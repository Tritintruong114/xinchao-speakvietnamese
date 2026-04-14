import type { SurvivalModule } from '@xinchao/shared';
import { prefetchSurvivalModuleRemoteAudio } from './survivalAudioPrefetch';
import { prefetchSurvivalModuleRemoteImages } from './localModuleImages';

/**
 * After Supabase sync: **images first** (home grid feels slow if competing with many audio downloads),
 * then audio in the background.
 */
export async function cacheSurvivalLibraryRemoteAssets(modules: SurvivalModule[]): Promise<void> {
  await prefetchSurvivalModuleRemoteImages(modules);
  void prefetchSurvivalModuleRemoteAudio(modules);
}
