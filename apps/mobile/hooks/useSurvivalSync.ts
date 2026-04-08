import {
  SURVIVAL_MODULES_TABLE,
  type SurvivalModuleRow,
  rowsToSurvivalModules,
} from '@xinchao/shared';
import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SurvivalStore } from '../store/survivalStore';

export const useSurvivalSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncModules = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await SurvivalStore.ensureHydrated();

      const { data, error: fetchError } = await supabase
        .from(SURVIVAL_MODULES_TABLE)
        .select('*')
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;

      if (data?.length) {
        const skipped: string[] = [];
        const mapped = rowsToSurvivalModules(data as SurvivalModuleRow[], (id, msg) => {
          console.warn('[survival sync] skip row', id, msg);
          skipped.push(id);
        });
        SurvivalStore.setModules(mapped);
        SurvivalStore.setLastSyncedAt(new Date().toISOString());
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Sync failed, using offline data:', err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { syncModules, isLoading, error };
};
