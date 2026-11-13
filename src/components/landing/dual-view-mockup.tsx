import { Check, AlertTriangle, Search, BarChart3, MapPin, Sparkles, Star, SlidersHorizontal, EyeOff, UserCheck, ChevronDown } from 'lucide-react'
import { ScoreRing } from '@/components/match/score-ring'

// Samma matchning sedd från båda håll, byggd med appens egna komponenter och färger så
// att den ser ut som produkten i båda temana. Innehållet speglar den riktiga matchningen:
// samma fyra delpoäng som AI:n returnerar (src/lib/ai/claude.ts), kompetensgap och
// rekryterarens överstyrning. Företaget och kandidaten är påhittade.

const categories = [
  { label: 'Kompetens', value: 92 },
  { label: 'Erfarenhet', value: 85 },
  { label: 'Utbildning', value: 80 },
  { label: 'Mjuka kompetenser', value: 76 },
]

function WindowChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-2.5">
      <span className="h-2 w-2 rounded-full bg-foreground/15" />
      <span className="h-2 w-2 rounded-full bg-foreground/15" />
      <span className="h-2 w-2 rounded-full bg-foreground/15" />
      <span className="ml-3 truncate text-[11px] text-muted-foreground">{url}</span>
    </div>
  )
}

function ViewLabel({ icon: Icon, children, tone }: { icon: typeof Search; children: string; tone: 'primary' | 'mint' }) {
  const cls = tone === 'primary' ? 'bg-primary/10 text-primary ring-primary/20' : 'bg-mint/10 text-mint-foreground ring-mint/25'
  return (
    <span className={`mb-3 inline-flex self-start items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {children}
    </span>
  )
}

export function DualViewMockup() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      {/* Jobbsökarens vy */}
      <figure className="flex min-w-0 flex-col">
        <ViewLabel icon={Search} tone="primary">Jobbsökaren ser</ViewLabel>
        <div className="mockup-card flex-1 overflow-hidden rounded-2xl border border-border bg-card" aria-hidden>
          <WindowChrome url="rekryo.com/jobb/underskoterska-akutmottagning" />
          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="gradient-primary flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white">NV</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug">Undersköterska, akutmottagning</p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />Nordvik Vård AB · Uppsala
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
              <ScoreRing score={87} size="lg" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-mint-foreground">Stark matchning</p>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">Du uppfyller 5 av 6 krav och har mer erfarenhet än tjänsten kräver.</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold">Varför du matchar</p>
              <ul className="space-y-2 text-[13px] leading-snug">
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-mint-foreground" />Akutsjukvård, triage och läkemedelshantering finns i ditt CV</li>
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-mint-foreground" />4 års erfarenhet, tjänsten efterfrågar minst 3</li>
              </ul>
            </div>

            <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />Det här saknas
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-foreground/80">
                Journalsystemet <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-medium text-amber-800 dark:text-amber-300">TakeCare</span>. Nämn erfarenhet av andra journalsystem i ansökan.
              </p>
            </div>

            <div className="flex gap-2">
              <span className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground">Sök jobbet</span>
              <span className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />Förbered intervju
              </span>
            </div>
          </div>
        </div>
      </figure>

      {/* Rekryterarens vy */}
      <figure className="flex min-w-0 flex-col">
        <ViewLabel icon={BarChart3} tone="mint">Rekryteraren ser</ViewLabel>
        <div className="mockup-card flex-1 overflow-hidden rounded-2xl border border-border bg-card" aria-hidden>
          <WindowChrome url="rekryo.com/rekryterare/kandidater" />
          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <ScoreRing score={87} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">Kandidat K-1042</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-2 py-0.5 text-[11px] font-medium text-mint-foreground">
                    <Star className="h-3 w-3 fill-current" />Shortlistad
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">Undersköterska · 4 års erfarenhet · Uppsala</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
              {categories.map(c => (
                <div key={c.label}>
                  <div className="mb-1.5 flex items-baseline justify-between text-xs">
                    <span className="text-muted-foreground">{c.label}</span>
                    <span className="font-medium tabular-nums">{c.value}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${c.value >= 75 ? 'bg-mint' : 'bg-primary'}`} style={{ width: `${c.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-primary/15 bg-primary/5 p-3.5">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />AI-bedömning
              </p>
              <p className="text-[13px] leading-snug">Stark inom akutsjukvård och triage. Saknar erfarenhet av TakeCare, som går att lära sig under introduktionen.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm">
                Granskad <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </span>
              <span className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm">
                <SlidersHorizontal className="h-3.5 w-3.5" />Justera poäng
              </span>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold">Fler sökande</p>
              <div className="divide-y divide-border rounded-xl border border-border">
                {[
                  { id: 'K-0981', meta: '6 års erfarenhet', score: 81 },
                  { id: 'K-1107', meta: '2 års erfarenhet', score: 74 },
                ].map(c => (
                  <div key={c.id} className="flex items-center gap-3 px-3.5 py-2.5 text-sm">
                    <span className="flex-1 truncate">Kandidat {c.id}<span className="ml-2 text-xs text-muted-foreground">{c.meta}</span></span>
                    <span className="font-semibold tabular-nums">{c.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border pt-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><EyeOff className="h-3 w-3" />Namnet skickas inte till AI:n</span>
              <span className="inline-flex items-center gap-1.5"><UserCheck className="h-3 w-3" />Du fattar beslutet, ändringar loggas</span>
            </div>
          </div>
        </div>
      </figure>
    </div>
  )
}
