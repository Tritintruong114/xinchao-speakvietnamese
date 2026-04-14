-- Idempotent: works when survival_modules never existed (no prior migrations applied),
-- or when the table exists but is missing columns (legacy setup-db).

CREATE TABLE IF NOT EXISTS public.survival_modules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('Beginner', 'Survival', 'Legend')),
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  steps JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.survival_modules
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.survival_modules
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS survival_modules_sort_order_idx ON public.survival_modules (sort_order);

ALTER TABLE public.survival_modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for survival modules" ON public.survival_modules;
CREATE POLICY "Public read access for survival modules" ON public.survival_modules FOR SELECT USING (true);

-- App upserts do not send updated_at; refresh on UPDATE when the column exists.
CREATE OR REPLACE FUNCTION public.set_survival_modules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_survival_modules_updated_at ON public.survival_modules;
CREATE TRIGGER trg_survival_modules_updated_at
  BEFORE UPDATE ON public.survival_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.set_survival_modules_updated_at();
