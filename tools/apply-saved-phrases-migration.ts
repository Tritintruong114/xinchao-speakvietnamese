/**
 * Apply supabase/migrations/20260410120000_saved_phrases.sql using a direct Postgres connection.
 *
 * Requires in apps/landing-web/.env (or env):
 *   SUPABASE_URL=https://<ref>.supabase.co
 *   SUPABASE_DB_PASSWORD=<Database password from Supabase → Settings → Database>
 */

import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

config({ path: path.join(root, 'apps/landing-web/.env') });
config({ path: path.join(root, '.env') });

function projectRefFromSupabaseUrl(url: string): string {
  const host = new URL(url).hostname;
  const sub = host.replace(/\.supabase\.co$/i, '');
  if (!sub || sub.includes('.')) {
    throw new Error('Could not parse project ref from SUPABASE_URL');
  }
  return sub;
}

async function main() {
  const url = process.env.SUPABASE_URL?.trim();
  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  if (!url) {
    console.error('Missing SUPABASE_URL');
    process.exit(1);
  }
  if (!password) {
    console.error(
      'Missing SUPABASE_DB_PASSWORD. In Supabase Dashboard → Project Settings → Database → copy the database password, then add:\n' +
        '  SUPABASE_DB_PASSWORD=...  to apps/landing-web/.env',
    );
    process.exit(1);
  }

  const ref = projectRefFromSupabaseUrl(url);
  const host = `db.${ref}.supabase.co`;
  const sqlPath = path.join(root, 'supabase/migrations/20260410120000_saved_phrases.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const client = new pg.Client({
    host,
    port: 5432,
    user: 'postgres',
    password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    await client.query(sql);
    console.log('Migration applied: saved_phrases table + RLS policy.');
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
