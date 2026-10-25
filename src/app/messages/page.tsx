import { createClient, createAdminClient } from '@/lib/supabase/server'
import { ensureConversation } from '@/lib/conversations'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { MessagesClient } from '@/components/messages/messages-client'
import { Navbar } from '@/components/navbar'
import type { Metadata } from 'next'
import type { ConversationPreview } from '@/components/messages/messages-client'

export const metadata: Metadata = { title: 'Meddelanden' }

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ user?: string }>
}) {
  const { user: targetUserId } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/onboarding')

  // Öppna eller skapa en konversation med targetUserId, men bara om det finns en legitim
  // koppling (ansökan eller samtycke till talangpoolen) — se ensureConversation.
  if (targetUserId && z.string().uuid().safeParse(targetUserId).success) {
    await ensureConversation(createAdminClient(), { id: user.id, userType: profile.user_type }, targetUserId)
  }

  // Fetch conversations
  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      id, created_at, last_message_at,
      recruiter:profiles!conversations_recruiter_id_fkey(id, full_name, avatar_url, headline),
      seeker:profiles!conversations_seeker_id_fkey(id, full_name, avatar_url, headline)
    `)
    .or(`recruiter_id.eq.${user.id},seeker_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden min-h-0">
        <MessagesClient
          currentUser={profile}
          conversations={(conversations ?? []).map(c => ({
            id: c.id,
            last_message_at: c.last_message_at,
            recruiter: Array.isArray(c.recruiter) ? (c.recruiter[0] ?? null) : c.recruiter,
            seeker: Array.isArray(c.seeker) ? (c.seeker[0] ?? null) : c.seeker,
          })) as ConversationPreview[]}
          initialConversationId={targetUserId ? undefined : undefined}
        />
      </div>
    </div>
  )
}
