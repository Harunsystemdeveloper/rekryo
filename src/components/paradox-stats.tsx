'use client'

import { CountUp } from '@/components/ui/count-up'

// Siffrorna visas som data, inte som larm: stor siffra, en stapel som visar andelen
// och källan direkt under. Allvaret bärs av innehållet, inte av röd färg och puls.
const stats = [
  {
    end: 76,
    label: 'av svenska företag hittar inte rätt kompetens, nästan dubbelt så många som för tio år sedan',
    source: 'ManpowerGroup Talent Shortage Survey 2025',
  },
  {
    end: 93,
    label: 'av företagen drabbas negativt: expansion stoppas, projekt försenas, kostnader ökar',
    source: 'Svenskt Näringsliv, Rekryteringsenkäten 2025/2026',
  },
  {
    end: 25,
    label: 'av alla rekryteringsförsök misslyckas helt, var fjärde tjänst förblir otillsatt',
    source: 'Svenskt Näringsliv, Rekryteringsenkäten 2025/2026',
  },
  {
    end: 33,
    label: 'av företagen har skjutit upp en planerad expansion på grund av kompetensbristen',
    source: 'Svenskt Näringsliv, Rekryteringsenkäten 2025/2026',
  },
]

export function ParadoxStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s, i) => (
        <div key={s.label} className="panel flex flex-col p-6">
          <p className="mb-4 text-5xl font-semibold leading-none tracking-tight tabular-nums">
            <CountUp end={s.end} decimals={0} suffix="%" duration={1600 + i * 200} />
          </p>

          <div
            className="mb-5 h-1.5 overflow-hidden rounded-full bg-muted"
            role="img"
            aria-label={`${s.end} procent`}
          >
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${s.end}%` }} />
          </div>

          <p className="mb-5 flex-1 text-sm leading-relaxed text-foreground/85">{s.label}</p>

          <p className="border-t border-border pt-3 text-xs text-muted-foreground">{s.source}</p>
        </div>
      ))}
    </div>
  )
}
