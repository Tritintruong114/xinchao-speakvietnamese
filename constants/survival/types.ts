
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
  timeLimit?: number; // in seconds
  timeoutId?: string; // where to go if time runs out
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
}

export interface SurvivalModule {
  id: string;
  title: string;
  category: 'Beginner' | 'Survival' | 'Legend';
  image: any;
  steps: SurvivalStep[];
}
