-- Pocket / saved phrases for mobile offline sync (dashboard CRUD + anon read)
CREATE TABLE IF NOT EXISTS public.saved_phrases (
  id TEXT PRIMARY KEY,
  vietnamese TEXT NOT NULL,
  english TEXT NOT NULL,
  audio_url TEXT,
  categories TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_bookmarked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS saved_phrases_sort_order_idx ON public.saved_phrases (sort_order);

ALTER TABLE public.saved_phrases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read saved phrases" ON public.saved_phrases FOR SELECT USING (true);
