import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GDPR art. 17 — rätten att bli raderad. Gäller både jobbsökare och rekryterare.
//
// Tidigare raderades bara profiles-raden. Inloggningskontot i auth.users (e-post,
// lösenordshash, inloggningshistorik) låg då kvar, liksom ai_decision_logs som är
// kopplade till auth.users och inte till profiles. Nu raderas auth-användaren via
// admin-API:t, vilket via ON DELETE CASCADE tar med profiles och därmed allt som
// hänger på den (CV, ansökningar, jobb, meddelanden, notiser, AI-loggar m.m.).
//
// AI-förordningens art. 26.6 kräver att loggar sparas i minst sex månader, men
// uttryckligen "om inte annat följer av unionsrätten, särskilt dataskyddsrätten" —
// en raderingsbegäran enligt GDPR går därför före.

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  // Uppladdade filer omfattas också. cvs och avatars lagras under <user.id>/, så hela
  // mappen listas och töms — då följer även filer med oväntade namn/ändelser med.
  // Fel här får aldrig blockera själva kontoraderingen.
  await Promise.all(
    (['cvs', 'avatars'] as const).map(async bucket => {
      const { data: files } = await admin.storage.from(bucket).list(user.id, { limit: 1000 })
      if (files?.length) {
        await admin.storage.from(bucket).remove(files.map(f => `${user.id}/${f.name}`))
      }
    })
  ).catch(() => null)

  // Filer som ligger i delade mappar med användar-id som filnamn kan inte listas per
  // användare, så där provas de vanliga ändelserna (remove() på en saknad fil är ofarligt).
  const exts = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif']
  await Promise.all([
    admin.storage.from('avatars').remove(exts.map(ext => `avatars/${user.id}.${ext}`)), // profilbild från onboardingen
    admin.storage.from('logos').remove(exts.flatMap(ext => [`logos/${user.id}.${ext}`, `covers/${user.id}.${ext}`])), // företagslogotyp och karriärsidans omslagsbild
  ]).catch(() => null)

  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    return NextResponse.json({ error: 'Kunde inte radera kontot. Försök igen eller kontakta privacy@rekryo.com.' }, { status: 500 })
  }

  // Sessionen är redan ogiltig, men cookies ska rensas i webbläsaren.
  await supabase.auth.signOut().catch(() => null)

  return NextResponse.json({
    success: true,
    message: 'Ditt konto och all associerad data har raderats.',
  })
}
