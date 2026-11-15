import { createClient, createAdminClient } from '@/lib/supabase/server'
import { generateInterviewQuestions } from '@/lib/ai/claude'
import { logAiDecision } from '@/lib/ai/audit-log'
import { NextResponse, after } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({ job_id: z.string().uuid() })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!rateLimit(`interview-questions:${user.id}`, 20)) {
    return NextResponse.json({ error: 'För många förfrågningar. Försök igen om en timme.' }, { status: 429 })
  }

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Ogiltigt job_id' }, { status: 400 })

  const [{ data: job }, { data: cvProfile }] = await Promise.all([
    supabase.from('jobs').select('*').eq('id', parsed.data.job_id).single(),
    supabase.from('cv_profiles').select('*').eq('seeker_id', user.id).single(),
  ])

  if (!job) return NextResponse.json({ error: 'Jobb hittades inte' }, { status: 404 })

  try {
    const result = await generateInterviewQuestions(
      { title: job.title, description: job.description, skills_required: job.skills_required ?? [] },
      {
        skills: cvProfile?.skills ?? [],
        experience_years: cvProfile?.experience_years ?? 0,
        summary: cvProfile?.ai_summary ?? '',
      }
    )

    // Spara frågorna på egen ansökan (service role sedan 0017, begränsat till user.id nedan)
    const { data: application } = await createAdminClient().from('applications')
      .update({ interview_questions: result.questions.map((q: { question: string }) => q.question) })
      .eq('job_id', parsed.data.job_id)
      .eq('seeker_id', user.id)
      .select('id')
      .maybeSingle()

    after(() => logAiDecision({
      subjectUserId: user.id,
      triggeredByUserId: user.id,
      decisionType: 'interview_questions',
      jobId: parsed.data.job_id,
      applicationId: application?.id,
      decisionSummary: `${result.questions.length} intervjufrågor togs fram`,
      inputSkills: cvProfile?.skills ?? [],
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Interview questions error:', error)
    return NextResponse.json({ error: 'Generering misslyckades' }, { status: 500 })
  }
}
