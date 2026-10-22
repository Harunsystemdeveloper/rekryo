-- 0019_lock_down_ai_decision_logs.sql
--
-- ai_decision_logs är granskningsloggen för AI-beslut (AI-förordningen art. 12) och
-- måste gå att lita på. Två policies från 20240120_ai_audit_logs.sql gjorde det inte:
--
-- 1) "Service role can insert logs" hade `with check (true)` men ingen `to service_role`,
--    samma fel som 0017 rättade för notifications. Den gällde därför alla roller, även
--    anon, så vem som helst med den publika anon-nyckeln kunde skapa falska loggposter
--    om valfri användare, t.ex. påhittade manuella överstyrningar.
-- 2) "Recruiters can mark logs as reviewed" tillät UPDATE av alla kolumner, så en
--    rekryterare kunde i efterhand skriva om poäng och motivering i sina egna loggar.
--
-- All loggning sker redan med service role (src/lib/ai/audit-log.ts och
-- /api/applications/override-score), och ingen kod uppdaterar loggar i efterhand.
-- Inloggade användare får fortsatt läsa sina egna loggar. Radering vid GDPR-begäran
-- sker via ON DELETE CASCADE och påverkas inte av rättigheterna nedan.

drop policy if exists "Service role can insert logs" on ai_decision_logs;
create policy "Service role can insert logs"
  on ai_decision_logs for insert
  to service_role
  with check (true);

drop policy if exists "Recruiters can mark logs as reviewed" on ai_decision_logs;

revoke insert, update, delete on ai_decision_logs from anon, authenticated;
