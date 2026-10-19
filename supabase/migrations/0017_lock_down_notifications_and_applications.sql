-- 0017_lock_down_notifications_and_applications.sql
--
-- 1) notifications: policyn "Service role can insert notifications" hade
--    `with check (true)` men ingen `to service_role` — den gällde därför ALLA roller,
--    även anonyma. Vem som helst kunde med den publika anon-nyckeln skapa notiser med
--    valfri titel/text/länk hos valfri användare (phishing). Nu kan bara service role
--    skriva; routerna skapar notiser via createAdminClient() efter egen behörighetskontroll.
drop policy if exists "Service role can insert notifications" on notifications;
create policy "Service role can insert notifications"
  on notifications for insert
  to service_role
  with check (true);

-- 2) applications: rekryterarens UPDATE-policy gällde hela raden, så match_score,
--    ai_summary, skill_gaps m.m. kunde ändras direkt via anon-nyckeln — förbi
--    /api/applications/override-score och dess obligatoriska motivering + AI-logg
--    (AI-förordningen art. 14). Inloggade användare får nu bara ändra status direkt;
--    AI-fält och poäng skrivs enbart av servern med service role efter ägarskapskontroll.
revoke update on applications from anon, authenticated;
grant update (status, updated_at) on applications to authenticated;
