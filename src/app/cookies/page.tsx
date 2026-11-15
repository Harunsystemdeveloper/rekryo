import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Cookies' }

export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Cookiepolicy</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <p className="text-muted-foreground">Senast uppdaterad: 2026-11-16</p>

          <h2 className="text-xl font-semibold mt-8">Vilka cookies använder vi?</h2>

          <h3 className="text-lg font-medium mt-6">Nödvändiga cookies</h3>
          <p>
            Dessa cookies är nödvändiga för att plattformen ska fungera. De håller dig inloggad
            och hanteras av Supabase. Utan dem går det inte att logga in, och de kräver därför
            inget samtycke.
          </p>

          <h3 className="text-lg font-medium mt-6">Lagring i din webbläsare</h3>
          <p>
            Vissa val sparas bara lokalt i din webbläsare och skickas aldrig till oss:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>om du valt mörkt eller ljust läge</li>
            <li>ditt svar på cookiemeddelandet</li>
            <li>om du har sett introduktionsguiden</li>
            <li>när du senast öppnade notiserna</li>
            <li>dina samtal med AI-karriärcoachen, så att de finns kvar om du laddar om sidan</li>
          </ul>
          <p>
            Du tar bort dem genom att rensa webbplatsdata i webbläsaren, och coachens samtal även
            med knappen Ny konversation.
          </p>

          <h2 className="text-xl font-semibold mt-8">Tredjepartscookies</h2>
          <p>
            Vi använder inga tredjepartscookies för spårning eller annonsering.
          </p>

        </div>
      </main>
      <Footer />
    </div>
  )
}
