'use client'

import { CountUp } from '@/components/ui/count-up'
import { TrendingDown } from 'lucide-react'

const stats = [
  {
    end: 76,
    decimals: 0,
    suffix: '%',
    label: 'av svenska företag hittar inte rätt kompetens — nästan dubbelt så många som för tio år sedan',
    source: 'ManpowerGroup Talent Shortage Survey 2025',
    change: 'Strukturellt',
  },
  {
    end: 93,
    decimals: 0,
    suffix: '%',
    label: 'av företagen drabbas negativt — expansion stoppas, projekt försenas, kostnader ökar',
    source: 'Svenskt Näringsliv, Rekryteringsenkäten 2025/2026',
    change: 'Strukturellt',
  },
  {
    end: 25,
    decimals: 0,
    suffix: '%',
    label: 'av alla rekryteringsförsök misslyckas helt — var fjärde tjänst förblir otillsatt',
    source: 'Svenskt Näringsliv, Rekryteringsenkäten 2025/2026',
    change: 'Oförändrat YoY',
  },
  {
    end: 33,
    decimals: 0,
    suffix: '%',
    label: 'av företag har skjutit upp planerad expansion till följd av kompetensbristen',
    source: 'Svenskt Näringsliv, Rekryteringsenkäten 2025/2026',
    change: 'Strukturellt',
  },
]

export function ParadoxStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="panel panel-hover-danger border-red-500/20 bg-red-500/[0.035] dark:bg-red-500/[0.05] dark:border-red-500/15 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Kompetensparadoxen</span>
            <div className="flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5">
              <TrendingDown className="h-3 w-3 text-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-red-500">{s.change}</span>
            </div>
          </div>

          <p className="stat-glow flex items-center gap-1.5 text-4xl sm:text-5xl font-black leading-none mb-3 text-red-600 dark:text-red-500 tabular-nums">
            <TrendingDown className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0" strokeWidth={2.5} />
            <CountUp end={s.end} decimals={s.decimals} suffix={s.suffix} duration={1800 + i * 200} />
          </p>

          <p className="text-xs sm:text-sm font-medium text-foreground leading-snug mb-4">{s.label}</p>

          <p className="text-[11px] text-muted-foreground/60 font-medium border-t border-border/60 pt-3">{s.source}</p>
        </div>
      ))}
    </div>
  )
}
