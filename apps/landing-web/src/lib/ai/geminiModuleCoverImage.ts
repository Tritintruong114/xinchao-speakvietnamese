import type { SurvivalCategory } from '@xinchao/shared';
import { AIConfig } from '@xinchao/shared';

/** Matches home `ModuleCard` image area: `IMAGE_HEIGHT = CARD_WIDTH * (2/3)` → width:height = 3:2. */
export const MODULE_COVER_ASPECT_RATIO = '3:2' as const;

const MAX_SUBJECT_TITLE_LEN = 240;
const MAX_EDITOR_COVER_CONTEXT = 2000;

function sanitizeSubjectTitle(raw: string): string {
  const oneLine = raw.replace(/\s+/g, ' ').trim();
  return oneLine.length > MAX_SUBJECT_TITLE_LEN ? `${oneLine.slice(0, MAX_SUBJECT_TITLE_LEN)}…` : oneLine;
}

export type GeminiCoverImageResult =
  | { ok: true; buffer: Buffer; mimeType: string }
  | { ok: false; error: string };

function extractInlineImage(body: unknown): { data: string; mimeType: string } | null {
  const parts = (body as { candidates?: Array<{ content?: { parts?: unknown[] } }> })?.candidates?.[0]
    ?.content?.parts;
  if (!Array.isArray(parts)) return null;
  for (const part of parts) {
    const p = part as {
      inlineData?: { data?: string; mimeType?: string };
      inline_data?: { data?: string; mime_type?: string };
    };
    const id = p.inlineData ?? p.inline_data;
    if (id?.data && typeof id.data === 'string') {
      const raw = id as { mimeType?: string; mime_type?: string };
      const mime = raw.mimeType ?? raw.mime_type ?? 'image/png';
      return { data: id.data, mimeType: mime };
    }
  }
  return null;
}

/**
 * Generates a cover via Gemini native image model (not JSON text).
 * Aspect ratio aligns with mobile home `ModuleCard` (3:2 landscape).
 */
export async function generateModuleCoverImageWithGemini(opts: {
  apiKey: string;
  operatorPrompt: string | null;
  /**
   * Title-first scene brief from the text agent (`generateCoverScenePromptWithGemini`).
   * Primary visual intent; must not contain wording to render as legible text in-frame.
   */
  sceneBrief: string;
  /** Title + category anchor for redundancy with the brief. */
  subject: { title: string; category: SurvivalCategory };
  /** Optional; strongest steer after title — repeats at render time so the image model obeys it. */
  userCoverContext?: string | null;
  /** Teaching heroes emphasize fun + situational fidelity to the lesson brief. */
  imageJob?: 'module_cover' | 'teaching_step';
}): Promise<GeminiCoverImageResult> {
  const sceneBrief = opts.sceneBrief.trim();
  if (!sceneBrief) {
    return { ok: false, error: 'Gemini image: scene brief is empty' };
  }

  const theme = sanitizeSubjectTitle(opts.subject.title);
  const band = opts.subject.category;

  const editorCtx = opts.userCoverContext?.trim()
    ? opts.userCoverContext.trim().slice(0, MAX_EDITOR_COVER_CONTEXT)
    : '';

  const brand = opts.operatorPrompt?.trim()
    ? editorCtx
      ? `Secondary brand notes from Settings (use only where they do not override the editor context above): ${opts.operatorPrompt.trim()}`
      : `Brand and palette notes from Settings (apply when they help the scene): ${opts.operatorPrompt.trim()}`
    : '';

  const job = opts.imageJob ?? 'module_cover';
  const opener =
    job === 'teaching_step'
      ? `Draw one landscape illustration, aspect ratio ${MODULE_COVER_ASPECT_RATIO}. Hero for a FUN mobile teaching screen: neo-brutalist flat vector with playful, lively energy. Depict the concrete situations in the brief — clear WHO-WHERE-WHAT story beats from the lesson — not generic filler. Vietnamese street or setting details when the lesson implies Vietnam. Lesson hook label: "${theme}" (${band}).`
      : `Draw one landscape illustration, aspect ratio ${MODULE_COVER_ASPECT_RATIO}. Neo-brutalist flat vector for a phone thumbnail: Vietnamese urban setting (tropical light, local props and architecture — not a generic Western city). The scene must match the title: "${theme}" (${band}). One clear story moment, not a generic backdrop.`;

  const prompt = [
    opener,
    'Line weight: use very bold black contours — thick uniform strokes around every major shape, like screen print or vinyl sticker art. No hairlines or timid pencil-thin outlines. Outer silhouettes and internal edges should read strong at small size; high contrast between jet-black ink and flat color fills.',
    'Keep the human cast small: about one to three people in focus, or a few readable figures; do not fill the frame with a rushing crowd unless the title clearly calls for it. Diagonals, steam, vehicles, and objects carry the energy.',
    brand,
    'Scene to render (do not paint any readable letters or words from this text onto the image; describe only what to show):',
    sceneBrief,
    editorCtx
      ? `Editor cover context — honor this first after the title topic "${theme}" (still no readable text in the picture): ${editorCtx}`
      : '',
    'The picture must fill the entire image from the left edge to the right edge and top to bottom with paint: sky, walls, ground, objects, or solid color must run all the way to each border. Do not leave an empty band, margin, mat, or second “picture inside” the canvas. Do not add a frame, phone outline, card shape, or drop shadow around a smaller drawing.',
    'No typography in the artwork: no captions, logos, stickers with letters, or readable sign text. If there is a sign or train front, use blank color blocks or abstract marks only.',
  ]
    .filter((p) => p.length > 0)
    .join('\n\n');

  const url = `${AIConfig.GEMINI_BASE_URL}/models/${AIConfig.GEMINI_IMAGE_MODEL}:generateContent?key=${encodeURIComponent(opts.apiKey)}`;

  const generationConfig = {
    responseModalities: ['IMAGE'],
    imageConfig: { aspectRatio: MODULE_COVER_ASPECT_RATIO },
  };

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig,
  };

  let res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    return { ok: false, error: 'Gemini image: invalid JSON response' };
  }

  if (!res.ok) {
    const errMsg =
      typeof (json as { error?: { message?: string } })?.error?.message === 'string'
        ? (json as { error: { message: string } }).error.message
        : `HTTP ${res.status}`;
    // Retry with TEXT+IMAGE if IMAGE-only is rejected by the API
    if (res.status === 400 || res.status === 404) {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
            imageConfig: { aspectRatio: MODULE_COVER_ASPECT_RATIO },
          },
        }),
        signal: AbortSignal.timeout(120_000),
      });
      try {
        json = await res.json();
      } catch {
        return { ok: false, error: errMsg };
      }
      if (!res.ok) {
        const err2 =
          typeof (json as { error?: { message?: string } })?.error?.message === 'string'
            ? (json as { error: { message: string } }).error.message
            : `HTTP ${res.status}`;
        return { ok: false, error: err2 };
      }
    } else {
      return { ok: false, error: errMsg };
    }
  }

  const inline = extractInlineImage(json);
  if (!inline) {
    return { ok: false, error: 'Gemini image: no inline image in response' };
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(inline.data, 'base64');
  } catch {
    return { ok: false, error: 'Gemini image: invalid base64' };
  }

  if (buffer.length < 256) {
    return { ok: false, error: 'Gemini image: decoded image too small' };
  }

  return { ok: true, buffer, mimeType: inline.mimeType };
}
