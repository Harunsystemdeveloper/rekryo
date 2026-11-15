import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'
import { OPERATOR_NAME, PRIVACY_EMAIL } from '@/lib/site'

export const metadata: Metadata = { title: 'Integritetspolicy' }

// Texten ska spegla vad koden faktiskt gör. Ändras vilka uppgifter som sparas, vilka
// leverantörer som används eller hur AI:n används, ska policyn ändras samtidigt.
export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Integritetspolicy</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <p className="text-muted-foreground">Senast uppdaterad: 2026-11-16</p>

          <h2 className="text-xl font-semibold mt-8">1. Vem som ansvarar för dina uppgifter</h2>
          <p>
            Rekryo drivs av <strong>{OPERATOR_NAME}</strong>, som är personuppgiftsansvarig för
            behandlingen av dina personuppgifter i tjänsten. Rekryo är för närvarande i en
            betaversion.
          </p>
          <p>
            Har du frågor om dina personuppgifter eller om hur AI används i tjänsten når du oss
            på <strong>{PRIVACY_EMAIL}</strong>. Vi besvarar förfrågningar så snart som möjligt
            och senast inom en månad.
          </p>
          <p>
            Policyn förklarar hur vi hanterar personuppgifter enligt dataskyddsförordningen
            (GDPR) och hur vi förhåller oss till EU:s förordning om artificiell intelligens
            (AI-förordningen), eftersom tjänsten använder AI för att bedöma och rangordna
            personer i en rekryteringsprocess.
          </p>

          <h2 className="text-xl font-semibold mt-8">2. Vilka uppgifter vi behandlar</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Konto:</strong> e-postadress, lösenord (lagras krypterat), namn och vilken roll du har.</li>
            <li><strong>Profil:</strong> profilbild, rubrik, ort, kort presentation och webbplats, om du fyller i dem.</li>
            <li>
              <strong>CV (jobbsökare):</strong> den uppladdade filen, texten som läses ut ur den och det
              AI:n tar fram ur texten: kompetenser, antal års erfarenhet, utbildning, språk och en
              sammanfattning. Allt som står i ditt CV, till exempel namn och kontaktuppgifter,
              följer med i texten. Skriv därför inte in personnummer eller hälsouppgifter i CV:t.
            </li>
            <li>
              <strong>Ansökningar:</strong> vilket jobb du sökt, telefonnummer, personligt brev,
              tillgänglighet och löneanspråk, ansökans status, matchningspoäng, AI:ns motivering och
              kompetensgap.
            </li>
            <li><strong>Rekryterarens arbete:</strong> anteckningar, intervjubokningar och intervjubedömningar som en rekryterare gör om dig som kandidat.</li>
            <li><strong>Rekryterare:</strong> företagsprofil (namn, logotyp, beskrivning) och publicerade jobbannonser.</li>
            <li><strong>Meddelanden</strong> mellan jobbsökare och rekryterare, och notiser i tjänsten.</li>
            <li>
              <strong>Demografiska uppgifter (kön, födelseår):</strong> helt frivilliga och kräver ett eget
              samtycke. De används aldrig för att matcha eller bedöma dig, bara i den statistiska
              rättviseanalysen i punkt 8. Du kan ta bort dem när som helst.
            </li>
            <li><strong>AI-beslutsloggen:</strong> en logg över varje AI-bedömning som rör dig, se punkt 8.</li>
          </ul>
          <p>
            Samtal med AI-karriärcoachen sparas bara i din egen webbläsare, inte hos oss. Det du skriver
            skickas till AI-leverantören för att coachen ska kunna svara.
          </p>

          <h2 className="text-xl font-semibold mt-8">3. Varför vi behandlar uppgifterna och med vilken rätt</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>För att leverera tjänsten du registrerat dig för</strong> (avtal, GDPR art. 6.1 b):
              ditt konto, CV-analysen, matchning mot jobb, ansökningar, meddelanden och mejl om ditt konto
              och dina ansökningar.
            </li>
            <li>
              <strong>Ditt samtycke</strong> (art. 6.1 a): att synas i talangpoolen och att lämna
              demografiska uppgifter. Du kan återkalla samtycket när som helst utan att det påverkar
              resten av tjänsten.
            </li>
            <li>
              <strong>Berättigat intresse</strong> (art. 6.1 f): att skydda tjänsten mot missbruk,
              begränsa antalet anrop och föra AI-beslutsloggen så att varje bedömning kan granskas i
              efterhand.
            </li>
          </ul>
          <p>
            Inga beslut som får rättsliga följder för dig fattas enbart automatiskt (art. 22). AI:n
            föreslår, och det är alltid en människa som beslutar.
          </p>

          <h2 className="text-xl font-semibold mt-8">4. Vem som får se dina uppgifter</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Rekryterare du söker jobb hos</strong> ser din profil, dina CV-uppgifter, din
              CV-fil, din ansökan och AI:ns bedömning. Rekryteraren blir då själv ansvarig för hur
              uppgifterna används i sin rekrytering.
            </li>
            <li>
              <strong>Alla inloggade rekryterare</strong> om du har valt att synas i talangpoolen, se
              punkt 5.
            </li>
            <li><strong>Den du har en konversation med</strong> ser dina meddelanden.</li>
            <li><strong>Våra leverantörer</strong> i punkt 6, som bara får behandla uppgifterna för vår räkning.</li>
          </ul>
          <p>Vi säljer aldrig dina uppgifter och använder dem inte för reklam.</p>
          <p>
            Rekryterarkonton kontrolleras inte i betaversionen. Om en rekryterare beter sig konstigt,
            till exempel ber om pengar, kontouppgifter eller känsliga uppgifter, kontakta oss på
            adressen i punkt 1.
          </p>

          <h2 className="text-xl font-semibold mt-8">5. Talangpoolen</h2>
          <p>
            Talangpoolen låter rekryterare hitta jobbsökare som inte själva har sökt deras jobb. Du
            syns där bara om du aktivt har slagit på det. Valet är avstängt från början och ändras
            under Inställningar → Integritet &amp; GDPR. Stänger du av det försvinner du ur
            talangpoolen direkt.
          </p>
          <p>
            Talangpoolen visas för alla inloggade rekryterare, oavsett bransch. De ser namn, rubrik,
            ort, presentation, webbplats, kompetenser, erfarenhet, utbildning, språk och AI:ns
            sammanfattning av ditt CV. Själva CV-filen, ditt telefonnummer och din e-postadress visas
            aldrig där. Rekryterare kan skicka ett första meddelande till dig, och det kan vara skrivet
            med hjälp av AI.
          </p>

          <h2 className="text-xl font-semibold mt-8">6. Leverantörer och var uppgifterna lagras</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Supabase</strong> lagrar databasen, inloggningen och uppladdade filer på servrar i
              Irland (EU).
            </li>
            <li>
              <strong>Anthropic</strong> (USA) tillhandahåller AI-modellen Claude som analyserar CV:n,
              beräknar matchningar, tar fram kompetensgap och intervjufrågor och driver karriärcoachen.
              Anthropic använder inte uppgifterna för att träna sina modeller och raderar dem normalt
              inom 30 dagar.
            </li>
            <li><strong>Vercel</strong> (USA) driftar webbplatsen och hanterar därför tekniska uppgifter som IP-adress i sina loggar.</li>
            <li><strong>Resend</strong> (USA) skickar mejl från tjänsten, till exempel bekräftelsemejl och notiser.</li>
          </ul>
          <p>
            När uppgifter förs över till USA sker det med stöd av EU-kommissionens
            standardavtalsklausuler i leverantörernas personuppgiftsbiträdesavtal, eller av
            EU–USA-ramverket för dataskydd när leverantören är ansluten till det.
          </p>

          <h2 className="text-xl font-semibold mt-8">7. Hur länge vi sparar uppgifterna</h2>
          <p>
            Uppgifterna sparas så länge du har ett konto. Raderar du kontot tas allt bort direkt: kontot,
            profilen, CV-filen och CV-uppgifterna, ansökningar, meddelanden, notiser och
            AI-beslutsloggen. Raderar en rekryterare sitt konto försvinner också rekryterarens annonser
            och de ansökningar som kommit in till dem. Kopior kan finnas kvar en kort tid i
            leverantörernas säkerhetskopior och loggar innan de skrivs över.
          </p>
          <p>
            Tar du bort ditt CV raderas filen och allt som AI:n tagit fram ur det, men ansökningar du
            redan skickat ligger kvar hos rekryteraren tills du eller rekryteraren tar bort dem.
          </p>

          <h2 className="text-xl font-semibold mt-8">8. AI i tjänsten och AI-förordningen</h2>
          <p>
            AI-system som används för att rekrytera eller bedöma personer i en anställningsprocess
            räknas som högrisk enligt AI-förordningen (bilaga III). Det gäller matchningspoängen,
            kompetensgapen och kandidatsammanfattningarna i Rekryo. Rekryo är ett projekt under
            utveckling och har inte genomgått den bedömning av överensstämmelse som förordningen
            kräver för högrisksystem. Tjänsten är byggd efter förordningens principer, som beskrivs
            nedan.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Mänsklig kontroll (art. 14):</strong> poängen är alltid ett förslag. En
              rekryterare kan ändra den men måste då ange en motivering, och både AI:ns poäng och
              ändringen sparas.
            </li>
            <li>
              <strong>Loggning (art. 12):</strong> varje CV-analys, matchning, kompetensgapsanalys,
              kandidatsammanfattning och rättviseanalys loggas med vilken modell som användes, vilka
              kompetenser som gick in och kom ut och en läsbar sammanfattning. Loggen innehåller inte
              hela ditt CV.
            </li>
            <li>
              <strong>Transparens (art. 13 och 50):</strong> det framgår alltid när AI har bedömt dig
              eller när du pratar med AI. Varje poäng går att få förklarad, och kompetensgapen visar
              vilka krav som räknades som uppfyllda och vilka som saknades.
            </li>
            <li>
              <strong>Ditt namn skickas inte till AI:n</strong> när du matchas mot ett jobb, så att
              namnet inte kan påverka poängen.
            </li>
            <li>
              <strong>Rättviseanalys:</strong> rekryterare kan se om poängen skiljer sig systematiskt
              mellan grupper, baserat på de frivilliga demografiska uppgifterna. Analysen visas bara på
              gruppnivå och bara när gruppen är tillräckligt stor för att ingen enskild person ska gå
              att peka ut.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">9. Dina rättigheter</h2>
          <p>Du har rätt att:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>få veta vilka uppgifter vi har om dig och få en kopia (art. 15), inklusive din AI-beslutslogg</li>
            <li>få felaktiga uppgifter rättade (art. 16)</li>
            <li>få dina uppgifter raderade (art. 17)</li>
            <li>begära att behandlingen begränsas (art. 18)</li>
            <li>få ut dina uppgifter i ett maskinläsbart format (art. 20)</li>
            <li>invända mot behandling som bygger på berättigat intresse (art. 21)</li>
            <li>återkalla ett samtycke när som helst, utan att det påverkar behandlingen innan dess</li>
            <li>få en förklaring av hur en AI-bedömning av dig gjorts och begära att en människa granskar den</li>
          </ul>
          <p>
            Export och radering gör du själv direkt under Inställningar → Integritet &amp; GDPR. För
            övrigt kontaktar du oss på {PRIVACY_EMAIL}.
          </p>
          <p>
            Tycker du att vi hanterar dina uppgifter fel har du rätt att klaga hos
            Integritetsskyddsmyndigheten (IMY), imy.se.
          </p>

          <h2 className="text-xl font-semibold mt-8">10. Cookies</h2>
          <p>
            Vi använder bara de cookies som behövs för inloggningen. Inställningar som tema, ditt
            cookieval och karriärcoachens samtal sparas lokalt i din webbläsare. Vi använder ingen
            spårning eller reklam. Läs mer i cookiepolicyn.
          </p>

          <h2 className="text-xl font-semibold mt-8">11. Ändringar</h2>
          <p>
            Policyn kan ändras när tjänsten utvecklas. Större ändringar meddelas i tjänsten eller via
            mejl innan de börjar gälla.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
