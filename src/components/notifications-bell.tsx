'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Notification {
  id: string
  message: string
  detail?: string
  href: string
  read: boolean
  created_at: string
  // Sparad i tabellen notifications (läst-status i databasen) eller framräknad
  stored: boolean
}

interface StoredNotification {
  id: string
  title: string
  body: string
  href: string | null
  read: boolean
  created_at: string
}

// Klockan bygger på två källor. Sparade notiser i tabellen notifications skapas av servern
// vid statusbyte, intervjuinbjudan och meddelande från ett företag, och har ett läst-fält i
// databasen. Nya ansökningar (rekryterare) och nya matchande jobb (jobbsökare) räknas fram
// direkt, och för dem sparas bara när klockan senast öppnades, per webbläsare.
const SEEN_KEY_PREFIX = 'rekryo:notiser-sedda:'
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000

function readSeenAt(userId: string): number {
  try {
    return Number(localStorage.getItem(SEEN_KEY_PREFIX + userId)) || 0
  } catch {
    return 0
  }
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('sv-SE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function NotificationsBell({ userId, userType = 'job_seeker' }: { userId: string; userType?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const supabase = createClient()

  async function loadNotifications() {
    const seenAt = readSeenAt(userId)
    const since = new Date(Date.now() - SEVEN_DAYS).toISOString()

    const { data: stored } = await supabase
      .from('notifications')
      .select('id, title, body, href, read, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(15)

    const storedNotifs: Notification[] = ((stored ?? []) as StoredNotification[]).map(n => ({
      id: n.id,
      message: n.title,
      detail: n.body,
      href: n.href ?? '/dashboard',
      read: n.read,
      created_at: n.created_at,
      stored: true,
    }))

    let derived: Notification[] = []
    if (userType === 'recruiter') {
      const { data: newApps } = await supabase
        .from('applications')
        .select('id, created_at, job:jobs!inner(id, title, recruiter_id), seeker:profiles(full_name)')
        .eq('jobs.recruiter_id', userId)
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(10)

      derived = (newApps ?? []).map(a => {
        const job = a.job as unknown as { id: string; title: string } | null
        const seeker = a.seeker as unknown as { full_name: string | null } | null
        return {
          id: `newapp-${a.id}`,
          message: `${seeker?.full_name ?? 'Ny sökande'} sökte "${job?.title ?? 'ett jobb'}"`,
          href: job ? `/recruiter/jobs/${job.id}/candidates` : '/recruiter/jobs',
          read: new Date(a.created_at).getTime() <= seenAt,
          created_at: a.created_at,
          stored: false,
        }
      })
    } else {
      const { data: cv } = await supabase
        .from('cv_profiles')
        .select('skills')
        .eq('seeker_id', userId)
        .maybeSingle()

      if (cv?.skills?.length) {
        const { data: newJobs } = await supabase
          .from('jobs')
          .select('id, title, created_at')
          .eq('status', 'active')
          .gte('created_at', since)
          .overlaps('skills_required', cv.skills)
          .limit(3)

        derived = (newJobs ?? []).map(j => ({
          id: `job-${j.id}`,
          message: `Nytt jobb matchar din profil: "${j.title}"`,
          href: `/seeker/jobs/${j.id}`,
          read: new Date(j.created_at).getTime() <= seenAt,
          created_at: j.created_at,
          stored: false,
        }))
      }
    }

    setNotifications(
      [...storedNotifs, ...derived]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 15)
    )
  }

  useEffect(() => {
    // Första hämtningen vid start. State sätts först efter nätverkssvaren, och samma
    // funktion används när realtidskanalen eller fönsterfokus säger att något ändrats.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications()

    // Servern skriver notisen strax efter att statusen sparats, så vänta lite innan
    // omläsningen när det är själva ansökan som ändrades
    let timer: ReturnType<typeof setTimeout> | undefined
    const reloadSoon = () => { clearTimeout(timer); timer = setTimeout(loadNotifications, 1500) }

    const channel = supabase
      .channel(`notiser-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        () => { loadNotifications() }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'applications', filter: `seeker_id=eq.${userId}` },
        reloadSoon
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'applications' },
        () => { if (userType === 'recruiter') loadNotifications() }
      )
      .subscribe()

    const onFocus = () => loadNotifications()
    window.addEventListener('focus', onFocus)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('focus', onFocus)
      supabase.removeChannel(channel)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const unread = notifications.filter(n => !n.read).length

  // Vid öppning sparas allt som läst, men olästa visas fetstilta tills menyn stängs så
  // att man ser vad som är nytt
  async function handleOpenChange(open: boolean) {
    if (!open) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      return
    }
    try {
      localStorage.setItem(SEEN_KEY_PREFIX + userId, String(Date.now()))
    } catch {
      // utan lagring visas framräknade notiser som olästa igen nästa gång
    }
    if (notifications.some(n => n.stored && !n.read)) {
      await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false)
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        render={
          <button
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent transition-colors focus:outline-none"
            aria-label={unread > 0 ? `Notiser, ${unread} olästa` : 'Notiser'}
          />
        }
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="font-semibold">Notiser</span>
            {unread > 0 && (
              <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground tabular-nums">
                {unread}
              </span>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Inga notiser ännu
          </div>
        ) : (
          <DropdownMenuGroup>
            {notifications.map(n => (
              <DropdownMenuItem key={n.id} render={<Link href={n.href} />}>
                <div className="flex flex-col gap-0.5 py-1">
                  <p className={`flex items-start gap-2 text-sm leading-snug ${n.read ? 'text-muted-foreground' : 'font-medium'}`}>
                    {!n.read && <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />}
                    {n.message}
                  </p>
                  {n.detail && <p className="text-xs leading-snug text-muted-foreground">{n.detail}</p>}
                  <p className="text-xs text-muted-foreground">{formatTime(n.created_at)}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
