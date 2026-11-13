'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Sparkles, X, Check, AlertTriangle, ArrowRight, Wand2, Timer, Circle } from 'lucide-react'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScoreRing, matchLevel, matchLevelLabel, matchLevelText } from '@/components/match/score-ring'

type Persona = 'seeker' | 'recruiter'

interface DemoResult {
  score: number
  matching: string[]
  missing: string[]
  verdict: string
}

// Exempeljobb med typiska krav — så jobbsökaren slipper gissa vad en annons "kräver",
// precis som de skulle se kraven i en riktig annons istället för att hitta på dem.
const exampleJobs = [
  { title: 'Sjuksköterska', requirements: ['Patientvård', 'Läkemedelshantering', 'Journalföring', 'Akutsjukvård'] },
  { title: 'Ekonomiassistent', requirements: ['Bokföring', 'Excel', 'Fakturahantering', 'Avstämningar'] },
  { title: 'Lärare årskurs 4–6', requirements: ['Pedagogik', 'Klassrumsledning', 'Individanpassning', 'Föräldrakontakt'] },
  { title: 'Säljare', requirements: ['Kundrelationer', 'Förhandling', 'CRM-system', 'Målstyrning'] },
  { title: 'Systemutvecklare', requirements: ['JavaScript', 'Git', 'API-utveckling', 'Agil metodik'] },
  { title: 'Kundtjänstmedarbetare', requirements: ['Kundservice', 'Kommunikation', 'Problemlösning', 'Zendesk'] },
]

// Ett klick fyller i allt och kör, så att besökaren ser ett resultat utan att skriva något
const examples: Record<Persona, { title: string; job: string[]; candidate: string[] }> = {
  seeker: {
    title: 'Sjuksköterska',
    job: exampleJobs[0].requirements,
    candidate: ['Patientvård', 'Läkemedelshantering', 'Journalföring', 'Kommunikation'],
  },
  recruiter: {
    title: 'Ekonomiassistent',
    job: exampleJobs[1].requirements,
    candidate: ['Bokföring', 'Excel', 'Kundservice', 'Fortnox'],
  },
}

// Stegen visas medan AI:n arbetar. De speglar vad prompten i /api/demo/match ber om.
const STEPS = ['Läser jobbets krav', 'Jämför kompetenserna', 'Skriver motiveringen']

const copy = {
  seeker: {
    intro: 'Välj ett jobb. Kraven fylls i som i en riktig annons, och du lägger till dina egna kompetenser.',
    jobTitleHint: 'jobbet du vill söka',
    jobSkillsLabel: 'Jobbets krav',
    jobSkillsHint: 'fylls i automatiskt',
    jobSkillsPlaceholder: 't.ex. Patientvård, Excel, Projektledning',
    thirdLabel: 'Dina kompetenser',
    thirdHint: 'tryck Enter efter varje',
    thirdPlaceholder: 't.ex. Kundservice, Redovisning, Omvårdnad',
    validationError: 'Fyll i jobbtitel, jobbets krav och dina kompetenser.',
    ctaText: 'Ladda upp ditt CV så matchas du mot alla aktiva jobb, med intervjufrågor och kompetensgap.',
    ctaButton: 'Skapa konto som jobbsökare',
    ctaHref: '/register?roll=jobbsokare',
  },
  recruiter: {
    intro: 'Fyll i tjänsten och en kandidats kompetenser, så räknar AI:n ut poängen och motiverar den.',
    jobTitleHint: 'tjänsten du rekryterar till',
    jobSkillsLabel: 'Jobbets krav',
    jobSkillsHint: 'tryck Enter efter varje',
    jobSkillsPlaceholder: 't.ex. Patientvård, Excel, Projektledning',
    thirdLabel: 'Kandidatens kompetenser',
    thirdHint: 'tryck Enter efter varje',
    thirdPlaceholder: 't.ex. Kundservice, Redovisning, Omvårdnad',
    validationError: 'Fyll i jobbtitel, jobbets krav och kandidatens kompetenser.',
    ctaText: 'Publicera en annons så rangordnas alla sökande automatiskt, med en sammanfattning per kandidat.',
    ctaButton: 'Skapa konto som rekryterare',
    ctaHref: '/register?roll=rekryterare',
  },
} satisfies Record<Persona, {
  intro: string
  jobTitleHint: string
  jobSkillsLabel: string
  jobSkillsHint: string
  jobSkillsPlaceholder: string
  thirdLabel: string
  thirdHint: string
  thirdPlaceholder: string
  validationError: string
  ctaText: string
  ctaButton: string
  ctaHref: string
}>

// Räknar upp poängen från 0 så att resultatet landar i stället för att bara dyka upp
function useCountUp(target: number | null, duration = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target == null) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = reduce ? 1 : Math.min(1, (now - start) / duration)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])
  return value
}

function SkillChips({ skills, tone, onRemove }: { skills: string[]; tone: 'job' | 'candidate'; onRemove: (s: string) => void }) {
  if (skills.length === 0) return null
  const cls = tone === 'job' ? 'bg-muted text-foreground/80' : 'bg-primary/10 text-primary'
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {skills.map(s => (
        <span key={s} className={`inline-flex items-center gap-1 rounded-full py-0.5 pl-2.5 pr-1 text-xs font-medium ${cls}`}>
          {s}
          <button type="button" onClick={() => onRemove(s)} className="rounded-full p-0.5 hover:bg-foreground/10" aria-label={`Ta bort ${s}`}>
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  )
}

export function DemoMatcher({ persona = 'seeker' }: { persona?: Persona }) {
  const c = copy[persona]

  const [jobTitle, setJobTitle] = useState('')
  const [jobSkillInput, setJobSkillInput] = useState('')
  const [jobSkills, setJobSkills] = useState<string[]>([])
  const [candidateSkillInput, setCandidateSkillInput] = useState('')
  const [candidateSkills, setCandidateSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<DemoResult | null>(null)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const [error, setError] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)
  const shown = useCountUp(result?.score ?? null)

  // Stegen byts på tid medan anropet pågår, så att väntan känns som arbete
  useEffect(() => {
    if (!loading) return
    const timers = [setTimeout(() => setStep(1), 700), setTimeout(() => setStep(2), 1600)]
    return () => timers.forEach(clearTimeout)
  }, [loading])

  function addSkill(input: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) {
    const s = input.trim()
    if (s && !list.includes(s) && list.length < 10) {
      setList([...list, s])
      setInput('')
    }
  }

  async function runDemo(preset?: { title: string; job: string[]; candidate: string[] }) {
    // Text som står kvar i fälten räknas med, så att man inte måste trycka Enter först
    const title = preset?.title ?? jobTitle
    const finalJobSkills = preset?.job ?? [...jobSkills]
    const finalCandidateSkills = preset?.candidate ?? [...candidateSkills]
    if (!preset) {
      if (jobSkillInput.trim() && !finalJobSkills.includes(jobSkillInput.trim())) {
        finalJobSkills.push(jobSkillInput.trim())
        setJobSkills(finalJobSkills)
        setJobSkillInput('')
      }
      if (candidateSkillInput.trim() && !finalCandidateSkills.includes(candidateSkillInput.trim())) {
        finalCandidateSkills.push(candidateSkillInput.trim())
        setCandidateSkills(finalCandidateSkills)
        setCandidateSkillInput('')
      }
    }

    if (!title || finalJobSkills.length === 0 || finalCandidateSkills.length === 0) {
      setError(c.validationError)
      return
    }
    setLoading(true)
    setStep(0)
    setError('')
    setResult(null)
    // På mobil ligger resultatet under formuläret, så visa det när analysen börjar
    if (window.matchMedia('(max-width: 1023px)').matches) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    const started = performance.now()
    try {
      const res = await fetch('/api/demo/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_title: title, job_skills: finalJobSkills, candidate_skills: finalCandidateSkills }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Något gick fel. Försök igen.'); return }
      setElapsed((performance.now() - started) / 1000)
      setResult(data)
    } catch {
      setError('Kunde inte nå tjänsten. Kontrollera din anslutning.')
    } finally {
      setLoading(false)
    }
  }

  function runExample() {
    const ex = examples[persona]
    setJobTitle(ex.title)
    setJobSkills(ex.job)
    setCandidateSkills(ex.candidate)
    setJobSkillInput('')
    setCandidateSkillInput('')
    runDemo(ex)
  }

  const level = result ? matchLevel(result.score) : null

  return (
    <div className="grid w-full overflow-hidden rounded-2xl border border-primary/25 bg-card text-left shadow-xl shadow-primary/10 lg:grid-cols-[1fr_1.05fr]">
      {/* Inmatning */}
      <div className="p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              Testa AI-matchningen
            </p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">{c.intro}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={runExample} disabled={loading}>
            <Wand2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Prova ett exempel
          </Button>
        </div>

        <div className="space-y-5">
          {persona === 'seeker' ? (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Jobbtitel <span className="font-normal text-muted-foreground">({c.jobTitleHint})</span></label>
              <Select
                value={jobTitle}
                onValueChange={(v) => {
                  setJobTitle(v as string)
                  const preset = exampleJobs.find(j => j.title === v)
                  if (preset) setJobSkills(preset.requirements)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Välj ett jobb du är intresserad av" />
                </SelectTrigger>
                <SelectContent>
                  {exampleJobs.map(j => (
                    <SelectItem key={j.title} value={j.title}>{j.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label htmlFor="demo-title" className="text-sm font-medium">Jobbtitel <span className="font-normal text-muted-foreground">({c.jobTitleHint})</span></label>
              <Input
                id="demo-title"
                placeholder="t.ex. Sjuksköterska, Ekonom, Lärare"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor={`demo-job-${persona}`} className="text-sm font-medium">{c.jobSkillsLabel} <span className="font-normal text-muted-foreground">({c.jobSkillsHint})</span></label>
            <Input
              id={`demo-job-${persona}`}
              placeholder={c.jobSkillsPlaceholder}
              value={jobSkillInput}
              onChange={e => setJobSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(jobSkillInput, jobSkills, setJobSkills, setJobSkillInput) } }}
            />
            <SkillChips skills={jobSkills} tone="job" onRemove={s => setJobSkills(jobSkills.filter(x => x !== s))} />
          </div>

          <div className="space-y-1.5">
            <label htmlFor={`demo-cand-${persona}`} className="text-sm font-medium">{c.thirdLabel} <span className="font-normal text-muted-foreground">({c.thirdHint})</span></label>
            <Input
              id={`demo-cand-${persona}`}
              placeholder={c.thirdPlaceholder}
              value={candidateSkillInput}
              onChange={e => setCandidateSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(candidateSkillInput, candidateSkills, setCandidateSkills, setCandidateSkillInput) } }}
            />
            <SkillChips skills={candidateSkills} tone="candidate" onRemove={s => setCandidateSkills(candidateSkills.filter(x => x !== s))} />
          </div>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

          <Button onClick={() => runDemo()} disabled={loading} size="lg" className="h-11 w-full">
            {loading
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />Analyserar</>
              : <><Sparkles className="mr-2 h-4 w-4" aria-hidden />Beräkna matchningspoäng</>}
          </Button>
        </div>
      </div>

      {/* Resultat: alltid synligt, så att det är tydligt vad man får */}
      <div
        ref={resultRef}
        className="flex min-h-[26rem] flex-col justify-center border-t border-border bg-muted/30 p-6 sm:p-8 lg:border-l lg:border-t-0"
        aria-live="polite"
      >
        {loading ? (
          <div className="mx-auto flex w-full max-w-xs flex-col items-center text-center">
            <div className="relative mb-7 flex h-[152px] w-[152px] items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-[10px] border-muted border-t-primary [animation-duration:1.1s]" />
              <Sparkles className="h-8 w-8 text-primary" aria-hidden />
            </div>
            <ol className="w-full space-y-2.5 text-left text-sm">
              {STEPS.map((label, i) => (
                <li key={label} className={`flex items-center gap-2.5 transition-colors ${i <= step ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                  {i < step
                    ? <Check className="h-4 w-4 text-mint-foreground" aria-hidden />
                    : i === step
                      ? <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
                      : <Circle className="h-4 w-4" aria-hidden />}
                  {label}
                </li>
              ))}
            </ol>
          </div>
        ) : result && level ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <ScoreRing score={shown} size="xl" />
              <div className="min-w-0">
                <p className={`text-2xl font-semibold tracking-tight ${matchLevelText[level]}`}>{matchLevelLabel[level]}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {result.matching.length} av {result.matching.length + result.missing.length} krav uppfyllda
                </p>
                {elapsed != null && (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-background/60 px-2.5 py-0.5 text-xs text-muted-foreground ring-1 ring-border">
                    <Timer className="h-3 w-3" aria-hidden />
                    Analyserad på {elapsed.toFixed(1).replace('.', ',')} s
                  </p>
                )}
              </div>
            </div>

            <blockquote className="mt-6 border-l-2 border-primary/50 pl-4">
              <p className="mb-1 text-xs font-semibold text-primary">Varför denna poäng</p>
              <p className="text-sm leading-relaxed">{result.verdict}</p>
            </blockquote>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-mint-foreground">
                  <Check className="h-3.5 w-3.5" aria-hidden />Matchar ({result.matching.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.matching.length === 0
                    ? <span className="text-xs text-muted-foreground">Inga av kraven</span>
                    : result.matching.map(s => (
                      <span key={s} className="rounded-full bg-mint/15 px-2.5 py-0.5 text-xs font-medium text-mint-foreground">{s}</span>
                    ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden />Saknas ({result.missing.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.missing.length === 0
                    ? <span className="text-xs text-muted-foreground">Inget saknas</span>
                    : result.missing.map(s => (
                      <span key={s} className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-700 dark:text-amber-400">{s}</span>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center">
              <p className="flex-1 text-sm">{c.ctaText}</p>
              <Button asChild size="sm" className="flex-shrink-0">
                <Link href={c.ctaHref}>{c.ctaButton}<ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden /></Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-xs flex-col items-center text-center">
            <div className="mb-6 flex h-[152px] w-[152px] items-center justify-center rounded-full border-[10px] border-dashed border-border">
              <span className="text-5xl font-semibold text-muted-foreground/40">?</span>
            </div>
            <p className="font-semibold">Resultatet visas här</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Ett poäng 0–100, vad som matchar, vad som saknas och en motivering. Det tar några sekunder.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
