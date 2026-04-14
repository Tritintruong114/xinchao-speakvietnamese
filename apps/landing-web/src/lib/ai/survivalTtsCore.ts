import type { SurvivalModuleInput, SurvivalStep } from '@xinchao/shared';

export type TtsSlot =
  | { kind: 'teaching_audio'; stepIndex: number }
  | { kind: 'vocab_phrase'; stepIndex: number; vocabIndex: number }
  | { kind: 'voice_step'; stepIndex: number }
  | { kind: 'quiz_question'; stepIndex: number };

/** Collect Vietnamese strings to synthesize (Pha A step types). */
export function collectTtsSlots(input: SurvivalModuleInput): { slot: TtsSlot; text: string }[] {
  const out: { slot: TtsSlot; text: string }[] = [];
  input.steps.forEach((step, stepIndex) => {
    if (step.type === 'teaching' && step.content?.trim()) {
      out.push({ slot: { kind: 'teaching_audio', stepIndex }, text: step.content.trim() });
    }
    if (step.type === 'micro-learning' && step.vocabulary?.length) {
      step.vocabulary.forEach((v, vocabIndex) => {
        if (v.phrase?.trim()) {
          out.push({
            slot: { kind: 'vocab_phrase', stepIndex, vocabIndex },
            text: v.phrase.trim(),
          });
        }
      });
    }
    if (step.type === 'voice_practice' && step.targetPhrase?.trim()) {
      out.push({ slot: { kind: 'voice_step', stepIndex }, text: step.targetPhrase.trim() });
    }
    if (step.type === 'quiz' && step.question?.trim()) {
      out.push({ slot: { kind: 'quiz_question', stepIndex }, text: step.question.trim() });
    }
  });
  return out;
}

function patchStep(step: SurvivalStep, slot: TtsSlot, url: string): SurvivalStep {
  if (slot.kind === 'teaching_audio' && step.type === 'teaching') {
    return { ...step, audioUri: url };
  }
  if (slot.kind === 'voice_step' && step.type === 'voice_practice') {
    return { ...step, audioUri: url };
  }
  if (slot.kind === 'quiz_question' && step.type === 'quiz') {
    return { ...step, audioUri: url };
  }
  if (slot.kind === 'vocab_phrase' && step.type === 'micro-learning') {
    const vocabulary = [...(step.vocabulary ?? [])];
    const row = vocabulary[slot.vocabIndex];
    if (row) {
      vocabulary[slot.vocabIndex] = { ...row, audioUri: url };
    }
    return { ...step, vocabulary };
  }
  return step;
}

export function applyTtsUrls(input: SurvivalModuleInput, updates: { slot: TtsSlot; url: string }[]): SurvivalModuleInput {
  const steps = [...input.steps];
  for (const u of updates) {
    const i = u.slot.stepIndex;
    if (i < 0 || i >= steps.length) continue;
    steps[i] = patchStep(steps[i], u.slot, u.url);
  }
  return { ...input, steps };
}

export function isTtsSlotFilled(input: SurvivalModuleInput, slot: TtsSlot): boolean {
  const step = input.steps[slot.stepIndex];
  if (!step) return false;
  if (slot.kind === 'teaching_audio' && step.type === 'teaching') {
    return Boolean(step.audioUri?.trim());
  }
  if (slot.kind === 'voice_step' && step.type === 'voice_practice') {
    return Boolean(step.audioUri?.trim());
  }
  if (slot.kind === 'quiz_question' && step.type === 'quiz') {
    return Boolean(step.audioUri?.trim());
  }
  if (slot.kind === 'vocab_phrase' && step.type === 'micro-learning') {
    const row = step.vocabulary?.[slot.vocabIndex];
    return Boolean(row?.audioUri?.trim());
  }
  return false;
}

export function ttsCoverage(input: SurvivalModuleInput): { filled: number; total: number } {
  const slots = collectTtsSlots(input);
  let filled = 0;
  for (const { slot } of slots) {
    if (isTtsSlotFilled(input, slot)) filled += 1;
  }
  return { filled, total: slots.length };
}
