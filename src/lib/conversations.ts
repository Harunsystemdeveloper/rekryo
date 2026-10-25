import type { SupabaseClient } from '@supabase/supabase-js'

type UserType = 'job_seeker' | 'recruiter'

/**
 * Säkerställer att en konversation finns mellan den inloggade användaren och targetId,
 * men bara om det finns en legitim koppling mellan dem:
 *
 * - rekryterare → jobbsökare: jobbsökaren har sökt något av rekryterarens jobb, eller
 *   har själv valt att synas i talangpoolen (samtycke, GDPR art. 6.1 a)
 * - jobbsökare → rekryterare: jobbsökaren har sökt något av rekryterarens jobb
 *
 * En befintlig konversation räcker alltid. Utan kontrollen kunde vem som helst skapa en
 * konversation med ett känt användar-id och därigenom både skicka meddelanden och, via
 * recruiter_can_view_seeker (0016), läsa profilen hos jobbsökare som aldrig samtyckt.
 *
 * Måste anropas med service role-klienten: konversationer skapas bara av servern (0022).
 */
export async function ensureConversation(
  admin: SupabaseClient,
  me: { id: string; userType: UserType },
  targetId: string
): Promise<{ id: string } | null> {
  if (targetId === me.id) return null

  const recruiterId = me.userType === 'recruiter' ? me.id : targetId
  const seekerId = me.userType === 'recruiter' ? targetId : me.id

  const { data: existing } = await admin
    .from('conversations')
    .select('id')
    .eq('recruiter_id', recruiterId)
    .eq('seeker_id', seekerId)
    .maybeSingle()
  if (existing) return existing

  const expectedTargetType: UserType = me.userType === 'recruiter' ? 'job_seeker' : 'recruiter'
  const { data: target } = await admin.from('profiles').select('user_type').eq('id', targetId).maybeSingle()
  if (target?.user_type !== expectedTargetType) return null

  const { data: application } = await admin
    .from('applications')
    .select('id, jobs!inner(recruiter_id)')
    .eq('seeker_id', seekerId)
    .eq('jobs.recruiter_id', recruiterId)
    .limit(1)
    .maybeSingle()

  let allowed = !!application
  if (!allowed && me.userType === 'recruiter') {
    const { data: cv } = await admin
      .from('cv_profiles')
      .select('talent_pool_visible')
      .eq('seeker_id', seekerId)
      .maybeSingle()
    allowed = cv?.talent_pool_visible === true
  }
  if (!allowed) return null

  const { data: created, error } = await admin
    .from('conversations')
    .upsert({ recruiter_id: recruiterId, seeker_id: seekerId }, { onConflict: 'recruiter_id,seeker_id' })
    .select('id')
    .single()

  if (error) {
    console.error('[conversations] create failed:', error.message)
    return null
  }
  return created
}
