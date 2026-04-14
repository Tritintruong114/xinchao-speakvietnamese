import type { SurvivalCategory } from '@xinchao/shared';
import { AIConfig } from '@xinchao/shared';
import { z } from 'zod';

const MAX_TITLE_IN_AGENT = 240;
const MAX_OPERATOR_SNIPPET = 3000;
const MAX_EDITOR_COVER_CONTEXT = 2000;
const MAX_TEACHING_BODY_IN_AGENT = 4500;
const GEMINI_TIMEOUT_MS = 45_000;
const MAX_RETRIES = 2;

const sceneResponseSchema = z.object({
  scene_prompt: z.string().min(40).max(6000),
});

function sanitizeOneLine(raw: string, max: number): string {
  const oneLine = raw.replace(/\s+/g, ' ').trim();
  return oneLine.length > max ? `${oneLine.slice(0, max)}…` : oneLine;
}

function extractJsonFromModelText(text: string): unknown {
  const t = text.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t);
  const jsonStr = fence ? fence[1].trim() : t;
  return JSON.parse(jsonStr);
}

const SYSTEM_INSTRUCTION = [
  'You help Xin Chào, a Vietnamese street-learning app. Reply with only valid JSON: {"scene_prompt":"..."}.',
  '',
  'The field scene_prompt must be one continuous paragraph of English (about five to twelve sentences) for an image model. Flowing prose only — no bullet lists, no markdown inside the string.',
  '',
  'Title is the script: describe one clear situation a learner would actually see when living that title — not a generic city scene. Name concrete props and actions tied to those words (food, vehicle, ticket gesture, stall hardware, platform edge, etc.).',
  '',
  'Vietnam-first look: tropical light, urban tube-house silhouettes, awnings, xe máy or cyclo where fitting, HCMC or Hanoi metro line colors and platform cues when the title is about metro (elevated track, curved train nose, yellow safety strip) — still unmistakably Vietnam, not a generic worldwide subway poster. Do not output wording for signs; describe signs as blank panels or colored shapes.',
  '',
  'Use a small cast: usually one to three people visible (or a few distant silhouettes). Avoid a dense rushing crowd unless the title explicitly demands chaos. Energy comes from angle, color, and body language, not headcount.',
  '',
  'Say the illustration should touch all four edges of the canvas with no cream margin band around the art.',
  '',
  'Also ask for extra-bold black outline art: thick contour lines everywhere, sticker or screen-print weight, not delicate linework.',
  '',
  'If the user message includes Editor cover context, treat that block as the strongest creative steer after the title — fold it into scene_prompt and prefer it over generic Settings operator notes when they disagree (title still wins if there is a direct conflict).',
].join('\n');

const SYSTEM_INSTRUCTION_TEACHING_STEP = [
  'You help Xin Chào. Reply with only valid JSON: {"scene_prompt":"..."}.',
  '',
  'This job is a TEACHING STEP hero image: one illustration for a single lesson screen on the phone — it must feel fun, lively, and inviting, not stiff or corporate.',
  '',
  'The field scene_prompt must be one continuous paragraph of English (about eight to fourteen sentences). Flowing prose only — no bullet lists, no markdown inside the string.',
  '',
  'ABSOLUTE FIDELITY: In the user message, the section FULL TEACHING CONTENT is the only script. Read it line by line. Every situation, object, place, food, vehicle, gesture, or social beat the lesson implies must show up as concrete, specific visuals. Do not drift into generic Vietnam stock scenery, unrelated metaphors, or a different scenario than the lesson describes. If the lesson is about ordering at a stall, depict that ordering beat; if about metro tickets, depict that; if several beats exist, choose the single clearest frozen moment that still packs maximum situational truth from the text.',
  '',
  'FUN + SITUATION: Write scene_prompt so the image model paints a crisp WHO-WHERE-WHAT moment — characters, props, spatial relationships, body language, and a hint of story (what just happened or what is about to happen). Keep it playful and energetic: expressive poses, tasty or tactile props, comic rhythm in the layout — still respectful.',
  '',
  'Vietnam-first when the lesson is set in Vietnam: believable street, food, or transit details. Signs only as blank colored shapes — never spell words that would appear as readable text in the picture.',
  '',
  'Small cast (about one to four people). Full bleed to all edges; no cream margin. Extra-bold black outline sticker style.',
  '',
  'Editor notes may tune mood or palette but must not contradict the teaching body. Operator notes from Settings are weakest.',
].join('\n');

function buildUserMessage(opts: {
  title: string;
  category: SurvivalCategory;
  operatorSnippet: string | null;
  editorCoverContext: string | null;
}): string {
  const title = sanitizeOneLine(opts.title, MAX_TITLE_IN_AGENT);
  const op = opts.operatorSnippet?.trim()
    ? opts.operatorSnippet.trim().slice(0, MAX_OPERATOR_SNIPPET)
    : 'None.';

  const ctx = opts.editorCoverContext?.trim()
    ? opts.editorCoverContext.trim().slice(0, MAX_EDITOR_COVER_CONTEXT)
    : null;

  const lines = [`Title: ${title}`, `Category: ${opts.category}`];
  if (ctx) {
    lines.push(
      `Editor cover context (highest priority for mood, props, palette emphasis, and composition after the title — weave into the scene): ${ctx}`,
    );
  }
  lines.push(`Operator notes from Settings (secondary if editor context is present): ${op}`);
  return lines.join('\n');
}

function buildTeachingStepUserMessage(opts: {
  stepTitle: string;
  category: SurvivalCategory;
  fullTeachingBody: string;
  visualHighlight: string | null;
  operatorSnippet: string | null;
  editorCoverContext: string | null;
}): string {
  const title = sanitizeOneLine(opts.stepTitle || 'Lesson', MAX_TITLE_IN_AGENT);
  const bodyRaw = opts.fullTeachingBody.trim();
  const body =
    bodyRaw.length > MAX_TEACHING_BODY_IN_AGENT
      ? `${bodyRaw.slice(0, MAX_TEACHING_BODY_IN_AGENT)}…`
      : bodyRaw;
  const op = opts.operatorSnippet?.trim()
    ? opts.operatorSnippet.trim().slice(0, MAX_OPERATOR_SNIPPET)
    : 'None.';
  const vh = opts.visualHighlight?.trim() ? opts.visualHighlight.trim() : 'None.';
  const ctx = opts.editorCoverContext?.trim()
    ? opts.editorCoverContext.trim().slice(0, MAX_EDITOR_COVER_CONTEXT)
    : null;

  const lines = [
    `Step title (short label only): ${title}`,
    `Category band: ${opts.category}`,
    '',
    'FULL TEACHING CONTENT — this is the single source of truth; ground every shape, prop, and situation in this text (do not invent a different lesson):',
    '',
    body,
    '',
    `Visual highlight (optional): ${vh}`,
  ];
  if (ctx) {
    lines.push('', `Editor / extra notes (must not contradict the teaching body): ${ctx}`);
  }
  lines.push('', `Operator notes from Settings (weakest): ${op}`);
  return lines.join('\n');
}

export type CoverScenePromptResult =
  | { ok: true; scene_prompt: string }
  | { ok: false; error: string };

/**
 * Text agent step: expands the module title into a culturally grounded scene brief for the image model.
 */
export async function generateCoverScenePromptWithGemini(opts: {
  apiKey: string;
  operatorPrompt: string | null;
  subject: { title: string; category: SurvivalCategory };
  /** Optional; takes priority over Settings operator prompt when both apply. */
  editorCoverContext?: string | null;
  /** Teaching-step heroes use full lesson body + dedicated system prompt. */
  sceneKind?: 'module_cover' | 'teaching_step';
  /** Required when sceneKind is teaching_step — full markdown/text of the lesson */
  teachingLessonBody?: string;
  teachingStepTitle?: string;
  teachingVisualHighlight?: string;
}): Promise<CoverScenePromptResult> {
  const kind = opts.sceneKind ?? 'module_cover';

  const operatorSnippet = opts.operatorPrompt?.trim()
    ? opts.operatorPrompt.trim().slice(0, MAX_OPERATOR_SNIPPET)
    : null;

  const editorCoverContext = opts.editorCoverContext?.trim()
    ? opts.editorCoverContext.trim().slice(0, MAX_EDITOR_COVER_CONTEXT)
    : null;

  let systemText = SYSTEM_INSTRUCTION;
  let userMessage: string;
  let temperature = 0.48;

  if (kind === 'teaching_step') {
    const fullBody = opts.teachingLessonBody?.trim() ?? '';
    if (!fullBody) {
      return { ok: false, error: 'Cover scene agent: teaching lesson body is empty.' };
    }
    systemText = SYSTEM_INSTRUCTION_TEACHING_STEP;
    userMessage = buildTeachingStepUserMessage({
      stepTitle: opts.teachingStepTitle?.trim() || opts.subject.title.trim() || 'Lesson',
      category: opts.subject.category,
      fullTeachingBody: fullBody,
      visualHighlight: opts.teachingVisualHighlight?.trim() ?? null,
      operatorSnippet,
      editorCoverContext,
    });
    temperature = 0.52;
  } else {
    const title = opts.subject.title.trim();
    if (!title) {
      return { ok: false, error: 'Cover scene agent: title is empty.' };
    }
    userMessage = buildUserMessage({
      title,
      category: opts.subject.category,
      operatorSnippet,
      editorCoverContext,
    });
  }

  const model = AIConfig.DEFAULT_GEMINI_MODEL;
  const url = `${AIConfig.GEMINI_BASE_URL}/models/${model}:generateContent?key=${encodeURIComponent(opts.apiKey)}`;

  let lastErr = 'Unknown error';
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemText }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature,
          },
        }),
        signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
      });

      const body = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        lastErr = String((body as { error?: { message?: string } }).error?.message ?? res.statusText);
        continue;
      }

      const text = (body as { candidates?: { content?: { parts?: { text?: string }[] } }[] }).candidates?.[0]
        ?.content?.parts?.[0]?.text;
      if (!text?.trim()) {
        lastErr = 'Cover scene agent: empty response';
        continue;
      }

      let parsed: unknown;
      try {
        parsed = extractJsonFromModelText(text);
      } catch {
        lastErr = 'Cover scene agent: invalid JSON';
        continue;
      }

      const validated = sceneResponseSchema.safeParse(parsed);
      if (!validated.success) {
        lastErr = validated.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        continue;
      }

      return { ok: true, scene_prompt: validated.data.scene_prompt.trim() };
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
    }
  }

  return { ok: false, error: `Cover scene agent: ${lastErr}` };
}
