import { useCallback, useEffect, useState } from 'react';
import { cacheSurvivalLibraryRemoteAssets } from '../lib/survivalLibraryCache';
import { useNetworkStatus } from './useNetworkStatus';
import {
  getMergedSurvivalModules,
  groupSurvivalModulesByCategory,
  orderedCategoryKeys,
  sectionTitleForCategory,
} from '../lib/survivalCatalog';
import { SurvivalStore } from '../store/survivalStore';
import { useSurvivalSync } from './useSurvivalSync';

export function useSurvivalModulesForHome() {
  const { syncModules, isLoading, error } = useSurvivalSync();
  const { isOffline } = useNetworkStatus();
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => setRevision((n) => n + 1), []);

  const modules = getMergedSurvivalModules();
  const grouped = groupSurvivalModulesByCategory(modules);

  const sections = orderedCategoryKeys(grouped)
    .filter((c) => grouped[c].length > 0)
    .map((category) => ({
      category,
      title: sectionTitleForCategory(category),
      modules: grouped[category],
    }));

  const lastSyncedAt = SurvivalStore.getLastSyncedAt();

  useEffect(() => {
    if (isOffline) return;
    const modules = getMergedSurvivalModules();
    void cacheSurvivalLibraryRemoteAssets(modules);
  }, [revision, isOffline]);

  return {
    sections,
    isLoading,
    error,
    lastSyncedAt,
    refresh,
    syncModules,
  };
}
