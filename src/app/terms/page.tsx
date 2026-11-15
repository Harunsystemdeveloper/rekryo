import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'
import { OPERATOR_NAME, PRIVACY_EMAIL } from '@/lib/site'

export const metadata: Metadata = { title: 'Användarvillkor' }

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Användarvillkor</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <p className="text-muted-foreground">Senast uppdaterade: 2026-11-16</p>

          <h2 className="text-xl font-semibold mt-8">1. Om Rekryo och de här villkoren</h2>
          <p>
            Rekryo är en tjänst för AI-stödd jobbmatchning mellan jobbsökare och rekryterare. Tjänsten
            är ett privat hobbyprojekt som tillhandahålls av <strong>{OPERATOR_NAME}</strong>,
            privatperson i Sverige. Det finns inget bolag bakom tjänsten. Kontakt: {PRIVACY_EMAIL}.
          </p>
          <p>
            Villkoren gäller när du skapar ett konto eller använder tjänsten. Hur vi hanterar
            personuppgifter beskrivs i <Link href="/privacy" className="text-primary hover:underline">integritetspolicyn</Link>.
          </p>

          <h2 className="text-xl font-semibold mt-8">2. Betaversion och kostnad</h2>
          <p>
            Rekryo är under utveckling och erbjuds som en betaversion. Funktioner kan ändras, tas bort
            eller sluta fungera, och tjänsten kan ha fel eller vara otillgänglig. Uppgifter kan behöva
            raderas om tjänsten läggs ned, och då meddelar vi dig i förväg.
          </p>
          <p>Tjänsten är gratis. Om det någon gång blir aktuellt med avgifter får du veta det i förväg, och inget debiteras utan att du själv godkänt det.</p>

          <h2 className="text-xl font-semibold mt-8">3. Ditt konto</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Du måste vara minst 16 år för att skapa ett konto.</li>
            <li>Uppgifterna du lämnar ska vara sanna. Du får inte utge dig för att vara någon annan eller företräda ett företag du inte har rätt att företräda.</li>
            <li>Varje person får ha ett konto. Du ansvarar för att hålla lösenordet hemligt och för det som görs från ditt konto.</li>
            <li>Du kan radera ditt konto när du vill under Inställningar → Integritet &amp; GDPR.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">4. AI-bedömningar</h2>
          <p>
            Matchningspoäng, kompetensgap, sammanfattningar, intervjufrågor och karriärcoachens råd tas
            fram av AI. De är ett stöd och kan vara felaktiga eller ofullständiga. Ett poäng är aldrig
            ett beslut och säger inget om ditt värde som person eller kandidat. Kontrollera viktiga
            uppgifter innan du använder dem.
          </p>
          <p>
            Rekryteringsbeslut fattas alltid av rekryteraren, aldrig av Rekryo eller av AI:n.
          </p>

          <h2 className="text-xl font-semibold mt-8">5. Regler för jobbsökare</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ditt CV och dina ansökningar ska vara dina egna och stämma med verkligheten.</li>
            <li>Lägg inte in personnummer, hälsouppgifter eller andra känsliga uppgifter i CV:t eller ansökan. De behövs inte för matchningen.</li>
            <li>Försök inte påverka AI-bedömningen med dold text eller instruktioner i CV:t.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">6. Regler för rekryterare</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Du får bara publicera annonser för tjänster som finns och som du har rätt att rekrytera till.</li>
            <li>
              Kandidaternas uppgifter får bara användas för den rekrytering de gäller. Du får inte
              spara, kopiera eller sälja dem för andra syften, eller kontakta kandidater om annat än
              jobb.
            </li>
            <li>
              Du är själv personuppgiftsansvarig för de kandidatuppgifter du tar emot och använder i
              din rekrytering, och ansvarar för att följa GDPR och diskrimineringslagen.
            </li>
            <li>Du får inte diskriminera kandidater, och du ansvarar för ditt beslut även när du har använt AI:ns poäng som stöd.</li>
            <li>Du får aldrig be kandidater om pengar, bankuppgifter, inloggningsuppgifter eller id-handlingar via tjänsten.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">7. Förbjuden användning</h2>
          <p>Du får inte:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>samla in, skrapa eller exportera andra användares uppgifter i större mängd, manuellt eller automatiskt</li>
            <li>skicka spam, bedrägliga erbjudanden eller trakasserande meddelanden</li>
            <li>ladda upp innehåll som är olagligt, kränkande eller som du inte har rätt att sprida</li>
            <li>försöka ta dig förbi säkerhetsfunktioner, begränsningar eller andras konton</li>
            <li>använda tjänsten på ett sätt som belastar den onormalt eller stör andra användare</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">8. Ditt innehåll</h2>
          <p>
            Du behåller rätten till det du laddar upp, till exempel CV, annonser och meddelanden. Du ger
            Rekryo rätt att lagra, bearbeta och visa innehållet i den omfattning som behövs för att
            tjänsten ska fungera, till exempel att analysera ditt CV med AI och visa din ansökan för
            rekryteraren. Rätten upphör när du raderar innehållet eller kontot.
          </p>

          <h2 className="text-xl font-semibold mt-8">9. Avstängning och anmälan</h2>
          <p>
            Bryter ett konto mot villkoren, eller misstänks det användas för bedrägeri eller missbruk,
            kan vi ta bort innehåll och stänga av kontot, vid behov utan förvarning. Ser du något som
            bryter mot villkoren, till exempel en falsk annons eller en rekryterare som ber om pengar,
            kontakta oss på {PRIVACY_EMAIL}.
          </p>

          <h2 className="text-xl font-semibold mt-8">10. Ansvar</h2>
          <p>
            Tjänsten tillhandahålls i befintligt skick, utan garantier för att den alltid fungerar, att
            AI-bedömningarna är korrekta eller att du får ett jobb eller hittar en kandidat. Rekryo
            ansvarar inte för rekryteringsbeslut, för vad andra användare skriver eller gör, eller för
            indirekta skador som förlorad inkomst. Ansvarsbegränsningen gäller inte om skadan orsakats
            med uppsåt eller genom grov vårdslöshet, och den begränsar inte de rättigheter du har enligt
            tvingande lag.
          </p>

          <h2 className="text-xl font-semibold mt-8">11. Ändringar av villkoren</h2>
          <p>
            Villkoren kan ändras när tjänsten utvecklas. Större ändringar meddelas i tjänsten eller via
            mejl minst 14 dagar innan de börjar gälla. Fortsätter du använda tjänsten efter det gäller
            de nya villkoren. Vill du inte det kan du radera ditt konto.
          </p>

          <h2 className="text-xl font-semibold mt-8">12. Lag och tvister</h2>
          <p>
            Svensk lag gäller för villkoren. Tvister ska i första hand lösas genom att du kontaktar oss.
            Annars avgörs de av svensk allmän domstol.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
