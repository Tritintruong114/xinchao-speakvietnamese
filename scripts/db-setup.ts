import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setupDatabase() {
  console.log("🚀 Starting database setup...");
  const sql = `
    CREATE TABLE IF NOT EXISTS public.survival_modules (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT, image_url TEXT, steps JSONB NOT NULL DEFAULT '[]', created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS public.vocabulary (
      id TEXT PRIMARY KEY, phrase TEXT NOT NULL, translation TEXT NOT NULL, audio_url TEXT, tags TEXT[] DEFAULT '{}', created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS public.dialogues (
      id TEXT PRIMARY KEY, speaker TEXT, text TEXT, tip TEXT, next_id TEXT, options JSONB, time_limit INT, timeout_id TEXT, audio_uri TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  const { error } = await supabase.rpc('exec_sql', { query: sql });
  if (error) console.error("Error setting up DB:", error);
  else console.log("✅ Tables created successfully!");
}

setupDatabase();
