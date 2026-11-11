import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { UserRound, KeyRound, ShieldCheck, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Inställningar' }

type Pill = { label: string; tone: 'ok' | 'neutral' | 'warn' }

const pillTone: Record<Pill['tone'], string> = {
  ok: 'bg-mint/15 text-mint-foreground',
  neutral: 'bg-muted text-muted-foreground',
  warn: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('user_type').eq('id', user.id).single()
  const isRecruiter = profile?.user_type === 'recruiter'
  const { data: cv } = isRecruiter
    ? { data: null }
    : await supabase.from('cv_profiles').select('talent_pool_visible').eq('seeker_id', user.id).maybeSingle()

  const rows: { icon: typeof UserRound; title: string; description: string; pills: Pill[]; href: string; action: string }[] = [
    {
      icon: UserRound,
      title: isRecruiter ? 'Företagsprofil' : 'Profil och CV',
      description: isRecruiter ? 'Företagsnamn, logotyp och beskrivning som kandidater ser' : 'Namn, rubrik, kompetenser och ditt CV',
      pills: [{ label: isRecruiter ? 'Rekryterare' : 'Jobbsökare', tone: 'neutral' }],
      href: isRecruiter ? '/recruiter/company' : '/seeker/profile',
      action: 'Redigera',
    },
    {
      icon: KeyRound,
      title: 'Inloggning och säkerhet',
      description: user.email ?? '',
      pills: [user.email_confirmed_at
        ? { label: 'E-post bekräftad', tone: 'ok' }
        : { label: 'E-post ej bekräftad', tone: 'warn' }],
      href: '/forgot-password',
      action: 'Byt lösenord',
    },
    {
      icon: ShieldCheck,
      title: 'Integritet och GDPR',
      description: isRecruiter ? 'Exportera din data eller radera kontot' : 'Talangpoolen, frivilliga uppgifter, export och radering',
      pills: isRecruiter ? [] : [cv?.talent_pool_visible
        ? { label: 'Syns i talangpoolen', tone: 'ok' }
        : { label: 'Syns inte i talangpoolen', tone: 'neutral' }],
      href: '/settings/privacy',
      action: 'Hantera',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Inställningar</h1>
        <p className="mt-1.5 text-muted-foreground">Hantera ditt konto, din profil och din data.</p>
      </div>

      <ul className="panel divide-y divide-border overflow-hidden">
        {rows.map(row => (
          <li key={row.title} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <row.icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold">{row.title}</h2>
                {row.pills.map(p => (
                  <span key={p.label} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${pillTone[p.tone]}`}>{p.label}</span>
                ))}
              </div>
              <p className="mt-1 truncate text-sm text-muted-foreground">{row.description}</p>
            </div>
            <Button variant="outline" size="sm" asChild className="self-start sm:self-auto">
              <Link href={row.href}>
                {row.action}
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
