'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog'
import {
  Loader2, Star, StarOff, MessageSquare, Search,
  Brain, ArrowLeft, Users, MapPin, LayoutList, Columns, Download, StickyNote, Pencil, ClipboardCheck,
  ChevronDown, ChevronUp, Sparkles, Check, MoreHorizontal
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { CandidateCrmPanel } from '@/components/recruiter/candidate-crm-panel'
import { InterviewScheduleButton } from '@/components/recruiter/interview-schedule-button'
import { InterviewScorecardPanel } from '@/components/recruiter/interview-scorecard-panel'
import { MatchBreakdownView } from '@/components/recruiter/match-breakdown-view'
import { ScoreRing, matchLevel, matchLevelLabel, matchLevelText } from '@/components/match/score-ring'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InviteCandidateDialog } from '@/components/recruiter/invite-candidate-dialog'
import type { MatchBreakdown } from '@/types/database'

interface Candidate {
  id: string
  status: string
  match_score: number | null
  match_breakdown: MatchBreakdown | null
  ai_summary: string | null
  skill_gaps: string[] | null
  interview_questions: string[] | null
  is_shortlisted: boolean
  seeker: { id: string; full_name: string | null; avatar_url: string | null; headline: string | null; location: string | null } | null
  cv: { skills: string[] | null; experience_years: number | null; ai_summary: string | null; languages: string[] | null } | null
}

const statusOptions = [
  { value: 'pending', label: 'Ny' },
  { value: 'reviewed', label: 'Granskad' },
  { value: 'shortlisted', label: 'Shortlistad' },
  { value: 'accepted', label: 'Accepterad' },
  { value: 'rejected', label: 'Avvisad' },
]

// Base UI:s Select visar råvärdet i triggern ("pending", "all") om den inte får en
// tabell från värde till etikett via items.
const STATUS_ITEMS = Object.fromEntries(statusOptions.map(s => [s.value, s.label]))
const STATUS_FILTER_ITEMS = { all: 'Alla statusar', ...STATUS_ITEMS }
const EXPERIENCE_ITEMS = { all: 'All erfarenhet', '0': 'Ingen erfarenhet', '1-2': '1–2 år', '3-5': '3–5 år', '5-10': '5–10 år', '10+': '10+ år' }

interface SuggestedProfile {
  id: string; full_name: string | null; avatar_url: string | null
  headline: string | null; location: string | null
  cv: { skills: string[] | null; experience_years: number | null } | null
  overlap: number
}

export function CandidatesClient({
  job,
  applications: initialApps,
  recruiterId,
  suggestedProfiles = [],
}: {
  job: { id: string; title: string; skills_required: string[] | null }
  applications: Candidate[]
  recruiterId: string
  suggestedProfiles?: SuggestedProfile[]
}) {
  const [apps, setApps] = useState(initialApps)
  const [matching, setMatching] = useState(false)
  const [search, setSearch] = useState('')
  const [filterExp, setFilterExp] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [crmOpen, setCrmOpen] = useState(false)
  const [crmCandidate, setCrmCandidate] = useState<{ id: string; name: string } | null>(null)
  const [scorecardOpen, setScorecardOpen] = useState(false)
  const [scorecardCandidate, setScorecardCandidate] = useState<{ applicationId: string; seekerId: string; name: string; questions: string[] } | null>(null)
  const [expandedBreakdown, setExpandedBreakdown] = useState<Set<string>>(new Set())
  const [overrideOpen, setOverrideOpen] = useState(false)
  const [overrideApp, setOverrideApp] = useState<{ id: string; name: string; currentScore: number | null } | null>(null)
  const [overrideScore, setOverrideScore] = useState<number>(50)
  const [overrideReason, setOverrideReason] = useState('')
  const [overriding, setOverriding] = useState(false)
  const supabase = createClient()

  function openOverride(appId: string, name: string, currentScore: number | null) {
    setOverrideApp({ id: appId, name, currentScore })
    setOverrideScore(currentScore ?? 50)
    setOverrideReason('')
    setOverrideOpen(true)
  }

  async function submitOverride() {
    if (!overrideApp || overrideReason.length < 10) return
    setOverriding(true)
    const res = await fetch('/api/applications/override-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        application_id: overrideApp.id,
        override_score: overrideScore,
        reason: overrideReason,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.error)
    } else {
      setApps(apps.map(a => a.id === overrideApp.id ? { ...a, match_score: overrideScore } : a))
      toast.success('Poäng uppdaterad och loggad i AI-logg')
      setOverrideOpen(false)
    }
    setOverriding(false)
  }

  function openCrm(seekerId: string, name: string) {
    setCrmCandidate({ id: seekerId, name })
    setCrmOpen(true)
  }

  function openScorecard(applicationId: string, seekerId: string, name: string, questions: string[] | null) {
    setScorecardCandidate({ applicationId, seekerId, name, questions: questions ?? [] })
    setScorecardOpen(true)
  }

  function toggleBreakdown(appId: string) {
    setExpandedBreakdown(prev => {
      const next = new Set(prev)
      if (next.has(appId)) next.delete(appId)
      else next.add(appId)
      return next
    })
  }

  function exportCsv() {
    const headers = ['Namn', 'Titel', 'Plats', 'Erfarenhet (år)', 'Matchpoäng', 'Status', 'Shortlistad', 'Kompetenser', 'Saknar']
    const rows = filtered.map(a => [
      a.seeker?.full_name ?? '',
      a.seeker?.headline ?? '',
      a.seeker?.location ?? '',
      a.cv?.experience_years ?? '',
      a.match_score ?? '',
      a.status,
      a.is_shortlisted ? 'Ja' : 'Nej',
      (a.cv?.skills ?? []).join('; '),
      (a.skill_gaps ?? []).join('; '),
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kandidater-${job.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function runAiMatch() {
    setMatching(true)
    toast.info('AI matchar kandidater...')
    const res = await fetch('/api/ai/match-candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: job.id }),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error); setMatching(false); return }
    toast.success(`Matchade ${data.matches?.length ?? 0} kandidater!`)
    // Reload page to get updated scores
    window.location.reload()
  }

  async function toggleShortlist(appId: string, isShortlisted: boolean) {
    if (isShortlisted) {
      await supabase.from('shortlist').delete().eq('application_id', appId).eq('recruiter_id', recruiterId)
      toast.success('Borttagen från shortlist')
    } else {
      await supabase.from('shortlist').insert({ application_id: appId, recruiter_id: recruiterId })
      toast.success('Tillagd i shortlist!')
    }
    setApps(apps.map(a => a.id === appId ? { ...a, is_shortlisted: !isShortlisted } : a))
  }

  async function updateStatus(appId: string, status: string) {
    await fetch('/api/applications/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application_id: appId, status }),
    })
    setApps(apps.map(a => a.id === appId ? { ...a, status } : a))
    toast.success('Status uppdaterad')
  }

  const scoredCount = apps.filter(a => a.match_score != null).length
  const required = new Set((job.skills_required ?? []).map(s => s.toLowerCase()))

  const filtered = apps.filter(app => {
    const seeker = app.seeker
    const matchSearch = !search ||
      seeker?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.cv?.skills?.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      seeker?.location?.toLowerCase().includes(search.toLowerCase())
    const exp = app.cv?.experience_years ?? 0
    const matchExp = filterExp === 'all' ||
      (filterExp === '0' && exp === 0) ||
      (filterExp === '1-2' && exp >= 1 && exp <= 2) ||
      (filterExp === '3-5' && exp >= 3 && exp <= 5) ||
      (filterExp === '5-10' && exp >= 6 && exp <= 10) ||
      (filterExp === '10+' && exp > 10)
    const matchStatus = filterStatus === 'all' || app.status === filterStatus
    return matchSearch && matchExp && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Rubrik */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Link href="/recruiter/jobs" className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden />Alla annonser
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">{job.title}</h1>
          <p className="mt-1.5 text-muted-foreground">
            {apps.length} {apps.length === 1 ? 'kandidat' : 'kandidater'}
            {scoredCount > 0 && <> · {scoredCount} AI-matchade</>}
          </p>
          {(job.skills_required?.length ?? 0) > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Annonsens krav:</span>
              {job.skills_required!.map(s => (
                <span key={s} className="rounded-full border border-border px-2.5 py-0.5 text-xs">{s}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border p-0.5" role="group" aria-label="Visningsläge">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7"
              onClick={() => setViewMode('list')}
              aria-pressed={viewMode === 'list'}
              aria-label="Lista"
            >
              <LayoutList className="h-4 w-4" aria-hidden />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7"
              onClick={() => setViewMode('kanban')}
              aria-pressed={viewMode === 'kanban'}
              aria-label="Tavla per status"
            >
              <Columns className="h-4 w-4" aria-hidden />
            </Button>
          </div>
          {filtered.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportCsv} className="hidden sm:flex">
              <Download className="mr-2 h-4 w-4" aria-hidden />
              Exportera CSV
            </Button>
          )}
          <Button onClick={runAiMatch} disabled={matching || apps.length === 0}>
            {matching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : <Sparkles className="mr-2 h-4 w-4" aria-hidden />}
            {matching ? 'Matchar…' : scoredCount > 0 ? 'Matcha om' : 'AI-matcha'}
          </Button>
        </div>
      </div>

      {/* Förklaring innan första matchningen */}
      {apps.length > 0 && scoredCount === 0 && (
        <div className="panel flex items-start gap-3 border-primary/25 bg-primary/5 p-4">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Brain className="h-4 w-4" aria-hidden />
          </span>
          <div className="text-sm">
            <p className="font-medium">Kandidaterna är inte matchade ännu</p>
            <p className="mt-0.5 text-muted-foreground">
              Klicka på <strong className="text-foreground">AI-matcha</strong> så jämförs varje kandidats kompetenser och erfarenhet med annonsens krav. Alla får en poäng 0–100 med motivering. Kandidatens namn skickas inte med i bedömningen.
            </p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input placeholder="Sök på namn, kompetens eller plats" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" aria-label="Sök kandidater" />
        </div>
        <Select items={EXPERIENCE_ITEMS} value={filterExp} onValueChange={(v) => setFilterExp(v ?? 'all')}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Filtrera på erfarenhet"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All erfarenhet</SelectItem>
            <SelectItem value="0">Ingen erfarenhet</SelectItem>
            <SelectItem value="1-2">1–2 år</SelectItem>
            <SelectItem value="3-5">3–5 år</SelectItem>
            <SelectItem value="5-10">5–10 år</SelectItem>
            <SelectItem value="10+">10+ år</SelectItem>
          </SelectContent>
        </Select>
        <Select items={STATUS_FILTER_ITEMS} value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? 'all')}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Filtrera på status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla statusar</SelectItem>
            {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Suggested profiles — seekers who haven't applied but match */}
      {suggestedProfiles.length > 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Föreslagna profiler — har inte sökt ännu</p>
            <span className="text-xs text-muted-foreground">({suggestedProfiles.length} matchande)</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestedProfiles.map(p => {
              const initials = p.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'
              const total = job.skills_required?.length ?? 1
              const pct = Math.round((p.overlap / total) * 100)
              return (
                <div key={p.id} className="bg-background rounded-lg border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={p.avatar_url ?? ''} />
                      <AvatarFallback className="gradient-primary text-white text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{p.full_name ?? 'Anonym'}</p>
                      {p.headline && <p className="text-xs text-muted-foreground truncate">{p.headline}</p>}
                    </div>
                    <span className="ml-auto text-sm font-bold text-primary flex-shrink-0">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1" />
                  <div className="flex flex-wrap gap-1">
                    {p.cv?.skills?.slice(0, 4).map(s => (
                      <Badge
                        key={s}
                        variant={job.skills_required?.includes(s) ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <InviteCandidateDialog
                    seekerId={p.id}
                    seekerName={p.full_name ?? 'Kandidat'}
                    jobs={[{ id: job.id, title: job.title }]}
                    trigger={
                      <Button size="sm" variant="outline" className="w-full h-7 text-xs">
                        <MessageSquare className="mr-1 h-3 w-3" />Bjud in att söka
                      </Button>
                    }
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Kanban view */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {statusOptions.map(col => {
              const colApps = filtered.filter(a => a.status === col.value)
              return (
                <div key={col.value} className="w-64 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-sm font-medium">{col.label}</span>
                    <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">{colApps.length}</span>
                  </div>
                  <div className="space-y-2">
                    {colApps.length === 0 && (
                      <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                        Inga kandidater
                      </div>
                    )}
                    {colApps.map(app => {
                      const seeker = app.seeker
                      const initials = seeker?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'
                      return (
                        <Card key={app.id} className="cursor-default hover:shadow-md transition-shadow">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={seeker?.avatar_url ?? ''} />
                                <AvatarFallback className="gradient-primary text-white text-xs">{initials}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{seeker?.full_name ?? 'Anonym'}</p>
                                {seeker?.headline && <p className="text-xs text-muted-foreground truncate">{seeker.headline}</p>}
                              </div>
                            </div>
                            {app.match_score != null && (
                              <div className="flex items-center gap-2">
                                <Progress value={app.match_score} className="h-1.5 flex-1" />
                                <span className="text-xs font-medium text-primary">{app.match_score}%</span>
                              </div>
                            )}
                            <div className="flex gap-1.5">
                              <Select items={STATUS_ITEMS} value={app.status} onValueChange={v => v && updateStatus(app.id, v)}>
                                <SelectTrigger className="h-6 text-xs flex-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleShortlist(app.id, app.is_shortlisted)}
                              >
                                {app.is_shortlisted ? <Star className="h-3.5 w-3.5 fill-primary text-primary" /> : <Star className="h-3.5 w-3.5" />}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Listvy */}
      {viewMode === 'list' && filtered.length === 0 ? (
        <div className="panel flex flex-col items-center px-6 py-14 text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-6 w-6" aria-hidden />
          </span>
          <p className="font-semibold">
            {apps.length === 0 ? 'Inga kandidater ännu' : 'Inga kandidater matchar filtret'}
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {apps.length === 0
              ? 'När någon söker jobbet dyker kandidaten upp här, redo att AI-matchas.'
              : 'Prova att rensa sökningen eller välja en annan status eller erfarenhetsnivå.'}
          </p>
        </div>
      ) : viewMode === 'list' && (
        <ul className="grid gap-4">
          {filtered.map(app => {
            const seeker = app.seeker
            const name = seeker?.full_name ?? 'Anonym kandidat'
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            const level = app.match_score != null ? matchLevel(app.match_score) : null
            const skills = app.cv?.skills ?? []
            const matched = skills.filter(s => required.has(s.toLowerCase()))
            const other = skills.filter(s => !required.has(s.toLowerCase()))
            const open = expandedBreakdown.has(app.id)
            return (
              <li key={app.id} className={`panel overflow-hidden ${app.is_shortlisted ? 'ring-1 ring-mint/50' : ''}`}>
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
                  {/* Poäng */}
                  <div className="flex items-center gap-3 sm:w-24 sm:flex-col sm:gap-2 sm:text-center">
                    {app.match_score != null && level ? (
                      <>
                        <ScoreRing score={app.match_score} size="md" />
                        <span className={`text-xs font-medium ${matchLevelText[level]}`}>{matchLevelLabel[level]}</span>
                      </>
                    ) : (
                      <>
                        <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-border text-sm text-muted-foreground" aria-hidden>–</span>
                        <span className="text-xs text-muted-foreground">Ej matchad</span>
                      </>
                    )}
                  </div>

                  {/* Kandidat */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={seeker?.avatar_url ?? ''} alt="" />
                        <AvatarFallback className="gradient-primary text-xs text-white">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{name}</h3>
                          {app.is_shortlisted && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-2 py-0.5 text-xs font-medium text-mint-foreground">
                              <Star className="h-3 w-3 fill-current" aria-hidden />Shortlistad
                            </span>
                          )}
                        </div>
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
                          {seeker?.headline && <span>{seeker.headline}</span>}
                          {seeker?.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" aria-hidden />{seeker.location}</span>}
                          {app.cv?.experience_years != null && <span>{app.cv.experience_years} års erfarenhet</span>}
                        </p>
                      </div>
                    </div>

                    {app.ai_summary && (
                      <div className="mt-4 rounded-lg border border-primary/15 bg-primary/5 px-3.5 py-3">
                        <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary">
                          <Sparkles className="h-3 w-3" aria-hidden />AI-bedömning
                        </p>
                        <p className="text-sm leading-relaxed">{app.ai_summary}</p>
                      </div>
                    )}

                    {(matched.length > 0 || other.length > 0 || (app.cv?.languages?.length ?? 0) > 0) && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {matched.map(s => (
                          <span key={s} className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-2.5 py-0.5 text-xs font-medium text-mint-foreground" title="Krävs i annonsen">
                            <Check className="h-3 w-3" aria-hidden />{s}
                          </span>
                        ))}
                        {other.slice(0, Math.max(0, 6 - matched.length)).map(s => (
                          <span key={s} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{s}</span>
                        ))}
                        {app.cv?.languages?.slice(0, 2).map(l => (
                          <span key={l} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">{l}</span>
                        ))}
                      </div>
                    )}

                    {app.skill_gaps && app.skill_gaps.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">Saknar:</span>
                        {app.skill_gaps.slice(0, 4).map(s => (
                          <span key={s} className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-700 dark:text-amber-400">{s}</span>
                        ))}
                      </div>
                    )}

                    {app.match_breakdown && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => toggleBreakdown(app.id)}
                          aria-expanded={open}
                          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          Varför denna poäng?
                          {open ? <ChevronUp className="h-4 w-4" aria-hidden /> : <ChevronDown className="h-4 w-4" aria-hidden />}
                        </button>
                        {open && (
                          <div className="mt-3">
                            <MatchBreakdownView breakdown={app.match_breakdown} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Åtgärder */}
                <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/30 px-5 py-3 sm:px-6">
                  <Select items={STATUS_ITEMS} value={app.status} onValueChange={v => v && updateStatus(app.id, v)}>
                    <SelectTrigger className="h-8 w-36 text-xs" aria-label={`Status för ${name}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant={app.is_shortlisted ? 'secondary' : 'outline'}
                    onClick={() => toggleShortlist(app.id, app.is_shortlisted)}
                    aria-pressed={app.is_shortlisted}
                  >
                    {app.is_shortlisted
                      ? <><StarOff className="mr-1 h-3.5 w-3.5" aria-hidden />Ta bort från shortlist</>
                      : <><Star className="mr-1 h-3.5 w-3.5" aria-hidden />Shortlista</>}
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/messages?user=${seeker?.id}`}>
                      <MessageSquare className="mr-1 h-3.5 w-3.5" aria-hidden />Chatta
                    </Link>
                  </Button>
                  <InterviewScheduleButton applicationId={app.id} seekerId={seeker?.id ?? ''} />
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button size="sm" variant="ghost" className="ml-auto" aria-label={`Fler åtgärder för ${name}`} />}
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem onClick={() => openCrm(seeker?.id ?? '', name)}>
                        <StickyNote className="mr-2 h-4 w-4" aria-hidden />Anteckningar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openScorecard(app.id, seeker?.id ?? '', name, app.interview_questions)}>
                        <ClipboardCheck className="mr-2 h-4 w-4" aria-hidden />Intervjuutvärdering
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openOverride(app.id, name, app.match_score)}>
                        <Pencil className="mr-2 h-4 w-4" aria-hidden />Justera AI-poäng
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Human override dialog — AI Act Article 14 */}
      <Dialog open={overrideOpen} onOpenChange={setOverrideOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Överstyr AI-matchpoäng</DialogTitle>
            <DialogDescription>
              {overrideApp?.name} · AI-poäng: {overrideApp?.currentScore ?? '–'}%
              <br />
              <span className="text-xs">Enligt EU AI Act krävs att mänskliga beslut loggas när AI-bedömningar åsidosätts.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nytt matchpoäng (0–100)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={overrideScore}
                  onChange={e => setOverrideScore(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-bold w-12 text-right">{overrideScore}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Motivering (krävs)</label>
              <Textarea
                placeholder="Förklara varför du justerar AI-poängen, t.ex. 'Kandidaten har relevant erfarenhet som inte framgår av CV:t'..."
                value={overrideReason}
                onChange={e => setOverrideReason(e.target.value)}
                rows={3}
                minLength={10}
              />
              <p className="text-xs text-muted-foreground">{overrideReason.length}/500 tecken (minst 10)</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOverrideOpen(false)}>Avbryt</Button>
            <Button
              onClick={submitOverride}
              disabled={overriding || overrideReason.length < 10}
            >
              {overriding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Spara och logga
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CRM Sheet */}
      <Sheet open={crmOpen} onOpenChange={setCrmOpen}>
        <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Kandidat-CRM</SheetTitle>
          </SheetHeader>
          {crmCandidate && (
            <div className="mt-4">
              <CandidateCrmPanel seekerId={crmCandidate.id} seekerName={crmCandidate.name} />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Scorecard Sheet */}
      <Sheet open={scorecardOpen} onOpenChange={setScorecardOpen}>
        <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Intervjuutvärdering</SheetTitle>
          </SheetHeader>
          {scorecardCandidate && (
            <div className="mt-4">
              <InterviewScorecardPanel
                applicationId={scorecardCandidate.applicationId}
                seekerId={scorecardCandidate.seekerId}
                seekerName={scorecardCandidate.name}
                suggestedQuestions={scorecardCandidate.questions}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
