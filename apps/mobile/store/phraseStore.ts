import type { SavedPhrase } from '@xinchao/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PHRASES_KEY = 'saved_phrases';
const LAST_SYNC_KEY = 'saved_phrases_last_sync_at';

let phrasesCache: SavedPhrase[] | null = null;
let lastSyncCache: string | null = null;
let hydratePromise: Promise<void> | null = null;

async function readDiskIntoCache(): Promise<void> {
  try {
    const [raw, rawSync] = await Promise.all([
      AsyncStorage.getItem(PHRASES_KEY),
      AsyncStorage.getItem(LAST_SYNC_KEY),
    ]);
    try {
      phrasesCache = raw ? (JSON.parse(raw) as SavedPhrase[]) : [];
    } catch {
      phrasesCache = [];
    }
    lastSyncCache = rawSync ?? null;
  } catch {
    if (phrasesCache === null) phrasesCache = [];
  }
}

export const PhraseStore = {
  ensureHydrated: async (): Promise<void> => {
    if (phrasesCache !== null) return;
    if (!hydratePromise) {
      hydratePromise = readDiskIntoCache().finally(() => {
        hydratePromise = null;
      });
    }
    await hydratePromise;
  },

  setPhrases: (phrases: SavedPhrase[]) => {
    phrasesCache = phrases;
    void AsyncStorage.setItem(PHRASES_KEY, JSON.stringify(phrases));
  },

  getPhrases: (): SavedPhrase[] => phrasesCache ?? [],

  setLastSyncedAt: (iso: string) => {
    lastSyncCache = iso;
    void AsyncStorage.setItem(LAST_SYNC_KEY, iso);
  },

  getLastSyncedAt: (): string | null => lastSyncCache,
};
