-- 0023_restrict_seeker_updates.sql
--
-- 1) interview_schedules: policyn "Seeker can confirm interview" gällde alla kolumner, så
--    kandidaten kunde ändra möteslänk, plats, föreslagna tider, anteckningar och till och
--    med recruiter_id. Rekryteraren och kandidaten delar databasrollen authenticated, och
--    rekryterarens upsert i /api/interview-schedule behöver alla kolumner, så kolumn-
--    rättigheter räcker inte. En trigger låter i stället kandidaten bara bekräfta en tid
--    eller avboka. Service role (auth.uid() är null) och rekryteraren påverkas inte.
--
-- 2) candidate_invites: policyn för kandidatens spårning gällde alla kolumner, så
--    kandidaten kunde byta recruiter_id eller job_id på en inbjudan. Inbjudningar skapas
--    av rekryteraren och uppdateras bara av /api/candidate-invites/track, så inloggade
--    får nu bara sätta opened_at och responded_at.

create or replace function public.restrict_seeker_interview_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null and auth.uid() = old.seeker_id and auth.uid() is distinct from old.recruiter_id then
    if (new.application_id, new.recruiter_id, new.seeker_id, new.proposed_times, new.location, new.meeting_link, new.notes)
       is distinct from
       (old.application_id, old.recruiter_id, old.seeker_id, old.proposed_times, old.location, old.meeting_link, old.notes)
    then
      raise exception 'Kandidaten får bara bekräfta eller avboka en intervju' using errcode = '42501';
    end if;
    if new.status not in ('confirmed', 'cancelled') then
      raise exception 'Ogiltig status för kandidaten' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists interview_schedules_restrict_seeker on interview_schedules;
create trigger interview_schedules_restrict_seeker
  before update on interview_schedules
  for each row execute function public.restrict_seeker_interview_update();

revoke update on candidate_invites from anon, authenticated;
grant update (opened_at, responded_at) on candidate_invites to authenticated;
