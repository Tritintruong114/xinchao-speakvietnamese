-- Display order for dashboard / library (avoid reserved word "order")
ALTER TABLE public.survival_modules
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS survival_modules_sort_order_idx
  ON public.survival_modules (sort_order);
