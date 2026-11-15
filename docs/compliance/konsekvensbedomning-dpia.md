# Konsekvensbedömning avseende dataskydd (DPIA, GDPR art. 35)

Förenklat utkast för betaversionen. Ska göras om före öppen lansering, gärna med juridiskt stöd. Senast uppdaterat: 2026-11-16.

## 1. Varför en DPIA behövs

Rekryo använder AI för att bedöma och rangordna arbetssökande. Det är systematisk utvärdering av personliga aspekter (profilering) i ett sammanhang där resultatet kan påverka om någon får ett jobb. IMY:s förteckning över behandlingar som kräver konsekvensbedömning omfattar sådan behandling.

## 2. Beskrivning av behandlingen

- **Ändamål:** matcha jobbsökare mot jobb och ge rekryterare ett förklarat beslutsunderlag.
- **Flöde:** jobbsökaren laddar upp CV → texten läses ut → Claude (Anthropic) tar fram kompetenser och sammanfattning → vid ansökan jämförs kompetenser och sammanfattning med annonsen → poäng 0–100 med motivering och kompetensgap → rekryteraren beslutar.
- **Omfattning i beta:** ett fåtal inbjudna testare.
- **Registrerade:** arbetssökande (svagare part), rekryterare.

## 3. Nödvändighet och proportionalitet

- Rättslig grund: avtal för kärntjänsten, samtycke för talangpool och demografi.
- Dataminimering: namn skickas inte till AI:n vid matchning, AI-loggen sparar inte hela CV:t, demografi används bara på gruppnivå.
- Inga helt automatiserade beslut (art. 22): rekryteraren beslutar och kan justera poängen med motivering.
- Transparens: varje poäng kan förklaras, integritetspolicyn beskriver AI-användningen.

## 4. Risker för de registrerade

| Risk | Sannolikhet | Konsekvens | Åtgärd | Kvarstående risk |
|---|---|---|---|---|
| AI:n bedömer fel eller snedvridet (t.ex. efter kön, ålder, ursprung) | Medel | Hög | Namn skickas inte, rättviseanalys med 4/5-regeln, mänskligt beslut, förklaringar | Medel. Systematiska biastester saknas. |
| Kandidaten förstår inte hur poängen räknas | Medel | Medel | "Hur räknas poängen?", motivering per poäng | Låg |
| Falsk rekryterare samlar in CV:n eller lurar kandidater | Medel | Hög | Villkor, varningstext i policyn, inga kontaktuppgifter i talangpoolen | **Hög. Rekryterare kontrolleras inte i betan.** |
| Obehörig åtkomst till CV:n | Låg | Hög | Privat lagring, signerade länkar, radnivåsäkerhet | Låg efter verifiering av databasreglerna |
| Manipulation av AI via CV-text | Medel | Medel | Användartext märks som data, AI-svar valideras | Låg–medel |
| Överföring till USA | Hög (sker) | Medel | Standardavtalsklausuler, Anthropic tränar inte på data | Medel |
| Känsliga uppgifter i CV:t (hälsa, religion) | Medel | Hög | Villkoren ber användare att inte lägga in sådant | Medel |

## 5. Beslut

Behandlingen kan genomföras i en sluten beta med kända testare. Före öppen lansering ska åtminstone följande vara på plats:

1. Kontroll av rekryterare och möjlighet att anmäla dem.
2. Systematiska biastester av matchningen.
3. Godkända personuppgiftsbiträdesavtal med alla leverantörer.
4. Juridisk granskning av policy, villkor och denna bedömning.
