# Register över behandlingar (GDPR art. 30)

Utkast. Uppdateras när tjänsten ändras. Senast uppdaterat: 2026-11-16.

**Personuppgiftsansvarig:** [namn], privatperson, Sverige. Kontakt: privacy@[domän].
**Dataskyddsombud:** inget utsett (krävs inte för verksamhetens storlek).

## Behandlingar

| # | Behandling | Ändamål | Kategorier av registrerade | Personuppgifter | Rättslig grund | Mottagare | Lagringstid |
|---|---|---|---|---|---|---|---|
| 1 | Konto och inloggning | Ge tillgång till tjänsten | Jobbsökare, rekryterare | E-post, lösenord (hash), namn, roll | Avtal (6.1 b) | Supabase | Tills kontot raderas |
| 2 | Profil | Visa vem man är för motparten | Jobbsökare, rekryterare | Profilbild, rubrik, ort, presentation, webbplats | Avtal (6.1 b) | Supabase, rekryterare med koppling | Tills kontot raderas |
| 3 | CV-analys | Ta fram kompetenser för matchning | Jobbsökare | CV-fil, CV-text, kompetenser, erfarenhet, utbildning, språk, AI-sammanfattning | Avtal (6.1 b) | Supabase, Anthropic | Tills CV:t eller kontot raderas |
| 4 | Matchning och rangordning | Ge rekryteraren ett förklarat underlag | Jobbsökare som sökt | Kompetenser, erfarenhet, AI-sammanfattning, poäng, motivering, kompetensgap (namn skickas inte till AI:n) | Avtal (6.1 b) | Anthropic, rekryteraren | Tills ansökan eller kontot raderas |
| 5 | Ansökningar | Förmedla ansökan till rekryterare | Jobbsökare | Telefon, personligt brev, tillgänglighet, löneanspråk, status | Avtal (6.1 b) | Rekryteraren, Resend (notismejl) | Tills ansökan eller kontot raderas |
| 6 | Talangpool | Låta rekryterare hitta kandidater | Jobbsökare som samtyckt | Profil och CV-uppgifter enligt integritetspolicyn punkt 5 | Samtycke (6.1 a) | Alla inloggade rekryterare | Tills samtycket återkallas |
| 7 | Rekryterarens arbete | Stödja rekryteraren i processen | Jobbsökare som sökt | Anteckningar, intervjubokningar, intervjubedömningar | Avtal (6.1 b), rekryteraren är själv ansvarig för innehållet | Rekryteraren | Tills kontot raderas |
| 8 | Meddelanden och notiser | Kommunikation i tjänsten | Båda | Meddelandeinnehåll, notiser | Avtal (6.1 b) | Motparten, Resend | Tills kontot raderas |
| 9 | Rättviseanalys | Upptäcka systematisk snedvridning | Jobbsökare som samtyckt | Kön, födelseår | Samtycke (6.1 a) | Ingen på individnivå | Tills samtycket återkallas |
| 10 | AI-beslutslogg | Spårbarhet enligt AI-förordningen art. 12 | Jobbsökare | Beslutstyp, poäng, kompetenser in och ut, sammanfattning, modell, mänsklig justering | Berättigat intresse (6.1 f) | Den registrerade, rekryteraren som utlöste beslutet | Tills kontot raderas (se öppen fråga nedan) |
| 11 | Karriärcoach | Ge råd till jobbsökaren | Jobbsökare | Det användaren skriver, profil, ansökningar | Avtal (6.1 b) | Anthropic | Sparas inte hos oss, bara i webbläsaren |
| 12 | Drift och säkerhet | Skydda tjänsten mot missbruk | Alla besökare | IP-adress, tekniska loggar | Berättigat intresse (6.1 f) | Vercel, Supabase | Enligt leverantörens loggtid |

## Personuppgiftsbiträden

| Leverantör | Uppgift | Plats | Överföringsgrund | Avtal godkänt |
|---|---|---|---|---|
| Supabase | Databas, inloggning, fillagring | Irland (EU) | Inom EU | [ ] |
| Anthropic | AI-modellen Claude | USA | Standardavtalsklausuler i DPA | [ ] |
| Vercel | Drift av webbplatsen | USA, global | Standardavtalsklausuler / DPF | [ ] |
| Resend | E-post | USA | Standardavtalsklausuler i DPA | [ ] |

## Säkerhetsåtgärder (art. 32)

- All trafik över HTTPS med HSTS, säkerhetshuvuden och CSP.
- Radnivåsäkerhet i databasen och kolumnbegränsade skrivrättigheter (migrationerna 0016–0024).
- AI-fält skrivs bara av servern. Användartext märks som data i alla AI-prompter.
- CV-filer i privat lagring, nås bara via kortlivade signerade länkar efter behörighetskontroll.
- Bekräftelse av e-post vid registrering.

## Öppna frågor

- AI-förordningen art. 19 kräver att loggar sparas i minst sex månader, men loggen raderas i dag med kontot. Lösning att utreda: pseudonymisera loggposten vid radering i stället för att ta bort den.
- Ska rekryterarens anteckningar och intervjubedömningar om en kandidat ingå i kandidatens dataexport? De är personuppgifter om kandidaten men också rekryterarens arbetsmaterial.
