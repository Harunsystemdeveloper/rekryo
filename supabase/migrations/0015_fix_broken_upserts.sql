-- 0015_fix_broken_upserts.sql
--
-- KRITISK FIX: Flera ställen i appen sparar data med .upsert() utan att ange
-- vilken kolumn som avgör en "konflikt" (onConflict). Utan det matchar Postgres
-- bara mot primärnyckeln (id) — som aldrig skickas med i dessa anrop — så varje
-- "uppdatering" blev istället ett nytt INSERT-försök.
--
-- Bekräftat live 2026-09-14 genom att återskapa exakt samma anrop som klienten
-- gör: cv_profiles-uppdateringen från /api/ai/analyze-cv misslyckades tyst med
-- "duplicate key value violates unique constraint cv_profiles_seeker_id_key"
-- (23505/409) eftersom seeker_id redan hade en rad men koden matchade mot id.
-- Felet loggades aldrig, så AI-analysen visades som lyckad i gränssnittet medan
-- ingenting sparades i databasen. Samma buggmönster fanns i tre filer till,
-- se motsvarande kodfix i samma commit.
--
-- company_profiles hade dessutom inte ens en unik begränsning på recruiter_id,
-- så även med rätt kod i klienten skulle upsert misslyckats — varje sparning av
-- företagsprofilen (t.ex. redigering efter onboarding) hade skapat en NY rad
-- istället för att uppdatera den befintliga, vilket i sin tur får alla ställen
-- som läser företagsprofilen med .single() att börja krascha så fort en
-- rekryterare sparar sin företagsprofil mer än en gång.

alter table company_profiles
  add constraint company_profiles_recruiter_id_key unique (recruiter_id);
