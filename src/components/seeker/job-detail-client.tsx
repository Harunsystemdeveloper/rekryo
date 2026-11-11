'use client'

import { useState, type ComponentPropsWithoutRef } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScoreRing, matchLevel, matchLevelLabel, matchLevelText } from '@/components/match/score-ring'
import {
  MapPin, Globe, Bookmark, BookmarkCheck, Loader2,
  Target, MessageSquare, CheckCircle, XCircle, ArrowLeft, Calendar, AlertCircle, Share2, FileWarning,
  Building2, Briefcase, Wallet, Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { daysUntil } from '@/lib/utils'
import { toast } from 'sonner'

// Ingen typografi-plugin är installerad, så vi styr markdown-elementen manuellt istället
// för att lita på "prose"-klasser som annars inte gör något.
const markdownComponents = {
  h1: (p: ComponentPropsWithoutRef<'h1'>) => <h2 className="text-lg font-semibold mt-6 mb-2 first:mt-0" {...p} />,
  h2: (p: ComponentPropsWithoutRef<'h2'>) => <h3 className="text-base font-semibold mt-5 mb-2 first:mt-0" {...p} />,
  h3: (p: ComponentPropsWithoutRef<'h3'>) => <h4 className="text-sm font-semibold mt-4 mb-1.5 first:mt-0" {...p} />,
  p: (p: ComponentPropsWithoutRef<'p'>) => <p className="text-sm leading-relaxed text-muted-foreground mb-3" {...p} />,
  ul: (p: ComponentPropsWithoutRef<'ul'>) => <ul className="space-y-1.5 mb-3 ml-1" {...p} />,
  ol: (p: ComponentPropsWithoutRef<'ol'>) => <ol className="space-y-1.5 mb-3 ml-4 list-decimal" {...p} />,
  li: (p: ComponentPropsWithoutRef<'li'>) => (
    <li className="text-sm leading-relaxed text-muted-foreground flex gap-2">
      <span className="text-primary mt-1.5 h-1 w-1 rounded-full bg-primary flex-shrink-0" />
      <span>{p.children}</span>
    </li>
  ),
  strong: (p: ComponentPropsWithoutRef<'strong'>) => <strong className="font-semibold text-foreground" {...p} />,
}

const workTypeLabel: Record<string, string> = { remote: 'Distans', hybrid: 'Hybrid', 'on-site': 'På plats' }

const applicationStatusLabel: Record<string, string> = {
  pending: 'Sökt', reviewed: 'Granskad', shortlisted: 'Shortlistad', accepted: 'Accepterad', rejected: 'Avslutad',
}

interface Props {
  job: {
    id: string; title: string; description: string; requirements: string | null
    skills_required: string[] | null; location: string | null; work_type: string | null
    salary_min: number | null; salary_max: number | null; currency: string
    experience_level: string | null; deadline: string | null
    company_profile: { company_name: string; logo_url: string | null; industry: string | null; location: string | null; website: string | null } | null
  }
  application: { id: string; status: string; match_score: number | null; skill_gaps: string[] | null; interview_questions: string[] | null; ai_summary: string | null } | null
  isSaved: boolean
  cvProfile: { skills: string[] | null; experience_years: number | null } | null
  userId: string
  similarJobs?: { id: string; title: string; location: string | null; work_type: string | null; skills_required: string[] | null; company_profile: { company_name: string } | null }[]
}

export function JobDetailClient({ job, application: initialApplication, isSaved: initialSaved, cvProfile, userId, similarJobs = [] }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [application, setApplication] = useState(initialApplication)
  const [skillGaps, setSkillGaps] = useState<{ match_score: number; missing_skills: string[]; matching_skills: string[]; gap_summary: string } | null>(null)
  const [questions, setQuestions] = useState<{ question: string; category: string; why: string }[]>([])
  const [loadingGaps, setLoadingGaps] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [phone, setPhone] = useState('')
  const [availability, setAvailability] = useState('')
  const [salaryExpectation, setSalaryExpectation] = useState('')
  const [applyStep, setApplyStep] = useState<1 | 2>(1)
  const supabase = createClient()

  async function toggleSave() {
    if (saved) {
      await supabase.from('saved_jobs').delete().eq('seeker_id', userId).eq('job_id', job.id)
      toast.success('Borttaget från sparade')
    } else {
      await supabase.from('saved_jobs').insert({ seeker_id: userId, job_id: job.id })
      toast.success('Jobb sparat!')
    }
    setSaved(!saved)
  }

  const MIN_COVER_LETTER = 80
  const hasCv = !!cvProfile?.skills?.length
  const phoneValid = phone.trim().length >= 6
  const coverLetterValid = coverLetter.trim().length >= MIN_COVER_LETTER

  async function applyToJob() {
    if (!coverLetterValid) {
      toast.error(`Skriv minst ${MIN_COVER_LETTER} tecken om varför du söker`)
      return
    }
    setApplying(true)

    const res = await fetch('/api/applications/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_id: job.id,
        phone,
        availability: availability || undefined,
        salary_expectation: salaryExpectation || undefined,
        cover_letter: coverLetter,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error('Ansökan misslyckades', { description: data.error })
      setApplying(false)
      return
    }
    setApplication(data)
    toast.success('Ansökan skickad!')
    setApplying(false)
  }

  async function analyzeGaps() {
    setLoadingGaps(true)
    const res = await fetch('/api/ai/skill-gaps', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: job.id }),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error); setLoadingGaps(false); return }
    setSkillGaps(data)
    setLoadingGaps(false)
  }

  async function generateQuestions() {
    setLoadingQuestions(true)
    const res = await fetch('/api/ai/interview-questions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: job.id }),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error); setLoadingQuestions(false); return }
    setQuestions(data.questions ?? [])
    setLoadingQuestions(false)
  }

  const required = job.skills_required ?? []
  const seekerSkills = new Set((cvProfile?.skills ?? []).map(s => s.toLowerCase()))
  const overlap = required.filter(s => seekerSkills.has(s.toLowerCase())).length
  const companyInitials = (job.company_profile?.company_name ?? job.title).split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  // Frågekategorier i designsystemets färger i stället för fyra olika Tailwind-paletter
  const categoryColors: Record<string, string> = {
    yrkesspecifik: 'bg-primary/10 text-primary',
    beteendemässig: 'bg-mint/15 text-mint-foreground',
    situationell: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    motivation: 'bg-muted text-muted-foreground',
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/seeker/jobs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Tillbaka till jobb
        </Link>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/jobs/${job.id}`)
            toast.success('Länk kopierad!')
          }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Share2 className="h-3.5 w-3.5" /> Dela annons
        </button>
      </div>

      {/* Rubrik */}
      <section className="panel p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 flex-shrink-0 rounded-xl">
            <AvatarImage src={job.company_profile?.logo_url ?? ''} alt="" className="object-contain" />
            <AvatarFallback className="gradient-primary rounded-xl text-base font-semibold text-white">{companyInitials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{job.title}</h1>
            <p className="mt-1 text-muted-foreground">
              {job.company_profile?.company_name ?? 'Okänt företag'}
              {job.company_profile?.industry && ` · ${job.company_profile.industry}`}
            </p>
          </div>
          <Button
            type="button"
            variant={saved ? 'secondary' : 'outline'}
            size="sm"
            onClick={toggleSave}
            aria-pressed={saved}
            className="flex-shrink-0"
          >
            {saved ? <BookmarkCheck className="h-4 w-4 sm:mr-1.5" aria-hidden /> : <Bookmark className="h-4 w-4 sm:mr-1.5" aria-hidden />}
            <span className="sr-only sm:not-sr-only">{saved ? 'Sparad' : 'Spara'}</span>
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {job.location && (
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden />{job.location}</span>
          )}
          {job.work_type && (
            <span className="inline-flex items-center gap-1.5"><Building2 className="h-4 w-4" aria-hidden />{workTypeLabel[job.work_type] ?? job.work_type}</span>
          )}
          {job.experience_level && (
            <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4" aria-hidden />{job.experience_level}</span>
          )}
          {(() => {
            const cur = job.currency ?? ''
            if (cur.startsWith('ök')) return <span className="inline-flex items-center gap-1.5"><Wallet className="h-4 w-4" aria-hidden />Lön enligt överenskommelse</span>
            if (job.salary_min || job.salary_max) {
              const label = cur.startsWith('fast+rörlig') ? 'Fast + rörlig' : cur.startsWith('provision') ? 'Provision' : cur.startsWith('SEK/tim') ? 'SEK/tim' : cur.startsWith('SEK/år') ? 'SEK/år' : 'SEK/mån'
              const range = job.salary_min && job.salary_max
                ? `${job.salary_min.toLocaleString('sv-SE')}–${job.salary_max.toLocaleString('sv-SE')}`
                : job.salary_min ? `från ${job.salary_min.toLocaleString('sv-SE')}` : `upp till ${job.salary_max?.toLocaleString('sv-SE')}`
              return <span className="inline-flex items-center gap-1.5 font-medium text-foreground"><Wallet className="h-4 w-4 text-muted-foreground" aria-hidden />{range} {label}</span>
            }
            return null
          })()}
          {job.deadline && (() => {
            const days = daysUntil(job.deadline)
            const urgent = days <= 3
            return (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 ${urgent ? 'bg-destructive/10 font-medium text-destructive' : 'bg-muted'}`}>
                {urgent ? <AlertCircle className="h-3.5 w-3.5" aria-hidden /> : <Calendar className="h-3.5 w-3.5" aria-hidden />}
                {days <= 0 ? 'Sista dag idag' : `Sök senast ${new Date(job.deadline).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })} · ${days} ${days === 1 ? 'dag' : 'dagar'} kvar`}
              </span>
            )
          })()}
          {job.company_profile?.website && (
            <a href={job.company_profile.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
              <Globe className="h-4 w-4" aria-hidden />Webbplats
            </a>
          )}
        </div>

        {required.length > 0 && (
          <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Krävda kompetenser</p>
              <div className="flex flex-wrap gap-1.5">
                {required.map(s => seekerSkills.has(s.toLowerCase()) ? (
                  <span key={s} className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-2.5 py-0.5 text-xs font-medium text-mint-foreground">
                    <CheckCircle className="h-3 w-3" aria-hidden />{s}<span className="sr-only"> (du har den)</span>
                  </span>
                ) : (
                  <span key={s} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{s}</span>
                ))}
              </div>
            </div>
            {hasCv && (
              <div className="sm:w-56">
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="text-muted-foreground">Kompetensöverlapp</span>
                  <span className="font-semibold tabular-nums">{overlap} av {required.length}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-mint" style={{ width: `${(overlap / required.length) * 100}%` }} />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">Räknat på ditt CV, inte AI-poängen</p>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Beskrivning</TabsTrigger>
              <TabsTrigger value="skillgap">
                <Target className="mr-1.5 h-3.5 w-3.5" />Kompetensgap
              </TabsTrigger>
              <TabsTrigger value="interview">
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />Intervjufrågor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <div className="panel p-6">
                <ReactMarkdown components={markdownComponents}>{job.description}</ReactMarkdown>
                {job.requirements && (
                  <>
                    <h3 className="text-sm font-semibold mt-6 mb-2 pt-4 border-t">Krav</h3>
                    <ReactMarkdown components={markdownComponents}>{job.requirements}</ReactMarkdown>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="skillgap" className="mt-4">
              <div className="panel p-6">
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <Target className="h-4 w-4 text-primary" aria-hidden />
                  Kompetensgap
                </h2>
                <p className="mb-5 text-sm text-muted-foreground">AI:n jämför kompetenserna i ditt CV med annonsens krav och visar vad du har och vad som saknas.</p>
                {!hasCv ? (
                  <div className="rounded-xl border border-dashed border-border p-5 text-center">
                    <p className="text-sm font-medium">Lägg till ditt CV först</p>
                    <p className="mt-1 text-xs text-muted-foreground">Analysen bygger på kompetenserna i ditt CV. Ju mer detaljerat det är, desto träffsäkrare blir den.</p>
                    <Button size="sm" asChild className="mt-4">
                      <Link href="/seeker/profile">Ladda upp CV</Link>
                    </Button>
                  </div>
                ) : !skillGaps ? (
                  <Button onClick={analyzeGaps} disabled={loadingGaps}>
                    {loadingGaps
                      ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />Analyserar…</>
                      : <><Sparkles className="mr-2 h-4 w-4" aria-hidden />Analysera mina kompetensgap</>}
                  </Button>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
                      <ScoreRing score={skillGaps.match_score} size="md" />
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold ${matchLevelText[matchLevel(skillGaps.match_score)]}`}>
                          {matchLevelLabel[matchLevel(skillGaps.match_score)]}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{skillGaps.gap_summary}</p>
                      </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-mint-foreground">
                          <CheckCircle className="h-3.5 w-3.5" aria-hidden />Du har ({skillGaps.matching_skills.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {skillGaps.matching_skills.map(s => (
                            <span key={s} className="rounded-full bg-mint/15 px-2.5 py-0.5 text-xs font-medium text-mint-foreground">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                          <XCircle className="h-3.5 w-3.5" aria-hidden />Saknas ({skillGaps.missing_skills.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {skillGaps.missing_skills.length === 0
                            ? <span className="text-xs text-muted-foreground">Inget saknas</span>
                            : skillGaps.missing_skills.map(s => (
                              <span key={s} className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-700 dark:text-amber-400">{s}</span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="interview" className="mt-4">
              <div className="panel p-6">
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <MessageSquare className="h-4 w-4 text-primary" aria-hidden />
                  Förbered intervjun
                </h2>
                <p className="mb-5 text-sm text-muted-foreground">Frågor som är troliga för just den här rollen, med en förklaring till varför de ställs.</p>
                {questions.length === 0 ? (
                  <Button onClick={generateQuestions} disabled={loadingQuestions}>
                    {loadingQuestions
                      ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />Tar fram frågor…</>
                      : <><Sparkles className="mr-2 h-4 w-4" aria-hidden />Ta fram intervjufrågor</>}
                  </Button>
                ) : (
                  <ol className="space-y-3">
                    {questions.map((q, i) => (
                      <li key={i} className="flex gap-3 rounded-xl border border-border bg-muted/30 p-4">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="text-sm font-medium">{q.question}</p>
                            <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs ${categoryColors[q.category] ?? 'bg-muted text-muted-foreground'}`}>
                              {q.category}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{q.why}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Apply sidebar */}
        <div>
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {application ? 'Din ansökan' : 'Ansök nu'}
              </CardTitle>
              {!application && (
                <div className="flex gap-1 mt-2">
                  {[1, 2].map(s => (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded-full transition-colors ${applyStep >= s ? 'bg-primary' : 'bg-muted'}`}
                    />
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {application ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-mint/15 text-mint-foreground">
                      <CheckCircle className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold">Du har sökt jobbet</p>
                      <p className="text-xs text-muted-foreground">
                        Status: <span className="font-medium text-foreground">{applicationStatusLabel[application.status] ?? application.status}</span>
                      </p>
                    </div>
                  </div>
                  {application.match_score != null ? (
                    <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
                      <ScoreRing score={application.match_score} size="md" />
                      <div>
                        <p className={`text-sm font-semibold ${matchLevelText[matchLevel(application.match_score)]}`}>
                          {matchLevelLabel[matchLevel(application.match_score)]}
                        </p>
                        <p className="text-xs text-muted-foreground">AI-poäng mot annonsens krav</p>
                      </div>
                    </div>
                  ) : (
                    <p className="rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
                      Rekryteraren har inte låtit AI:n matcha ansökningarna ännu. Poängen dyker upp här när det är gjort.
                    </p>
                  )}
                  {application.ai_summary && (
                    <div>
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary">
                        <Sparkles className="h-3 w-3" aria-hidden />AI:ns motivering
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{application.ai_summary}</p>
                    </div>
                  )}
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/seeker/applications">Mina ansökningar</Link>
                  </Button>
                </div>
              ) : !hasCv ? (
                <div className="text-center space-y-3 py-2">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
                    <FileWarning className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">CV krävs för att ansöka</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ladda upp och analysera ditt CV så att rekryteraren och AI-matchningen faktiskt kan bedöma din ansökan — precis som på riktiga jobbannonser.
                    </p>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/seeker/profile">Ladda upp CV</Link>
                  </Button>
                </div>
              ) : applyStep === 1 ? (
                <>
                  <p className="text-xs text-muted-foreground">Steg 1 av 2 — Grunduppgifter</p>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Telefonnummer <span className="text-destructive">*</span></label>
                      <input
                        type="tel"
                        placeholder="070-123 45 67"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          phone && !phoneValid ? 'border-destructive' : 'border-input'
                        }`}
                      />
                      <p className="text-xs text-muted-foreground">Krävs så att rekryteraren kan kontakta dig.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Tillgänglighet <span className="text-muted-foreground font-normal">(valfritt)</span></label>
                      <select
                        value={availability}
                        onChange={e => setAvailability(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Välj tillgänglighet</option>
                        <option value="Omgående">Omgående</option>
                        <option value="Inom 1 månad">Inom 1 månad</option>
                        <option value="Inom 2 månader">Inom 2 månader</option>
                        <option value="Inom 3 månader">Inom 3 månader</option>
                        <option value="Enligt överenskommelse">Enligt överenskommelse</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Löneanspråk <span className="text-muted-foreground font-normal">(valfritt)</span></label>
                      <input
                        type="text"
                        placeholder="t.ex. 42 000 SEK/mån"
                        value={salaryExpectation}
                        onChange={e => setSalaryExpectation(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => setApplyStep(2)} disabled={!phoneValid}>
                    Nästa steg →
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">Steg 2 av 2 — Personligt brev</p>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">
                      Berätta om dig själv <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder={`Varför söker du den här rollen?\nVad gör dig till en bra kandidat?\nVad vill du bidra med?`}
                      rows={7}
                      value={coverLetter}
                      onChange={e => setCoverLetter(e.target.value.slice(0, 1000))}
                      className={coverLetter && !coverLetterValid ? 'border-destructive' : undefined}
                    />
                    <p className={`text-xs ${coverLetter.length > 0 && !coverLetterValid ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {coverLetter.length}/1000 tecken {!coverLetterValid && `(minst ${MIN_COVER_LETTER} krävs)`}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setApplyStep(1)}>
                      ← Tillbaka
                    </Button>
                    <Button className="flex-1" onClick={applyToJob} disabled={applying || !coverLetterValid}>
                      {applying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Skicka
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar jobs */}
      {similarJobs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Liknande jobb</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarJobs.map(sj => (
              <Link key={sj.id} href={`/seeker/jobs/${sj.id}`}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="pt-4 pb-4 space-y-2">
                    <p className="font-medium text-sm leading-snug">{sj.title}</p>
                    <p className="text-xs text-muted-foreground">{sj.company_profile?.company_name ?? 'Okänt företag'}</p>
                    <div className="flex flex-wrap gap-1">
                      {sj.location && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-2.5 w-2.5 mr-1" />{sj.location}
                        </Badge>
                      )}
                      {sj.work_type && <Badge variant="outline" className="text-xs">{workTypeLabel[sj.work_type] ?? sj.work_type}</Badge>}
                    </div>
                    {sj.skills_required && (
                      <div className="flex flex-wrap gap-1">
                        {sj.skills_required.slice(0, 3).map(s => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
