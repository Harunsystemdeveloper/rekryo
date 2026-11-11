'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { JobSearchIllustration } from '@/components/illustrations/job-search-illustration'
import { JobListCard, type JobListItem } from '@/components/seeker/job-list-card'

const PAGE_SIZE = 12

// Base UI:s Select visar värdet ("all", "newest") om den inte får veta etiketterna
const WORK_TYPE_ITEMS = { all: 'Alla former', remote: 'Distans', hybrid: 'Hybrid', 'on-site': 'På plats' }
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

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök titel, företag, ort, kompetens..."
              value={search}
              onChange={e => handleFilter(() => setSearch(e.target.value))}
              className="pl-9"
            />
          </div>
          <Select
            items={WORK_TYPE_ITEMS}
            value={workType}
            onValueChange={v => handleFilter(() => setWorkType(v ?? 'all'))}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Arbetsform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla former</SelectItem>
              <SelectItem value="remote">Distans</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="on-site">På plats</SelectItem>
            </SelectContent>
          </Select>
          <Select
            items={SORT_ITEMS}
            value={sortBy}
            onValueChange={v => handleFilter(() => setSortBy(v ?? 'newest'))}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Sortera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Nyast först</SelectItem>
              <SelectItem value="match">Bäst match</SelectItem>
              <SelectItem value="salary">Högst lön</SelectItem>
              <SelectItem value="deadline">Sista datum</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Salary filter */}
        <div className="flex flex-wrap items-center gap-3">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="relative w-full sm:w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Min</span>
            <Input
              type="number"
              placeholder="40 000 kr/mån"
              value={minSalary}
              onChange={e => handleFilter(() => setMinSalary(e.target.value))}
              className="pl-10"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => { setSearch(''); setWorkType('all'); setMinSalary(''); setPage(1) }}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Rensa filter
            </button>
          )}
          {filtered.length !== jobs.length && (
            <p className="text-xs text-muted-foreground">{filtered.length} av {jobs.length} jobb</p>
          )}
        </div>
      </div>

      {/* Results */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <JobSearchIllustration className="h-32 w-auto mx-auto mb-4 opacity-70" />
          {jobs.length === 0 ? (
            <>
              <p className="font-medium">Inga aktiva annonser just nu</p>
              <p className="text-sm mt-1">Kom tillbaka snart — nya jobb publiceras dagligen</p>
            </>
          ) : (
            <>
              <p className="font-medium">Inga jobb matchar din sökning</p>
              <p className="text-sm mt-1">Prova att ändra filter</p>
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
