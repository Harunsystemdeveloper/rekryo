import { NextResponse } from 'next/server'

// Databasfel från Supabase/Postgres innehåller tabellnamn, constraints och ibland värden.
// De loggas på servern men skickas aldrig till klienten, som bara får ett generiskt svar.
export function dbError(
  scope: string,
  error: { message: string; code?: string },
  status = 500,
  message = 'Något gick fel. Försök igen.'
) {
  console.error(`[${scope}] ${error.code ?? 'db'}: ${error.message}`)
  return NextResponse.json({ error: message }, { status })
}
