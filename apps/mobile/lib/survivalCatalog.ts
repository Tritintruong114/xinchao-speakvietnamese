import type { SurvivalModule } from '@xinchao/shared';
import { SURVIVAL_MODULES } from '../constants/SurvivalData';
import { SurvivalStore } from '../store/survivalStore';

const CATEGORY_ORDER: SurvivalModule['category'][] = ['Beginner', 'Survival', 'Legend'];

export const SECTION_TITLE: Record<SurvivalModule['category'], string> = {
  Beginner: 'BEGINNER: THE BASICS',
  Survival: 'SURVIVAL: STREET SMART',
  Legend: 'LEGEND: LIVE LIKE A LOCAL',
};

export function sortSurvivalModules(modules: SurvivalModule[]): SurvivalModule[] {
  const rank = (c: SurvivalModule['category']) => CATEGORY_ORDER.indexOf(c);
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

export function groupSurvivalModulesByCategory(
  modules: SurvivalModule[],
): Record<SurvivalModule['category'], SurvivalModule[]> {
  const empty: Record<SurvivalModule['category'], SurvivalModule[]> = {
    Beginner: [],
    Survival: [],
    Legend: [],
  };
  for (const m of modules) {
    empty[m.category].push(m);
  }
  return empty;
}
