'use client'

import { Info } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// "Hur räknas poängen?" — samma förklaring överallt där en AI-poäng visas. Texten ska
// spegla koden: matchCandidates/matchCandidatesLite i lib/ai/claude.ts, förfiltreringen
// i lib/ai/skill-similarity.ts och nivåerna i score-ring.tsx. Ändras logiken där ska
// texten här ändras med den.

type Variant = 'recruiter' | 'seeker' | 'preview'

const LEVELS = [
  { range: '75–100', label: 'Stark matchning', dot: 'bg-mint' },
  { range: '50–74', label: 'God matchning', dot: 'bg-primary' },
  { range: '0–49', label: 'Svag matchning', dot: 'bg-amber-500' },
]

export function ScoreExplainer({ variant, className = '' }: { variant: Variant; className?: string }) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={`inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
          />
        }
      >
        <Info className="h-3.5 w-3.5" aria-hidden />
        Hur räknas poängen?
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 gap-3 p-4 text-left">
        <p className="text-sm font-semibold">Hur räknas poängen?</p>
        {variant === 'preview' ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            AI:n jämför kompetenserna och antalet år av erfarenhet i ditt CV med annonsens titel, beskrivning och krävda kompetenser. Det är en förhandsbedömning för dig. Den sparas inte och påverkar inte poängen rekryteraren ser.
          </p>
        ) : (
          <>
            <p className="text-xs leading-relaxed text-muted-foreground">
              AI:n jämför {variant === 'seeker' ? 'kompetenserna, erfarenheten och sammanfattningen i ditt CV' : 'kandidatens kompetenser, erfarenhet och CV-sammanfattning'} med annonsens titel, beskrivning, krav och nivå. Poängen väger samman kompetens, erfarenhet, utbildning och mjuka kompetenser, med tyngdpunkt på kompetens och erfarenhet.
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Namn och foto skickas aldrig med. Har en annons många sökande bedöms de 28 med störst kompetensöverlapp av AI:n, övriga får en poäng som bara bygger på hur väl kompetenslistorna överlappar.
            </p>
          </>
        )}
        <ul className="space-y-1 border-t border-border pt-3">
          {LEVELS.map(l => (
            <li key={l.range} className="flex items-center gap-2 text-xs">
              <span className={`h-2 w-2 rounded-full ${l.dot}`} aria-hidden />
              <span className="w-12 tabular-nums text-muted-foreground">{l.range}</span>
              <span>{l.label}</span>
            </li>
          ))}
        </ul>
        {variant !== 'preview' && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {variant === 'recruiter'
              ? 'Poängen är ett stöd, inte ett beslut. Du kan justera den, och justeringen sparas med din motivering i AI-loggen.'
              : 'Poängen är ett stöd för rekryteraren, inte ett beslut. Det är alltid en människa som avgör, och rekryteraren kan justera poängen med en motivering som loggas.'}
          </p>
        )}
      </PopoverContent>
    </Popover>
  )
}
