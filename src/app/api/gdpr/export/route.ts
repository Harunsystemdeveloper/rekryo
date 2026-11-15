import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Samla all data om användaren (GDPR Article 15 + AI Act Article 12)
  const [
    { data: profile },
    { data: cvProfile },
    { data: applications },
    { data: savedJobs },
    { data: conversations },
    { data: companyProfile },
    { data: aiDecisionLogs },
    { data: demographics },
    { data: notifications },
    { data: interviewSchedules },
    { data: invitesReceived },
    { data: jobs },
    { data: notesWritten },
    { data: scorecardsWritten },
    { data: shortlist },
    { data: invitesSent },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('cv_profiles').select('*').eq('seeker_id', user.id).maybeSingle(),
    supabase.from('applications').select('*').eq('seeker_id', user.id),
    supabase.from('saved_jobs').select('*').eq('seeker_id', user.id),
    supabase.from('conversations').select('*').or(`recruiter_id.eq.${user.id},seeker_id.eq.${user.id}`),
    supabase.from('company_profiles').select('*').eq('recruiter_id', user.id).maybeSingle(),
    // AI Act: export all AI decisions that affected this user
    supabase.from('ai_decision_logs')
      .select('decision_type, job_id, score, decision_summary, output_skills_matched, output_skills_missing, model_id, was_reviewed_by_human, human_override_score, human_override_reason, created_at')
      .eq('subject_user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase.from('candidate_demographics').select('*').eq('seeker_id', user.id).maybeSingle(),
    supabase.from('notifications').select('type, title, body, href, read, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('interview_schedules').select('*').or(`recruiter_id.eq.${user.id},seeker_id.eq.${user.id}`),
    // Jobbsökaren har ingen läsrätt till inbjudningar i databasen, därav service role,
    // begränsat till den inloggades egna rader
    createAdminClient().from('candidate_invites').select('job_id, match_score, opened_at, responded_at, created_at').eq('seeker_id', user.id),
    // Rekryterarens egna uppgifter: annonser, anteckningar, intervjubedömningar,
    // shortlist och skickade inbjudningar
    supabase.from('jobs').select('*').eq('recruiter_id', user.id),
    supabase.from('candidate_notes').select('*').eq('recruiter_id', user.id),
    supabase.from('interview_scorecards').select('*').eq('recruiter_id', user.id),
    supabase.from('shortlist').select('*').eq('recruiter_id', user.id),
    supabase.from('candidate_invites').select('*').eq('recruiter_id', user.id),
  ])

  // Alla meddelanden i användarens konversationer, både skickade och mottagna. Tidigare
  // kom bara de skickade med, men även mottagna meddelanden är personuppgifter om en.
  const conversationIds = (conversations ?? []).map(c => c.id)
  const { data: messages } = conversationIds.length > 0
    ? await supabase.from('messages').select('*').in('conversation_id', conversationIds).order('created_at', { ascending: true })
    : { data: [] }

  const exportData = {
    exported_at: new Date().toISOString(),
    gdpr_notice: 'Denna export innehåller all persondata vi lagrar om dig enligt GDPR Artikel 15, inklusive AI-beslut enligt EU AI Act Artikel 12.',
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
    profile,
    cv_profile: cvProfile,
    company_profile: companyProfile,
    fairness_demographics: {
      notice: 'Helt frivilliga uppgifter du själv valt att ange för fairness-övervakning. Används aldrig i matchning eller av AI, och delas aldrig med rekryterare på individnivå — bara i anonymiserad, aggregerad statistik.',
      data: demographics,
    },
    applications,
    saved_jobs: savedJobs,
    interview_schedules: interviewSchedules ?? [],
    invites_received: invitesReceived ?? [],
    notifications: notifications ?? [],
    conversations,
    messages,
    recruiter: {
      notice: 'Uppgifter du själv har skapat som rekryterare.',
      jobs: jobs ?? [],
      candidate_notes: notesWritten ?? [],
      interview_scorecards: scorecardsWritten ?? [],
      shortlist: shortlist ?? [],
      invites_sent: invitesSent ?? [],
    },
    ai_decisions: {
      notice: 'Alla automatiserade AI-beslut som berört dig, inklusive matchpoäng och CV-analys.',
      count: aiDecisionLogs?.length ?? 0,
      logs: aiDecisionLogs ?? [],
    },
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="rekryo-data-${user.id.slice(0, 8)}.json"`,
    },
  })
}
