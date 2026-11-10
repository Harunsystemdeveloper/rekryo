// Minimal illustration av matchning: profiler till vänster, tjänster till höger och
// kopplingar mellan dem. Den starkaste kopplingen är markerad med lila till mint och ett
// poäng. Färgerna kommer från temat (stroke-border, fill-card), så den fungerar i båda lägena.

const profiles = [40, 120, 200, 280]
const jobs = [80, 180, 260]
const links: [number, number][] = [[0, 1], [1, 0], [2, 2], [3, 2], [0, 0], [3, 1]]
const best: [number, number] = [1, 1]

function curve(y1: number, y2: number) {
  return `M 128 ${y1 + 22} C 220 ${y1 + 22}, 260 ${y2 + 22}, 352 ${y2 + 22}`
}

export function MatchNetworkIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 340" className={className} role="img" aria-label="Illustration: profiler kopplas till tjänster, där den bästa matchningen markeras">
      <defs>
        <linearGradient id="mn-best" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6C5CE7" />
          <stop offset="100%" stopColor="#00B894" />
        </linearGradient>
      </defs>

      {links.map(([p, j]) => (
        <path key={`${p}-${j}`} d={curve(profiles[p], jobs[j])} fill="none" className="stroke-border" strokeWidth="1.5" strokeDasharray="3 5" />
      ))}
      <path d={curve(profiles[best[0]], jobs[best[1]])} fill="none" stroke="url(#mn-best)" strokeWidth="2.5" />

      {profiles.map((y, i) => (
        <g key={`p${i}`} transform={`translate(24 ${y})`}>
          <rect width="104" height="44" rx="12" className={i === best[0] ? 'fill-card stroke-primary' : 'fill-card stroke-border'} strokeWidth="1.5" />
          <circle cx="22" cy="22" r="10" className={i === best[0] ? 'fill-primary/20' : 'fill-muted'} />
          <rect x="40" y="15" width="48" height="5" rx="2.5" className="fill-muted-foreground/40" />
          <rect x="40" y="25" width="32" height="5" rx="2.5" className="fill-muted-foreground/20" />
        </g>
      ))}

      {jobs.map((y, i) => (
        <g key={`j${i}`} transform={`translate(352 ${y})`}>
          <rect width="104" height="44" rx="12" className={i === best[1] ? 'fill-card stroke-mint' : 'fill-card stroke-border'} strokeWidth="1.5" />
          <rect x="12" y="12" width="20" height="20" rx="6" className={i === best[1] ? 'fill-mint/20' : 'fill-muted'} />
          <rect x="42" y="15" width="48" height="5" rx="2.5" className="fill-muted-foreground/40" />
          <rect x="42" y="25" width="28" height="5" rx="2.5" className="fill-muted-foreground/20" />
        </g>
      ))}

      {/* Poängmarkör mitt på den bästa kopplingen */}
      <g transform="translate(212 136)">
        <rect width="56" height="30" rx="15" className="fill-card stroke-primary" strokeWidth="1.5" />
        <text x="28" y="20" textAnchor="middle" className="fill-foreground" fontSize="13" fontWeight="600">87</text>
      </g>
    </svg>
  )
}
