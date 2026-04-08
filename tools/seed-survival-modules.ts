/**
 * Bundle static survival modules (apps/mobile/constants/survival), upload MP3s to Storage, upsert DB.
 *
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Optional:  bucket `survival-audio` (see supabase/migrations/20260409120000_storage_survival_audio_bucket.sql)
 *
 * Run: pnpm seed:survival
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  SURVIVAL_MODULES_TABLE,
  survivalModuleInputToRow,
  type SurvivalModuleInput,
  type SurvivalStep,
} from '@xinchao/shared';
import { config } from 'dotenv';
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const AUDIO_ROOT_PREFIX = 'apps/mobile/assets/audio/';
const SEED_PREFIX = '__SEED_FILE__:';
const BUCKET = 'survival-audio';

config({ path: path.join(root, '.env') });
config({ path: path.join(root, 'apps/mobile/.env') });
config({ path: path.join(root, 'apps/landing-web/.env') });

/** Images: null. Audio: magic string __SEED_FILE__:<repo-relative path> */
function seedBundlePlugin(): esbuild.Plugin {
  return {
    name: 'seed-bundle-assets',
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
        if (rel.startsWith('..')) {
          throw new Error(`Audio file outside repo: ${args.path}`);
        }
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

function storageObjectPath(repoRel: string): string {
  if (!repoRel.startsWith(AUDIO_ROOT_PREFIX)) {
    return repoRel.replace(/^apps\/mobile\/assets\//, '');
  }
  return repoRel.slice(AUDIO_ROOT_PREFIX.length);
}

/** Remove stray Metro asset ids if any */
function deepStripNumericAssets(value: unknown): unknown {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((x) => deepStripNumericAssets(x));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    if ((k === 'audioUri' || k === 'image') && typeof v === 'number') continue;
    out[k] = deepStripNumericAssets(v);
  }
  return out;
}

async function replaceSeedPaths(
  value: unknown,
  upload: (repoRel: string) => Promise<string>,
): Promise<unknown> {
  if (typeof value === 'string' && value.startsWith(SEED_PREFIX)) {
    const rel = value.slice(SEED_PREFIX.length);
    return upload(rel);
  }
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return Promise.all(value.map((x) => replaceSeedPaths(x, upload)));
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = await replaceSeedPaths(v, upload);
  }
  return out;
}

async function loadSurvivalModulesFromBundle(): Promise<
  Record<string, import('@xinchao/shared').SurvivalModule>
> {
  const cacheDir = path.join(__dirname, '.cache');
  fs.mkdirSync(cacheDir, { recursive: true });
  const outfile = path.join(cacheDir, 'survival-seed-bundle.cjs');

  await esbuild.build({
    absWorkingDir: root,
    entryPoints: [path.join(root, 'apps/mobile/constants/survival/index.ts')],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node20',
    logLevel: 'warning',
    plugins: [seedBundlePlugin()],
  });

  const require = createRequire(import.meta.url);
  const mod = require(outfile) as { SURVIVAL_MODULES: Record<string, import('@xinchao/shared').SurvivalModule> };
  if (!mod.SURVIVAL_MODULES) {
    throw new Error('Bundle did not export SURVIVAL_MODULES');
  }
  return mod.SURVIVAL_MODULES;
}

const AUDIO_MIME = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/ogg',
];

/** Create bucket if missing (SQL migration may not be applied on remote yet). */
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

async function main() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
    process.exit(1);
  }

  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log('Ensuring Storage bucket…');
  await ensureSurvivalAudioBucket(client);

  const urlCache = new Map<string, string>();
  const upload = async (repoRel: string): Promise<string> => {
    if (urlCache.has(repoRel)) return urlCache.get(repoRel)!;
    const abs = path.join(root, repoRel);
    if (!fs.existsSync(abs)) {
      throw new Error(`Audio file missing on disk: ${abs}`);
    }
    const buf = fs.readFileSync(abs);
    const objectPath = storageObjectPath(repoRel);
    const ct = contentTypeForExt(abs);
    const { error } = await client.storage.from(BUCKET).upload(objectPath, buf, {
      contentType: ct,
      upsert: true,
    });
    if (error) {
      throw new Error(`Storage upload ${objectPath}: ${error.message}`);
    }
    const { data } = client.storage.from(BUCKET).getPublicUrl(objectPath);
    urlCache.set(repoRel, data.publicUrl);
    console.log(`  ↑ ${objectPath}`);
    return data.publicUrl;
  };

  console.log('Bundling survival constants…');
  const SURVIVAL_MODULES = await loadSurvivalModulesFromBundle();
  const entries = Object.entries(SURVIVAL_MODULES);

  console.log('Uploading audio + building rows…');
  const rows: Record<string, unknown>[] = [];
  for (let index = 0; index < entries.length; index++) {
    const [key, m] = entries[index]!;
    if (m.id !== key) {
      console.warn(`Key "${key}" !== module.id "${m.id}", using module.id`);
    }
    const rawSteps = m.steps ?? [];
    const resolvedSteps = (await replaceSeedPaths(rawSteps, upload)) as SurvivalStep[];
    const steps = deepStripNumericAssets(resolvedSteps) as SurvivalStep[];

    const input: SurvivalModuleInput = {
      id: m.id,
      title: m.title,
      category: m.category,
      sort_order: m.sort_order ?? index,
      image_url: m.image_url ?? null,
      steps,
    };
    rows.push(survivalModuleInputToRow(input));
  }

  console.log(`Upserting ${rows.length} rows into ${SURVIVAL_MODULES_TABLE} (${urlCache.size} unique audio files)…`);
  const { error } = await client.from(SURVIVAL_MODULES_TABLE).upsert(rows, { onConflict: 'id' });
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
