-- 0014_remove_legacy_profiles_policies.sql
--
-- 0013 lade på rätt policies, men läckan bestod — därför att RLS-policies i
-- Postgres OR:as ihop (permissiva policies). Tre gamla policies låg kvar sedan
-- profiles-tabellen tydligen konfigurerades direkt i Supabase Dashboard för
-- länge sen, helt utanför migrationshistoriken, och gjorde 0013 verkningslös:
--
--   "Profiles are viewable by everyone"  SELECT  qual: true
--     → släppte igenom HELT ANONYMA requests (huvudorsaken till läckan)
--   "read_all"                            SELECT  qual: auth.uid() IS NOT NULL
--     → lät VILKEN inloggad användare som helst (även andra jobbsökare) se allas profiler
--   "read_authenticated"                  SELECT  qual: auth.uid() IS NOT NULL
--     → exakt samma problem, en duplett av read_all
--
-- Bekräftat live 2026-09-13 att dessa tre var de faktiska orsakerna: efter att
-- 0013 kördes kunde jobbsökares fulla namn/bio/plats fortfarande läsas anonymt.

drop policy if exists "Profiles are viewable by everyone" on profiles;
drop policy if exists "read_all" on profiles;
drop policy if exists "read_authenticated" on profiles;

-- Överflödig duplett av "Users can update own profile" från 0013 (samma villkor,
-- ofarlig men onödig — städas bort för tydlighetens skull).
drop policy if exists "update_own" on profiles;
