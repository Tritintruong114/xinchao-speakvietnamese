import type { Dialogue, SurvivalModule, SurvivalStep } from '@xinchao/shared';

export type SurvivalLibraryAudioRow = {
  id: string;
  moduleId: string;
  moduleTitle: string;
  moduleCategory: SurvivalModule['category'];
  stepType: string;
  /** Vietnamese / main line */
  primary: string;
  /** English, translation, or short context */
  secondary: string;
  audioUri: string | number;
};

function hasPlayableAudio(v: unknown): boolean {
  if (v === undefined || v === null) return false;
  if (typeof v === 'number') return true;
  if (typeof v === 'string') return v.trim().length > 0;
  return false;
}

function pushDialogueOptions(
  rows: SurvivalLibraryAudioRow[],
  m: SurvivalModule,
  step: SurvivalStep,
  dialogue: Dialogue,
  dIdx: number,
) {
  if (!dialogue.options?.length) return;
  dialogue.options.forEach((opt, oIdx) => {
    if (!hasPlayableAudio(opt.audioUri)) return;
    rows.push({
      id: `${m.id}:${step.id}:dlg:${dIdx}:opt:${oIdx}`,
      moduleId: m.id,
      moduleTitle: m.title,
      moduleCategory: m.category,
      stepType: step.type,
      primary: opt.label,
      secondary: m.title,
      audioUri: opt.audioUri as string | number,
    });
  });
}

function walkDialogues(
  rows: SurvivalLibraryAudioRow[],
  m: SurvivalModule,
  step: SurvivalStep,
  dialogues: Dialogue[] | undefined,
) {
  if (!dialogues?.length) return;
  dialogues.forEach((d, dIdx) => {
    if (hasPlayableAudio(d.audioUri)) {
      rows.push({
        id: `${m.id}:${step.id}:dlg:${dIdx}`,
        moduleId: m.id,
        moduleTitle: m.title,
        moduleCategory: m.category,
        stepType: step.type,
        primary: (d.text ?? '').trim() || `Line ${dIdx + 1}`,
        secondary: m.title,
        audioUri: d.audioUri as string | number,
      });
    }
    pushDialogueOptions(rows, m, step, d, dIdx);
  });
}

/**
 * Flatten every phrase / line in merged survival modules that carries an `audioUri`.
 * Skips `teaching` and `quiz` (use the module flow). Covers: micro-learning, voice_practice, roleplay.
 */
export function collectSurvivalLibraryAudioRows(modules: SurvivalModule[]): SurvivalLibraryAudioRow[] {
  const rows: SurvivalLibraryAudioRow[] = [];

  for (const m of modules) {
    for (const step of m.steps ?? []) {
      const base = `${m.id}:${step.id}`;

      switch (step.type) {
        case 'micro-learning': {
          const vocab = step.vocabulary ?? [];
          for (let i = 0; i < vocab.length; i++) {
            const v = vocab[i];
            if (!hasPlayableAudio(v.audioUri)) continue;
            rows.push({
              id: `${base}:voc:${i}`,
              moduleId: m.id,
              moduleTitle: m.title,
              moduleCategory: m.category,
              stepType: step.type,
              primary: v.phrase,
              secondary: v.translation,
              audioUri: v.audioUri as string | number,
            });
          }
          break;
        }
        case 'voice_practice': {
          if (!hasPlayableAudio(step.audioUri)) break;
          rows.push({
            id: `${base}:vp`,
            moduleId: m.id,
            moduleTitle: m.title,
            moduleCategory: m.category,
            stepType: step.type,
            primary: step.targetPhrase || step.title,
            secondary: step.targetTranslation || '',
            audioUri: step.audioUri as string | number,
          });
          break;
        }
        case 'roleplay': {
          walkDialogues(rows, m, step, step.dialogues);
          break;
        }
        default:
          break;
      }
    }
  }

  return rows;
}
