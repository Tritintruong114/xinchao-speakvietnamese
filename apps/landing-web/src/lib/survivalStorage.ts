import { randomUUID } from 'node:crypto';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const SURVIVAL_AUDIO_BUCKET = 'survival-audio';

function sanitizePrefix(raw: string): string {
  const t = raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
  return t || 'draft';
}

/** Upload raw audio bytes to survival-audio bucket; returns public URL. */
export async function uploadSurvivalAudioBuffer(opts: {
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
  const safeExt = ext.match(/^\.[a-zA-Z0-9]{1,8}$/) ? ext : '.mp3';
  const objectPath = `${prefix}/${opts.subpath}/${randomUUID()}${safeExt}`;

  const { error } = await admin.storage.from(SURVIVAL_AUDIO_BUCKET).upload(objectPath, opts.buffer, {
    contentType: opts.contentType,
    upsert: true,
  });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data } = admin.storage.from(SURVIVAL_AUDIO_BUCKET).getPublicUrl(objectPath);
  return { url: data.publicUrl, error: null };
}
