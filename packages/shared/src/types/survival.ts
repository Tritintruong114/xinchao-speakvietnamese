/**
 * Survival Module Types
 * Extracted from constants/survival/types.ts
 * Used by both mobile app and edge functions
 */

export type MascotExpression = 'happy' | 'neutral' | 'sad' | 'excited';

export interface Dialogue {
  id: string;
  speaker: 'seller' | 'user' | 'app' | 'mascot';
  text?: string;
  tip?: string;
  options?: {
    label: string;
    nextId: string;
    xp?: number;
    badge?: string;
    audioUri?: string;
  }[];
  audioUri?: string;
  nextId?: string;
  timeLimit?: number;
  timeoutId?: string;
  mascotExpression?: MascotExpression;
}

export type SurvivalStepType =
  | 'onboarding'
  | 'micro-learning'
  | 'voice_practice'
  | 'roleplay'
  | 'reward'
  | 'quiz'
  | 'teaching';

export interface SurvivalStep {
  id: string;
  type: SurvivalStepType;
  title: string;
  goal?: string;
  description?: string;
  mascotExpression?: MascotExpression;
  vocabulary?: { phrase: string; translation: string; audioUri?: string; tag?: string }[];
  targetPhrase?: string;
  targetTranslation?: string;
  successFeedback?: string;
  dialogues?: Dialogue[];
  /** Remote URL, bundled `require()`, or legacy phrase key — used by voice_practice & teaching narration */
  audioUri?: string;
  reward?: { xp: number; badge: string };
  // Quiz specific
  question?: string;
  image?: any;
  images?: any[];
  options?: string[];
  correctIndex?: number;
  fact?: string;
  // Teaching specific
  content?: string;
  visualHighlight?: string;
  /** Optional hero image for teaching steps; mobile falls back to module cover when absent */
  image_url?: string | null;
}

export interface SurvivalModule {
  id: string;
  title: string;
  /** Display label; must exist in `survival_module_categories` when loaded from DB */
  category: string;
  /** Bundled asset (e.g. RN require); optional when loaded from DB */
  image?: any;
  /** Remote cover image from survival_modules.image_url */
  image_url?: string | null;
  steps: SurvivalStep[];
  /** Row order in DB / dashboard (column `sort_order`) */
  sort_order?: number;
  /** ISO timestamp from DB when column exists */
  updated_at?: string;
}
