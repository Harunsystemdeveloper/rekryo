import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { dbError } from '@/lib/api-errors'
import { z } from 'zod'

const createSchema = z.object({
  application_id: z.string().uuid(),
  // Ignoreras: kandidaten hämtas från ansökan, aldrig från klienten (se POST). Kvar i
  // schemat bara för att befintliga klienter skickar med fältet.
  seeker_id: z.string().uuid().optional(),
  proposed_times: z.array(z.string().datetime()).min(1).max(5),
  location: z.string().max(200).optional(),
  meeting_link: z.string().url().optional().or(z.literal('')),
  notes: z.string().max(1000).optional(),
})

const confirmSchema = z.object({
  id: z.string().uuid(),
  confirmed_time: z.string().datetime(),
})

const cancelSchema = z.object({
  id: z.string().uuid(),
})

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const applicationId = url.searchParams.get('application_id')
  if (!applicationId) return NextResponse.json({ error: 'application_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('interview_schedules')
    .select('*')
    .eq('application_id', applicationId)
    .maybeSingle()

  if (error) return dbError('interview-schedule', error, 500)
  return NextResponse.json({ schedule: data })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('user_type').eq('id', user.id).single()
  if (profile?.user_type !== 'recruiter') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  // Ansökan måste höra till ett av rekryterarens egna jobb, och kandidaten är den som
  // faktiskt sökte — annars kunde vilken rekryterare som helst skicka inbjudningar (med
  // valfri mötes-länk) till vilken jobbsökare som helst.
  const { data: application } = await supabase
    .from('applications')
    .select('seeker_id, job:jobs!inner(recruiter_id)')
    .eq('id', parsed.data.application_id)
    .single()
  const job = Array.isArray(application?.job) ? application.job[0] : application?.job
  if (!application || job?.recruiter_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { application_id, proposed_times, location, meeting_link, notes } = parsed.data
  const { data, error } = await supabase
    .from('interview_schedules')
    .upsert({
      application_id, proposed_times, location, meeting_link, notes,
      seeker_id: application.seeker_id,
      recruiter_id: user.id,
      status: 'pending',
      confirmed_time: null,
    }, { onConflict: 'application_id' }) // unique(application_id) — utan detta blev varje anrop en ny rad
    .select()
    .single()

  if (error) {
    console.error('[interview-schedule] save failed:', error.message)
    return NextResponse.json({ error: 'Kunde inte spara intervjuförslaget' }, { status: 500 })
  }

  // Service role: notiser får sedan 0017 bara skrivas av servern.
  await createAdminClient().from('notifications').insert({
    user_id: application.seeker_id,
    type: 'interview_invite',
    title: 'Intervjuinbjudan!',
    body: 'Du har fått en intervjuinbjudan. Välj en tid som passar dig.',
    href: '/seeker/applications', // det finns ingen /seeker/interviews-sida
  })

  return NextResponse.json({ schedule: data })
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  if (body.action === 'confirm') {
    const parsed = confirmSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

    const { data, error } = await supabase
      .from('interview_schedules')
      .update({ confirmed_time: parsed.data.confirmed_time, status: 'confirmed' })
      .eq('id', parsed.data.id)
      .eq('seeker_id', user.id)
      .select()
      .single()

    if (error) return dbError('interview-schedule', error, 500)
    return NextResponse.json({ schedule: data })
  }

  if (body.action === 'cancel') {
    const parsed = cancelSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

    const { data, error } = await supabase
      .from('interview_schedules')
      .update({ status: 'cancelled' })
      .eq('id', parsed.data.id)
      .or(`recruiter_id.eq.${user.id},seeker_id.eq.${user.id}`)
      .select()
      .single()

    if (error) return dbError('interview-schedule', error, 500)
    return NextResponse.json({ schedule: data })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
