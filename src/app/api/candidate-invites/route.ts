import { createClient, createAdminClient } from '@/lib/supabase/server'
import { generateOutreachMessage } from '@/lib/ai/claude'
import { logAiDecision } from '@/lib/ai/audit-log'
import { NextResponse, after } from 'next/server'
import { dbError } from '@/lib/api-errors'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({ job_id: z.string().uuid(), seeker_id: z.string().uuid() })

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('user_type, full_name').eq('id', user.id).single()
  if (profile?.user_type !== 'recruiter') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  if (!rateLimit(`candidate-invite:${user.id}`, 30)) {
    return NextResponse.json({ error: 'För många förfrågningar. Försök igen om en timme.' }, { status: 429 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Ogiltig indata' }, { status: 400 })
  const { job_id, seeker_id } = parsed.data

  const { data: job } = await supabase.from('jobs').select('*').eq('id', job_id).eq('recruiter_id', user.id).single()
  if (!job) return NextResponse.json({ error: 'Jobb hittades inte' }, { status: 404 })

  // Kandidatens CV — recruiter har ingen RLS-åtkomst till andras cv_profiles, admin krävs
  // (samma avgränsade, granskade mönster som match-candidates/talent-pool använder).
  const admin = createAdminClient()
  const [{ data: cv }, { data: seekerProfile }, { data: company }] = await Promise.all([
    admin.from('cv_profiles').select('skills, experience_years, ai_summary, talent_pool_visible').eq('seeker_id', seeker_id).single(),
    admin.from('profiles').select('full_name').eq('id', seeker_id).single(),
    supabase.from('company_profiles').select('company_name').eq('recruiter_id', user.id).single(),
  ])
  if (!cv) return NextResponse.json({ error: 'Kandidaten har inget analyserat CV' }, { status: 400 })
  // Utskick till någon som inte sökt jobbet kräver att hen valt att synas i talangpoolen
  // — annars kunde ett känt seeker_id användas för att kringgå samtycket.
  if (!cv.talent_pool_visible) return NextResponse.json({ error: 'Kandidaten är inte synlig i talangpoolen' }, { status: 403 })

  const requiredSkills: string[] = job.skills_required ?? []
  const candidateSkills: string[] = cv.skills ?? []
  const matchingSkills = requiredSkills.filter(s => candidateSkills.includes(s))
  const matchScore = requiredSkills.length > 0 ? Math.round((matchingSkills.length / requiredSkills.length) * 100) : null

  try {
    const { message: outreachText, usage } = await generateOutreachMessage(
      { title: job.title, description: job.description },
      { name: seekerProfile?.full_name ?? 'Kandidat', skills: candidateSkills, experience_years: cv.experience_years },
      matchingSkills,
      company?.company_name ?? 'Vårt företag',
      profile?.full_name ?? 'Rekryteraren'
    )

    // Konversationer skapas bara av servern (0022). Samtycket till talangpoolen är
    // kontrollerat ovan, och recruiter_id är alltid den inloggade rekryteraren.
    const { data: conversation, error: convErr } = await admin
      .from('conversations')
      .upsert({ recruiter_id: user.id, seeker_id, job_id }, { onConflict: 'recruiter_id,seeker_id' })
      .select('id')
      .single()
    if (convErr || !conversation) return NextResponse.json({ error: 'Kunde inte skapa konversation' }, { status: 500 })

    const { data: sentMessage, error: msgErr } = await supabase
      .from('messages')
      .insert({ conversation_id: conversation.id, sender_id: user.id, content: outreachText })
      .select('id')
      .single()
    if (msgErr || !sentMessage) return NextResponse.json({ error: 'Kunde inte skicka meddelande' }, { status: 500 })

    await supabase.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversation.id)

    // Service role: inloggade får sedan 0023 bara uppdatera spårningsfälten, och en ny
    // inbjudan till samma kandidat och jobb uppdaterar den befintliga raden
    const { data: invite, error: inviteErr } = await admin
      .from('candidate_invites')
      .upsert({
        recruiter_id: user.id,
        job_id,
        seeker_id,
        conversation_id: conversation.id,
        message_id: sentMessage.id,
        match_score: matchScore,
      }, { onConflict: 'recruiter_id,job_id,seeker_id' })
      .select()
      .single()
    if (inviteErr) return dbError('candidate-invites', inviteErr, 500)

    // Service role: notiser får sedan 0017 bara skrivas av servern.
    await admin.from('notifications').insert({
      user_id: seeker_id,
      type: 'message',
      title: 'Ett företag är intresserad av dig!',
      body: `${company?.company_name ?? 'En rekryterare'} har skickat dig ett meddelande om tjänsten "${job.title}".`,
      href: '/messages',
    })

    after(() => logAiDecision({
      triggeredByUserId: user.id,
      subjectUserId: seeker_id,
      decisionType: 'candidate_summary',
      jobId: job_id,
      score: matchScore ?? undefined,
      decisionSummary: `Genererade utskick till kandidat i talangpoolen (${matchingSkills.length} matchande kompetenser).`,
      decisionData: { type: 'candidate_invite', matching_skills: matchingSkills },
      usage,
    }))

    return NextResponse.json({ invite, message: outreachText })
  } catch (error) {
    console.error('Candidate invite error:', error)
    return NextResponse.json({ error: 'Kunde inte generera meddelande' }, { status: 500 })
  }
}
