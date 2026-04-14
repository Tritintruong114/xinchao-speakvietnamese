import type { SurvivalModule } from '@xinchao/shared';
import * as FileSystem from 'expo-file-system/legacy';

const CACHE_SUBDIR = 'survival-audio';

export function isRemoteAudioUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim()) return false;
  const t = value.trim();
  return t.startsWith('https://') || t.startsWith('http://');
}

function extFromUrl(url: string): string {
  try {
    const p = new URL(url).pathname;
    const m = /\.(m4a|mp3|aac|wav|ogg|caf|opus)$/i.exec(p);
    return m ? m[0] : '.mp3';
  } catch {
    return '.mp3';
  }
}

/** Short stable id for cache filename (sync; avoids async crypto on playback path). */
function quickHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/** Local path for a remote survival audio URL (under app cache). */
export function urlToLocalSurvivalAudioPath(url: string): string {
  const base = FileSystem.cacheDirectory;
  if (!base) return '';
  const trimmed = url.trim();
  return `${base}${CACHE_SUBDIR}/${quickHash(trimmed)}${extFromUrl(trimmed)}`;
}

/**
 * Collect every http(s) `audioUri` from modules shown on home (all steps: teaching,
 * micro-learning, voice_practice, roleplay dialogues, etc.).
 */
export function collectSurvivalRemoteAudioUris(modules: SurvivalModule[]): string[] {
  const seen = new Set<string>();
  const add = (v: unknown) => {
    if (isRemoteAudioUrl(v)) seen.add(v.trim());
  };

  for (const m of modules) {
    for (const step of m.steps ?? []) {
      add(step.audioUri);
      if (step.vocabulary) {
        for (const row of step.vocabulary) add(row.audioUri);
      }
      if (step.dialogues) {
        for (const d of step.dialogues) {
          add(d.audioUri);
          if (d.options) {
            for (const opt of d.options) add(opt.audioUri);
          }
        }
      }
    }
  }
  return [...seen];
}

async function ensureAudioCacheDir(): Promise<boolean> {
  const base = FileSystem.cacheDirectory;
  if (!base) return false;
  const dir = `${base}${CACHE_SUBDIR}`;
  try {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Download remote survival audio into the app cache so playback works offline.
 * Skips URLs already present on disk.
 */
export async function prefetchSurvivalModuleRemoteAudio(
  modules: SurvivalModule[],
): Promise<void> {
  const urls = collectSurvivalRemoteAudioUris(modules);
  if (urls.length === 0) return;
  const ok = await ensureAudioCacheDir();
  if (!ok) return;

  await Promise.allSettled(
    urls.map(async (url) => {
      const dest = urlToLocalSurvivalAudioPath(url);
      if (!dest) return;
      try {
        const info = await FileSystem.getInfoAsync(dest);
        if (info.exists) return;
        await FileSystem.downloadAsync(url, dest);
      } catch (e) {
        console.warn('[survival audio prefetch]', url, e);
      }
    }),
  );
}

/** Prefer cached file for remote survival URLs (offline playback). */
export async function resolveSurvivalAudioForPlayback(source: string): Promise<string> {
  if (!isRemoteAudioUrl(source)) return source;
  const dest = urlToLocalSurvivalAudioPath(source);
  if (!dest) return source;
  try {
    const info = await FileSystem.getInfoAsync(dest);
    if (info.exists) return dest;
  } catch {
    /* use remote */
  }
  return source;
}
