import type { SavedPhrase } from '@xinchao/shared';
import { SAVED_PHRASES } from '../constants/survival/saved_phrases';
import { PhraseStore } from '../store/phraseStore';

function bySortOrder(a: SavedPhrase, b: SavedPhrase): number {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0);
}

/** Prefer remote cache when non-empty; otherwise bundled Pocket list. */
export function getMergedSavedPhrases(): SavedPhrase[] {
  const remote = PhraseStore.getPhrases();
  if (remote.length > 0) {
    return [...remote].sort(bySortOrder);
  }
  return [...SAVED_PHRASES].sort(bySortOrder);
}
