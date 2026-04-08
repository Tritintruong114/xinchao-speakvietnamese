'use server';

import type { SurvivalModuleInput } from '@xinchao/shared';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { deleteSurvivalModuleById, upsertSurvivalModuleFromDashboard } from '../data';

const SURVIVAL_AUDIO_BUCKET = 'survival-audio';

/** Upload an audio file to Storage; returns public URL for step / vocabulary audioUri fields. */
export async function uploadSurvivalAudioAction(
  formData: FormData,
): Promise<{ url: string | null; error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { url: null, error: 'Database is not configured.' };
  }

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { url: null, error: 'No file received.' };
  }

  const rawPrefix = (formData.get('prefix') as string | null)?.trim() || 'draft';
  const prefix = rawPrefix.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80) || 'draft';

  const baseName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || 'audio';
  const extMatch = baseName.match(/\.[a-zA-Z0-9]{1,8}$/);
  const ext = extMatch ? extMatch[0] : '.bin';
  const objectPath = `${prefix}/step-audio/${randomUUID()}${ext}`;

  const buf = Buffer.from(await file.arrayBuffer());
  const contentType = file.type?.trim() || 'audio/mpeg';

  const { error } = await admin.storage.from(SURVIVAL_AUDIO_BUCKET).upload(objectPath, buf, {
    contentType,
    upsert: true,
  });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data } = admin.storage.from(SURVIVAL_AUDIO_BUCKET).getPublicUrl(objectPath);
  return { url: data.publicUrl, error: null };
}

export async function saveModuleAction(input: SurvivalModuleInput): Promise<{ error: string | null }> {
  const { error } = await upsertSurvivalModuleFromDashboard(input);
  revalidatePath('/dashboard/library');
  return { error };
}

export async function deleteModuleAction(id: string): Promise<{ error: string | null }> {
  const { error } = await deleteSurvivalModuleById(id);
  revalidatePath('/dashboard/library');
  return { error };
}
