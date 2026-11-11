'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Scale, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { toast } from 'sonner'

interface GroupResult {
  name: string
  n: number
  selection_rate: number | null
  avg_match_score: number | null
  included: boolean
}

interface DimensionResult {
  dimension: 'gender' | 'age_bucket'
  groups: GroupResult[]
  adverse_impact: { reference_group: string | null; lowest_group: string | null; ratio: number | null; flagged: boolean }
  significance: { group_a: string; group_b: string; z_score: number; significant: boolean } | null
  human_review_required: boolean
  excluded_small_groups: string[]
}

interface AnalysisResult {
  total_applications: number
  total_candidates_with_demographics: number
  min_group_size: number
  gender: DimensionResult
  age_bucket: DimensionResult
  human_review_required: boolean
}

const DIMENSION_LABELS = { gender: 'Kön', age_bucket: 'Åldersgrupp' }

function DimensionCard({ result }: { result: DimensionResult }) {
  return (
    <Card className={result.human_review_required ? 'border-amber-400/60' : undefined}>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>{DIMENSION_LABELS[result.dimension]}</span>
          {result.human_review_required ? (
            <Badge className="bg-amber-500 text-white gap-1"><AlertTriangle className="h-3 w-3" />Mänsklig granskning krävs</Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3" />Ingen flagga</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {result.groups.filter(g => g.included).length === 0 ? (
          <p className="text-sm text-muted-foreground">För få datapunkter per grupp (minst 5 krävs) för att visa statistik.</p>
        ) : (
          <div className="space-y-3">
            {result.groups.filter(g => g.included).map(g => (
              <div key={g.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{g.name} <span className="text-muted-foreground font-normal">({g.n} st)</span></span>
                  <span className="text-muted-foreground">
                    {g.selection_rate !== null ? `${Math.round(g.selection_rate * 100)}% gick vidare` : '–'}
                    {g.avg_match_score !== null ? ` · snitt ${g.avg_match_score}%` : ''}
                  </span>
                </div>
                <Progress value={(g.selection_rate ?? 0) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        )}

        {result.adverse_impact.ratio !== null && (
          <div className="rounded-lg bg-muted/40 border p-2.5 text-xs space-y-1">
            <p>
              <strong>Adverse impact ratio:</strong> {result.adverse_impact.ratio.toFixed(2)}
              {' '}({result.adverse_impact.lowest_group} vs {result.adverse_impact.reference_group})
              {result.adverse_impact.flagged && <span className="text-amber-600 font-medium"> — under 0.8, flaggat enligt 4/5-regeln</span>}
            </p>
            {result.significance && (
              <p>
                <strong>Signifikanstest:</strong> z = {result.significance.z_score}
                {result.significance.significant ? ' — statistiskt signifikant skillnad (p < 0.05)' : ' — ingen signifikant skillnad'}
              </p>
            )}
          </div>
        )}

        {result.excluded_small_groups.length > 0 && (
          <p className="text-xs text-muted-foreground flex items-start gap-1.5">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            Exkluderat från statistik (för få datapunkter): {result.excluded_small_groups.join(', ')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export interface FairnessOverview {
  total: number
  scored: number
  averageScore: number | null
  buckets: { label: string; count: number }[]
  statusCounts: Record<string, number>
  overrides: number
}

const BUCKET_COLORS = ['bg-amber-500', 'bg-amber-500/70', 'bg-primary', 'bg-mint/80', 'bg-mint']

const FUNNEL = [
  { key: 'pending', label: 'Nya' },
  { key: 'reviewed', label: 'Granskade' },
  { key: 'shortlisted', label: 'Shortlistade' },
  { key: 'accepted', label: 'Accepterade' },
  { key: 'rejected', label: 'Avvisade' },
]

function OverviewSection({ overview }: { overview: FairnessOverview }) {
  const maxBucket = Math.max(1, ...overview.buckets.map(b => b.count))
  const maxStatus = Math.max(1, ...FUNNEL.map(f => overview.statusCounts[f.key] ?? 0))

  return (
    <section aria-labelledby="overview" className="space-y-4">
      <div>
        <h2 id="overview" className="text-lg font-semibold">Översikt</h2>
        <p className="text-sm text-muted-foreground">Alla dina annonser. Bygger bara på ansökningar och poäng, inga personuppgifter om grupper.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Ansökningar', value: overview.total },
          { label: 'AI-matchade', value: overview.scored },
          { label: 'Snittpoäng', value: overview.averageScore ?? '–' },
          { label: 'Mänskliga justeringar', value: overview.overrides },
        ].map(stat => (
          <div key={stat.label} className="panel p-5">
            <span className="block text-2xl font-semibold leading-none tabular-nums">{stat.value}</span>
            <span className="mt-1.5 block text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-6">
          <h3 className="text-base font-semibold">Poängfördelning</h3>
          <p className="mb-5 text-sm text-muted-foreground">Hur AI-poängen sprider sig över alla matchade kandidater</p>
          {overview.scored === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Inga kandidater är AI-matchade ännu.</p>
          ) : (
            <div className="flex h-44 items-end gap-3" role="img" aria-label={`Poängfördelning: ${overview.buckets.map(b => `${b.label}: ${b.count}`).join(', ')}`}>
              {overview.buckets.map((b, i) => (
                <div key={b.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <span className="text-xs font-semibold tabular-nums">{b.count}</span>
                  <div className={`w-full rounded-t-md ${BUCKET_COLORS[i]}`} style={{ height: `${Math.max(b.count ? 6 : 2, (b.count / maxBucket) * 100)}%` }} />
                  <span className="text-[11px] text-muted-foreground">{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel p-6">
          <h3 className="text-base font-semibold">Urvalstratt</h3>
          <p className="mb-5 text-sm text-muted-foreground">Var i processen ansökningarna befinner sig just nu</p>
          {overview.total === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Inga ansökningar ännu.</p>
          ) : (
            <ul className="space-y-3">
              {FUNNEL.map(f => {
                const count = overview.statusCounts[f.key] ?? 0
                return (
                  <li key={f.key} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3 text-sm">
                    <span className="text-muted-foreground">{f.label}</span>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${f.key === 'rejected' ? 'bg-muted-foreground/40' : f.key === 'accepted' || f.key === 'shortlisted' ? 'bg-mint' : 'bg-primary'}`}
                        style={{ width: `${(count / maxStatus) * 100}%` }}
                      />
                    </div>
                    <span className="text-right font-semibold tabular-nums">{count}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export function FairnessDashboardClient({ jobs, overview }: { jobs: { id: string; title: string }[]; overview: FairnessOverview }) {
  const [jobId, setJobId] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const jobItems = { all: 'Alla mina jobbannonser', ...Object.fromEntries(jobs.map(j => [j.id, j.title])) }

  async function analyze() {
    setLoading(true)
    const res = await fetch('/api/fairness/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobId === 'all' ? {} : { job_id: jobId }),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(typeof data.error === 'string' ? data.error : 'Analys misslyckades'); setLoading(false); return }
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">EU AI Act · GDPR</p>
        <h1 className="text-3xl font-semibold tracking-tight">Rättvisa i urvalet</h1>
        <p className="mt-1.5 max-w-2xl text-muted-foreground">
          Följ hur AI-poängen fördelar sig och om kandidater i olika grupper går vidare i olika takt. Det hjälper dig upptäcka mönster som en människa bör granska.
        </p>
      </div>

      <OverviewSection overview={overview} />

      <section aria-labelledby="groups" className="space-y-4">
        <div>
          <h2 id="groups" className="text-lg font-semibold">Gruppanalys</h2>
          <p className="text-sm text-muted-foreground">
            Anonymiserad statistik per kön och åldersgrupp, baserad på uppgifter kandidaterna frivilligt lämnat. Enskilda personer visas aldrig.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select items={jobItems} value={jobId} onValueChange={v => setJobId(v ?? 'all')}>
            <SelectTrigger className="sm:w-64" aria-label="Välj annons"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla mina jobbannonser</SelectItem>
              {jobs.map(j => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={analyze} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scale className="mr-2 h-4 w-4" />}
            Analysera
          </Button>
        </div>

        {result && (
          <>
            {result.human_review_required && (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><strong>Human Review Required.</strong> Analysen upptäckte en möjlig systematisk skillnad mellan grupper. Detta betyder inte nödvändigtvis att bias föreligger, men en människa bör granska matchningsresultaten manuellt innan beslut fattas.</span>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {result.total_applications} ansökningar totalt, {result.total_candidates_with_demographics} kandidater har lämnat frivilliga uppgifter. Minsta gruppstorlek för att visas: {result.min_group_size}.
            </p>

            <div className="grid gap-4">
              <DimensionCard result={result.gender} />
              <DimensionCard result={result.age_bucket} />
            </div>
          </>
        )}
      </section>
    </div>
  )
}
