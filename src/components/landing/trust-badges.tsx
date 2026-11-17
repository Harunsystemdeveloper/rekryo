import { ShieldCheck, Lock, UserCheck, ScrollText } from 'lucide-react'

// Fyra förtroendemärken i startsidans hero. De visas bara där, så att sidan inte
// upprepar samma märken i varje sektion. Formuleringarna måste stämma med
// koden: "byggd för", inte "certifierad", eftersom det inte finns någon certifiering.
// Mänsklig kontroll = override-score med obligatorisk motivering, loggning =
// ai_decision_logs, EU-lagring = Supabase i Irland.
const badges = [
  { icon: ShieldCheck, label: 'Byggd för EU AI Act' },
  { icon: Lock, label: 'GDPR · data inom EU' },
  { icon: UserCheck, label: 'Människan har alltid sista ordet' },
  { icon: ScrollText, label: 'Varje AI-beslut loggas' },
]

// "adaptive" används i heron, som följer temat: kort i ljust läge och genomskinligt på
// det mörka bandet i mörkt läge.
const styles = {
  default: { item: 'border-border bg-card text-foreground/80', icon: 'text-mint-foreground' },
  adaptive: {
    item: 'border-border bg-card text-foreground/80 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70',
    icon: 'text-mint-foreground dark:text-[#5EEAD4]',
  },
}

export function TrustBadges({ variant = 'default', className = '' }: { variant?: keyof typeof styles; className?: string }) {
  const { item, icon } = styles[variant]
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
