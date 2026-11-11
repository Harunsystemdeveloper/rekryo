import { ThumbsUp, AlertTriangle } from 'lucide-react'
import { matchLevel } from '@/components/match/score-ring'
import type { MatchBreakdown } from '@/types/database'

const CATEGORY_LABELS: Record<keyof MatchBreakdown['category_scores'], string> = {
  kompetens: 'Kompetens',
  erfarenhet: 'Erfarenhet',
  utbildning: 'Utbildning',
  kultur_mjuka_kompetenser: 'Kultur / mjuka kompetenser',
}

// Samma nivåfärger som poängringen, så att en svag delpoäng syns på samma sätt
const barColor = { strong: 'bg-mint', good: 'bg-primary', weak: 'bg-amber-500' }

export function MatchBreakdownView({ breakdown }: { breakdown: MatchBreakdown }) {
  const categories = Object.keys(CATEGORY_LABELS) as Array<keyof MatchBreakdown['category_scores']>

  return (
    <div className="space-y-5 rounded-xl border border-border bg-muted/30 p-4 text-sm">
      {/* Kategoripoäng */}
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map(cat => {
          const value = breakdown.category_scores[cat]
          return (
            <div key={cat}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium">{CATEGORY_LABELS[cat]}</span>
                <span className="text-xs font-semibold tabular-nums">{value}<span className="font-normal text-muted-foreground">/100</span></span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${CATEGORY_LABELS[cat]}: ${value} av 100`}>
                <div className={`h-full rounded-full ${barColor[matchLevel(value)]}`} style={{ width: `${value}%` }} />
              </div>
              {breakdown.category_reasoning?.[cat] && (
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{breakdown.category_reasoning[cat]}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Styrkor och gap */}
      {(breakdown.top_positive_factors?.length > 0 || breakdown.top_gaps?.length > 0) && (
        <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
          {breakdown.top_positive_factors?.length > 0 && (
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-medium text-mint-foreground">
                <ThumbsUp className="h-3.5 w-3.5" aria-hidden />Starkaste faktorer
              </p>
              <ul className="space-y-1.5">
                {breakdown.top_positive_factors.map((f, i) => (
                  <li key={i} className="relative pl-3.5 text-xs text-muted-foreground before:absolute before:left-0 before:top-1.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-mint">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {breakdown.top_gaps?.length > 0 && (
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden />Gap och risker
              </p>
              <ul className="space-y-1.5">
                {breakdown.top_gaps.map((g, i) => (
                  <li key={i} className="relative pl-3.5 text-xs text-muted-foreground before:absolute before:left-0 before:top-1.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber-500">
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
