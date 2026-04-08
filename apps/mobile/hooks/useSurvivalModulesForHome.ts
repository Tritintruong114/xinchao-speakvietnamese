import type { SurvivalModule } from '@xinchao/shared';
import { useCallback, useState } from 'react';
import {
  getMergedSurvivalModules,
  groupSurvivalModulesByCategory,
  SECTION_TITLE,
} from '../lib/survivalCatalog';
import { SurvivalStore } from '../store/survivalStore';
import { useSurvivalSync } from './useSurvivalSync';

const CATEGORY_ORDER: SurvivalModule['category'][] = ['Beginner', 'Survival', 'Legend'];

export function useSurvivalModulesForHome() {
  const { syncModules, isLoading, error } = useSurvivalSync();
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => setRevision((n) => n + 1), []);

  const modules = getMergedSurvivalModules();
  const grouped = groupSurvivalModulesByCategory(modules);

  const sections = CATEGORY_ORDER.filter((c) => grouped[c].length > 0).map((category) => ({
    category,
    title: SECTION_TITLE[category],
    modules: grouped[category],
  }));

  const lastSyncedAt = SurvivalStore.getLastSyncedAt();

  return {
    sections,
    isLoading,
    error,
    lastSyncedAt,
    refresh,
    syncModules,
  };
}
