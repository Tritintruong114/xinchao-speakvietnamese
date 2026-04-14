'use server';

import { revalidatePath } from 'next/cache';

import {
  createSurvivalModuleCategory,
  deleteSurvivalModuleCategory,
  renameSurvivalModuleCategory,
  setSurvivalModuleCategoriesSortOrder,
} from '../data';

export async function createCategoryAction(name: string): Promise<{ error: string | null }> {
  const { error } = await createSurvivalModuleCategory(name);
  if (!error) {
    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard/library');
  }
  return { error };
}

export async function renameCategoryAction(id: string, newName: string): Promise<{ error: string | null }> {
  const { error } = await renameSurvivalModuleCategory(id, newName);
  if (!error) {
    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard/library');
  }
  return { error };
}

export async function deleteCategoryAction(id: string): Promise<{ error: string | null }> {
  const { error } = await deleteSurvivalModuleCategory(id);
  if (!error) {
    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard/library');
  }
  return { error };
}

export async function reorderCategoriesAction(orderedIds: string[]): Promise<{ error: string | null }> {
  const { error } = await setSurvivalModuleCategoriesSortOrder(orderedIds);
  if (!error) {
    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard/library');
  }
  return { error };
}
