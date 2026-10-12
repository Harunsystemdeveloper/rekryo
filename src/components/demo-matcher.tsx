'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, X, CheckCircle, XCircle, ArrowRight, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Persona = 'seeker' | 'recruiter'

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

const copy = {
  seeker: {
    intro: 'Välj ett jobb du är intresserad av — kraven fylls i automatiskt, precis som i en riktig annons. Lägg sedan till dina egna kompetenser.',
    jobTitleHint: 'jobbet du vill söka',
    jobSkillsLabel: 'Jobbets krav',
    jobSkillsHint: 'fylls i automatiskt — lägg till fler om du vill',
    jobSkillsPlaceholder: 't.ex. Patientvård, Excel, Projektledning, Juridik...',
    thirdLabel: 'Dina kompetenser',
    thirdHint: 'vad du faktiskt kan — tryck Enter',
    thirdPlaceholder: 't.ex. Kundservice, Redovisning, Omvårdnad, Pedagogik...',
    validationError: 'Fyll i jobbtitel, jobbets krav och dina kompetenser.',
    ctaText: 'Vill du se hela analysen med CV-upload, intervjufrågor och mer?',
    ctaButton: 'Skapa gratis konto',
  },
  recruiter: {
    intro: 'För dig som rekryterar: fyll i tjänsten du söker till och en kandidats kompetenser, så räknar AI:n ut matchningspoänget.',
    jobTitleHint: 'tjänsten du rekryterar till',
    jobSkillsLabel: 'Jobbets krav',
    jobSkillsHint: 'vad tjänsten kräver — tryck Enter',
    jobSkillsPlaceholder: 't.ex. Patientvård, Excel, Projektledning, Juridik...',
    thirdLabel: 'Kandidatens kompetenser',
    thirdHint: 'testa en sökandes profil — tryck Enter',
    thirdPlaceholder: 't.ex. Kundservice, Redovisning, Omvårdnad, Pedagogik...',
    validationError: 'Fyll i jobbtitel, jobbets krav och kandidatens kompetenser.',
    ctaText: 'Vill du ranka alla dina sökande automatiskt och få AI-sammanfattningar?',
    ctaButton: 'Skapa gratis konto',
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
}>

export function DemoMatcher({ persona = 'seeker' }: { persona?: Persona }) {
  const c = copy[persona]

  const [jobTitle, setJobTitle] = useState('')
  const [jobSkillInput, setJobSkillInput] = useState('')
  const [jobSkills, setJobSkills] = useState<string[]>([])
  const [candidateSkillInput, setCandidateSkillInput] = useState('')
  const [candidateSkills, setCandidateSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ score: number; matching: string[]; missing: string[]; verdict: string } | null>(null)
  const [error, setError] = useState('')

  function addSkill(input: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) {
    const s = input.trim()
    if (s && !list.includes(s) && list.length < 10) {
      setList([...list, s])
      setInput('')
    }
  }

  function removeSkill(skill: string, list: string[], setList: (v: string[]) => void) {
    setList(list.filter(s => s !== skill))
  }

  async function runDemo() {
    // Auto-add any text left in the inputs before validating
    const finalJobSkills = [...jobSkills]
    if (jobSkillInput.trim() && !finalJobSkills.includes(jobSkillInput.trim())) {
      finalJobSkills.push(jobSkillInput.trim())
      setJobSkills(finalJobSkills)
      setJobSkillInput('')
    }
    const finalCandidateSkills = [...candidateSkills]
    if (candidateSkillInput.trim() && !finalCandidateSkills.includes(candidateSkillInput.trim())) {
      finalCandidateSkills.push(candidateSkillInput.trim())
      setCandidateSkills(finalCandidateSkills)
      setCandidateSkillInput('')
    }

    if (!jobTitle || finalJobSkills.length === 0 || finalCandidateSkills.length === 0) {
      setError(c.validationError)
      return
    }
    setLoading(true)
    setError('')
    setResult(null)

    const res = await fetch('/api/demo/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_title: jobTitle, job_skills: finalJobSkills, candidate_skills: finalCandidateSkills }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setResult(data)
    setLoading(false)
  }

  const isCrash = result ? result.score < 45 : false
  const scoreColor = result
    ? result.score >= 70 ? 'text-green-500' : result.score >= 45 ? 'text-yellow-500' : 'text-red-600 dark:text-red-500'
    : ''

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-primary/25 bg-card p-6 sm:p-8 shadow-xl shadow-primary/5">
      <div className="flex items-center gap-2 mb-1.5">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-semibold">Testa AI-matchning — utan konto</span>
      </div>
      <p className="text-xs text-muted-foreground mb-6">{c.intro}</p>

      <div className="space-y-5">
        {/* Job title */}
        {persona === 'seeker' ? (
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Jobbtitel <span className="text-muted-foreground font-normal">({c.jobTitleHint})</span></label>
            <Select
              value={jobTitle}
              onValueChange={(v) => {
                setJobTitle(v as string)
                const preset = exampleJobs.find(j => j.title === v)
                if (preset) setJobSkills(preset.requirements)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Välj ett jobb du är intresserad av..." />
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
            <label className="text-sm font-medium">Jobbtitel <span className="text-muted-foreground font-normal">({c.jobTitleHint})</span></label>
            <Input
              placeholder="t.ex. Sjuksköterska, Ekonom, Lärare, Säljare..."
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
            />
          </div>
        )}

        {/* Job skills */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{c.jobSkillsLabel} <span className="text-muted-foreground font-normal">({c.jobSkillsHint})</span></label>
          <Input
            placeholder={c.jobSkillsPlaceholder}
            value={jobSkillInput}
            onChange={e => setJobSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(jobSkillInput, jobSkills, setJobSkills, setJobSkillInput) } }}
          />
          {jobSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {jobSkills.map(s => (
                <Badge key={s} variant="secondary" className="gap-1 pr-1">
                  {s}
                  <button onClick={() => removeSkill(s, jobSkills, setJobSkills)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Candidate skills */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{c.thirdLabel} <span className="text-muted-foreground font-normal">({c.thirdHint})</span></label>
          <Input
            placeholder={c.thirdPlaceholder}
            value={candidateSkillInput}
            onChange={e => setCandidateSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(candidateSkillInput, candidateSkills, setCandidateSkills, setCandidateSkillInput) } }}
          />
          {candidateSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {candidateSkills.map(s => (
                <Badge key={s} className="gap-1 pr-1 bg-primary/10 text-primary border-primary/20">
                  {s}
                  <button onClick={() => removeSkill(s, candidateSkills, setCandidateSkills)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button onClick={runDemo} disabled={loading} className="w-full">
          {loading
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyserar...</>
            : <><Sparkles className="mr-2 h-4 w-4" />Beräkna matchningspoäng</>
          }
        </Button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 pt-6 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Matchningspoäng</span>
            <span className={`flex items-center gap-1.5 text-4xl font-bold tabular-nums ${scoreColor} ${isCrash ? 'stat-glow' : ''}`}>
              {isCrash && <TrendingDown className="h-7 w-7 flex-shrink-0" strokeWidth={2.5} />}
              {result.score}<span className="text-lg text-muted-foreground">/100</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground italic">{result.verdict}</p>

          <div className="grid sm:grid-cols-2 gap-3">
            {result.matching.length > 0 && (
              <div>
                <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Matchar ({result.matching.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {result.matching.map(s => (
                    <Badge key={s} className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {result.missing.length > 0 && (
              <div>
                <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1.5 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> Saknas ({result.missing.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {result.missing.map(s => (
                    <Badge key={s} variant="destructive" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center space-y-2">
            <p className="text-sm font-medium">{c.ctaText}</p>
            <Button asChild size="sm">
              <Link href="/register">{c.ctaButton} <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
