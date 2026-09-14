import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PrivacySettingsClient } from '@/components/settings/privacy-settings-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Integritet & GDPR' }

export default async function PrivacySettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <PrivacySettingsClient />
}
