'use server';

import type { SurvivalModuleInput } from '@xinchao/shared';
import { revalidatePath } from 'next/cache';
import { loadSurvivalModuleById, updateSurvivalModuleImageUrl } from '../data';
import { synthesizeElevenLabsSpeech } from '@/lib/ai/elevenlabsTts';
import { generateSurvivalModuleDraft } from '@/lib/ai/geminiSurvivalModule';
import { synthesizeAndUploadSlot } from '@/lib/ai/survivalModuleTts';
import { applyTtsUrls, collectTtsSlots } from '@/lib/ai/survivalTtsCore';
import { generateCoverScenePromptWithGemini } from '@/lib/ai/geminiModuleCoverImagePrompt';
import { generateModuleCoverImageWithGemini } from '@/lib/ai/geminiModuleCoverImage';
import {
  getDashboardSetting,
  SETTING_AI_MODULE_SYSTEM_PROMPT,
  SETTING_ELEVENLABS,
  SETTING_ELEVENLABS_VOICE,
  SETTING_GEMINI,
} from '@/lib/dashboardSettingsDb';
import { guessExtFromMime, uploadSurvivalImageBuffer } from '@/lib/survivalImageStorage';

export async function generateModuleDraftAction(payload: {
  topicBrief: string;
  category: string;
  sort_order: number;
  stepCount: number;
}): Promise<
  { ok: true; draft: SurvivalModuleInput; warnings: string[] } | { ok: false; error: string }
> {
  return generateSurvivalModuleDraft(payload);
}

export async function generateModuleAudioAction(
  input: SurvivalModuleInput,
): Promise<
  | {
      ok: true;
      draft: SurvivalModuleInput;
      warnings: string[];
      stats: { newUploads: number; deduplicated: number };
    }
  | { ok: false; error: string }
> {
  const apiKey = await getDashboardSetting(SETTING_ELEVENLABS);
  if (!apiKey?.trim()) {
    return { ok: false, error: 'ElevenLabs API key is not set. Add it under Dashboard → Settings.' };
  }

  let voiceId = (await getDashboardSetting(SETTING_ELEVENLABS_VOICE))?.trim();
  if (!voiceId) {
    voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() ?? '';
  }
  if (!voiceId) {
    return {
      ok: false,
      error:
        'ElevenLabs voice id is not set. Add it under Dashboard → Settings (or set ELEVENLABS_VOICE_ID on the server).',
    };
  }

  const slots = collectTtsSlots(input);
  if (slots.length === 0) {
    return {
      ok: false,
      error:
        'No TTS targets found. Add teaching content, vocabulary phrases, voice practice lines, or quiz questions first.',
    };
  }

  const prefix = input.id.trim() || 'draft';
  const textToUrl = new Map<string, string>();
  const warnings: string[] = [];
  const updates: { slot: (typeof slots)[number]['slot']; url: string }[] = [];
  let newUploads = 0;
  let deduplicated = 0;

  const fetchAudio = (text: string) =>
    synthesizeElevenLabsSpeech({ apiKey, voiceId: voiceId!, text });

  for (const { slot, text } of slots) {
    const hit = textToUrl.get(text);
    if (hit) {
      updates.push({ slot, url: hit });
      deduplicated += 1;
      continue;
    }

    const { url, error } = await synthesizeAndUploadSlot({
      prefix,
      text,
      fetchAudio,
    });

    if (error || !url) {
      warnings.push(error ?? 'Upload failed');
      continue;
    }

    textToUrl.set(text, url);
    updates.push({ slot, url });
    newUploads += 1;
  }

  if (updates.length === 0) {
    return {
      ok: false,
      error: warnings.length ? warnings.join(' · ') : 'TTS produced no audio clips.',
    };
  }

  const draft = applyTtsUrls(input, updates);
  return {
    ok: true,
    draft,
    warnings,
    stats: { newUploads, deduplicated },
  };
}

/** ElevenLabs TTS for a single teaching step (`content` → `audioUri`). Does not save the module. */
export async function regenerateTeachingStepAudioAction(payload: {
  moduleId: string;
  /** Vietnamese lesson body — must match what you want spoken */
  text: string;
}): Promise<{ ok: true; audio_url: string } | { ok: false; error: string }> {
  const apiKey = await getDashboardSetting(SETTING_ELEVENLABS);
  if (!apiKey?.trim()) {
    return { ok: false, error: 'ElevenLabs API key is not set. Add it under Dashboard → Settings.' };
  }

  let voiceId = (await getDashboardSetting(SETTING_ELEVENLABS_VOICE))?.trim();
  if (!voiceId) {
    voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() ?? '';
  }
  if (!voiceId) {
    return {
      ok: false,
      error:
        'ElevenLabs voice id is not set. Add it under Dashboard → Settings (or set ELEVENLABS_VOICE_ID on the server).',
    };
  }

  const text = payload.text.trim();
  if (!text) {
    return { ok: false, error: 'Teaching content is empty — add text before regenerating audio.' };
  }

  const prefix = payload.moduleId.trim() || 'draft';

  const fetchAudio = (t: string) =>
    synthesizeElevenLabsSpeech({ apiKey, voiceId: voiceId!, text: t });

  const { url, error } = await synthesizeAndUploadSlot({
    prefix,
    text,
    fetchAudio,
  });

  if (error || !url) {
    return { ok: false, error: error ?? 'TTS upload failed' };
  }

  return { ok: true, audio_url: url };
}

function resolveSurvivalCategory(value: string | null | undefined, fallback: string): string {
  const v = value?.trim();
  return v || fallback;
}

/** Dedicated cover pipeline: Gemini image model → Storage public URL (does not run text JSON module generation). */
export async function regenerateModuleCoverImageAction(payload: {
  moduleId: string;
  /** Prefer current form values so the cover matches unsaved edits. */
  title?: string;
  category?: string;
  /** Optional; highest-priority creative steer after title (dashboard textarea). */
  coverContext?: string;
}): Promise<
  { ok: true; image_url: string; savedToDb: boolean } | { ok: false; error: string }
> {
  const apiKey = (await getDashboardSetting(SETTING_GEMINI))?.trim();
  if (!apiKey) {
    return { ok: false, error: 'Gemini API key is not set. Add it under Dashboard → Settings.' };
  }

  const prefix = payload.moduleId.trim();
  if (!prefix) {
    return { ok: false, error: 'Module id is required to upload the cover.' };
  }

  const { module, error: loadErr } = await loadSurvivalModuleById(prefix);

  const title = (payload.title?.trim() || module?.title?.trim() || '').trim();
  if (!title) {
    return {
      ok: false,
      error:
        loadErr ??
        'Add a module title before generating a cover (title is used as the scene subject).',
    };
  }

  const category = resolveSurvivalCategory(
    payload.category ?? module?.category ?? null,
    'Beginner',
  );

  const operatorPrompt = (await getDashboardSetting(SETTING_AI_MODULE_SYSTEM_PROMPT))?.trim() ?? null;

  const editorCoverContext = payload.coverContext?.trim() || null;

  const scene = await generateCoverScenePromptWithGemini({
    apiKey,
    operatorPrompt,
    subject: { title, category },
    editorCoverContext,
  });
  if (scene.ok === false) {
    return { ok: false, error: scene.error };
  }

  const gen = await generateModuleCoverImageWithGemini({
    apiKey,
    operatorPrompt,
    sceneBrief: scene.scene_prompt,
    subject: { title, category },
    userCoverContext: editorCoverContext,
  });

  if (gen.ok === false) {
    return { ok: false, error: gen.error };
  }

  const ext = guessExtFromMime(gen.mimeType);
  const upload = await uploadSurvivalImageBuffer({
    prefix,
    subpath: 'covers',
    buffer: gen.buffer,
    contentType: gen.mimeType,
    fileExtension: ext,
  });

  if (upload.error || !upload.url) {
    return { ok: false, error: upload.error ?? 'Upload failed' };
  }

  const persist = await updateSurvivalModuleImageUrl(prefix, upload.url);
  if (persist.error) {
    return { ok: false, error: persist.error };
  }

  revalidatePath('/dashboard/library');

  return { ok: true, image_url: upload.url, savedToDb: persist.rowsUpdated > 0 };
}

const MAX_TEACHING_IMAGE_SUBJECT = 240;

function buildTeachingImageSubject(opts: {
  stepTitle: string;
  teachingContent: string;
  visualHighlight?: string;
}): string {
  const title = opts.stepTitle.trim() || 'Teaching';
  const body = opts.teachingContent.replace(/\s+/g, ' ').trim().slice(0, 160);
  const vh = opts.visualHighlight?.trim();
  const parts = [title, body || undefined, vh].filter(Boolean) as string[];
  const s = parts.join(' — ');
  return s.length > MAX_TEACHING_IMAGE_SUBJECT
    ? `${s.slice(0, MAX_TEACHING_IMAGE_SUBJECT - 1)}…`
    : s;
}

/**
 * Gemini image → Storage for `SurvivalStep.image_url` on teaching steps (mobile hero).
 * Does not write the DB — caller patches the step and Save persists `steps` JSON.
 */
export async function generateTeachingStepImageAction(payload: {
  moduleId: string;
  moduleCategory: string;
  stepTitle: string;
  teachingContent: string;
  visualHighlight?: string;
  /** Optional extra steer (same role as module cover context). */
  stepImageContext?: string;
}): Promise<{ ok: true; image_url: string } | { ok: false; error: string }> {
  const apiKey = (await getDashboardSetting(SETTING_GEMINI))?.trim();
  if (!apiKey) {
    return { ok: false, error: 'Gemini API key is not set. Add it under Dashboard → Settings.' };
  }

  const prefix = payload.moduleId.trim();
  if (!prefix) {
    return { ok: false, error: 'Module id is required to upload the image.' };
  }

  if (!payload.stepTitle?.trim() && !payload.teachingContent?.trim()) {
    return {
      ok: false,
      error: 'Add a step title or teaching content before generating the step image.',
    };
  }

  const category = resolveSurvivalCategory(payload.moduleCategory, 'Beginner');
  const syntheticTitle = buildTeachingImageSubject({
    stepTitle: payload.stepTitle,
    teachingContent: payload.teachingContent,
    visualHighlight: payload.visualHighlight,
  });

  const operatorPrompt = (await getDashboardSetting(SETTING_AI_MODULE_SYSTEM_PROMPT))?.trim() ?? null;

  const editorCoverContext = payload.stepImageContext?.trim() || null;

  const scene = await generateCoverScenePromptWithGemini({
    apiKey,
    operatorPrompt,
    subject: { title: syntheticTitle, category },
    editorCoverContext,
    sceneKind: 'teaching_step',
    teachingLessonBody: payload.teachingContent.trim(),
    teachingStepTitle: payload.stepTitle.trim(),
    teachingVisualHighlight: payload.visualHighlight,
  });
  if (scene.ok === false) {
    return { ok: false, error: scene.error };
  }

  const gen = await generateModuleCoverImageWithGemini({
    apiKey,
    operatorPrompt,
    sceneBrief: scene.scene_prompt,
    subject: { title: syntheticTitle, category },
    userCoverContext: editorCoverContext,
    imageJob: 'teaching_step',
  });

  if (gen.ok === false) {
    return { ok: false, error: gen.error };
  }

  const ext = guessExtFromMime(gen.mimeType);
  const upload = await uploadSurvivalImageBuffer({
    prefix,
    subpath: 'teaching-steps',
    buffer: gen.buffer,
    contentType: gen.mimeType,
    fileExtension: ext,
  });

  if (upload.error || !upload.url) {
    return { ok: false, error: upload.error ?? 'Upload failed' };
  }

  return { ok: true, image_url: upload.url };
}
