import type { SurvivalModule } from '@xinchao/shared';
import { SURVIVAL_MODULES } from '../constants/SurvivalData';
import { SurvivalStore } from '../store/survivalStore';

const CATEGORY_ORDER_DEFAULT = ['Beginner', 'Survival', 'Legend'] as const;

const SECTION_TITLE_DEFAULT: Record<string, string> = {
  Beginner: 'BEGINNER: THE BASICS',
  Survival: 'SURVIVAL: STREET SMART',
  Legend: 'LEGEND: LIVE LIKE A LOCAL',
};

/** Section heading for home — known bands get marketing copy; others use the label. */
export function sectionTitleForCategory(category: string): string {
  return SECTION_TITLE_DEFAULT[category] ?? category.toUpperCase();
}

export function sortSurvivalModules(modules: SurvivalModule[]): SurvivalModule[] {
  const rank = (c: string) => {
    const i = CATEGORY_ORDER_DEFAULT.indexOf(c as (typeof CATEGORY_ORDER_DEFAULT)[number]);
    return i === -1 ? 999 : i;
  };
  return [...modules].sort((a, b) => {
    const cr = rank(a.category) - rank(b.category);
    if (cr !== 0) return cr;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
}

/** Prefer remote cached list (AsyncStorage) when non-empty; otherwise bundled catalog. */
export function getMergedSurvivalModules(): SurvivalModule[] {
  const remote = SurvivalStore.getModules();
  if (remote.length > 0) {
    return sortSurvivalModules(remote);
  }
  return sortSurvivalModules(Object.values(SURVIVAL_MODULES));
}

export function groupSurvivalModulesByCategory(modules: SurvivalModule[]): Record<string, SurvivalModule[]> {
  const out: Record<string, SurvivalModule[]> = {};
  for (const m of modules) {
    const k = m.category;
    if (!out[k]) out[k] = [];
    out[k].push(m);
  }
  return out;
}

const DEFAULT_CATEGORY_SET = new Set<string>(CATEGORY_ORDER_DEFAULT);

/** Stable section order: default bands first (when present), then remaining categories A–Z. */
export function orderedCategoryKeys(grouped: Record<string, SurvivalModule[]>): string[] {
  const keys = Object.keys(grouped);
  const preferred = CATEGORY_ORDER_DEFAULT.filter((c) => keys.includes(c));
  const rest = keys.filter((k) => !DEFAULT_CATEGORY_SET.has(k)).sort();
  return [...preferred, ...rest];
}
