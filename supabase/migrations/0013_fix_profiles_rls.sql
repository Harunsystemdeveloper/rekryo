-- 0013_fix_profiles_rls.sql
--
-- KRITISK FIX: tabellen "profiles" hade ingen Row Level Security alls. Eftersom
-- NEXT_PUBLIC_SUPABASE_ANON_KEY är publik (ligger i varje webbläsarbundle) betydde
-- detta att VEM SOM HELST på internet — utan konto, utan inloggning — kunde läsa
-- alla jobbsökares fullständiga namn, bio, plats och rubrik direkt via Supabase
-- REST API, helt förbi appens egna inloggningskontroll. Bekräftat live 2026-09-13.
--
-- Rekryterare behöver fortfarande kunna se jobbsökares profiler på två ställen
-- utan att gå via service-role-klienten:
--   - recruiter/jobs/[id]/candidates: "föreslagna kandidater som inte sökt än"
--     (matchar CV-kompetenser mot jobbets krav)
-- Talangpoolen (recruiter/talent-pool) går redan via createAdminClient() och
-- kringgår RLS helt, så den påverkas inte av denna åtstramning.
--
-- Rekryterares egna profiler ska fortfarande vara publikt läsbara (samma princip
-- som company_profiles) eftersom de är kopplade till publika jobbannonser.

alter table profiles enable row level security;

-- Alla kan läsa sin egen fullständiga profil.
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Alla kan läsa rekryterares profiler (kopplade till publika jobbannonser/företag).
drop policy if exists "Recruiter profiles are public" on profiles;
create policy "Recruiter profiles are public"
  on profiles for select
  using (user_type = 'recruiter');

-- Hjälpfunktion: hämtar inloggad användares user_type utan att trigga RLS
-- rekursivt (Supabase-rekommenderat mönster för självrefererande policies).
create or replace function public.current_user_type()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select user_type from profiles where id = auth.uid()
$$;

-- Rekryterare (och bara rekryterare) kan läsa jobbsökares profiler.
drop policy if exists "Recruiters can view job seeker profiles" on profiles;
create policy "Recruiters can view job seeker profiles"
  on profiles for select
  using (
    user_type = 'job_seeker'
    and public.current_user_type() = 'recruiter'
  );

-- Alla kan uppdatera/skapa sin egen profil (oförändrat beteende, men explicit nu
-- när RLS är på — utan detta skulle t.ex. onboarding sluta fungera).
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Krävs av /api/gdpr/delete, som raderar profilraden direkt via den vanliga
-- klienten (CASCADE tar sedan bort resten av användarens data).
drop policy if exists "Users can delete own profile" on profiles;
create policy "Users can delete own profile"
  on profiles for delete
  using (auth.uid() = id);
