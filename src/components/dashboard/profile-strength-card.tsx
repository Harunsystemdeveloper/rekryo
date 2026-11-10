import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Profile, CvProfile } from '@/types/database'

// Samma poäng som tidigare, men varje del är nu ett namngivet steg med länk, så att
// användaren ser exakt vad som höjer profilstyrkan i stället för bara en procentsats.
function profileSteps(profile: Profile, cv: CvProfile | null) {
  return [
    { label: 'Ladda upp ditt CV', points: 20, done: !!cv?.cv_url, href: '/seeker/profile' },
    { label: 'Lägg till minst 5 kompetenser', points: 15, done: (cv?.skills?.length ?? 0) >= 5, href: '/seeker/profile' },
    { label: 'Ange ditt namn', points: 15, done: !!profile.full_name, href: '/seeker/profile' },
    { label: 'Ange antal års erfarenhet', points: 10, done: cv?.experience_years != null, href: '/seeker/profile' },
    { label: 'Skriv en rubrik', points: 10, done: !!profile.headline, href: '/seeker/profile' },
    { label: 'Skriv en kort bio', points: 10, done: !!profile.bio, href: '/seeker/profile' },
    { label: 'Lägg till profilbild', points: 10, done: !!profile.avatar_url, href: '/seeker/profile' },
    { label: 'Ange ort', points: 5, done: !!profile.location, href: '/seeker/profile' },
    { label: 'Ange utbildning', points: 5, done: !!cv?.education, href: '/seeker/profile' },
  ]
}

export function getProfileStrength(profile: Profile, cv: CvProfile | null): number {
  return profileSteps(profile, cv).reduce((sum, s) => sum + (s.done ? s.points : 0), 0)
}

export function ProfileStrengthCard({ profile, cvProfile }: { profile: Profile; cvProfile: CvProfile | null }) {
  const steps = profileSteps(profile, cvProfile)
  const strength = getProfileStrength(profile, cvProfile)
  const remaining = steps.filter(s => !s.done)
  const next = remaining[0]
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const level = strength >= 80 ? 'Stark' : strength >= 50 ? 'På god väg' : 'Kom igång'

  return (
    <div className="panel p-6">
      <div className="mb-5 flex items-center gap-4">
        <div className="relative h-20 w-20 flex-shrink-0" role="img" aria-label={`Profilstyrka ${strength} procent`}>
          <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
            <circle cx="40" cy="40" r={radius} fill="none" className="stroke-muted" strokeWidth="7" />
            <circle
              cx="40" cy="40" r={radius} fill="none" stroke="url(#strength-gradient)" strokeWidth="7" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={circumference * (1 - strength / 100)}
              className="transition-[stroke-dashoffset] duration-700"
            />
            <defs>
              <linearGradient id="strength-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--mint)" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold tabular-nums">{strength}%</span>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Profilstyrka</p>
          <p className="mt-1 text-lg font-semibold">{level}</p>
          <p className="text-sm text-muted-foreground">
            {remaining.length === 0 ? 'Din profil är komplett.' : `${remaining.length} steg kvar till 100 %`}
          </p>
        </div>
      </div>

      {next && (
        <Button asChild className="mb-5 w-full justify-between">
          <Link href={next.href}>
            <span>Nästa steg: {next.label.charAt(0).toLowerCase() + next.label.slice(1)}</span>
            <span className="flex items-center gap-1 text-xs opacity-90">+{next.points} <ArrowRight className="h-3.5 w-3.5" /></span>
          </Link>
        </Button>
      )}

      <ul className="space-y-1">
        {steps.map(s => (
          <li key={s.label}>
            <Link
              href={s.href}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted/60"
            >
              <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${s.done ? 'bg-mint/15 text-mint-foreground' : 'border border-border'}`}>
                {s.done && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span className={`flex-1 ${s.done ? 'text-muted-foreground line-through decoration-muted-foreground/40' : ''}`}>{s.label}</span>
              {!s.done && <span className="text-xs font-medium tabular-nums text-muted-foreground">+{s.points}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
