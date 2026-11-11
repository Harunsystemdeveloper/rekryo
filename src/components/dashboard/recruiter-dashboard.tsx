import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import {
  BriefcaseIcon, FileTextIcon, PlusIcon, UsersIcon, Brain, MessageSquare, Clock, Scale,
  ArrowRight, Building2, MapPin,
} from 'lucide-react'
import { EmptyApplicationsIllustration } from '@/components/illustrations/empty-states'
import type { Profile } from '@/types/database'

const workTypeLabels: Record<string, string> = { remote: 'Distans', hybrid: 'Hybrid', 'on-site': 'På plats' }

const jobStatus: Record<string, { label: string; className: string }> = {
  active: { label: 'Aktiv', className: 'bg-mint/15 text-mint-foreground' },
  paused: { label: 'Pausad', className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400' },
  closed: { label: 'Stängd', className: 'bg-muted text-muted-foreground' },
}

export default async function RecruiterDashboard({ profile }: { profile: Profile }) {
  const supabase = await createClient()

  // Antalen räknas separat: listan nedan är begränsad till de fem senaste annonserna
  // och gav därför fel siffror så fort rekryteraren hade fler än fem.
  const [{ data: jobs }, { count: jobCount }, { count: activeJobs }, { count: appCount }, { count: pendingCount }] = await Promise.all([
    supabase.from('jobs').select('*, applications(count)').eq('recruiter_id', profile.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('recruiter_id', profile.id),
    supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('recruiter_id', profile.id).eq('status', 'active'),
    supabase.from('applications').select('*, jobs!inner(recruiter_id)', { count: 'exact', head: true }).eq('jobs.recruiter_id', profile.id),
    supabase.from('applications').select('*, jobs!inner(recruiter_id)', { count: 'exact', head: true }).eq('jobs.recruiter_id', profile.id).eq('status', 'pending'),
  ])

  const firstName = profile.full_name?.split(' ')[0] ?? 'där'
  const pending = pendingCount ?? 0
  const hasJobs = !!jobs && jobs.length > 0

  return (
    <div className="space-y-8">
      {/* Rubrik med en tydlig nästa åtgärd */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Hej, {firstName}!</h1>
          <p className="mt-1.5 text-muted-foreground">
            {!hasJobs
              ? 'Skapa din första annons så börjar kandidaterna komma in.'
              : pending > 0
                ? `Du har ${pending} ${pending === 1 ? 'ny ansökan' : 'nya ansökningar'} att granska.`
                : 'Alla ansökningar är granskade. Här är läget i dina rekryteringar.'}
          </p>
        </div>
        <Button asChild>
          <Link href="/recruiter/jobs/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Ny jobbannons
          </Link>
        </Button>
      </div>

      {/* Nyckeltal, samma kortmönster som jobbsökarens dashboard */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: BriefcaseIcon, label: 'Aktiva annonser', value: activeJobs ?? 0, href: '/recruiter/jobs', tone: 'primary' as const },
          { icon: FileTextIcon, label: 'Totalt annonser', value: jobCount ?? 0, href: '/recruiter/jobs', tone: 'mint' as const },
          { icon: UsersIcon, label: 'Ansökningar', value: appCount ?? 0, href: '/recruiter/jobs', tone: 'primary' as const },
          { icon: Clock, label: 'Att granska', value: pending, href: '/recruiter/jobs', tone: 'mint' as const, highlight: pending > 0 },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`panel panel-hover flex items-center gap-4 p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${stat.highlight ? 'ring-1 ring-mint/40' : ''}`}
          >
            <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${stat.tone === 'primary' ? 'bg-primary/10 text-primary' : 'bg-mint/10 text-mint-foreground'}`}>
              <stat.icon className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-2xl font-semibold leading-none tabular-nums">{stat.value}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{stat.label}</span>
            </span>
          </Link>
        ))}
      </div>

      {hasJobs ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Huvudyta */}
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <section className="panel p-6" aria-labelledby="recent-jobs">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 id="recent-jobs" className="text-base font-semibold">Senaste annonser</h2>
                  <p className="text-sm text-muted-foreground">Öppna en annons för att se rankade kandidater</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/recruiter/jobs">Alla annonser <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                </Button>
              </div>
              <ul className="divide-y divide-border">
                {jobs.map(job => {
                  const count = (job.applications as { count: number }[])?.[0]?.count ?? 0
                  const status = jobStatus[job.status] ?? jobStatus.closed
                  return (
                    <li key={job.id}>
                      <Link
                        href={`/recruiter/jobs/${job.id}/candidates`}
                        className="group -mx-2 flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
                      >
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <BriefcaseIcon className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{job.title}</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" aria-hidden />
                            {job.location ?? 'Plats ej angiven'}
                            {job.work_type && <> · {workTypeLabels[job.work_type] ?? job.work_type}</>}
                          </span>
                        </span>
                        <span className="hidden text-right sm:block">
                          <span className="block text-sm font-semibold tabular-nums">{count}</span>
                          <span className="block text-xs text-muted-foreground">{count === 1 ? 'kandidat' : 'kandidater'}</span>
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>{status.label}</span>
                        <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          </div>

          {/* Sidokolumn */}
          <div className="min-w-0 space-y-6">
            <div className="panel gradient-subtle p-6">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Scale className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="text-base font-semibold">Rättvisa i urvalet</h2>
              <p className="mt-1 mb-5 text-sm text-muted-foreground">
                Se om kandidater i olika köns- och åldersgrupper går vidare i olika takt. Statistiken bygger på frivilliga uppgifter och visar aldrig enskilda personer.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/recruiter/fairness">Öppna rättvisevyn <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            <div className="panel p-6">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-mint/10 text-mint-foreground">
                <Building2 className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="text-base font-semibold">Företagsprofil</h2>
              <p className="mt-1 mb-5 text-sm text-muted-foreground">Logotyp och beskrivning visas för kandidater på varje annons.</p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/recruiter/company">Redigera profilen</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="panel flex flex-col items-center gap-4 px-6 py-12 text-center">
            <EmptyApplicationsIllustration className="h-24 w-auto" />
            <div>
              <h2 className="text-lg font-semibold">Din första annons är några minuter bort</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                Beskriv rollen och vilka kompetenser som krävs. När ansökningarna kommer in rankar AI:n kandidaterna och förklarar varje poäng.
              </p>
            </div>
            <Button asChild>
              <Link href="/recruiter/jobs/new"><PlusIcon className="mr-2 h-4 w-4" />Skapa annons</Link>
            </Button>
          </section>

          <section aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="mb-4 text-lg font-semibold">Så fungerar det</h2>
            <ol className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: BriefcaseIcon, title: 'Skapa en annons', desc: 'Ange roll, kompetenskrav och erfarenhetsnivå. Ju tydligare krav, desto bättre matchning.' },
                { icon: Brain, title: 'Låt AI:n ranka', desc: 'Klicka AI-matcha i kandidatlistan. Varje kandidat får en poäng 0–100 med motivering per område.' },
                { icon: MessageSquare, title: 'Du fattar beslutet', desc: 'Shortlista, chatta och boka intervju. AI:n föreslår, men det är alltid du som bestämmer.' },
              ].map((step, i) => (
                <li key={step.title} className="panel p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="gradient-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">{i + 1}</span>
                    <step.icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </div>
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="panel flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-mint/10 text-mint-foreground">
                <Building2 className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-medium">Fyll i din företagsprofil</p>
                <p className="text-xs text-muted-foreground">Kandidater ser ditt företag på varje annons</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/recruiter/company">Företagsprofil</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
