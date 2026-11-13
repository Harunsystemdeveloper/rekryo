import { ShieldCheck, Lock, UserCheck, ScrollText } from 'lucide-react'

// Fyra förtroendemärken som återkommer på startsidan. Formuleringarna måste stämma med
// koden: "byggd för", inte "certifierad", eftersom det inte finns någon certifiering.
// Mänsklig kontroll = override-score med obligatorisk motivering, loggning =
// ai_decision_logs, EU-lagring = Supabase i Irland.
const badges = [
  { icon: ShieldCheck, label: 'Byggd för EU AI Act' },
  { icon: Lock, label: 'GDPR · data inom EU' },
  { icon: UserCheck, label: 'Människan har alltid sista ordet' },
  { icon: ScrollText, label: 'Varje AI-beslut loggas' },
]

// "onDark" används på de mörka banden (hero och slut-CTA) som är mörka i båda temana
export function TrustBadges({ variant = 'default', className = '' }: { variant?: 'default' | 'onDark'; className?: string }) {
  const item = variant === 'onDark'
    ? 'border-white/10 bg-white/[0.04] text-white/70'
    : 'border-border bg-card text-foreground/80'
  const icon = variant === 'onDark' ? 'text-[#5EEAD4]' : 'text-mint-foreground'
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Förtroende och regelefterlevnad">
      {badges.map(({ icon: Icon, label }) => (
        <li key={label} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm ${item}`}>
          <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${icon}`} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  )
}
