import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse, after } from 'next/server'
import { dbError } from '@/lib/api-errors'
import { sendStatusUpdateEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'

const STATUS_NOTIFICATION_LABELS: Record<string, string> = {
  reviewed: 'Din ansökan har granskats',
  shortlisted: 'Du är shortlistad!',
  accepted: 'Grattis — du har blivit accepterad!',
  rejected: 'Uppdatering på din ansökan',
}

// Brödtexten säger vad som faktiskt hänt, inte bara att ansökan "uppdaterats"
const STATUS_NOTIFICATION_BODIES: Record<string, (title: string) => string> = {
  reviewed: title => `Rekryteraren har läst din ansökan till "${title}".`,
  shortlisted: title => `Du är bland favoritkandidaterna till "${title}". Rekryteraren kan höra av sig snart.`,
  accepted: title => `Du har gått vidare med din ansökan till "${title}".`,
  rejected: title => `Rekryteraren går vidare med andra kandidater till "${title}". Fortsätt söka, rätt jobb väntar.`,
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Varje statusbyte skickar notis och mejl till kandidaten. Gränsen hindrar att
  // statusväxling används för att översvämma en kandidats inkorg.
  if (!rateLimit(`update-status:${user.id}`, 200)) {
    return NextResponse.json({ error: 'För många statusändringar. Försök igen om en stund.' }, { status: 429 })
  }

  const { application_id, status } = await req.json()
  if (!application_id || !status) {
    return NextResponse.json({ error: 'application_id och status krävs' }, { status: 400 })
  }

  const validStatuses = ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Ogiltigt status' }, { status: 400 })
  }

  // Verify the user is the recruiter who owns the job for this application
  const { data: app } = await supabase
    .from('applications')
    .select('status, job:jobs(recruiter_id)')
    .eq('id', application_id)
    .single()

  const job = Array.isArray(app?.job) ? app.job[0] : app?.job
  if (!job || (job as { recruiter_id: string }).recruiter_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Oförändrad status: inget att spara och ingen anledning att notifiera kandidaten igen
  if (app?.status === status) return NextResponse.json({ ok: true })

  const { error } = await supabase
    .from('applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', application_id)

  if (error) return dbError('applications/update-status', error, 400)

  // Notifiera kandidaten efter svaret — både in-app-notis och mejl. after() håller
  // serverless-funktionen vid liv tills jobbet är klart (en lös async-IIFE kan frysas).
  after(async () => {
    try {
      // Service role: notiser får sedan 0017 bara skrivas av servern.
      const admin = createAdminClient()
      const { data: application } = await supabase
        .from('applications')
        .select('seeker_id, job:jobs(id, title)')
        .eq('id', application_id)
        .single()

      if (!application) return
      const job = Array.isArray(application.job) ? application.job[0] : application.job
      if (!job) return

      // In-app-notis — synlig oavsett om e-post går fram eller inte
      const notifTitle = STATUS_NOTIFICATION_LABELS[status]
      if (notifTitle) {
        await admin.from('notifications').insert({
          user_id: application.seeker_id,
          type: 'status_change',
          title: notifTitle,
          body: STATUS_NOTIFICATION_BODIES[status]?.(job.title) ?? `Din ansökan till "${job.title}" har uppdaterats.`,
          href: '/seeker/applications',
        })
      }

      const { data: seeker } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', application.seeker_id)
        .single()

      const { data: authData } = await admin.auth.admin.getUserById(application.seeker_id)
      if (!authData?.user?.email) return

      await sendStatusUpdateEmail({
        seekerEmail: authData.user.email,
        seekerName: seeker?.full_name ?? 'Kandidat',
        jobTitle: job.title,
        newStatus: status,
        jobId: job.id,
      })
    } catch (err) {
      console.error('[update-status] notification error:', err)
    }
  })

  return NextResponse.json({ ok: true })
}
