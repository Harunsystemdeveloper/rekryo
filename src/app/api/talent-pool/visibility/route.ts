import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const updateSchema = z.object({ visible: z.boolean() })

// Jobbsökarens samtycke till att synas i talangpoolen (GDPR art. 6.1 a / 7).
// Samtycket ska vara lika lätt att återkalla som att ge, så samma route hanterar båda.
// Samtycket skrivs med service role (0021) så att tidsstämpeln alltid sätts av servern och
// inte kan anges av klienten. Skrivningen är begränsad till den inloggades egen rad.

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('cv_profiles')
    .select('talent_pool_visible, talent_pool_consent_at')
    .eq('seeker_id', user.id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({
    visible: data?.talent_pool_visible ?? false,
    consent_at: data?.talent_pool_consent_at ?? null,
  })
}

export async function PUT(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('user_type').eq('id', user.id).single()
  if (profile?.user_type !== 'job_seeker') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const parsed = updateSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'Ogiltig indata' }, { status: 400 })
  const { visible } = parsed.data

  const consentAt = visible ? new Date().toISOString() : null
  const { error } = await createAdminClient()
    .from('cv_profiles')
    .upsert(
      { seeker_id: user.id, talent_pool_visible: visible, talent_pool_consent_at: consentAt },
      { onConflict: 'seeker_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ visible, consent_at: consentAt })
}
