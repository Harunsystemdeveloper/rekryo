-- 0020_lock_down_application_inserts.sql
--
-- 0017 begränsade UPDATE på applications, men INSERT gällde fortfarande alla kolumner.
-- En inloggad jobbsökare kunde därför skapa en ansökan direkt via REST-API:t med eget
-- match_score, egen ai_summary, egna skill_gaps och valfri status (t.ex. 'shortlisted').
-- Rekryterarens kandidatlista sorteras på match_score, så den förfalskade ansökan hamnade
-- överst med en påhittad AI-motivering. Kraven i /api/applications/create (analyserat CV,
-- telefon, personligt brev) och mejlet till rekryteraren kringgicks samtidigt.
--
-- Inloggade användare får nu bara ange jobb, sig själva som sökande och personligt brev.
-- status får sitt defaultvärde ('pending'), och AI-fälten skrivs bara av servern.
-- Policyn kräver dessutom att den sökande är jobbsökare och att jobbet är aktivt, så att
-- man inte kan söka pausade eller stängda jobb förbi gränssnittet.

revoke insert on applications from anon, authenticated;
grant insert (job_id, seeker_id, cover_letter) on applications to authenticated;

drop policy if exists "Seekers can insert own applications" on applications;
create policy "Seekers can insert own applications"
  on applications for insert
  to authenticated
  with check (
    seeker_id = auth.uid()
    and public.current_user_type() = 'job_seeker'
    and exists (select 1 from jobs where jobs.id = applications.job_id and jobs.status = 'active')
  );
