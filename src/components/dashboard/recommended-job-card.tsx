import Link from 'next/link'
import { MapPin, Building2, Upload } from 'lucide-react'
import { ScoreRing, matchLevel, matchLevelLabel, matchLevelText } from '@/components/match/score-ring'

export interface DashboardJob {
  id: string
  title: string
  location: string | null
  work_type: string | null
  skills_required: string[] | null
  company_profile: { company_name: string; industry: string | null } | null
}

const workTypeLabel: Record<string, string> = { remote: 'Distans', hybrid: 'Hybrid', 'on-site': 'På plats' }

// Poängen här är andelen av jobbets efterfrågade kompetenser som finns i profilen, inte
// AI-bedömningen (den görs när man söker). Därför heter den "kompetensöverlapp".
export function RecommendedJobCard({ job, seekerSkills }: { job: DashboardJob; seekerSkills: string[] | null }) {
  const required = job.skills_required ?? []
  const hasCv = (seekerSkills?.length ?? 0) > 0
  const lower = new Set((seekerSkills ?? []).map(s => s.toLowerCase()))
  const matched = required.filter(s => lower.has(s.toLowerCase()))
  const missing = required.filter(s => !lower.has(s.toLowerCase()))
  const score = required.length > 0 ? Math.round((matched.length / required.length) * 100) : 0
  const level = matchLevel(score)
  // Utan någon gemensam kompetens visas vad jobbet efterfrågar, neutralt. En nolla i
  // en ring säger inget användbart och känns bara avskräckande.
  const showScore = hasCv && matched.length > 0

  return (
    <Link
      href={`/seeker/jobs/${job.id}`}
      className="panel panel-hover group flex h-full flex-col p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold group-hover:text-primary">{job.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
            {job.company_profile?.company_name ?? 'Okänt företag'}
          </p>
        </div>
        {showScore && <ScoreRing score={score} size="md" label="Kompetensöverlapp" />}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" aria-hidden />{job.location}</span>}
        {job.work_type && <span className="rounded-full border border-border px-2 py-0.5">{workTypeLabel[job.work_type] ?? job.work_type}</span>}
      </div>

      {hasCv && !showScore && required.length > 0 ? (
        <div className="mt-auto space-y-2.5">
          <p className="text-xs text-muted-foreground">Efterfrågade kompetenser</p>
          <div className="flex flex-wrap gap-1.5">
            {required.slice(0, 4).map(s => (
              <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground/80">{s}</span>
            ))}
          </div>
        </div>
      ) : hasCv ? (
        <div className="mt-auto space-y-2.5">
          {required.length > 0 && (
            <p className={`text-xs font-medium ${matchLevelText[level]}`}>
              {matchLevelLabel[level]} · {matched.length} av {required.length} kompetenser
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {matched.slice(0, 3).map(s => (
              <span key={s} className="rounded-md bg-mint/10 px-2 py-0.5 text-xs font-medium text-mint-foreground">{s}</span>
            ))}
            {missing.slice(0, 2).map(s => (
              <span key={s} className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-400">Saknas: {s}</span>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Upload className="h-3.5 w-3.5" aria-hidden />
          Ladda upp ditt CV för att se hur du matchar
        </p>
      )}
    </Link>
  )
}
