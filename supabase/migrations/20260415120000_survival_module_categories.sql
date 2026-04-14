-- Dashboard-managed categories; survival_modules.category references name (ON UPDATE CASCADE).

CREATE TABLE IF NOT EXISTS public.survival_module_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS survival_module_categories_sort_order_idx
  ON public.survival_module_categories (sort_order);

ALTER TABLE public.survival_module_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read survival module categories" ON public.survival_module_categories;
CREATE POLICY "Public read survival module categories"
  ON public.survival_module_categories FOR SELECT USING (true);

INSERT INTO public.survival_module_categories (name, sort_order) VALUES
  ('Beginner', 0),
  ('Survival', 1),
  ('Legend', 2)
ON CONFLICT (name) DO NOTHING;

ALTER TABLE public.survival_modules DROP CONSTRAINT IF EXISTS survival_modules_category_check;

ALTER TABLE public.survival_modules
  ADD CONSTRAINT survival_modules_category_fkey
  FOREIGN KEY (category) REFERENCES public.survival_module_categories (name)
  ON UPDATE CASCADE
  ON DELETE RESTRICT;
