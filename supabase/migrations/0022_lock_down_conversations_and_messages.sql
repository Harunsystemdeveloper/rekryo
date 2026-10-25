-- 0022_lock_down_conversations_and_messages.sql
--
-- 1) conversations: INSERT-policyn krävde bara att den inloggade var en av parterna, så
--    vem som helst kunde skapa en konversation med valfri motpart. Eftersom
--    recruiter_can_view_seeker (0016) ger rekryteraren läsrätt till profilen så fort en
--    konversation finns, räckte ett känt användar-id för att kringgå samtycket till
--    talangpoolen och dessutom skicka oönskade meddelanden. Konversationer skapas nu
--    bara av servern via ensureConversation (src/lib/conversations.ts) och
--    /api/candidate-invites, efter kontroll av ansökan eller samtycke.
--
-- 2) UPDATE-policyn på conversations saknade with check och gällde alla kolumner, så en
--    part kunde byta ut motparten (recruiter_id/seeker_id) och lägga in konversationen i
--    någon annans inkorg. Inloggade får nu bara uppdatera last_message_at.
--
-- 3) UPDATE-policyn på messages ("mark read") gällde alla kolumner, så en part kunde
--    skriva om innehållet i den andras meddelanden. Inloggade får nu bara sätta read_at.

drop policy if exists "Participants can create conversations they're part of" on conversations;
revoke insert on conversations from anon, authenticated;

revoke update on conversations from anon, authenticated;
grant update (last_message_at) on conversations to authenticated;

revoke update on messages from anon, authenticated;
grant update (read_at) on messages to authenticated;
