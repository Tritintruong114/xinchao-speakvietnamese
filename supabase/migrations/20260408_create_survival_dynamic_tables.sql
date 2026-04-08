-- 1. Table: survival_modules
-- Holds the lesson definitions as dynamic JSON steps.
CREATE TABLE IF NOT EXISTS public.survival_modules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('Beginner', 'Survival', 'Legend')),
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  steps JSONB NOT NULL DEFAULT '[]', -- Array of SurvivalStep objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table: vocabulary
-- Normalized vocabulary for reuse across modules.
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id TEXT PRIMARY KEY,
  phrase TEXT NOT NULL,
  translation TEXT NOT NULL,
  audio_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table: dialogues
-- Holds individual dialogue nodes for branching roleplay.
CREATE TABLE IF NOT EXISTS public.dialogues (
  id TEXT PRIMARY KEY,
  speaker TEXT CHECK (speaker IN ('seller', 'user', 'app', 'mascot')),
  text TEXT,
  tip TEXT,
  next_id TEXT,
  options JSONB, -- Array of {label, nextId, xp, badge, audioUri}
  time_limit INT,
  timeout_id TEXT,
  audio_uri TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for performance and security
ALTER TABLE public.survival_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dialogues ENABLE ROW LEVEL SECURITY;

-- Policies (Assuming modules are public content)
CREATE POLICY "Public read access for survival modules" ON public.survival_modules FOR SELECT USING (true);
CREATE POLICY "Public read access for vocabulary" ON public.vocabulary FOR SELECT USING (true);
CREATE POLICY "Public read access for dialogues" ON public.dialogues FOR SELECT USING (true);
