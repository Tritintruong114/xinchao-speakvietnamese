/**
 * saved_phrases table ↔ SavedPhrase (mobile Pocket screen).
 */

import type { PhraseCategory, SavedPhrase } from '../types/phrase';
import { CategoryColors } from '../types/phrase';

export const SAVED_PHRASES_TABLE = 'saved_phrases' as const;

const VALID_CATEGORY = new Set<string>(Object.keys(CategoryColors));

export interface SavedPhraseRow {
  id: string;
  vietnamese: string;
  english: string;
  audio_url: string | null;
  categories: string[] | null;
  sort_order: number | null;
  is_bookmarked: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export type SavedPhraseInput = {
  id: string;
  vietnamese: string;
  english: string;
  audio_url: string | null;
  categories: PhraseCategory[];
  sort_order: number;
  is_bookmarked: boolean;
};

function parseCategories(raw: unknown): PhraseCategory[] {
  if (!Array.isArray(raw)) return [];
  const out: PhraseCategory[] = [];
  for (const x of raw) {
    if (typeof x === 'string' && VALID_CATEGORY.has(x)) {
      out.push(x as PhraseCategory);
    }
  }
  return out;
}

export function rowToSavedPhrase(row: SavedPhraseRow): SavedPhrase {
  return {
    id: row.id,
    vietnamese: row.vietnamese,
    english: row.english,
    audioUri: row.audio_url ?? '',
    categories: parseCategories(row.categories),
    isBookmarked: row.is_bookmarked ?? undefined,
    sort_order: row.sort_order ?? undefined,
  };
}

export function savedPhraseInputToRow(input: SavedPhraseInput): Record<string, unknown> {
  if (!input.id?.trim()) throw new Error('id is required');
  if (!input.vietnamese?.trim()) throw new Error('vietnamese is required');
  if (!input.english?.trim()) throw new Error('english is required');
  for (const c of input.categories) {
    if (!VALID_CATEGORY.has(c)) throw new Error(`Invalid category: ${c}`);
  }

  return {
    id: input.id.trim(),
    vietnamese: input.vietnamese.trim(),
    english: input.english.trim(),
    audio_url: input.audio_url,
    categories: input.categories,
    sort_order: input.sort_order ?? 0,
    is_bookmarked: input.is_bookmarked,
    updated_at: new Date().toISOString(),
  };
}

export function rowsToSavedPhrases(
  rows: SavedPhraseRow[],
  onError?: (id: string, message: string) => void,
): SavedPhrase[] {
  const out: SavedPhrase[] = [];
  for (const row of rows) {
    try {
      out.push(rowToSavedPhrase(row));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      onError?.(row.id, msg);
    }
  }
  return out;
}

export const PHRASE_CATEGORY_OPTIONS = Object.keys(CategoryColors) as PhraseCategory[];
