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

// Constants
export { AIConfig } from './constants/ai';
export { BrandColors } from './constants/brand';
