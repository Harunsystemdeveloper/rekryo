-- 0016_talent_pool_consent.sql
--
-- GDPR: Talangpoolen visade tidigare ALLA jobbsökare med en cv_profiles-rad för
-- ALLA rekryterare, utan att jobbsökaren valt det — trots att landningssidans FAQ
-- lovar att bara kandidater som "valt att vara synliga" syns där. Att bli sökbar för
-- rekryterare man inte själv sökt jobb hos är en separat behandling som kräver ett
-- aktivt, frivilligt och återkalleligt samtycke (art. 6.1 a, art. 7) och ska vara
-- avstängt som standard (inbyggt dataskydd, art. 25).
--
-- Befintliga användare får false — de har aldrig gett något samtycke, så de måste
-- själva slå på synligheten under Inställningar → Integritet & GDPR.

alter table cv_profiles
  add column if not exists talent_pool_visible boolean not null default false,
  add column if not exists talent_pool_consent_at timestamptz;

create index if not exists cv_profiles_talent_pool_visible_idx
  on cv_profiles (talent_pool_visible) where talent_pool_visible;

-- Dataminimering: policyn från 0013 lät VILKEN rekryterare som helst läsa VILKEN
-- jobbsökares profil som helst via den publika anon-nyckeln, oavsett koppling.
-- Nu krävs en faktisk anledning: kandidaten har sökt ett av rekryterarens jobb,
-- har en pågående konversation med rekryteraren, eller har själv valt att synas
-- i talangpoolen. Security definer behövs för att slå upp applications/jobs/
-- conversations/cv_profiles utan att trigga deras egna RLS-policies rekursivt.
create or replace function public.recruiter_can_view_seeker(seeker uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select
    exists (
      select 1 from applications a
      join jobs j on j.id = a.job_id
      where a.seeker_id = seeker and j.recruiter_id = auth.uid()
    )
    or exists (
      select 1 from conversations c
      where c.seeker_id = seeker and c.recruiter_id = auth.uid()
    )
    or exists (
      select 1 from cv_profiles cv
      where cv.seeker_id = seeker and cv.talent_pool_visible
    )
$$;

drop policy if exists "Recruiters can view job seeker profiles" on profiles;
create policy "Recruiters can view job seeker profiles"
  on profiles for select
  using (
    user_type = 'job_seeker'
    and public.current_user_type() = 'recruiter'
    and public.recruiter_can_view_seeker(id)
  );
