'use server';

import type { SurvivalModuleInput } from '@xinchao/shared';
import { revalidatePath } from 'next/cache';
import { uploadSurvivalAudioBuffer } from '@/lib/survivalStorage';

import {
  deleteSurvivalModuleById,
  patchSurvivalModuleCategory,
  setSurvivalModulesSortOrder,
  upsertSurvivalModuleFromDashboard,
} from '../data';

/** Upload an audio file to Storage; returns public URL for step / vocabulary audioUri fields. */
export async function uploadSurvivalAudioAction(
  formData: FormData,
): Promise<{ url: string | null; error: string | null }> {
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { url: null, error: 'No file received.' };
  }

  const rawPrefix = (formData.get('prefix') as string | null)?.trim() || 'draft';
  const baseName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || 'audio';
  const extMatch = baseName.match(/\.[a-zA-Z0-9]{1,8}$/);
  const ext = extMatch ? extMatch[0] : '.bin';
  const buf = Buffer.from(await file.arrayBuffer());
  const contentType = file.type?.trim() || 'audio/mpeg';

  return uploadSurvivalAudioBuffer({
    prefix: rawPrefix,
    subpath: 'step-audio',
    buffer: buf,
    contentType,
    fileExtension: ext,
  });
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

export async function reorderSurvivalModulesAction(
  orderedIds: string[],
): Promise<{ error: string | null }> {
  const ids = orderedIds.map((id) => id.trim()).filter(Boolean);
  if (ids.length === 0) return { error: null };
  const { error } = await setSurvivalModulesSortOrder(ids);
  revalidatePath('/dashboard/library');
  return { error };
}

export async function updateSurvivalModuleCategoryAction(
  id: string,
  category: string,
): Promise<{ error: string | null }> {
  const { error } = await patchSurvivalModuleCategory(id.trim(), category);
  revalidatePath('/dashboard/library');
  return { error };
}
