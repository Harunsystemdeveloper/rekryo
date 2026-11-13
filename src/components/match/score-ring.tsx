// Poängring 0–100 som används överallt där en matchning visas. Färgen följer nivån
// (mint = stark, lila = god, amber = svag) men bär aldrig betydelsen ensam: etiketten
// och aria-label säger samma sak i text.

export type MatchLevel = 'strong' | 'good' | 'weak'

export function matchLevel(score: number): MatchLevel {
  if (score >= 75) return 'strong'
  if (score >= 50) return 'good'
  return 'weak'
}

export const matchLevelLabel: Record<MatchLevel, string> = {
  strong: 'Stark matchning',
  good: 'God matchning',
  weak: 'Svag matchning',
}

const levelStroke: Record<MatchLevel, string> = {
  strong: 'stroke-mint',
  good: 'stroke-primary',
  weak: 'stroke-amber-500',
}

export const matchLevelText: Record<MatchLevel, string> = {
  strong: 'text-mint-foreground',
  good: 'text-primary',
  weak: 'text-amber-600 dark:text-amber-400',
}

const sizes = {
  sm: { box: 48, stroke: 5, text: 'text-sm', sub: false },
  md: { box: 64, stroke: 6, text: 'text-lg', sub: false },
  lg: { box: 88, stroke: 7, text: 'text-2xl', sub: true },
  xl: { box: 152, stroke: 10, text: 'text-5xl', sub: true },
}

export function ScoreRing({
  score,
  size = 'md',
  label = 'Matchningspoäng',
}: {
  score: number
  size?: keyof typeof sizes
  label?: string
}) {
  const s = sizes[size]
  const value = Math.max(0, Math.min(100, Math.round(score)))
  const radius = (s.box - s.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const level = matchLevel(value)

  return (
    <div className="relative flex-shrink-0" style={{ width: s.box, height: s.box }} role="img" aria-label={`${label}: ${value} av 100, ${matchLevelLabel[level].toLowerCase()}`}>
      <svg width={s.box} height={s.box} viewBox={`0 0 ${s.box} ${s.box}`} className="-rotate-90">
        <circle cx={s.box / 2} cy={s.box / 2} r={radius} fill="none" className="stroke-muted" strokeWidth={s.stroke} />
        <circle
          cx={s.box / 2} cy={s.box / 2} r={radius} fill="none" className={`${levelStroke[level]} transition-[stroke-dashoffset] duration-700`}
          strokeWidth={s.stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${s.text} font-semibold leading-none tabular-nums`}>{value}</span>
        {s.sub && <span className="mt-0.5 text-[10px] text-muted-foreground">av 100</span>}
      </div>
    </div>
  )
}
