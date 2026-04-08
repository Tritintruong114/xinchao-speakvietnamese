'use server';

import type { SavedPhraseInput } from '@xinchao/shared';
import { revalidatePath } from 'next/cache';
import { deleteSavedPhraseById, upsertSavedPhraseFromDashboard } from '../data';

export async function savePhraseAction(input: SavedPhraseInput): Promise<{ error: string | null }> {
  const { error } = await upsertSavedPhraseFromDashboard(input);
  revalidatePath('/dashboard/offline');
  return { error };
}

export async function deletePhraseAction(id: string): Promise<{ error: string | null }> {
  const { error } = await deleteSavedPhraseById(id);
  revalidatePath('/dashboard/offline');
  return { error };
}
