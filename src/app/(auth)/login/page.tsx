import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LoginForm } from '@/components/auth/login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Logga in' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verification?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')
  const { verification } = await searchParams
  return <LoginForm verificationFailed={verification === 'failed'} />
}
