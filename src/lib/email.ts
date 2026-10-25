import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM = 'Rekryo <noreply@rekryo.com>'
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://rekryo.com'

// Namn och jobbtitlar skrivs av användare och får aldrig tolkas som HTML i ett mejl som
// skickas från vår domän — annars kan t.ex. ett namn som <a href="…">Verifiera kontot</a>
// bli en äkta phishinglänk. Escapa ALLT användarstyrt innehåll som läggs in i mallarna.
function esc(value: string): string {
  return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

// Returnerar om mejlet faktiskt skickades. De flesta utskick är best effort och ignorerar
// svaret, men verifieringsmejlet måste fram för att kontot ska gå att använda.
async function send(options: Parameters<Resend['emails']['send']>[0]): Promise<boolean> {
  if (!resend) return false
  try {
    // Resend kastar inte vid API-fel (t.ex. overifierad avsändardomän) utan returnerar error
    const { error } = await resend.emails.send(options)
    if (error) {
      console.error('[email] send failed:', error.message)
      return false
    }
    return true
  } catch (err) {
    console.error('[email] send failed:', err)
    return false
  }
}

export async function sendNewApplicationEmail({
  recruiterEmail,
  recruiterName,
  seekerName,
  jobTitle,
  jobId,
}: {
  recruiterEmail: string
  recruiterName: string
  seekerName: string
  jobTitle: string
  jobId: string
}) {
  await send({
    from: FROM,
    to: recruiterEmail,
    subject: `Ny ansökan till ${jobTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="margin-bottom:8px">Ny ansökan 📬</h2>
        <p>Hej ${esc(recruiterName)},</p>
        <p><strong>${esc(seekerName)}</strong> har sökt tjänsten <strong>${esc(jobTitle)}</strong>.</p>
        <p>
          <a href="${BASE_URL}/recruiter/jobs/${jobId}/candidates"
             style="display:inline-block;background:#6d28d9;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
            Granska ansökan
          </a>
        </p>
        <p style="color:#666;font-size:13px">Rekryo · AI-driven jobbmatchning för den svenska arbetsmarknaden</p>
      </div>
    `,
  })
}

export async function sendStatusUpdateEmail({
  seekerEmail,
  seekerName,
  jobTitle,
  newStatus,
  jobId,
}: {
  seekerEmail: string
  seekerName: string
  jobTitle: string
  newStatus: string
  jobId: string
}) {
  const statusLabels: Record<string, string> = {
    reviewed: 'Granskad',
    shortlisted: 'Shortlistad — du är ett steg närmre!',
    accepted: 'Accepterad — grattis!',
    rejected: 'Ej aktuell den här gången',
  }

  const label = statusLabels[newStatus]
  if (!label) return

  const isPositive = newStatus === 'shortlisted' || newStatus === 'accepted'

  await send({
    from: FROM,
    to: seekerEmail,
    subject: `Din ansökan till ${jobTitle}: ${label}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="margin-bottom:8px">${isPositive ? '🎉' : '📋'} Uppdatering på din ansökan</h2>
        <p>Hej ${esc(seekerName)},</p>
        <p>Din ansökan till <strong>${esc(jobTitle)}</strong> har fått statusen: <strong>${label}</strong>.</p>
        ${newStatus === 'accepted' ? '<p>Rekryteraren kommer att höra av sig till dig inom kort.</p>' : ''}
        ${newStatus === 'rejected' ? '<p>Ge inte upp — det finns fler jobb som matchar din profil.</p>' : ''}
        <p>
          <a href="${BASE_URL}/seeker/jobs/${jobId}"
             style="display:inline-block;background:#6d28d9;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
            Visa jobbet
          </a>
        </p>
        <p style="color:#666;font-size:13px">Rekryo · AI-driven jobbmatchning för den svenska arbetsmarknaden</p>
      </div>
    `,
  })
}

export async function sendWelcomeEmail({
  email,
  name,
  userType,
}: {
  email: string
  name: string
  userType: 'job_seeker' | 'recruiter'
}) {
  const isSeeker = userType === 'job_seeker'
  const dashboardUrl = `${BASE_URL}/dashboard`

  await send({
    from: FROM,
    to: email,
    subject: 'Välkommen till Rekryo!',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="margin-bottom:8px">Välkommen, ${esc(name)}! 🎉</h2>
        <p>Ditt konto är nu aktivt. ${isSeeker
          ? 'Du kan nu ladda upp ditt CV och börja matcha mot hundratals jobb med hjälp av AI.'
          : 'Du kan nu publicera jobbannonser och låta AI rangordna kandidaterna åt dig.'
        }</p>
        <p>
          <a href="${dashboardUrl}"
             style="display:inline-block;background:#6d28d9;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
            Gå till din dashboard
          </a>
        </p>
        <p style="color:#666;font-size:13px">Rekryo · AI-driven jobbmatchning för den svenska arbetsmarknaden</p>
      </div>
    `,
  })
}

export async function sendNewMessageEmail({
  recipientEmail,
  recipientName,
  senderName,
}: {
  recipientEmail: string
  recipientName: string
  senderName: string
}) {
  await send({
    from: FROM,
    to: recipientEmail,
    subject: `Nytt meddelande från ${senderName}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="margin-bottom:8px">Nytt meddelande 💬</h2>
        <p>Hej ${esc(recipientName)},</p>
        <p><strong>${esc(senderName)}</strong> har skickat dig ett meddelande på Rekryo.</p>
        <p>
          <a href="${BASE_URL}/messages"
             style="display:inline-block;background:#6d28d9;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
            Läs meddelandet
          </a>
        </p>
        <p style="color:#666;font-size:13px">Rekryo · AI-driven jobbmatchning för den svenska arbetsmarknaden</p>
      </div>
    `,
  })
}
