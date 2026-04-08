import type { SavedPhrase } from '@xinchao/shared';
import { useCallback, useState } from 'react';
import { getMergedSavedPhrases } from '../lib/savedPhrasesCatalog';
import { usePhraseSync } from './usePhraseSync';

export function useSavedPhrasesForPocket() {
  const [phrases, setPhrases] = useState<SavedPhrase[]>(() => getMergedSavedPhrases());
  const { syncPhrases, isLoading, error } = usePhraseSync();

  const refresh = useCallback(() => {
    setPhrases(getMergedSavedPhrases());
  }, []);

  return { phrases, syncPhrases, refresh, isLoading, error };
}
