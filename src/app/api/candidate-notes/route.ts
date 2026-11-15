import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { dbError } from '@/lib/api-errors'
import { z } from 'zod'

const createSchema = z.object({
  seeker_id: z.string().uuid(),
  note: z.string().min(1).max(2000),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
})

const updateSchema = z.object({
  id: z.string().uuid(),
  note: z.string().min(1).max(2000).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
})

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const seekerId = url.searchParams.get('seeker_id')
  if (!seekerId) return NextResponse.json({ error: 'seeker_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('candidate_notes')
    .select('*')
    .eq('recruiter_id', user.id)
    .eq('seeker_id', seekerId)
    .order('created_at', { ascending: false })

  if (error) return dbError('candidate-notes', error, 500)
  return NextResponse.json({ notes: data })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  // Anteckningar är personuppgifter om kandidaten och får bara föras om någon rekryteraren
  // har en faktisk koppling till: sökt ett av rekryterarens jobb, en konversation eller
  // synlig i talangpoolen. Samma regel som styr vilka profiler rekryteraren får se (0016).
  const { data: profile } = await supabase.from('profiles').select('user_type').eq('id', user.id).single()
  if (profile?.user_type !== 'recruiter') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { data: canView } = await supabase.rpc('recruiter_can_view_seeker', { seeker: parsed.data.seeker_id })
  if (canView !== true) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data, error } = await supabase
    .from('candidate_notes')
    .insert({ ...parsed.data, recruiter_id: user.id })
    .select()
    .single()

  if (error) return dbError('candidate-notes', error, 500)
  return NextResponse.json({ note: data })
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { id, ...updates } = parsed.data
  const { data, error } = await supabase
    .from('candidate_notes')
    .update(updates)
    .eq('id', id)
    .eq('recruiter_id', user.id)
    .select()
    .single()

  if (error) return dbError('candidate-notes', error, 500)
  return NextResponse.json({ note: data })
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabase
    .from('candidate_notes')
    .delete()
    .eq('id', id)
    .eq('recruiter_id', user.id)

  if (error) return dbError('candidate-notes', error, 500)
  return NextResponse.json({ success: true })
}
