import type { SurvivalModuleInput, SurvivalStep } from '@xinchao/shared';
import { z } from 'zod';

const mascotExpressionSchema = z.enum(['happy', 'neutral', 'sad', 'excited']);

const teachingStepSchema = z.object({
  id: z.string().optional(),
  type: z.literal('teaching'),
  title: z.string().min(1),
  content: z.string().min(1),
  goal: z.string().optional(),
  description: z.string().optional(),
  mascotExpression: mascotExpressionSchema.optional(),
  visualHighlight: z.string().optional(),
  /** TTS / hosted MP3 URL or pipeline-specific audio reference */
  audioUri: z.string().optional(),
});

const vocabItemSchema = z.object({
  phrase: z.string().min(1),
  translation: z.string().min(1),
  tag: z.string().optional(),
  audioUri: z.string().optional(),
});

const microLearningStepSchema = z.object({
  id: z.string().optional(),
  type: z.literal('micro-learning'),
  title: z.string().min(1),
  description: z.string().optional(),
  goal: z.string().optional(),
  vocabulary: z.array(vocabItemSchema).min(1),
  mascotExpression: mascotExpressionSchema.optional(),
});

const voicePracticeStepSchema = z.object({
  id: z.string().optional(),
  type: z.literal('voice_practice'),
  title: z.string().min(1),
  targetPhrase: z.string().min(1),
  targetTranslation: z.string().min(1),
  goal: z.string().optional(),
  description: z.string().optional(),
  successFeedback: z.string().optional(),
  mascotExpression: mascotExpressionSchema.optional(),
});

const quizStepSchema = z
  .object({
    id: z.string().optional(),
    type: z.literal('quiz'),
    title: z.string().min(1),
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    correctIndex: z.number().int().min(0),
    fact: z.string().optional(),
    description: z.string().optional(),
    mascotExpression: mascotExpressionSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.correctIndex >= data.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'correctIndex must be within options length',
        path: ['correctIndex'],
      });
    }
  });

/** Pha A: teaching, micro-learning, voice_practice, quiz only (no roleplay/dialogue graphs). */
export const phaASurvivalStepSchema = z.discriminatedUnion('type', [
  teachingStepSchema,
  microLearningStepSchema,
  voicePracticeStepSchema,
  quizStepSchema,
]);

/** Raw Gemini body: `image_url` is an https source URL or null before server ingest to Storage. */
export const geminiModuleBodySchema = z.object({
  title: z.string().min(1),
  image_url: z.preprocess(
    (v) => (v === '' || v === undefined ? null : v),
    z.union([z.string().url(), z.null()]),
  ),
  steps: z.array(phaASurvivalStepSchema).min(1),
});

export type GeminiModuleBody = z.infer<typeof geminiModuleBodySchema>;

function newStepId(): string {
  try {
    const u = crypto.randomUUID().replace(/-/g, '');
    return `st_${u.slice(0, 12)}`;
  } catch {
    return `st_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

/** Strip optional ids from Gemini and assign stable step ids. */
export function normalizePhaASteps(steps: GeminiModuleBody['steps']): SurvivalStep[] {
  return steps.map((s) => {
    const id = newStepId();
    switch (s.type) {
      case 'teaching':
        return {
          id,
          type: 'teaching' as const,
          title: s.title,
          content: s.content,
          goal: s.goal,
          description: s.description,
          mascotExpression: s.mascotExpression,
          visualHighlight: s.visualHighlight,
          ...(s.audioUri ? { audioUri: s.audioUri } : {}),
        };
      case 'micro-learning':
        return {
          id,
          type: 'micro-learning' as const,
          title: s.title,
          description: s.description,
          goal: s.goal,
          mascotExpression: s.mascotExpression,
          vocabulary: s.vocabulary.map((v) => ({
            phrase: v.phrase,
            translation: v.translation,
            tag: v.tag,
            audioUri: v.audioUri,
          })),
        };
      case 'voice_practice':
        return {
          id,
          type: 'voice_practice' as const,
          title: s.title,
          targetPhrase: s.targetPhrase,
          targetTranslation: s.targetTranslation,
          goal: s.goal,
          description: s.description,
          successFeedback: s.successFeedback,
          mascotExpression: s.mascotExpression,
        };
      case 'quiz':
        return {
          id,
          type: 'quiz' as const,
          title: s.title,
          question: s.question,
          options: s.options,
          correctIndex: s.correctIndex,
          fact: s.fact,
          description: s.description,
          mascotExpression: s.mascotExpression,
        };
    }
  });
}

export function buildSurvivalModuleInput(opts: {
  moduleId: string;
  title: string;
  category: string;
  sort_order: number;
  image_url: string | null;
  steps: SurvivalStep[];
}): SurvivalModuleInput {
  return {
    id: opts.moduleId,
    title: opts.title.trim(),
    category: opts.category,
    sort_order: opts.sort_order,
    image_url: opts.image_url,
    steps: opts.steps,
  };
}

export function validatePhaAModuleBody(input: {
  title: string;
  image_url?: string | null;
  steps: SurvivalModuleInput['steps'];
}): { ok: true } | { ok: false; error: string } {
  const r = geminiModuleBodySchema.safeParse({
    title: input.title,
    image_url: input.image_url ?? null,
    steps: input.steps,
  });
  if (r.success) return { ok: true };
  const msg = r.error.issues.map((x) => `${x.path.join('.')}: ${x.message}`).join('; ');
  return { ok: false, error: msg };
}
