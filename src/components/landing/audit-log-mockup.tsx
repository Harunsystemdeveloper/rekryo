import { Lock, Sparkles, UserCheck, ArrowRight, ScrollText } from 'lucide-react'

// Visar hur granskningsloggen ser ut i stället för att bara påstå att den finns. Raderna
// följer det ai_decision_logs faktiskt sparar: beslutstyp, poäng, modell och, vid en
// mänsklig justering, ny poäng och motivering (override-score). Innehållet är påhittat.

const rows = [
  { time: '14:11', type: 'Rättviseanalys', detail: 'Ingen grupp under 4/5-gränsen', actor: 'ai' as const, model: 'beräkning' },
  { time: '14:09', type: 'Poäng justerad', detail: 'Kandidat K-1042 · 87 → 80', actor: 'human' as const, reason: 'Saknar körkort, som krävs för hemtjänstpass.' },
  { time: '14:02', type: 'Matchning', detail: 'Kandidat K-1042 · 87 av 100', actor: 'ai' as const, model: 'claude-sonnet-4-6' },
  { time: '14:01', type: 'CV-analys', detail: '14 kompetenser, 4 års erfarenhet', actor: 'ai' as const, model: 'claude-sonnet-4-6' },
]

export function AuditLogMockup() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Loggen */}
      <div className="mockup-card overflow-hidden rounded-2xl border border-border bg-card lg:col-span-3" aria-hidden>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-3">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ScrollText className="h-4 w-4 text-primary" />
            AI-logg · Undersköterska, akutmottagning
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/10 px-2.5 py-1 text-[11px] font-medium text-mint-foreground ring-1 ring-mint/25">
            <Lock className="h-3 w-3" />Kan inte ändras i efterhand
          </span>
        </div>
        <ol className="divide-y divide-border">
          {rows.map(r => (
            <li key={r.time + r.type} className="flex gap-4 px-5 py-3.5">
              <span className="w-11 flex-shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground">{r.time}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-medium">{r.type}</span>
                  {r.actor === 'human' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                      <UserCheck className="h-3 w-3" />Rekryterare
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      <Sparkles className="h-3 w-3" />AI
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{r.detail}</p>
                {r.actor === 'human' && (
                  <p className="mt-1.5 rounded-md border-l-2 border-amber-500/50 bg-amber-500/[0.06] px-2.5 py-1.5 text-[13px] leading-snug">
                    <span className="text-muted-foreground">Motivering:</span> {r.reason}
                  </p>
                )}
              </div>
              {r.actor === 'ai' && (
                <span className="hidden flex-shrink-0 self-start rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">{r.model}</span>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Mänsklig kontroll: AI:n föreslår, rekryteraren beslutar */}
      <div className="panel flex flex-col p-6 sm:p-7 lg:col-span-2">
        <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10 text-mint-foreground">
          <UserCheck className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="text-lg font-semibold">Människan har alltid sista ordet</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          AI:n föreslår en poäng. Rekryteraren kan ändra den, men bara med en motivering, och både förslaget och ändringen sparas.
        </p>
        <div className="inset-surface mt-6 flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-4" aria-hidden>
          <div className="text-center">
            <p className="text-[11px] text-muted-foreground">AI föreslår</p>
            <p className="text-2xl font-semibold tabular-nums">87</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="text-center">
            <p className="text-[11px] text-muted-foreground">Du beslutar</p>
            <p className="text-2xl font-semibold tabular-nums text-mint-foreground">80</p>
          </div>
          <span className="rounded-full bg-mint/10 px-2.5 py-1 text-[11px] font-medium text-mint-foreground">Loggad</span>
        </div>
        <p className="mt-auto pt-5 text-xs text-muted-foreground">Enligt AI-förordningen artikel 12 (loggning) och 14 (mänsklig tillsyn).</p>
      </div>
    </div>
  )
}
