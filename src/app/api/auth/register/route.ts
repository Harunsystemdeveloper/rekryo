import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import { sendVerificationEmail } from '@/lib/email'
import { SITE_URL } from '@/lib/site'

const schema = z.object({
  email: z.string().email('Ogiltig e-postadress'),
  password: z.string().min(8, 'Lösenord måste vara minst 8 tecken').max(72),
  user_type: z.enum(['job_seeker', 'recruiter']),
  full_name: z.string().max(200).optional(),
})

const BASE_URL = SITE_URL

// Samma svar oavsett om adressen redan har ett konto, så att routen inte kan användas
// för att ta reda på vilka e-postadresser som är registrerade.
const SENT = { message: 'Om adressen inte redan är registrerad har vi skickat en bekräftelselänk.' }

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  if (!rateLimit(`register:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'För många registreringsförsök. Försök igen om en timme.' }, { status: 429 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Ogiltiga uppgifter' }, { status: 400 })
  }
  const { email, password, user_type, full_name } = parsed.data

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Kontot skapas overifierat. Tidigare bekräftades e-posten direkt, så vem som helst
  // kunde registrera sig med någon annans adress, t.ex. ett företags, och utge sig för att
  // vara den. Användaren kan logga in först efter att ha klickat på länken i mejlet.
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: { data: { user_type, full_name } },
  })

  if (error) {
    if (error.code === 'email_exists' || error.code === 'user_already_exists') {
      // Finns kontot men är obekräftat (t.ex. om länken gått ut) skickas en ny länk.
      // Bekräftade konton får inget mejl. Svaret är detsamma i båda fallen.
      const { data: existing } = await supabaseAdmin.auth.admin.generateLink({ type: 'magiclink', email })
      if (existing?.user && !existing.user.email_confirmed_at) {
        await sendVerificationEmail({
          email,
          link: `${BASE_URL}/api/auth/confirm?token_hash=${existing.properties.hashed_token}&type=magiclink`,
        })
      }
      return NextResponse.json(SENT)
    }
    console.error('[register] generateLink failed:', error.message)
    return NextResponse.json({ error: 'Kunde inte skapa kontot. Försök igen.' }, { status: 500 })
  }

  const link = `${BASE_URL}/api/auth/confirm?token_hash=${data.properties.hashed_token}&type=signup`
  const sent = await sendVerificationEmail({ email, link })

  if (!sent) {
    // Utan mejlet går kontot aldrig att aktivera — ta bort det så att användaren kan försöka igen
    await supabaseAdmin.auth.admin.deleteUser(data.user.id)
    return NextResponse.json({ error: 'Kunde inte skicka bekräftelsemejlet. Försök igen om en stund.' }, { status: 502 })
  }

  return NextResponse.json(SENT)
}
