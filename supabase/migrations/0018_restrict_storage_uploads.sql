-- 0018_restrict_storage_uploads.sql
--
-- avatars och logos är publika buckets utan begränsning av filtyp eller storlek.
-- Uppladdning sker direkt från klienten, så vem som helst med ett konto kunde lägga
-- upp HTML, SVG med JavaScript eller körbara filer som sedan serveras publikt från
-- projektets Supabase-domän (phishing, spridning av skadlig kod, lagringskostnad).
-- SVG tillåts medvetet inte: formatet kan bära skript och är en känd attackyta i
-- bildoptimering. Gränserna kontrolleras av Storage oavsett vad klienten skickar.

update storage.buckets
set file_size_limit = 5242880, -- 5 MB
    allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp']
where id in ('avatars', 'logos');

update storage.buckets
set file_size_limit = 10485760, -- 10 MB
    allowed_mime_types = array['application/pdf', 'text/plain']
where id = 'cvs';
