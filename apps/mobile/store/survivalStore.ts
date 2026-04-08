import type { SurvivalModule } from '@xinchao/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MODULES_KEY = 'survival_modules';
const LAST_SYNC_KEY = 'survival_modules_last_sync_at';

/** In-memory cache; null means disk has not been read yet */
let modulesCache: SurvivalModule[] | null = null;
let lastSyncCache: string | null = null;
let hydratePromise: Promise<void> | null = null;

async function readDiskIntoCache(): Promise<void> {
  try {
    const [rawModules, rawSync] = await Promise.all([
      AsyncStorage.getItem(MODULES_KEY),
      AsyncStorage.getItem(LAST_SYNC_KEY),
    ]);
    try {
      modulesCache = rawModules ? (JSON.parse(rawModules) as SurvivalModule[]) : [];
    } catch {
      modulesCache = [];
    }
    lastSyncCache = rawSync ?? null;
  } catch {
    if (modulesCache === null) modulesCache = [];
  }
}

export const SurvivalStore = {
  /**
   * Load persisted modules from AsyncStorage into memory once.
   * Call before relying on getModules() after cold start.
   */
  ensureHydrated: async (): Promise<void> => {
    if (modulesCache !== null) return;
    if (!hydratePromise) {
      hydratePromise = readDiskIntoCache().finally(() => {
        hydratePromise = null;
      });
    }
    await hydratePromise;
  },

  setModules: (modules: SurvivalModule[]) => {
    modulesCache = modules;
    void AsyncStorage.setItem(MODULES_KEY, JSON.stringify(modules));
  },

  getModules: (): SurvivalModule[] => {
    return modulesCache ?? [];
  },

  getModuleById: (id: string): SurvivalModule | undefined => {
    return (modulesCache ?? []).find((m) => m.id === id);
  },

  hasData: (): boolean => {
    return (modulesCache?.length ?? 0) > 0;
  },

  setLastSyncedAt: (iso: string) => {
    lastSyncCache = iso;
    void AsyncStorage.setItem(LAST_SYNC_KEY, iso);
  },

  getLastSyncedAt: (): string | null => {
    return lastSyncCache;
  },
};
