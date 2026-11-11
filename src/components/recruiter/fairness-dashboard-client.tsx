'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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

// Svenskt decimaltecken, så att 0,92 och gränsen 0,80 skrivs likadant
const sv = (n: number) => n.toFixed(2).replace('.', ',')

function DimensionCard({ result, minGroupSize }: { result: DimensionResult; minGroupSize: number }) {
  const included = result.groups.filter(g => g.included)
  const maxRate = Math.max(0, ...included.map(g => g.selection_rate ?? 0))
  // 4/5-regeln: en grupp vars urvalsfrekvens är under 80 % av den högsta flaggas
  const threshold = maxRate * 0.8
  const ratio = result.adverse_impact.ratio

  return (
    <div className={`panel p-6 ${result.human_review_required ? 'ring-1 ring-amber-500/50' : ''}`}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold">{DIMENSION_LABELS[result.dimension]}</h3>
        {result.human_review_required ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-3 w-3" aria-hidden />Bör granskas av en människa
          </span>
        ) : included.length > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-2.5 py-0.5 text-xs font-medium text-mint-foreground">
            <CheckCircle2 className="h-3 w-3" aria-hidden />Ingen flagga
          </span>
        ) : null}
      </div>

      {included.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Ingen grupp har ännu minst {minGroupSize} kandidater med frivilliga uppgifter, så statistiken visas inte. Gränsen finns för att ingen enskild kandidat ska kunna pekas ut.
        </p>
      ) : (
        <>
          <p className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Andel som gick vidare (shortlistad eller accepterad)</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 border-l-2 border-dashed border-foreground/60" aria-hidden />4/5-gränsen
            </span>
          </p>
          <ul className="space-y-4">
            {included.map(g => {
              const rate = g.selection_rate ?? 0
              const below = maxRate > 0 && rate < threshold
              return (
                <li key={g.name}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium">{g.name}</span>
                    <span className="font-semibold tabular-nums">{Math.round(rate * 100)} %</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-muted" role="img" aria-label={`${g.name}: ${Math.round(rate * 100)} procent gick vidare${below ? ', under 4/5-gränsen' : ''}`}>
                    <div className={`h-full rounded-full ${below ? 'bg-amber-500' : 'bg-mint'}`} style={{ width: `${rate * 100}%` }} />
                    {maxRate > 0 && (
                      <span className="absolute -top-1 -bottom-1 border-l-2 border-dashed border-foreground/60" style={{ left: `${threshold * 100}%` }} aria-hidden />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {g.n} kandidater{g.avg_match_score !== null && <> · snittpoäng {g.avg_match_score}</>}
                  </p>
                </li>
              )
            })}
          </ul>

          {ratio !== null && (
            <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
              <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">Kvot mellan lägsta och högsta grupp</span>
                <span className={`font-semibold tabular-nums ${result.adverse_impact.flagged ? 'text-amber-700 dark:text-amber-400' : 'text-mint-foreground'}`}>{sv(ratio)}</span>
              </div>
              <div className="relative h-2 rounded-full bg-gradient-to-r from-amber-500/40 via-amber-500/20 to-mint/40" role="img" aria-label={`Kvot ${sv(ratio)}, gränsen är 0,80`}>
                <span className="absolute -top-1 -bottom-1 border-l-2 border-dashed border-foreground/60" style={{ left: '80%' }} aria-hidden />
                <span
                  className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background ${result.adverse_impact.flagged ? 'bg-amber-500' : 'bg-mint'}`}
                  style={{ left: `${Math.min(1, ratio) * 100}%` }}
                  aria-hidden
                />
              </div>
              <div className="relative mt-1.5 h-4 text-[11px] text-muted-foreground" aria-hidden>
                <span className="absolute left-0">0</span>
                <span className="absolute -translate-x-1/2" style={{ left: '80%' }}>0,80</span>
                <span className="absolute right-0">1</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {result.adverse_impact.lowest_group} jämfört med {result.adverse_impact.reference_group}.
                {' '}{result.adverse_impact.flagged ? 'Under 0,80 flaggas enligt 4/5-regeln.' : 'Över 0,80, inom 4/5-regeln.'}
                {result.significance && (
                  <> {result.significance.significant
                    ? `Skillnaden är statistiskt signifikant (z = ${sv(result.significance.z_score)}, p < 0,05).`
                    : `Skillnaden är inte statistiskt signifikant (z = ${sv(result.significance.z_score)}).`}</>
                )}
              </p>
            </div>
          )}
        </>
      )}

      {result.excluded_small_groups.length > 0 && (
        <p className="mt-4 flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3 w-3 flex-shrink-0" aria-hidden />
          Visas inte, för få kandidater: {result.excluded_small_groups.join(', ')}
        </p>
      )}
    </div>
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
              <div className="panel flex items-start gap-3 border-amber-500/40 bg-amber-500/5 p-4" role="alert">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" aria-hidden />
                </span>
                <div className="text-sm">
                  <p className="font-medium">En människa bör granska urvalet</p>
                  <p className="mt-0.5 text-muted-foreground">
                    Analysen hittade en möjlig systematisk skillnad mellan grupper. Det betyder inte att urvalet är orättvist, men matchningarna och besluten bör granskas manuellt innan du går vidare.
                  </p>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {result.total_applications} ansökningar, varav {result.total_candidates_with_demographics} kandidater har lämnat frivilliga uppgifter. Grupper med färre än {result.min_group_size} kandidater visas inte.
            </p>

            <div className="grid gap-4 lg:grid-cols-2">
              <DimensionCard result={result.gender} minGroupSize={result.min_group_size} />
              <DimensionCard result={result.age_bucket} minGroupSize={result.min_group_size} />
            </div>
          </>
        )}
      </section>
    </div>
  )
}
