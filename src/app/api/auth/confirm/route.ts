import { createClient } from '@/lib/supabase/server'
import { NextResponse, after, type NextRequest } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email'

// Mål för länken i bekräftelsemejlet från /api/auth/register. verifyOtp bekräftar
// e-postadressen och sätter sessionscookies, så användaren hamnar inloggad i onboardingen.
// token_hash fungerar oavsett vilken webbläsare eller enhet mejlet öppnas i.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  // signup: första länken från registreringen. magiclink: ny länk till ett obekräftat konto
  // som registrerats igen. Båda bekräftar e-postadressen när de verifieras.
  if (!tokenHash || (type !== 'signup' && type !== 'magiclink')) {
    return NextResponse.redirect(`${origin}/login?verification=failed`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })

  if (error || !data.user?.email) {
    return NextResponse.redirect(`${origin}/login?verification=failed`)
  }

  const { email, user_metadata: meta } = data.user
  after(async () => {
    try {
      await sendWelcomeEmail({
        email,
        name: (meta?.full_name as string | undefined) ?? email.split('@')[0],
        userType: meta?.user_type === 'recruiter' ? 'recruiter' : 'job_seeker',
      })
    } catch (err) {
      console.error('[confirm] welcome email error:', err)
    }
  })

  return NextResponse.redirect(`${origin}/onboarding`)
}
