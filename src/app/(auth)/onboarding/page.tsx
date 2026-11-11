import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Konfigurera din profil · Rekryo' }

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  if (profile.onboarding_complete) redirect('/dashboard')

  const isRecruiter = profile.user_type === 'recruiter'

  return (
    <div className="w-full max-w-xl">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Välkommen till Rekryo</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {isRecruiter ? 'Kom igång med rätt kandidater' : 'Kom igång med ditt nästa jobb'}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tre korta steg, ungefär två minuter. Du kan ändra allt senare i din profil.
        </p>
      </div>

      <OnboardingWizard profile={profile} />
    </div>
  )
}
