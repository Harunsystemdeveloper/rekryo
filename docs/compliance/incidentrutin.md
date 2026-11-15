# Rutin för personuppgiftsincidenter (GDPR art. 33–34)

Senast uppdaterad: 2026-11-16.

En personuppgiftsincident är när personuppgifter av misstag eller olagligt förstörs, förloras, ändras, sprids eller blir åtkomliga för obehöriga. Exempel: en läckt API-nyckel, en databasregel som visar andras CV:n, ett hackat konto som används för att läsa kandidater, eller ett mejl till fel mottagare.

## 1. Upptäck och stoppa (direkt)

1. Notera tid, vad som har hänt och hur det upptäcktes.
2. Stoppa läckan:
   - **Läckt nyckel:** rotera den direkt i Supabase, Anthropic eller Resend och uppdatera den i Vercel. Gör en ny deploy.
   - **Felaktig databasregel:** rätta regeln i Supabase SQL Editor, eller stäng av funktionen.
   - **Komprometterat konto:** spärra kontot i Supabase → Authentication → Users.
3. Spara bevis: Vercel-loggar, Supabase-loggar och skärmdumpar, innan de skrivs över.

## 2. Bedöm (inom 24 timmar)

- Vilka uppgifter, hur många personer och vilka kategorier (jobbsökare, rekryterare)?
- Är det sannolikt att incidenten medför en risk för personerna? Om **nej**: dokumentera bara. Om **ja**: anmäl till IMY.
- Är risken **hög**, till exempel om CV:n eller känsliga uppgifter har spridits: informera också de drabbade.

## 3. Anmäl till IMY (senast 72 timmar efter upptäckt)

- Anmälan görs via IMY:s e-tjänst på imy.se.
- Har inte allt hunnit utredas anmäls det som är känt, och resten kompletteras senare.

## 4. Informera de drabbade (vid hög risk, utan onödigt dröjsmål)

Mejlet ska på klart språk beskriva vad som har hänt, vilka uppgifter som berörs, vad som har gjorts och vad personen själv kan göra (t.ex. byta lösenord, vara uppmärksam på bedrägeriförsök), samt kontaktadressen.

## 5. Dokumentera och förbättra

Alla incidenter dokumenteras, även de som inte anmäls: datum, vad som hände, påverkade uppgifter, bedömning, åtgärder och om anmälan gjordes.

| Datum | Vad hände | Uppgifter och antal | Risk | Åtgärder | Anmäld till IMY | Drabbade informerade |
|---|---|---|---|---|---|---|
| | | | | | | |
