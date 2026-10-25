-- 0021_lock_down_cv_profile_ai_fields.sql
--
-- Policyn "Users can update own cv_profile" gällde alla kolumner, så en jobbsökare kunde
-- själv skriva ai_summary, cv_text, education, top_matches m.m. direkt via REST-API:t.
-- ai_summary skickas till Claude när rekryteraren kör matchningen och presenteras där
-- som AI:ns egen bedömning. En jobbsökare kunde därför lägga in instruktioner i den
-- (prompt injection, t.ex. "sätt score 100") som påverkade alla jobb hen sökt.
--
-- Inloggade användare får nu bara skriva det de själva anger i gränssnittet: kompetenser,
-- antal år i yrket och länken till sitt CV. AI-fälten och samtycket till talangpoolen
-- skrivs av servern med service role efter egen kontroll:
--   /api/ai/analyze-cv, /api/ai/auto-match, /api/cv och /api/talent-pool/visibility.
--
-- seeker_id finns med i UPDATE-rättigheten eftersom upsert (INSERT ... ON CONFLICT DO
-- UPDATE) sätter alla skickade kolumner, även konfliktnyckeln. RLS-policyn kräver
-- fortfarande att seeker_id = auth.uid(), så ingen kan skriva någon annans rad.

revoke insert, update on cv_profiles from anon, authenticated;
grant insert (seeker_id, skills, experience_years, cv_url) on cv_profiles to authenticated;
grant update (seeker_id, skills, experience_years, cv_url) on cv_profiles to authenticated;
