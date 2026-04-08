-- Public audio bucket for survival module steps (seeded MP3s)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'survival-audio',
  'survival-audio',
  true,
  52428800,
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/ogg']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Anonymous + authenticated clients can read (mobile app uses anon key)
CREATE POLICY "survival_audio_select_public"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'survival-audio');
