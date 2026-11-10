// Små illustrationer för tomma lägen. Färgerna kommer från temat (fill-card, stroke-border,
// fill-primary, fill-mint), så de fungerar i båda lägena. Dekorativa: aria-hidden.

export function EmptyApplicationsIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 100" className={className} aria-hidden>
      <rect x="34" y="30" width="80" height="54" rx="10" className="fill-muted stroke-border" strokeWidth="1.5" />
      <rect x="26" y="22" width="80" height="54" rx="10" className="fill-card stroke-border" strokeWidth="1.5" />
      <rect x="38" y="36" width="34" height="5" rx="2.5" className="fill-muted-foreground/40" />
      <rect x="38" y="47" width="52" height="4" rx="2" className="fill-muted-foreground/20" />
      <rect x="38" y="56" width="44" height="4" rx="2" className="fill-muted-foreground/20" />
      <path d="M118 30 L148 16 L136 46 L128 36 Z" className="fill-primary/80" />
      <path d="M128 36 L148 16" className="stroke-card" strokeWidth="1.5" />
      <path d="M104 50 C 112 46, 118 42, 124 38" fill="none" className="stroke-primary/40" strokeWidth="1.5" strokeDasharray="3 4" />
    </svg>
  )
}

export function EmptyGapsIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 100" className={className} aria-hidden>
      <rect x="20" y="16" width="120" height="70" rx="12" className="fill-card stroke-border" strokeWidth="1.5" />
      {[
        { y: 32, w: 84, cls: 'fill-mint/70' },
        { y: 48, w: 62, cls: 'fill-primary/70' },
        { y: 64, w: 40, cls: 'fill-amber-500/60' },
      ].map(b => (
        <g key={b.y}>
          <rect x="34" y={b.y} width="92" height="7" rx="3.5" className="fill-muted" />
          <rect x="34" y={b.y} width={b.w} height="7" rx="3.5" className={b.cls} />
        </g>
      ))}
      <path d="M134 10 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" className="fill-primary" />
    </svg>
  )
}

export function EmptyActivityIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 90" className={className} aria-hidden>
      <line x1="16" y1="74" x2="184" y2="74" className="stroke-border" strokeWidth="1.5" />
      {[30, 52, 74].map(y => <line key={y} x1="16" y1={y - 22} x2="184" y2={y - 22} className="stroke-border/60" strokeWidth="1" strokeDasharray="3 5" />)}
      <path d="M16 70 C 50 68, 70 62, 100 50 S 150 26, 184 18" fill="none" className="stroke-primary/50" strokeWidth="2.5" strokeDasharray="5 6" strokeLinecap="round" />
      <circle cx="184" cy="18" r="6" className="fill-mint" />
      <circle cx="184" cy="18" r="11" className="fill-mint/20" />
    </svg>
  )
}
