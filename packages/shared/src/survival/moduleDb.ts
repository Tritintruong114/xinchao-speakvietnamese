/**
 * survival_modules table ↔ client SurvivalModule mapping (platform-agnostic).
 */

import type { SurvivalModule, SurvivalStep } from '../types/survival';

export const SURVIVAL_MODULES_TABLE = 'survival_modules' as const;

export type SurvivalCategory = SurvivalModule['category'];

/** Row shape returned by PostgREST for public.survival_modules */
export interface SurvivalModuleRow {
  id: string;
  title: string;
  category: SurvivalCategory | null;
  image_url: string | null;
  sort_order: number | null;
  steps: unknown;
  created_at?: string;
  /** Present after migration; optional for older rows */
  updated_at?: string;
}

export type SurvivalModuleInput = {
  id: string;
  title: string;
  category: SurvivalCategory;
  sort_order: number;
  image_url: string | null;
  steps: SurvivalStep[];
};

/** Coerce unknown JSON into SurvivalStep[]; throws on invalid root type. */
export function parseSurvivalSteps(raw: unknown): SurvivalStep[] {
  if (raw == null) return [];
  if (!Array.isArray(raw)) {
    throw new Error('survival_modules.steps must be a JSON array');
  }
  return raw as SurvivalStep[];
}

/**
 * Normalize a DB / API row into SurvivalModule.
 * Bundled `image` is absent; consumers use image_url or local fallbacks.
 */
export function rowToSurvivalModule(row: SurvivalModuleRow): SurvivalModule {
  const category = row.category;
  if (category !== 'Beginner' && category !== 'Survival' && category !== 'Legend') {
    throw new Error(`Invalid survival_modules.category for id=${row.id}`);
  }
  const steps = parseSurvivalSteps(row.steps);
  return {
    id: row.id,
    title: row.title,
    category,
    image: undefined,
    image_url: row.image_url ?? undefined,
    steps,
    sort_order: row.sort_order ?? 0,
    updated_at: row.updated_at,
  };
}

/** Validate input and build a row for upsert (matches DB columns). */
export function survivalModuleInputToRow(input: SurvivalModuleInput): Record<string, unknown> {
  if (!input.id?.trim()) throw new Error('id is required');
  if (!input.title?.trim()) throw new Error('title is required');
  const { category } = input;
  if (category !== 'Beginner' && category !== 'Survival' && category !== 'Legend') {
    throw new Error('Invalid category');
  }
  parseSurvivalSteps(input.steps);
  return {
    id: input.id.trim(),
    title: input.title.trim(),
    category,
    image_url: input.image_url,
    sort_order: input.sort_order ?? 0,
    steps: input.steps,
    updated_at: new Date().toISOString(),
  };
}

/** Map many rows; skips invalid rows when onError collect. */
export function rowsToSurvivalModules(
  rows: SurvivalModuleRow[],
  onError?: (id: string, message: string) => void,
): SurvivalModule[] {
  const out: SurvivalModule[] = [];
  for (const row of rows) {
    try {
      out.push(rowToSurvivalModule(row));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      onError?.(row.id, msg);
    }
  }
  return out;
}
