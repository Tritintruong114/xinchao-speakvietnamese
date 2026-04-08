import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS public.survival_modules (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT CHECK (category IN ('Beginner', 'Survival', 'Legend')),
      image_url TEXT,
      steps JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.vocabulary (
      id TEXT PRIMARY KEY,
      phrase TEXT NOT NULL,
      translation TEXT NOT NULL,
      audio_url TEXT,
      tags TEXT[] DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.dialogues (
      id TEXT PRIMARY KEY,
      speaker TEXT CHECK (speaker IN ('seller', 'user', 'app', 'mascot')),
      text TEXT,
      tip TEXT,
      next_id TEXT,
      options JSONB,
      time_limit INT,
      timeout_id TEXT,
      audio_uri TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const { error } = await supabase.rpc("exec_sql", { query: sql });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Tables created successfully" }), {
    status: 200,
  });
});
