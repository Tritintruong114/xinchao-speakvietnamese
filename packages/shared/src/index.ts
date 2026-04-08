/**
 * @xinchao/shared - Survival Vietnamese Types
 *
 * Platform-agnostic types and constants shared between:
 * - apps/mobile (React Native / Expo)
 * - apps/edge-functions (Deno / Supabase)
 */

// Types
export type { SurvivalModule, SurvivalStep, SurvivalStepType, Dialogue, MascotExpression } from './types/survival';
export type { SurvivalScanResult } from './types/scan';
export * from './types/phrase';

// Survival DB mapping
export {
  SURVIVAL_MODULES_TABLE,
  parseSurvivalSteps,
  rowToSurvivalModule,
  rowsToSurvivalModules,
  survivalModuleInputToRow,
} from './survival/moduleDb';
export type { SurvivalModuleRow, SurvivalModuleInput, SurvivalCategory } from './survival/moduleDb';

// Pocket / saved phrases DB mapping
export {
  SAVED_PHRASES_TABLE,
  rowToSavedPhrase,
  rowsToSavedPhrases,
  savedPhraseInputToRow,
  PHRASE_CATEGORY_OPTIONS,
} from './pocket/phraseDb';
export type { SavedPhraseRow, SavedPhraseInput } from './pocket/phraseDb';

// Constants
export { AIConfig } from './constants/ai';
export { BrandColors } from './constants/brand';
