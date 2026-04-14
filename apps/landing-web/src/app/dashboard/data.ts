import {
  SAVED_PHRASES_TABLE,
  SURVIVAL_MODULES_TABLE,
  type SavedPhrase,
  type SavedPhraseInput,
  type SavedPhraseRow,
  type SurvivalModule,
  type SurvivalModuleInput,
  type SurvivalModuleRow,
  rowsToSavedPhrases,
  rowsToSurvivalModules,
  savedPhraseInputToRow,
  survivalModuleInputToRow,
} from '@xinchao/shared';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { ContactRow, WaitlistRow } from './types';

export const SURVIVAL_MODULE_CATEGORIES_TABLE = 'survival_module_categories' as const;

export type SurvivalModuleCategoryRecord = {
  id: string;
  name: string;
  sort_order: number;
};

/** Order modules for library UI: category order first, then `sort_order`. Unknown categories sort last. */
export function sortSurvivalModulesForLibrary(
  modules: SurvivalModule[],
  categories: SurvivalModuleCategoryRecord[],
): SurvivalModule[] {
  const rank = new Map(categories.map((c) => [c.name, c.sort_order] as const));
  return [...modules].sort((a, b) => {
    const ar = rank.get(a.category) ?? 99999;
    const br = rank.get(b.category) ?? 99999;
    if (ar !== br) return ar - br;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
}

const SAVED_PHRASES_MIGRATION_HINT =
  'Bảng saved_phrases chưa có trên project Supabase. Chạy file supabase/migrations/20260410120000_saved_phrases.sql trong SQL Editor (hoặc supabase db push sau khi link project), rồi tải lại trang.';

function savedPhrasesMissingTableMessage(errorMessage: string | undefined): string | null {
  const msg = errorMessage ?? '';
  if (/Could not find the table|schema cache/i.test(msg) && /saved_phrases/i.test(msg)) {
    return SAVED_PHRASES_MIGRATION_HINT;
  }
  return null;
}

export async function loadSurvivalModules(): Promise<{ rows: SurvivalModule[]; error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { rows: [], error: 'Database is not configured.' };
  }

  const { data, error } = await admin
    .from(SURVIVAL_MODULES_TABLE)
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[dashboard survival]', error.message);
    return { rows: [], error: 'Could not load survival modules.' };
  }

  const rows = (data ?? []) as SurvivalModuleRow[];
  const skipped: string[] = [];
  const mapped = rowsToSurvivalModules(rows, (id, msg) => {
    console.warn('[dashboard survival] skip row', id, msg);
    skipped.push(id);
  });
  if (skipped.length) {
    console.warn('[dashboard survival] skipped rows:', skipped.join(', '));
  }
  return { rows: mapped, error: null };
}

export async function loadSurvivalModuleById(
  id: string,
): Promise<{ module: SurvivalModule | null; error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { module: null, error: 'Database is not configured.' };

  const { data, error } = await admin
    .from(SURVIVAL_MODULES_TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[dashboard survival]', error.message);
    return { module: null, error: 'Could not load module.' };
  }
  if (!data) return { module: null, error: null };
  try {
    return { module: rowsToSurvivalModules([data as SurvivalModuleRow])[0] ?? null, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { module: null, error: msg };
  }
}

export async function upsertSurvivalModuleFromDashboard(input: SurvivalModuleInput): Promise<{ error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { error: 'Database is not configured.' };

  let row: Record<string, unknown>;
  try {
    row = survivalModuleInputToRow(input);
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }

  const { error } = await admin.from(SURVIVAL_MODULES_TABLE).upsert(row, { onConflict: 'id' });
  if (error) return { error: error.message };
  return { error: null };
}

export async function deleteSurvivalModuleById(id: string): Promise<{ error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { error: 'Database is not configured.' };
  const { error } = await admin.from(SURVIVAL_MODULES_TABLE).delete().eq('id', id);
  if (error) return { error: error.message };
  return { error: null };
}

/** Partial update for cover URL after Storage upload (does not touch steps JSON). */
export async function updateSurvivalModuleImageUrl(
  id: string,
  image_url: string,
): Promise<{ rowsUpdated: number; error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { rowsUpdated: 0, error: 'Database is not configured.' };

  const { data, error } = await admin
    .from(SURVIVAL_MODULES_TABLE)
    .update({ image_url })
    .eq('id', id)
    .select('id');

  if (error) return { rowsUpdated: 0, error: error.message };
  return { rowsUpdated: Array.isArray(data) ? data.length : 0, error: null };
}

/** Sets `sort_order` to each index (0-based) for the given id list — library table order. */
export async function setSurvivalModulesSortOrder(orderedIds: string[]): Promise<{ error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { error: 'Database is not configured.' };

  const updates = orderedIds.map((id, i) =>
    admin.from(SURVIVAL_MODULES_TABLE).update({ sort_order: i }).eq('id', id),
  );
  const results = await Promise.all(updates);
  for (const r of results) {
    if (r.error) return { error: r.error.message };
  }
  return { error: null };
}

export async function patchSurvivalModuleCategory(
  id: string,
  category: string,
): Promise<{ error: string | null }> {
  const trimmed = category.trim();
  if (!trimmed) return { error: 'Invalid category' };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: 'Database is not configured.' };

  const { data: exists, error: qErr } = await admin
    .from(SURVIVAL_MODULE_CATEGORIES_TABLE)
    .select('name')
    .eq('name', trimmed)
    .maybeSingle();
  if (qErr) return { error: qErr.message };
  if (!exists) return { error: 'Unknown category' };

  const { error } = await admin.from(SURVIVAL_MODULES_TABLE).update({ category: trimmed }).eq('id', id);
  if (error) return { error: error.message };
  return { error: null };
}

export async function loadSurvivalModuleCategories(): Promise<{
  rows: SurvivalModuleCategoryRecord[];
  error: string | null;
}> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { rows: [], error: 'Database is not configured.' };
  }

  const { data, error } = await admin
    .from(SURVIVAL_MODULE_CATEGORIES_TABLE)
    .select('id, name, sort_order')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[dashboard survival categories]', error.message);
    return { rows: [], error: 'Could not load categories.' };
  }

  const rows = (data ?? []) as SurvivalModuleCategoryRecord[];
  return { rows, error: null };
}

export async function createSurvivalModuleCategory(name: string): Promise<{ error: string | null }> {
  const label = name.trim();
  if (!label) return { error: 'Name is required.' };
  if (label.length > 120) return { error: 'Name is too long.' };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: 'Database is not configured.' };

  const { data: maxRow } = await admin
    .from(SURVIVAL_MODULE_CATEGORIES_TABLE)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (typeof maxRow?.sort_order === 'number' ? maxRow.sort_order : -1) + 1;
  const { error } = await admin.from(SURVIVAL_MODULE_CATEGORIES_TABLE).insert({
    name: label,
    sort_order: nextOrder,
  });
  if (error) {
    if (/duplicate key|unique/i.test(error.message)) return { error: 'That category name already exists.' };
    return { error: error.message };
  }
  return { error: null };
}

export async function renameSurvivalModuleCategory(
  id: string,
  newName: string,
): Promise<{ error: string | null }> {
  const label = newName.trim();
  if (!label) return { error: 'Name is required.' };
  if (label.length > 120) return { error: 'Name is too long.' };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: 'Database is not configured.' };

  const { error } = await admin.from(SURVIVAL_MODULE_CATEGORIES_TABLE).update({ name: label }).eq('id', id);
  if (error) {
    if (/duplicate key|unique/i.test(error.message)) return { error: 'That category name already exists.' };
    return { error: error.message };
  }
  return { error: null };
}

export async function deleteSurvivalModuleCategory(id: string): Promise<{ error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { error: 'Database is not configured.' };

  const { data: row, error: loadErr } = await admin
    .from(SURVIVAL_MODULE_CATEGORIES_TABLE)
    .select('name')
    .eq('id', id)
    .maybeSingle();
  if (loadErr) return { error: loadErr.message };
  const catName = row && typeof row === 'object' && 'name' in row && typeof (row as { name: string }).name === 'string'
    ? (row as { name: string }).name
    : null;
  if (!catName) return { error: 'Category not found.' };

  const { count, error: countErr } = await admin
    .from(SURVIVAL_MODULES_TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('category', catName);
  if (countErr) return { error: countErr.message };
  if ((count ?? 0) > 0) {
    return { error: 'Move or delete modules that use this category first.' };
  }

  const { error } = await admin.from(SURVIVAL_MODULE_CATEGORIES_TABLE).delete().eq('id', id);
  if (error) return { error: error.message };
  return { error: null };
}

export async function setSurvivalModuleCategoriesSortOrder(
  orderedIds: string[],
): Promise<{ error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { error: 'Database is not configured.' };

  const ids = orderedIds.map((x) => x.trim()).filter(Boolean);
  if (ids.length === 0) return { error: null };

  const updates = ids.map((rowId, i) =>
    admin.from(SURVIVAL_MODULE_CATEGORIES_TABLE).update({ sort_order: i }).eq('id', rowId),
  );
  const results = await Promise.all(updates);
  for (const r of results) {
    if (r.error) return { error: r.error.message };
  }
  return { error: null };
}

export async function loadSavedPhrases(): Promise<{ rows: SavedPhrase[]; error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { rows: [], error: 'Database is not configured.' };
  }

  const { data, error } = await admin
    .from(SAVED_PHRASES_TABLE)
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[dashboard saved_phrases]', error.message);
    const hint = savedPhrasesMissingTableMessage(error.message);
    if (hint) return { rows: [], error: hint };
    return { rows: [], error: 'Could not load saved phrases.' };
  }

  const raw = (data ?? []) as SavedPhraseRow[];
  const skipped: string[] = [];
  const mapped = rowsToSavedPhrases(raw, (id, msg) => {
    console.warn('[dashboard saved_phrases] skip row', id, msg);
    skipped.push(id);
  });
  if (skipped.length) {
    console.warn('[dashboard saved_phrases] skipped rows:', skipped.join(', '));
  }
  return { rows: mapped, error: null };
}

export async function loadSavedPhraseById(
  id: string,
): Promise<{ phrase: SavedPhrase | null; error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { phrase: null, error: 'Database is not configured.' };

  const { data, error } = await admin
    .from(SAVED_PHRASES_TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[dashboard saved_phrases]', error.message);
    const hint = savedPhrasesMissingTableMessage(error.message);
    return { phrase: null, error: hint ?? 'Could not load phrase.' };
  }
  if (!data) return { phrase: null, error: null };
  try {
    return { phrase: rowsToSavedPhrases([data as SavedPhraseRow])[0] ?? null, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { phrase: null, error: msg };
  }
}

export async function upsertSavedPhraseFromDashboard(input: SavedPhraseInput): Promise<{ error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { error: 'Database is not configured.' };

  let row: Record<string, unknown>;
  try {
    row = savedPhraseInputToRow(input);
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }

  const { error } = await admin.from(SAVED_PHRASES_TABLE).upsert(row, { onConflict: 'id' });
  if (error) {
    const hint = savedPhrasesMissingTableMessage(error.message);
    return { error: hint ?? error.message };
  }
  return { error: null };
}

export async function deleteSavedPhraseById(id: string): Promise<{ error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { error: 'Database is not configured.' };
  const { error } = await admin.from(SAVED_PHRASES_TABLE).delete().eq('id', id);
  if (error) {
    const hint = savedPhrasesMissingTableMessage(error.message);
    return { error: hint ?? error.message };
  }
  return { error: null };
}

export async function loadWaitlist(): Promise<{ rows: WaitlistRow[]; error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { rows: [], error: 'Database is not configured.' };
  }

  const { data, error } = await admin
    .from('landing_waitlist')
    .select('id,email,created_at,source')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[dashboard waitlist]', error.message);
    return { rows: [], error: 'Could not load waitlist.' };
  }

  return { rows: (data ?? []) as WaitlistRow[], error: null };
}

export async function loadContacts(): Promise<{ rows: ContactRow[]; error: string | null }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { rows: [], error: 'Database is not configured.' };
  }

  const { data, error } = await admin
    .from('landing_contact_submissions')
    .select('id,name,email,message,created_at,source')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[dashboard contacts]', error.message);
    return { rows: [], error: 'Could not load messages.' };
  }

  return { rows: (data ?? []) as ContactRow[], error: null };
}
