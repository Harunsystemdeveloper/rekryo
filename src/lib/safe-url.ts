// Länkar som användare själva anger, t.ex. företagets webbplats, sparas direkt från
// klienten och kan därför innehålla vilket schema som helst (javascript:, data:, file:).
// Bara http och https får bli klickbara länkar. Allt annat ger undefined, så att <a>
// renderas utan href.
export function safeHttpUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  try {
    const parsed = new URL(url.trim())
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : undefined
  } catch {
    return undefined
  }
}
