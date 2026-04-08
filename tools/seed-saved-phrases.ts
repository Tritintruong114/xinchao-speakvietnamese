/**
 * Seed Pocket phrases from apps/mobile/constants/survival/saved_phrases.ts:
 * upload real MP3s to survival-audio, upsert public.saved_phrases.
 *
 * Run: pnpm seed:pocket
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (landing or mobile .env)
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  SAVED_PHRASES_TABLE,
  type SavedPhrase,
  type SavedPhraseInput,
  savedPhraseInputToRow,
} from '@xinchao/shared';
import { config } from 'dotenv';
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SEED_PREFIX = '__SEED_FILE__:';
const BUCKET = 'survival-audio';

config({ path: path.join(root, '.env') });
config({ path: path.join(root, 'apps/mobile/.env') });
config({ path: path.join(root, 'apps/landing-web/.env') });

function seedBundlePlugin(): esbuild.Plugin {
  return {
    name: 'seed-pocket-audio',
    setup(build) {
      build.onResolve({ filter: /\.(png|jpe?g|gif|webp)$/i }, () => ({
        path: 'virtual-image-stub',
        namespace: 'image-stub',
      }));
      build.onLoad({ filter: /.*/, namespace: 'image-stub' }, () => ({
        contents: 'module.exports = null;',
        loader: 'js',
      }));

      build.onResolve({ filter: /\.(mp3|m4a|wav|ogg)$/i }, (args) => {
        const resolved = path.isAbsolute(args.path)
          ? args.path
          : path.resolve(path.dirname(args.importer), args.path);
        return { path: resolved, namespace: 'audio-seed' };
      });
      build.onLoad({ filter: /.*/, namespace: 'audio-seed' }, (args) => {
        const rel = path.relative(root, args.path).replace(/\\/g, '/');
        if (rel.startsWith('..')) throw new Error(`Audio outside repo: ${args.path}`);
        return {
          contents: `module.exports = ${JSON.stringify(`${SEED_PREFIX}${rel}`)};`,
          loader: 'js',
        };
      });
    },
  };
}

function contentTypeForExt(file: string): string {
  const e = path.extname(file).toLowerCase();
  if (e === '.mp3') return 'audio/mpeg';
  if (e === '.wav') return 'audio/wav';
  if (e === '.m4a') return 'audio/mp4';
  if (e === '.ogg') return 'audio/ogg';
  return 'application/octet-stream';
}

/** Path under bucket for Pocket seed audio */
function pocketObjectPath(phraseId: string, absFile: string): string {
  const ext = path.extname(absFile).toLowerCase() || '.mp3';
  const safeId = phraseId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64) || 'phrase';
  return `pocket/seed/${safeId}-${randomUUID().slice(0, 8)}${ext}`;
}

const AUDIO_MIME = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/ogg',
];

async function ensureSurvivalAudioBucket(client: SupabaseClient): Promise<void> {
  const { data, error } = await client.storage.getBucket(BUCKET);
  if (!error && data) return;

  const created = await client.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 52428800,
    allowedMimeTypes: AUDIO_MIME,
  });
  if (created.error) {
    const msg = created.error.message ?? '';
    if (!/already exists|Duplicate|422/i.test(msg)) {
      throw new Error(`Storage bucket ${BUCKET}: ${created.error.message}`);
    }
  } else {
    console.log(`  (created Storage bucket “${BUCKET}”)`);
  }
}

async function loadSavedPhrasesFromBundle(): Promise<SavedPhrase[]> {
  const cacheDir = path.join(__dirname, '.cache');
  fs.mkdirSync(cacheDir, { recursive: true });
  const outfile = path.join(cacheDir, 'pocket-seed-bundle.cjs');

  await esbuild.build({
    absWorkingDir: root,
    entryPoints: [path.join(root, 'apps/mobile/constants/survival/saved_phrases.ts')],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node20',
    logLevel: 'warning',
    plugins: [seedBundlePlugin()],
  });

  const require = createRequire(import.meta.url);
  const mod = require(outfile) as { SAVED_PHRASES: SavedPhrase[] };
  if (!Array.isArray(mod.SAVED_PHRASES)) {
    throw new Error('Bundle did not export SAVED_PHRASES array');
  }
  return mod.SAVED_PHRASES;
}

async function resolveAudioUrl(
  phrase: SavedPhrase,
  uploadFile: (repoRel: string, phraseId: string) => Promise<string>,
): Promise<string | null> {
  const raw = phrase.audioUri;
  if (raw == null || raw === '') return null;
  if (typeof raw === 'number') return null;
  const s = String(raw).trim();
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith(SEED_PREFIX)) {
    const rel = s.slice(SEED_PREFIX.length);
    return uploadFile(rel, phrase.id);
  }
  return null;
}

async function main() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log('Ensuring Storage bucket…');
  await ensureSurvivalAudioBucket(client);

  const urlCache = new Map<string, string>();
  const uploadFile = async (repoRel: string, phraseId: string): Promise<string> => {
    if (urlCache.has(repoRel)) return urlCache.get(repoRel)!;
    const abs = path.join(root, repoRel);
    if (!fs.existsSync(abs)) throw new Error(`Missing audio: ${abs}`);
    const buf = fs.readFileSync(abs);
    const objectPath = pocketObjectPath(phraseId, abs);
    const ct = contentTypeForExt(abs);
    const { error } = await client.storage.from(BUCKET).upload(objectPath, buf, {
      contentType: ct,
      upsert: true,
    });
    if (error) throw new Error(`Upload ${objectPath}: ${error.message}`);
    const { data } = client.storage.from(BUCKET).getPublicUrl(objectPath);
    urlCache.set(repoRel, data.publicUrl);
    console.log(`  ↑ ${objectPath}`);
    return data.publicUrl;
  };

  console.log('Bundling saved_phrases…');
  const list = await loadSavedPhrasesFromBundle();

  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < list.length; i++) {
    const p = list[i]!;
    const audio_url = await resolveAudioUrl(p, uploadFile);
    const input: SavedPhraseInput = {
      id: p.id,
      vietnamese: p.vietnamese,
      english: p.english,
      audio_url,
      categories: p.categories ?? [],
      sort_order: p.sort_order ?? i,
      is_bookmarked: p.isBookmarked ?? false,
    };
    rows.push(savedPhraseInputToRow(input));
  }

  console.log(`Upserting ${rows.length} rows into ${SAVED_PHRASES_TABLE} (${urlCache.size} audio uploads)…`);
  const { error } = await client.from(SAVED_PHRASES_TABLE).upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
