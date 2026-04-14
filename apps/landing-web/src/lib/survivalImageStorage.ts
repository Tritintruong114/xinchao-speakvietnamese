import { randomUUID } from 'node:crypto';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const SURVIVAL_IMAGES_BUCKET = 'survival-images';

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 30_000;

function sanitizePrefix(raw: string): string {
  const t = raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
  return t || 'draft';
}

/** Upload image bytes to survival-images bucket; returns public URL. */
export async function uploadSurvivalImageBuffer(opts: {
  prefix: string;
  subpath: string;
  buffer: Buffer;
  contentType: string;
  fileExtension: string;
}): Promise<{ url: string | null; error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { url: null, error: 'Database is not configured.' };
  }

  const prefix = sanitizePrefix(opts.prefix);
  const ext = opts.fileExtension.startsWith('.') ? opts.fileExtension : `.${opts.fileExtension}`;
  const safeExt = ext.match(/^\.[a-zA-Z0-9]{1,8}$/) ? ext : '.jpg';
  const objectPath = `${prefix}/${opts.subpath}/${randomUUID()}${safeExt}`;

  const { error } = await admin.storage.from(SURVIVAL_IMAGES_BUCKET).upload(objectPath, opts.buffer, {
    contentType: opts.contentType,
    upsert: true,
  });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data } = admin.storage.from(SURVIVAL_IMAGES_BUCKET).getPublicUrl(objectPath);
  return { url: data.publicUrl, error: null };
}

export function guessExtFromMime(ct: string): string {
  if (ct.includes('jpeg') || ct === 'image/jpg') return '.jpg';
  if (ct.includes('png')) return '.png';
  if (ct.includes('webp')) return '.webp';
  if (ct.includes('gif')) return '.gif';
  return '.jpg';
}

/**
 * Download a remote https image and re-upload to Supabase Storage so the app stores a stable public URL.
 */
export async function ingestRemoteImageToSurvivalStorage(opts: {
  url: string;
  prefix: string;
}): Promise<{ url: string | null; error: string | null }> {
  const raw = opts.url.trim();
  if (!raw.startsWith('https://')) {
    return { url: null, error: 'Cover source URL must use https.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { url: null, error: 'Invalid cover URL.' };
  }

  const host = parsed.hostname.toLowerCase();
  if (host === 'localhost' || host.startsWith('127.') || host === '0.0.0.0' || host.endsWith('.local')) {
    return { url: null, error: 'Cover URL host is not allowed.' };
  }

  try {
    const res = await fetch(raw, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { Accept: 'image/*,*/*' },
    });

    if (!res.ok) {
      return { url: null, error: `Failed to fetch cover image (HTTP ${res.status}).` };
    }

    const ct = res.headers.get('content-type')?.split(';')[0]?.trim()?.toLowerCase() ?? '';
    if (!ct.startsWith('image/')) {
      return { url: null, error: 'Cover response is not an image.' };
    }

    const ab = await res.arrayBuffer();
    const buffer = Buffer.from(ab);
    if (buffer.length > MAX_IMAGE_BYTES) {
      return { url: null, error: 'Cover image is too large.' };
    }

    const ext = guessExtFromMime(ct);
    return uploadSurvivalImageBuffer({
      prefix: opts.prefix,
      subpath: 'covers',
      buffer,
      contentType: ct,
      fileExtension: ext,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { url: null, error: msg };
  }
}
