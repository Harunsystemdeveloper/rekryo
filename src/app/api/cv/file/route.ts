import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Öppnar en jobbsökares uppladdade CV. cvs-bucketen är privat, så den sparade cv_url
// (en publik adress) fungerar inte. I stället kontrolleras behörigheten här och
// användaren skickas vidare till en signerad länk som bara gäller i 60 sekunder.
// Behöriga: jobbsökaren själv och rekryterare som har fått en ansökan från personen
// till något av sina jobb. Talangpoolen ger inte tillgång till CV-filen.

const seekerId = z.string().uuid()

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const param = new URL(req.url).searchParams.get('seeker') ?? user.id
  const parsed = seekerId.safeParse(param)
  if (!parsed.success) return NextResponse.json({ error: 'Ogiltig kandidat' }, { status: 400 })
  const id = parsed.data

  const admin = createAdminClient()

  if (id !== user.id) {
    const { data: apps } = await admin
      .from('applications')
      .select('id, jobs!inner(recruiter_id)')
      .eq('seeker_id', id)
      .eq('jobs.recruiter_id', user.id)
      .limit(1)
    if (!apps?.length) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // CV:t ligger som <seeker_id>/<seeker_id>.<pdf|txt>
  const { data: files } = await admin.storage.from('cvs').list(id, { limit: 10 })
  const file = files?.find(f => f.name.startsWith(id))
  if (!file) return NextResponse.json({ error: 'Inget CV uppladdat' }, { status: 404 })

  const { data: signed, error } = await admin.storage.from('cvs').createSignedUrl(`${id}/${file.name}`, 60)
  if (error || !signed) {
    console.error('[cv/file] signed url failed:', error?.message)
    return NextResponse.json({ error: 'Kunde inte öppna CV:t' }, { status: 500 })
  }

  return NextResponse.redirect(signed.signedUrl)
}
