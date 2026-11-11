import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FairnessDashboardClient, type FairnessOverview } from '@/components/recruiter/fairness-dashboard-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Rättvisa i urvalet' }

// Samma skala som AI:n poängsätter efter (se matchCandidates i lib/ai/claude.ts)
const SCORE_BUCKETS = [
  { label: '0–29', min: 0, max: 29 },
  { label: '30–49', min: 30, max: 49 },
  { label: '50–69', min: 50, max: 69 },
  { label: '70–89', min: 70, max: 89 },
  { label: '90–100', min: 90, max: 100 },
]

export default async function FairnessPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('user_type').eq('id', user.id).single()
  if (profile?.user_type !== 'recruiter') redirect('/dashboard')

  // Översikten bygger bara på rekryterarens egna ansökningar och loggar, inga
  // demografiska uppgifter. Gruppanalysen hämtas separat via /api/fairness/analyze.
  const [{ data: jobs }, { data: apps }, { count: overrides }] = await Promise.all([
    supabase.from('jobs').select('id, title').eq('recruiter_id', user.id).order('created_at', { ascending: false }),
    supabase.from('applications').select('status, match_score, jobs!inner(recruiter_id)').eq('jobs.recruiter_id', user.id),
    supabase.from('ai_decision_logs').select('id', { count: 'exact', head: true })
      .eq('triggered_by_user_id', user.id)
      .not('human_override_score', 'is', null),
  ])

  const scores = (apps ?? []).map(a => a.match_score).filter((s): s is number => typeof s === 'number')
  const statusCounts = (apps ?? []).reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1
    return acc
  }, {})

  const overview: FairnessOverview = {
    total: apps?.length ?? 0,
    scored: scores.length,
    averageScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
    buckets: SCORE_BUCKETS.map(b => ({ label: b.label, count: scores.filter(s => s >= b.min && s <= b.max).length })),
    statusCounts,
    overrides: overrides ?? 0,
  }

  return <FairnessDashboardClient jobs={jobs ?? []} overview={overview} />
}
