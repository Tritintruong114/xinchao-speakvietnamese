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
