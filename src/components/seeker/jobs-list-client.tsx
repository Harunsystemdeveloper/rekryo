'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { JobSearchIllustration } from '@/components/illustrations/job-search-illustration'
import { JobListCard, type JobListItem } from '@/components/seeker/job-list-card'

const PAGE_SIZE = 12

// Base UI:s Select visar värdet ("all", "newest") om den inte får veta etiketterna
const WORK_TYPES = [
  { value: 'all', label: 'Alla' },
  { value: 'remote', label: 'Distans' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'on-site', label: 'På plats' },
]
const SORT_ITEMS = { newest: 'Nyast först', match: 'Bäst match', salary: 'Högst lön', deadline: 'Sista datum' }

// Samma poäng som jobbkortet visar: AI-poäng om jobbet är sökt, annars kompetensöverlapp
function jobScore(job: JobListItem, skills: Set<string>): number {
  if (job.user_application?.match_score != null) return job.user_application.match_score
  const required = job.skills_required ?? []
  if (required.length === 0 || skills.size === 0) return -1
  return Math.round((required.filter(r => skills.has(r.toLowerCase())).length / required.length) * 100)
}

export function JobsListClient({ jobs: initialJobs, userId, seekerSkills }: { jobs: JobListItem[]; userId: string; seekerSkills: string[] | null }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [search, setSearch] = useState('')
  const [workType, setWorkType] = useState('all')
  const [minSalary, setMinSalary] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const supabase = createClient()

  async function toggleSave(jobId: string, isSaved: boolean) {
    if (isSaved) {
      await supabase.from('saved_jobs').delete().eq('seeker_id', userId).eq('job_id', jobId)
      toast.success('Jobb borttaget från sparade')
    } else {
      await supabase.from('saved_jobs').insert({ seeker_id: userId, job_id: jobId })
      toast.success('Jobb sparat!')
    }
    setJobs(jobs.map(j => j.id === jobId ? { ...j, is_saved: !isSaved } : j))
  }

  const filtered = useMemo(() => {
    const minSal = minSalary ? parseInt(minSalary) : 0
    return jobs.filter(j => {
      const matchSearch = !search ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company_profile?.company_name.toLowerCase().includes(search.toLowerCase()) ||
        j.location?.toLowerCase().includes(search.toLowerCase()) ||
        j.skills_required?.some(s => s.toLowerCase().includes(search.toLowerCase()))
      const matchWork = workType === 'all' || j.work_type === workType
      const matchSalary = !minSal || (j.salary_max != null && j.salary_max >= minSal)
      // Filter out expired deadlines
      const notExpired = !j.deadline || new Date(j.deadline) >= new Date()
      return matchSearch && matchWork && matchSalary && notExpired
    })
  }, [jobs, search, workType, minSalary])

  const skillSet = useMemo(() => new Set((seekerSkills ?? []).map(s => s.toLowerCase())), [seekerSkills])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'match') {
        return jobScore(b, skillSet) - jobScore(a, skillSet)
      }
      if (sortBy === 'salary') {
        return (b.salary_max ?? 0) - (a.salary_max ?? 0)
      }
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      }
      // newest (default)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [filtered, sortBy, skillSet])

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function changePage(newPage: number) {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleFilter(fn: () => void) { fn(); setPage(1) }

  const hasActiveFilters = search || workType !== 'all' || minSalary

  const notExpiredCount = useMemo(
    () => jobs.filter(j => !j.deadline || new Date(j.deadline) >= new Date()).length,
    [jobs]
  )

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border bg-muted/30">
        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-bold">Hitta ditt nästa jobb</h1>
          <p className="text-muted-foreground mt-2">
            <span className="font-semibold text-foreground">{notExpiredCount}</span> aktiva annonser just nu — AI:n räknar ut din matchningspoäng automatiskt när du söker.
          </p>
        </div>
        <JobSearchIllustration className="pointer-events-none absolute -right-6 -bottom-8 h-56 w-auto opacity-90 hidden sm:block" />
      </div>

      {/* Filter: sökfält, arbetsform som knappar, lägsta lön och sortering */}
      <div className="panel space-y-4 p-4 sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            aria-label="Sök jobb"
            placeholder="Sök titel, företag, ort eller kompetens"
            value={search}
            onChange={e => handleFilter(() => setSearch(e.target.value))}
            className="h-11 pl-10 text-[15px]"
          />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <fieldset>
              <legend className="mb-1.5 text-xs font-medium text-muted-foreground">Arbetsform</legend>
              <div className="flex flex-wrap gap-1.5">
                {WORK_TYPES.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    aria-pressed={workType === t.value}
                    onClick={() => handleFilter(() => setWorkType(t.value))}
                    className={`h-9 rounded-lg border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      workType === t.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="min-salary" className="mb-1.5 block text-xs font-medium text-muted-foreground">Lägsta lön</label>
              <div className="relative w-full sm:w-44">
                <Input
                  id="min-salary"
                  type="number"
                  inputMode="numeric"
                  placeholder="t.ex. 30000"
                  value={minSalary}
                  onChange={e => handleFilter(() => setMinSalary(e.target.value))}
                  className="h-9 pr-16"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">kr/mån</span>
              </div>
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Sortera</span>
            <Select
              items={SORT_ITEMS}
              value={sortBy}
              onValueChange={v => handleFilter(() => setSortBy(v ?? 'newest'))}
            >
              <SelectTrigger className="h-9 w-full sm:w-44" aria-label="Sortera jobb">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Nyast först</SelectItem>
                <SelectItem value="match">Bäst match</SelectItem>
                <SelectItem value="salary">Högst lön</SelectItem>
                <SelectItem value="deadline">Sista datum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Resultatrad med aktiva filter som kan tas bort ett och ett */}
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-1 text-sm text-muted-foreground" aria-live="polite">
          <strong className="font-semibold text-foreground">{sorted.length}</strong> jobb
          {hasActiveFilters ? ' matchar dina filter' : ' att söka'}
        </p>
        {search && (
          <button type="button" onClick={() => handleFilter(() => setSearch(''))} className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs hover:bg-muted/70" aria-label={`Ta bort sökningen ${search}`}>
            &rdquo;{search}&rdquo; <X className="h-3 w-3" aria-hidden />
          </button>
        )}
        {workType !== 'all' && (
          <button type="button" onClick={() => handleFilter(() => setWorkType('all'))} className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs hover:bg-muted/70" aria-label="Ta bort filtret för arbetsform">
            {WORK_TYPES.find(t => t.value === workType)?.label} <X className="h-3 w-3" aria-hidden />
          </button>
        )}
        {minSalary && (
          <button type="button" onClick={() => handleFilter(() => setMinSalary(''))} className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs hover:bg-muted/70" aria-label="Ta bort lönefiltret">
            Minst {parseInt(minSalary).toLocaleString('sv-SE')} kr <X className="h-3 w-3" aria-hidden />
          </button>
        )}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => { setSearch(''); setWorkType('all'); setMinSalary(''); setPage(1) }}
            className="text-xs font-medium text-primary hover:underline"
          >
            Rensa alla
          </button>
        )}
      </div>

      {/* Resultat */}
      {sorted.length === 0 ? (
        <div className="panel flex flex-col items-center px-6 py-14 text-center">
          <JobSearchIllustration className="mb-6 h-32 w-auto" />
          {jobs.length === 0 ? (
            <>
              <h2 className="text-xl font-semibold">Inga lediga jobb just nu</h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Nya annonser dyker upp här så fort arbetsgivare publicerar dem. Gör din profil redo under tiden,
                så ser du direkt hur väl du matchar.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button asChild><Link href="/seeker/profile">Förbättra din profil</Link></Button>
                <Button variant="outline" asChild><Link href="/seeker/coach">Fråga karriärcoachen</Link></Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">Inga jobb matchar dina filter</h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Det finns {jobs.length} lediga jobb, men inget passar alla filter samtidigt. Prova att söka bredare,
                till exempel bara på ort eller yrkesroll.
              </p>
              <Button
                className="mt-6"
                onClick={() => { setSearch(''); setWorkType('all'); setMinSalary(''); setPage(1) }}
              >
                Rensa alla filter
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {paginated.map(job => (
            <JobListCard key={job.id} job={job} seekerSkills={seekerSkills} onToggleSave={toggleSave} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Visar {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} av {sorted.length} jobb
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => changePage(page - 1)} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => changePage(page + 1)} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
