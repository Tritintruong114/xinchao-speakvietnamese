import {
  SAVED_PHRASES_TABLE,
  type SavedPhraseRow,
  rowsToSavedPhrases,
} from '@xinchao/shared';
import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PhraseStore } from '../store/phraseStore';

export const usePhraseSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncPhrases = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await PhraseStore.ensureHydrated();

      const { data, error: fetchError } = await supabase
        .from(SAVED_PHRASES_TABLE)
        .select('*')
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;

      if (data != null) {
        if (data.length) {
          const skipped: string[] = [];
          const mapped = rowsToSavedPhrases(data as SavedPhraseRow[], (id, msg) => {
            console.warn('[phrase sync] skip row', id, msg);
            skipped.push(id);
          });
          PhraseStore.setPhrases(mapped);
        } else {
          PhraseStore.setPhrases([]);
        }
        PhraseStore.setLastSyncedAt(new Date().toISOString());
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Phrase sync failed, using offline data:', err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { syncPhrases, isLoading, error };
};
