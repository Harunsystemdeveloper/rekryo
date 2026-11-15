-- 0024_lock_down_roles.sql
--
-- 1) profiles: policyn "Users can update own profile" gällde alla kolumner, så en inloggad
--    användare kunde själv byta user_type via REST-API:t, t.ex. från jobbsökare till
--    rekryterare. Det kringgår varje framtida kontroll av rekryterare. Gränssnittet
--    uppdaterar bara namn, rubrik, ort, presentation, webbplats, profilbild och
--    onboardingstatus, så bara de kolumnerna får skrivas av inloggade. Rollen sätts vid
--    registreringen (handle_new_user) och kan bara ändras av servern med service role.
--    Profilen skapas av triggern, så inloggade behöver inte heller kunna lägga till rader.
--
-- 2) jobs: INSERT-policyn krävde bara recruiter_id = auth.uid(), så även en jobbsökare
--    kunde publicera annonser direkt via REST-API:t, förbi /api/jobs/create. En restriktiv
--    policy kräver nu rollen rekryterare. Restriktiva policies gäller tillsammans med alla
--    andra (AND), så de skyddar även om äldre policies från Supabase-panelen finns kvar.
--
-- 3) candidate_notes: anteckningar är personuppgifter om kandidaten. Utöver kontrollen i
--    /api/candidate-notes kräver databasen nu samma koppling som för att se profilen:
--    ansökan, konversation eller synlighet i talangpoolen (recruiter_can_view_seeker, 0016).

revoke update on profiles from anon, authenticated;
grant update (full_name, headline, location, bio, website, avatar_url, onboarding_complete, updated_at)
  on profiles to authenticated;
revoke insert on profiles from anon, authenticated;

drop policy if exists "Only recruiters can create jobs" on jobs;
create policy "Only recruiters can create jobs"
  on jobs as restrictive for insert
  to authenticated
  with check (public.current_user_type() = 'recruiter');

drop policy if exists "Notes only about connected candidates" on candidate_notes;
create policy "Notes only about connected candidates"
  on candidate_notes as restrictive for insert
  to authenticated
  with check (
    public.current_user_type() = 'recruiter'
    and public.recruiter_can_view_seeker(seeker_id)
  );
