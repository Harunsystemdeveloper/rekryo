import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RegisterForm } from '@/components/auth/register-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Skapa konto' }

// Knapparna "Jag söker jobb" och "Jag rekryterar" länkar hit med ?roll=, så att rätt
// roll redan är vald. Okända värden faller tillbaka på jobbsökare.
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ roll?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')
  const { roll } = await searchParams
  return <RegisterForm defaultUserType={roll === 'rekryterare' ? 'recruiter' : 'job_seeker'} />
}
