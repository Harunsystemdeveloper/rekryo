import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Publik route utan inloggning — hårda gränser så att den inte kan användas för att skicka
// stora mängder godtycklig text till Claude på vår bekostnad.
const skill = z.string().trim().min(1).max(60)
const schema = z.object({
  job_title: z.string().trim().min(2).max(100),
  job_skills: z.array(skill).min(1).max(15),
  candidate_skills: z.array(skill).min(1).max(15),
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  if (!rateLimit(`demo:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'För många försök. Prova igen om en timme.' }, { status: 429 })
  }

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Fyll i alla fält (max 15 kompetenser à 60 tecken).' }, { status: 400 })
  }
  const { job_title, job_skills, candidate_skills } = parsed.data

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Du är ett professionellt AI-rekryteringsverktyg som hanterar ALLA branscher — vård, ekonomi, juridik, IT, pedagogik, handel, bygg, kreativa yrken m.fl. Analysera matchningen mellan en kandidat och ett jobb.

VIKTIGT: Om jobbtitel, jobbkrav eller kompetenser är nonsens, slumpmässiga tecken eller inte är riktiga yrkeskompetenser — returnera score 0 och förklara i verdict att inmatningen inte är giltig.

Jobb: ${job_title}
Jobbkrav (kompetenser): ${job_skills.join(', ')}
Kandidatens kompetenser: ${candidate_skills.join(', ')}

Svara ENDAST med giltig JSON:
{
  "score": <0-100>,
  "matching": ["kompetens som matchar"],
  "missing": ["kompetens som saknas"],
  "verdict": "<En mening på svenska om matchningen>"
}`,
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const result = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim())
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Analys misslyckades. Försök igen.' }, { status: 500 })
  }
}
