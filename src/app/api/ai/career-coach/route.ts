import Anthropic from '@anthropic-ai/sdk'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Klienten skickar historiken själv, så den måste begränsas: bara vanliga textmeddelanden
// (inga påhittade tool-anrop/-resultat), rimlig längd per meddelande och en övre gräns för
// hela historiken — annars kan en enda användare skicka enorma prompts 30 gånger i timmen.
const MAX_HISTORY = 20
const inputSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(8000),
  })).min(1).max(100),
})

const tools: Anthropic.Tool[] = [
  {
    name: 'get_my_profile',
    description: 'Hämtar användarens profil och CV-data: kompetenser, erfarenhet, utbildning, sammanfattning.',
    input_schema: { type: 'object' as const, properties: {}, required: [] },
  },
  {
    name: 'get_active_jobs',
    description: 'Hämtar aktiva jobbannonser på plattformen. Använd när användaren frågar om jobb som passar dem. Filtrera på kompetenser när du redan vet vad användaren kan, för mer relevanta träffar.',
    input_schema: {
      type: 'object' as const,
      properties: {
        limit: { type: 'number', description: 'Max antal jobb (default 15)' },
        skills: {
          type: 'array',
          items: { type: 'string' },
          description: 'Valfritt: matcha bara jobb som kräver minst en av dessa kompetenser',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_job_details',
    description: 'Hämtar fullständiga detaljer om ett specifikt jobb inklusive beskrivning och krav.',
    input_schema: {
      type: 'object' as const,
      properties: {
        job_id: { type: 'string', description: 'Jobbets UUID' },
      },
      required: ['job_id'],
    },
  },
  {
    name: 'get_my_applications',
    description: 'Hämtar användarens ansökningar med matchningspoäng och status.',
    input_schema: { type: 'object' as const, properties: {}, required: [] },
  },
  {
    name: 'get_skill_gap_analysis',
    description: 'Räknar ut exakt vilka av jobbets krav användaren redan har och vilka som saknas, samt en matchningsprocent. Använd alltid detta verktyg istället för att gissa när användaren frågar om ett specifikt jobb passar dem eller vad de saknar — det ger exakta siffror, inte uppskattningar.',
    input_schema: {
      type: 'object' as const,
      properties: {
        job_id: { type: 'string', description: 'Jobbets UUID' },
      },
      required: ['job_id'],
    },
  },
]

// Friendly Swedish status labels shown in the UI while a tool runs
export const TOOL_LABELS: Record<string, string> = {
  get_my_profile: 'Läser din profil',
  get_active_jobs: 'Söker bland aktiva jobb',
  get_job_details: 'Hämtar jobbdetaljer',
  get_my_applications: 'Hämtar dina ansökningar',
  get_skill_gap_analysis: 'Räknar ut kompetensgap',
}

function normalizeSkill(s: string) {
  return s.toLowerCase().trim()
}

async function executeTool(
  name: string,
  input: Record<string, unknown>,
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
): Promise<string> {
  try {
    switch (name) {
      case 'get_my_profile': {
        const [{ data: profile }, { data: cv }] = await Promise.all([
          admin.from('profiles').select('full_name, headline, bio, location').eq('id', userId).single(),
          admin.from('cv_profiles').select('skills, experience_years, education, ai_summary, languages').eq('seeker_id', userId).single(),
        ])
        return JSON.stringify({ profile, cv_profile: cv })
      }
      case 'get_active_jobs': {
        const limit = Math.min(Math.max(Number(input.limit) || 15, 1), 30) // modellstyrt värde — begränsa
        const skills = (input.skills as string[] | undefined)?.filter(Boolean)
        let query = admin
          .from('jobs')
          .select('id, title, location, work_type, skills_required, salary_min, salary_max, currency, experience_level, description')
          .eq('status', 'active')
        if (skills && skills.length > 0) {
          query = query.overlaps('skills_required', skills)
        }
        const { data: jobs } = await query.order('created_at', { ascending: false }).limit(limit)
        return JSON.stringify(jobs ?? [])
      }
      case 'get_job_details': {
        const { data: job } = await admin
          .from('jobs')
          .select('*')
          .eq('id', input.job_id as string)
          .single()
        return JSON.stringify(job)
      }
      case 'get_my_applications': {
        const { data: apps } = await admin
          .from('applications')
          .select('id, status, match_score, skill_gaps, ai_summary, created_at, job:jobs(id, title, location, skills_required)')
          .eq('seeker_id', userId)
          .order('created_at', { ascending: false })
        return JSON.stringify(apps ?? [])
      }
      case 'get_skill_gap_analysis': {
        const [{ data: cv }, { data: job }] = await Promise.all([
          admin.from('cv_profiles').select('skills').eq('seeker_id', userId).single(),
          admin.from('jobs').select('title, skills_required').eq('id', input.job_id as string).single(),
        ])
        if (!job) return JSON.stringify({ error: 'Jobbet hittades inte' })
        const mySkills = new Set((cv?.skills ?? []).map(normalizeSkill))
        const required: string[] = job.skills_required ?? []
        const matching = required.filter(r => mySkills.has(normalizeSkill(r)))
        const missing = required.filter(r => !mySkills.has(normalizeSkill(r)))
        const match_percentage = required.length ? Math.round((matching.length / required.length) * 100) : 100
        return JSON.stringify({ job_title: job.title, matching, missing, match_percentage })
      }
      default:
        return JSON.stringify({ error: 'Okänt verktyg' })
    }
  } catch {
    return JSON.stringify({ error: 'Kunde inte hämta data' })
  }
}

function sseEncode(obj: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(obj)}\n\n`)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!rateLimit(`career-coach:${user.id}`, 30)) {
    return NextResponse.json({ error: 'För många förfrågningar. Försök igen om en timme.' }, { status: 429 })
  }

  const parsedInput = inputSchema.safeParse(await request.json().catch(() => null))
  if (!parsedInput.success) {
    return NextResponse.json({ error: 'Ogiltiga meddelanden' }, { status: 400 })
  }
  // Behåll bara de senaste meddelandena, och se till att historiken börjar med ett
  // user-meddelande och slutar med ett (krav från API:t respektive för att få ett svar).
  let inputMessages = parsedInput.data.messages.slice(-MAX_HISTORY)
  while (inputMessages.length > 0 && inputMessages[0].role !== 'user') inputMessages = inputMessages.slice(1)
  if (inputMessages.length === 0 || inputMessages[inputMessages.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'Ogiltiga meddelanden' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()

  const systemPrompt = `Du är Rekryos AI-karriärcoach — en personlig assistent för jobbsökare på den svenska arbetsmarknaden.

Du hjälper ${profile?.full_name ?? 'användaren'} med:
- Analysera deras CV och ge konkreta, handlingsbara förbättringstips
- Rekommendera passande jobb från plattformen baserat på deras profil och kompetenser
- Skriva personliga brev och ansökningstextar anpassade till specifika jobb
- Förbereda för intervjuer med träningsfrågor och råd
- Förklara kompetensgap och ge råd om hur de kan fyllas (kurser, certifikat, erfarenhet)
- Tolka och förklara matchningspoäng

Du har tillgång till verktyg för att hämta användarens profil, aktiva jobb, ansökningar och exakta kompetensgap i realtid — använd dem proaktivt, och gissa aldrig data du kan hämta.

Regler:
- Svara alltid på svenska
- Var konkret och handlingsinriktad — ge specifika råd, inte generella
- Använd markdown (rubriker med ##, punktlistor med -, **fetstil**) för att göra svaren lättlästa
- Referera till verkliga jobb och kompetenser från databasen när möjligt
- Om användaren frågar om ett specifikt jobb, hämta detaljerna med get_job_details
- Om användaren frågar hur väl de passar ett jobb eller vad de saknar, använd ALLTID get_skill_gap_analysis för exakta siffror istället för att uppskatta själv`

  let messages: Anthropic.MessageParam[] = inputMessages

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (let round = 0; round < 6; round++) {
          const stream = anthropic.messages.stream({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            system: systemPrompt,
            tools,
            messages,
          })

          stream.on('text', (delta) => {
            controller.enqueue(sseEncode({ type: 'text', delta }))
          })

          const message = await stream.finalMessage()

          if (message.stop_reason === 'tool_use') {
            const toolBlocks = message.content.filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
            messages = [...messages, { role: 'assistant', content: message.content }]

            for (const tool of toolBlocks) {
              controller.enqueue(sseEncode({ type: 'tool_start', tool: tool.name, label: TOOL_LABELS[tool.name] ?? tool.name }))
            }

            const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
              toolBlocks.map(async tool => ({
                type: 'tool_result' as const,
                tool_use_id: tool.id,
                content: await executeTool(tool.name, tool.input as Record<string, unknown>, admin, user.id),
              }))
            )

            for (const tool of toolBlocks) {
              controller.enqueue(sseEncode({ type: 'tool_end', tool: tool.name }))
            }

            messages = [...messages, { role: 'user', content: toolResults }]
            continue
          }

          // end_turn (or any other terminal reason) — full text already streamed above
          controller.enqueue(sseEncode({ type: 'done' }))
          controller.close()
          return
        }

        controller.enqueue(sseEncode({ type: 'error', message: 'Svaret tog för många steg. Försök ställa en mer avgränsad fråga.' }))
        controller.close()
      } catch {
        controller.enqueue(sseEncode({ type: 'error', message: 'Något gick fel. Försök igen.' }))
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Content-Type-Options': 'nosniff',
      'X-Accel-Buffering': 'no',
    },
  })
}
