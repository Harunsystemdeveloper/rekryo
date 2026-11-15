// Sidans adress och e-postdomän på ett ställe. Allt utgår från NEXT_PUBLIC_APP_URL, så
// när domänen byts räcker det att ändra den variabeln i Vercel och bygga om. Mejl
// skickas från samma domän, som måste vara verifierad i Resend. EMAIL_DOMAIN kan sättas
// om mejlen ska gå från en annan domän än sidan, t.ex. medan sidan ligger på vercel.app.

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://rekryo.com').replace(/\/+$/, '')

export const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN ?? new URL(SITE_URL).hostname.replace(/^www\./, '')

export const EMAIL_FROM = `Rekryo <noreply@${EMAIL_DOMAIN}>`

export const PRIVACY_EMAIL = `privacy@${EMAIL_DOMAIN}`
