import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Tar bort jobbsökarens uppladdade CV och allt som härletts ur det. AI-fälten i
// cv_profiles får bara skrivas av servern (0021), så rensningen kan inte ske från klienten.
export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  // CV:n lagras under <user.id>/, så hela mappen töms oavsett filändelse.
  const { data: files } = await admin.storage.from('cvs').list(user.id, { limit: 100 })
  if (files?.length) {
    const { error: removeError } = await admin.storage.from('cvs').remove(files.map(f => `${user.id}/${f.name}`))
    if (removeError) {
      console.error('[cv] storage remove failed:', removeError.message)
      return NextResponse.json({ error: 'Kunde inte ta bort CV-filen' }, { status: 500 })
    }
  }

  // cv_text_hash nollställs också, annars skulle samma CV laddat igen träffa cachen
  // i /api/ai/analyze-cv och returnera de tomma fälten i stället för en ny analys.
  const { error } = await admin
    .from('cv_profiles')
    .update({
      cv_url: null,
      cv_text: null,
      cv_text_hash: null,
      skills: [],
      ai_summary: null,
      last_analyzed_at: null,
    })
    .eq('seeker_id', user.id)

  if (error) {
    console.error('[cv] profile reset failed:', error.message)
    return NextResponse.json({ error: 'Kunde inte ta bort CV-uppgifterna' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
