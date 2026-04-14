-- Public image bucket for survival module cover art (dashboard ingest + mobile)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'survival-images',
  'survival-images',
  true,
  6291456,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "survival_images_select_public" ON storage.objects;
CREATE POLICY "survival_images_select_public"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'survival-images');
