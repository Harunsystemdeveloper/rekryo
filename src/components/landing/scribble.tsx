import type { ReactNode } from 'react'

// Handritad understrykning under ett eller några ord i en rubrik. Den ersätter
// gradienttexten, som gjorde rubrikerna lika varandra och mallartade. Linjen är medvetet
// lite ojämn, med ett tunnare andra drag, som när någon stryker under med penna.
export function Scribble({ children, tone = 'mint' }: { children: ReactNode; tone?: 'mint' | 'primary' }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        className={`absolute -bottom-[0.16em] left-[-3%] h-[0.4em] w-[106%] ${tone === 'mint' ? 'text-mint' : 'text-primary'}`}
      >
        <path d="M3 9.4C31 4.6 63 3.3 99 5.2c30 1.5 61 3.2 98 1.1" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" opacity="0.8" />
        <path d="M16 12.1c37-3.1 80-3.7 128-1.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      </svg>
    </span>
  )
}
