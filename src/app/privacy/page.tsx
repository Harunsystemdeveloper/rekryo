import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Integritetspolicy' }

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Integritetspolicy</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <p className="text-muted-foreground">Senast uppdaterad: 2026-09-19</p>

          <h2 className="text-xl font-semibold mt-8">1. Vilka vi är</h2>
          <p>
            Rekryo är en AI-driven jobbmatchningsplattform som hjälper jobbsökare
            och rekryterare att hitta varandra. Den här policyn förklarar dels hur vi
            hanterar dina personuppgifter enligt GDPR, dels hur vi lever upp till
            EU:s förordning om artificiell intelligens (AI-förordningen, &quot;AI Act&quot;)
            eftersom kärnan i tjänsten — AI som bedömer och rangordnar personer i en
            rekryteringsprocess — är precis det AI-förordningen är skriven för att
            reglera.
          </p>

          <h2 className="text-xl font-semibold mt-8">2. Vilka uppgifter vi samlar in</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Kontouppgifter: e-post, namn, profilbild</li>
            <li>CV-data: kompetenser, erfarenhet, utbildning (frivilligt uppladdad)</li>
            <li>Jobbannonser och ansökningsstatus</li>
            <li>Meddelanden mellan användare</li>
            <li>
              Demografiska uppgifter (kön, födelseår) — <strong>helt frivilligt</strong> och
              separat samtycke krävs. Används aldrig för att matcha eller bedöma dig,
              bara för den anonymiserade rättvise-analysen i punkt 5 nedan. Du kan
              radera dessa uppgifter när som helst utan att det påverkar ditt konto.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">3. Datalagring</h2>
          <p>
            All data lagras inom EU (Irland) via Supabase och behandlas i enlighet med GDPR.
            Supabase är certifierat enligt SOC 2 Type II och uppfyller EU:s krav på databehandling.
          </p>

          <h2 className="text-xl font-semibold mt-8">4. Hur vi använder AI</h2>
          <p>
            Vi använder Claude AI (Anthropic) för att analysera CV:n, beräkna matchningspoäng,
            identifiera kompetensgap, generera intervjufrågor och sammanfatta kandidater.
            Ditt CV och dina uppgifter skickas till Anthropics API enbart för att utföra
            dessa tjänster — Anthropic lagrar inte din data och använder den inte för att
            träna AI-modeller. Detta framgår av{' '}
            <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Anthropics integritetspolicy
            </a>.
          </p>

          <h2 className="text-xl font-semibold mt-8">5. EU:s AI-förordning (AI Act)</h2>
          <p>
            AI-system som används för att rekrytera eller utvärdera personer i en
            anställningsprocess klassas som <strong>högrisk-AI</strong> enligt AI-förordningens
            bilaga III — det gäller matchningspoängen, kompetensgap-analysen och
            kandidatsammanfattningarna i Rekryo. Så här hanterar vi det konkret,
            inte bara som en policy-formulering:
          </p>

          <h3 className="text-base font-semibold mt-6">Mänsklig kontroll (Artikel 14)</h3>
          <p>
            AI:ns matchningspoäng är alltid rådgivande, aldrig ett automatiskt beslut.
            En rekryterare kan när som helst manuellt skriva över ett AI-genererat
            poäng och måste då ange en motivering — den motiveringen sparas tillsammans
            med det ursprungliga AI-poänget, inte istället för det, så att båda alltid
            går att se i efterhand.
          </p>

          <h3 className="text-base font-semibold mt-6">Loggning och spårbarhet (Artikel 12)</h3>
          <p>
            Varje AI-beslut som rör dig — CV-analys, matchningspoäng, kompetensgap,
            intervjufrågor, kandidatsammanfattning — loggas i en granskningsbar
            beslutslogg. Loggen innehåller vilken modell som användes, vilka
            kompetenser som gick in och ut ur analysen, en läsbar sammanfattning av
            beslutet, samt om och när en människa granskat eller skrivit över det.
            Loggen innehåller <strong>aldrig</strong> ditt fullständiga CV i klartext —
            bara de extraherade kompetenserna, inte den råa texten.
          </p>

          <h3 className="text-base font-semibold mt-6">Transparens (Artikel 13 &amp; 50)</h3>
          <p>
            Vi döljer aldrig att du interagerar med AI. Karriärcoachen är tydligt
            märkt som AI-assistent, varje matchningspoäng visar &quot;AI-match&quot; och kan
            expanderas med &quot;Varför denna poäng?&quot; för en förklaring i klartext, och
            kompetensgap-analysen visar exakt vilka kompetenser som räknades som
            matchande respektive saknade — aldrig bara en siffra utan motivering.
          </p>

          <h3 className="text-base font-semibold mt-6">Rättvisa och bias-övervakning</h3>
          <p>
            Rekryterare har tillgång till en fairness-dashboard som statistiskt
            testar om matchningspoäng skiljer sig systematiskt mellan grupper
            (t.ex. kön eller åldersintervall), baserat på de frivilliga demografiska
            uppgifter som beskrivs i punkt 2. Analysen görs alltid på gruppnivå med
            ett minimikrav på gruppstorlek — är en grupp för liten för att ge ett
            statistiskt meningsfullt resultat visas ingen siffra alls, för att undvika
            att peka ut enskilda individer i en liten grupp.
          </p>

          <h3 className="text-base font-semibold mt-6">Dina rättigheter enligt AI-förordningen</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Rätt att få veta att ett AI-system använts för att bedöma dig</li>
            <li>Rätt till en begriplig förklaring av hur ett matchningspoäng räknats fram</li>
            <li>Rätt att begära mänsklig granskning av ett AI-genererat beslut</li>
            <li>Rätt att få ut din egen AI-beslutslogg (ingår i dataexporten under punkt 6)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">6. GDPR</h2>
          <p>
            Vi följer EU:s dataskyddsförordning (GDPR). Du har rätt att:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Få tillgång till dina uppgifter, inklusive din AI-beslutslogg</li>
            <li>Radera ditt konto och all data</li>
            <li>Exportera dina uppgifter i ett maskinläsbart format</li>
            <li>Invända mot viss databehandling</li>
            <li>Återkalla samtycke till demografiska uppgifter utan att det påverkar kontot</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">7. Kontakt</h2>
          <p>
            Vid frågor om din integritet eller hur AI används för att bedöma dig,
            kontakta oss på privacy@rekryo.com.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
