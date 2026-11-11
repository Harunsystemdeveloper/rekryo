'use client'

import Link from 'next/link'
import { MapPin, Bookmark, BookmarkCheck, Clock, Building2, Check, AlertTriangle, ChevronDown, Wallet } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScoreRing, matchLevel, matchLevelLabel, matchLevelText } from '@/components/match/score-ring'
import { ScoreExplainer } from '@/components/match/score-explainer'

export interface JobListItem {
  id: string
  title: string
  skills_required: string[] | null
  location: string | null
  work_type: string | null
  salary_min: number | null
  salary_max: number | null
  currency: string
  created_at: string
  deadline: string | null
  is_saved: boolean
  user_application: { match_score: number | null; status: string } | null
  company_profile: { company_name: string; logo_url: string | null; industry: string | null } | null
}

const workTypeLabel: Record<string, string> = { remote: 'Distans', hybrid: 'Hybrid', 'on-site': 'På plats' }
const statusLabel: Record<string, string> = {
  pending: 'Sökt', reviewed: 'Granskad', shortlisted: 'Shortlistad', accepted: 'Accepterad', rejected: 'Avslutad',
}

function daysLeft(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 864e5)
}

// Poängen är AI-bedömningen om användaren redan sökt jobbet. Annars visas andelen av
// jobbets kompetenser som finns i profilen, tydligt märkt som kompetensöverlapp.
export function JobListCard({
  job,
  seekerSkills,
  onToggleSave,
}: {
  job: JobListItem
  seekerSkills: string[] | null
  onToggleSave: (jobId: string, isSaved: boolean) => void
}) {
  const required = job.skills_required ?? []
  const lower = new Set((seekerSkills ?? []).map(s => s.toLowerCase()))
  const hasCv = lower.size > 0
  const matched = required.filter(s => lower.has(s.toLowerCase()))
  const missing = required.filter(s => !lower.has(s.toLowerCase()))
  const aiScore = job.user_application?.match_score ?? null
  const overlap = required.length > 0 ? Math.round((matched.length / required.length) * 100) : 0
  const score = aiScore ?? overlap
  const showScore = aiScore != null || (hasCv && matched.length > 0)
  const level = matchLevel(score)
  const days = job.deadline ? daysLeft(job.deadline) : null
  const initials = (job.company_profile?.company_name ?? '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <article className="panel panel-hover p-5 sm:p-6">
      <div className="flex gap-4">
        <Avatar className="hidden h-12 w-12 flex-shrink-0 rounded-xl border sm:flex">
          <AvatarImage src={job.company_profile?.logo_url ?? ''} className="object-contain" />
          <AvatarFallback className="rounded-xl bg-muted text-sm text-muted-foreground">
            {job.company_profile ? initials : <Building2 className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <Link href={`/seeker/jobs/${job.id}`} className="rounded hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <h3 className="text-lg font-semibold leading-snug">{job.title}</h3>
          </Link>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {job.company_profile?.company_name ?? 'Okänt företag'}
            {job.company_profile?.industry && ` · ${job.company_profile.industry}`}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {job.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden />{job.location}</span>}
            {job.work_type && <span className="rounded-full border border-border px-2 py-0.5">{workTypeLabel[job.work_type] ?? job.work_type}</span>}
            {job.salary_min && job.salary_max && (
              <span className="flex items-center gap-1 font-medium text-foreground/80">
                <Wallet className="h-3.5 w-3.5" aria-hidden />
                {job.salary_min.toLocaleString('sv-SE')}–{job.salary_max.toLocaleString('sv-SE')} {job.currency}/mån
              </span>
            )}
            {days !== null && (
              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${days <= 3 ? 'bg-destructive/10 font-medium text-destructive' : 'bg-muted'}`}>
                <Clock className="h-3 w-3" aria-hidden />
                {days <= 0 ? 'Sista dagen idag' : `${days} ${days === 1 ? 'dag' : 'dagar'} kvar`}
              </span>
            )}
          </div>

          {required.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {hasCv ? (
                <>
                  {matched.map(s => (
                    <span key={s} className="flex items-center gap-1 rounded-md bg-mint/10 px-2 py-0.5 text-xs font-medium text-mint-foreground">
                      <Check className="h-3 w-3" aria-hidden />{s}
                    </span>
                  ))}
                  {missing.map(s => (
                    <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{s}</span>
                  ))}
                </>
              ) : (
                required.slice(0, 6).map(s => (
                  <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground/80">{s}</span>
                ))
              )}
            </div>
          )}

          {(hasCv || aiScore != null) && required.length > 0 && (
            <details className="group mt-4 rounded-xl border border-border bg-muted/30 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-primary">
                <span>
                  Varför denna matchning?
                  {showScore && <span className={`ml-2 text-xs font-normal ${matchLevelText[level]}`}>{matchLevelLabel[level]}</span>}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="space-y-3 border-t border-border px-4 py-3.5 text-sm">
                {aiScore != null && (
                  <p className="text-muted-foreground">
                    AI:n har bedömt din ansökan till <strong className="text-foreground">{aiScore} av 100</strong>.
                    Bedömningen granskas av en rekryterare som fattar beslutet.{' '}
                    <ScoreExplainer variant="seeker" className="align-middle" />
                  </p>
                )}
                <p className="text-muted-foreground">
                  Du har <strong className="text-foreground">{matched.length} av {required.length}</strong> kompetenser som annonsen efterfrågar.
                </p>
                {matched.length > 0 && (
                  <ul className="space-y-1">
                    {matched.map(s => (
                      <li key={s} className="flex items-center gap-2"><Check className="h-4 w-4 text-mint-foreground" aria-hidden />{s}</li>
                    ))}
                  </ul>
                )}
                {missing.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Kompetensgap</p>
                    <ul className="space-y-1">
                      {missing.map(s => (
                        <li key={s} className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden />{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Öppna annonsen för en AI-analys av gapen och förslag på hur du kan fylla dem.</p>
              </div>
            </details>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">Publicerad {new Date(job.created_at).toLocaleDateString('sv-SE')}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleSave(job.id, job.is_saved)}
                aria-label={job.is_saved ? 'Ta bort från sparade' : 'Spara jobb'}
                aria-pressed={job.is_saved}
              >
                {job.is_saved ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
              </Button>
              {job.user_application ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {statusLabel[job.user_application.status] ?? 'Sökt'}
                </span>
              ) : (
                <Button size="sm" asChild>
                  <Link href={`/seeker/jobs/${job.id}`}>Visa och ansök</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {showScore && (
          <div className="flex flex-col items-center gap-1">
            <ScoreRing score={score} size="md" label={aiScore != null ? 'AI-matchning' : 'Kompetensöverlapp'} />
            <span className="text-[10px] text-muted-foreground">{aiScore != null ? 'AI-poäng' : 'Överlapp'}</span>
          </div>
        )}
      </div>
    </article>
  )
}
