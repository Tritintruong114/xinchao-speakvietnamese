import { AIConfig } from '@xinchao/shared';
import type { SurvivalCategory } from '@xinchao/shared';
import { newDashboardEntityId } from '@/lib/dashboardEntityId';
import { getDashboardSetting, SETTING_AI_MODULE_SYSTEM_PROMPT, SETTING_GEMINI } from '@/lib/dashboardSettingsDb';
import { ingestRemoteImageToSurvivalStorage } from '@/lib/survivalImageStorage';
import {
  buildSurvivalModuleInput,
  geminiModuleBodySchema,
  normalizePhaASteps,
  type GeminiModuleBody,
} from '@/lib/validation/survivalModuleDraft';

const GEMINI_GENERATE_TIMEOUT_MS = 90_000;
const MAX_RETRIES = 2;

function extractJsonFromModelText(text: string): unknown {
  const t = text.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t);
  const jsonStr = fence ? fence[1].trim() : t;
  return JSON.parse(jsonStr);
}

/**
 * System instruction: operator design system FIRST (when set), then Pha A rules.
 * Uses Gemini `systemInstruction` so brand/cover constraints are not treated as casual user text.
 */
function buildSystemInstruction(operatorPrompt: string | null): string {
  const phaATechnical = [
    AIConfig.PERSONA_PREFIX,
    'You author concise survival Vietnamese learning modules for travelers.',
    'Output must be a single JSON object only (no markdown outside JSON).',
    'Use natural Vietnamese for phrases and clear English for translations where applicable.',
    'Allowed step types ONLY: "teaching", "micro-learning", "voice_practice", "quiz".',
    'Do NOT use roleplay, dialogues, onboarding, reward, or branching.',
    'Each step must include "type" and required fields for that type:',
    '- teaching: title, content (Vietnamese lesson body)',
    '- micro-learning: title, vocabulary: [{ phrase (Vietnamese), translation (English) }] at least 2 items',
    '- voice_practice: title, targetPhrase (Vietnamese), targetTranslation (English)',
    '- quiz: title, question, options (array of 3-4 Vietnamese strings), correctIndex (0-based)',
    'Order steps as a lesson: teach → practice vocabulary → speak → quiz.',
    'Omit "id" fields on steps or leave empty; they will be assigned server-side.',
    'JSON keys: title (string), image_url (https URL or null), steps (array).',
    'For image_url: one publicly reachable https URL pointing to a raster image (JPEG/PNG/WebP). No data URLs. The backend will re-host the file; your URL is only the download source.',
  ];

  if (operatorPrompt?.trim()) {
    const brand = operatorPrompt.trim();
    const priority = [
      'PRIORITY — OPERATOR DESIGN SYSTEM (mandatory when present):',
      'Follow the block below for ALL of the following:',
      '(1) Module title wording and tone.',
      '(2) All step titles, Vietnamese copy, English glosses, and quiz wording.',
      '(3) Cover image (image_url): choose a stock/photo URL whose subject, mood, palette, and style MATCH this design system — not a generic unrelated image. If the design system specifies illustration vs photo, flat vs neo-brutalist colors, street-food vibe, etc., the cover must reflect that intent.',
      '(4) Do not invent a separate visual style; stay consistent with the operator rules.',
      '--- OPERATOR DESIGN SYSTEM ---',
      brand,
      '--- END OPERATOR DESIGN SYSTEM ---',
    ];
    return [...priority, '', ...phaATechnical].join('\n');
  }

  return [
    ...phaATechnical,
    'For image_url: pick a cover relevant to the module topic (stock-style https image) or null.',
  ].join('\n');
}

function buildUserTask(opts: { topicBrief: string; category: SurvivalCategory; stepCount: number }): string {
  return [
    'Generate one survival module. Obey the system instruction completely (including operator design system if present).',
    '',
    `Topic / brief: ${opts.topicBrief}`,
    `Category label: ${opts.category}`,
    `Target number of steps: ${opts.stepCount} (use exactly this many).`,
    '',
    'Return only JSON with shape: {"title":"string","image_url":"https://..." | null,"steps":[ ... ]}',
  ].join('\n');
}

export type GenerateModuleDraftResult =
  | {
      ok: true;
      draft: ReturnType<typeof buildSurvivalModuleInput>;
      warnings: string[];
    }
  | { ok: false; error: string };

export async function generateSurvivalModuleDraft(opts: {
  topicBrief: string;
  category: SurvivalCategory;
  sort_order: number;
  stepCount: number;
}): Promise<GenerateModuleDraftResult> {
  const apiKey = await getDashboardSetting(SETTING_GEMINI);
  if (!apiKey?.trim()) {
    return { ok: false, error: 'Gemini API key is not set. Add it under Dashboard → Settings.' };
  }

  const rawOperator = await getDashboardSetting(SETTING_AI_MODULE_SYSTEM_PROMPT);
  const operatorPrompt = rawOperator?.trim() ? rawOperator : null;

  const n = Math.min(12, Math.max(2, Math.floor(opts.stepCount)));
  const systemInstruction = buildSystemInstruction(operatorPrompt);
  const userTask = buildUserTask({
    topicBrief: opts.topicBrief.trim(),
    category: opts.category,
    stepCount: n,
  });

  const model = AIConfig.DEFAULT_GEMINI_MODEL;
  const url = `${AIConfig.GEMINI_BASE_URL}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  let lastErr = 'Unknown error';
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts: [{ text: userTask }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: operatorPrompt ? 0.42 : 0.55,
          },
        }),
        signal: AbortSignal.timeout(GEMINI_GENERATE_TIMEOUT_MS),
      });

      const body = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        lastErr = String((body as { error?: { message?: string } }).error?.message ?? res.statusText);
        continue;
      }

      const text = (body as { candidates?: { content?: { parts?: { text?: string }[] } }[] }).candidates?.[0]
        ?.content?.parts?.[0]?.text;
      if (!text?.trim()) {
        lastErr = 'Empty response from Gemini';
        continue;
      }

      let parsed: unknown;
      try {
        parsed = extractJsonFromModelText(text);
      } catch {
        lastErr = 'Gemini returned non-JSON text';
        continue;
      }

      const validated = geminiModuleBodySchema.safeParse(parsed);
      if (!validated.success) {
        lastErr = validated.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        continue;
      }

      const data: GeminiModuleBody = validated.data;
      const warnings: string[] = [];
      if (data.steps.length !== n) {
        warnings.push(`Expected ${n} steps; model returned ${data.steps.length}.`);
      }

      const moduleId = newDashboardEntityId('survival_module');
      const steps = normalizePhaASteps(data.steps);

      let imageUrl: string | null = null;
      if (data.image_url && typeof data.image_url === 'string' && data.image_url.startsWith('https://')) {
        const ingested = await ingestRemoteImageToSurvivalStorage({
          url: data.image_url,
          prefix: moduleId,
        });
        if (ingested.url) {
          imageUrl = ingested.url;
        } else {
          warnings.push(`Cover image not saved (using null): ${ingested.error ?? 'unknown error'}`);
        }
      }

      const draft = buildSurvivalModuleInput({
        moduleId,
        title: data.title,
        category: opts.category,
        sort_order: opts.sort_order,
        image_url: imageUrl,
        steps,
      });
      return { ok: true, draft, warnings };
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
    }
  }

  return { ok: false, error: lastErr };
}
