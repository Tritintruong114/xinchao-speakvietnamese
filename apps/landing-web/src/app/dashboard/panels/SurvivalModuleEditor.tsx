'use client';

import type { SurvivalModule, SurvivalModuleInput, SurvivalStep } from '@xinchao/shared';
import { BrutalButton, BrutalCard, BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import { CheckCircle2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { newDashboardEntityId } from '@/lib/dashboardEntityId';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  generateModuleAudioAction,
  generateModuleDraftAction,
  regenerateModuleCoverImageAction,
} from '../library/ai-actions';
import { deleteModuleAction, saveModuleAction } from '../library/actions';
import { ModuleDraftHitlChecklist } from './ModuleDraftHitlChecklist';
import { ModuleStepsEditor } from './ModuleStepsEditor';

const formIconBtn =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0';

const formIconBtnDanger =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-red-600 shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 hover:bg-red-50 disabled:opacity-50 disabled:hover:translate-y-0';

const emptyInput = (defaultCategory: string): SurvivalModuleInput => ({
  id: '',
  title: '',
  category: defaultCategory,
  sort_order: 0,
  image_url: null,
  steps: [],
});

function moduleToInput(m: SurvivalModule): SurvivalModuleInput {
  return {
    id: m.id,
    title: m.title,
    category: m.category,
    sort_order: m.sort_order ?? 0,
    image_url: m.image_url ?? null,
    steps: m.steps ?? [],
  };
}

type BaseOpts = {
  layout?: 'page' | 'panel';
  onSaved?: () => void;
  onDeleted?: () => void;
  /** From Dashboard → Categories; defaults to Beginner / Survival / Legend */
  categoryOptions?: string[];
};

type Props =
  | ({ mode: 'create'; initial: null } & BaseOpts)
  | ({ mode: 'edit'; initial: SurvivalModule } & BaseOpts);

export function SurvivalModuleEditor(props: Props) {
  const layout = props.layout ?? 'page';
  const router = useRouter();
  const categoryOptions = useMemo(
    () =>
      props.categoryOptions?.length
        ? props.categoryOptions
        : (['Beginner', 'Survival', 'Legend'] as string[]),
    [props.categoryOptions],
  );
  const defaultCategory = categoryOptions[0] ?? 'Beginner';

  const editorCategoryOptions = useMemo(() => {
    const o = [...categoryOptions];
    if (props.mode === 'edit' && !o.includes(props.initial.category)) o.push(props.initial.category);
    return o;
  }, [categoryOptions, props]);

  const [input, setInput] = useState<SurvivalModuleInput>(() =>
    props.mode === 'edit'
      ? moduleToInput(props.initial)
      : { ...emptyInput(defaultCategory), id: newDashboardEntityId('survival_module') },
  );
  const [steps, setSteps] = useState<SurvivalStep[]>(() =>
    props.mode === 'edit' ? [...(props.initial.steps ?? [])] : [],
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [coverBusy, setCoverBusy] = useState(false);
  const [moduleBusy, setModuleBusy] = useState(false);
  const [audioBusy, setAudioBusy] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiStepCount, setAiStepCount] = useState(4);
  const [coverContext, setCoverContext] = useState('');
  const [coverNotice, setCoverNotice] = useState<string | null>(null);
  const [moduleNotice, setModuleNotice] = useState<string | null>(null);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);

  useEffect(() => {
    if (props.mode !== 'create') return;
    setInput((prev) => {
      if (categoryOptions.includes(prev.category)) return prev;
      return { ...prev, category: defaultCategory };
    });
  }, [props.mode, categoryOptions, defaultCategory]);

  /** Only block UI during save/delete — cover / draft / audio / step gens may run in parallel. */
  const saving = busy;

  const onGenerateCoverImage = useCallback(async () => {
    setErr(null);
    setCoverNotice(null);
    const id = input.id.trim();
    if (!id) {
      setErr('Module id is missing — reload the page or create a new module.');
      return;
    }
    setCoverBusy(true);
    const res = await regenerateModuleCoverImageAction({
      moduleId: id,
      title: input.title,
      category: input.category,
      coverContext: coverContext.trim() || undefined,
    });
    setCoverBusy(false);
    if (res.ok === false) {
      setErr(res.error);
      return;
    }
    setInput((s) => ({ ...s, image_url: res.image_url }));
    setCoverNotice(
      res.savedToDb
        ? 'Cover generated, uploaded to Storage, and saved to the database — Image URL updated below.'
        : 'Cover generated and uploaded — Image URL updated below. Click Save once so this new module row stores the URL (module not in DB yet).',
    );
  }, [input.id, input.title, input.category, coverContext]);

  const onGenerateModuleDraft = useCallback(async () => {
    setErr(null);
    setModuleNotice(null);
    setModuleBusy(true);
    const topicBrief = aiTopic.trim() || input.title.trim();
    if (!topicBrief) {
      setErr('Add a topic brief or title before generating.');
      setModuleBusy(false);
      return;
    }
    const res = await generateModuleDraftAction({
      topicBrief,
      category: input.category,
      sort_order: input.sort_order,
      stepCount: aiStepCount,
    });
    setModuleBusy(false);
    if (res.ok === false) {
      setErr(res.error);
      return;
    }
    const keepId = props.mode === 'edit' ? props.initial.id : res.draft.id;
    setInput((prev) => ({
      ...prev,
      id: keepId,
      title: res.draft.title,
      category: res.draft.category,
      sort_order: res.draft.sort_order,
      image_url: res.draft.image_url,
    }));
    setSteps(res.draft.steps);
    const parts = [...res.warnings, 'Draft loaded — review steps, then run audio or adjust cover.'].filter(Boolean);
    setModuleNotice(parts.join(' '));
  }, [aiTopic, aiStepCount, input.category, input.sort_order, input.title, props]);

  const onGenerateAudio = useCallback(async () => {
    setErr(null);
    setAudioNotice(null);
    setAudioBusy(true);
    const payload: SurvivalModuleInput = { ...input, steps };
    const res = await generateModuleAudioAction(payload);
    setAudioBusy(false);
    if (res.ok === false) {
      setErr(res.error);
      return;
    }
    const keepId = input.id;
    setInput({ ...res.draft, id: keepId });
    setSteps(res.draft.steps);
    const w = res.warnings.length ? `${res.warnings.length} warning(s). ` : '';
    setAudioNotice(
      `${w}TTS: ${res.stats.newUploads} new file(s), ${res.stats.deduplicated} reused line(s). Review clips before save.`,
    );
  }, [input, steps]);

  const save = useCallback(
    async (redirectToLibrary: boolean) => {
      setErr(null);
      setBusy(true);
      const payload: SurvivalModuleInput = { ...input, steps };
      const { error } = await saveModuleAction(payload);
      setBusy(false);
      if (error) {
        setErr(error);
        return;
      }
      router.refresh();
      if (redirectToLibrary) {
        if (layout === 'panel') {
          props.onSaved?.();
        } else {
          router.push('/dashboard/library');
        }
      }
    },
    [input, steps, router, layout, props],
  );

  const onDelete = useCallback(async () => {
    if (props.mode !== 'edit') return;
    if (!window.confirm(`Delete module "${props.initial.id}"?`)) return;
    setBusy(true);
    const { error } = await deleteModuleAction(props.initial.id);
    setBusy(false);
    if (error) {
      setErr(error);
      return;
    }
    router.refresh();
    if (layout === 'panel') {
      props.onDeleted?.();
    } else {
      router.push('/dashboard/library');
    }
  }, [props, router, layout]);

  const sectionClass =
    layout === 'panel' ? 'mx-0 max-w-none space-y-4' : 'mx-auto max-w-4xl space-y-6';

  return (
    <section className={sectionClass}>
      {layout === 'page' ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <BrutalTag backgroundColor="bg-brand-pink" className="mb-2">
              Library
            </BrutalTag>
            <BrutalHeading as="h1" className="text-text-main">
              {props.mode === 'create' ? 'New module' : `Edit: ${props.initial.id}`}
            </BrutalHeading>
          </div>
          <Link
            href="/dashboard/library"
            className="text-sm font-black uppercase tracking-wide text-text-main underline decoration-2 underline-offset-4"
          >
            Back to list
          </Link>
        </div>
      ) : null}

      {err ? (
        <div className="border-2 border-text-main bg-brand-cream px-4 py-3 text-sm font-bold text-text-main">
          {err}
        </div>
      ) : null}

      <BrutalCard className="space-y-4 border-2 border-text-main p-6 md:p-8">
        <p className="text-xs font-semibold text-text-main/60">
          Three pipelines: cover (Gemini image), module draft (Gemini text JSON), Vietnamese audio (ElevenLabs). You can
          run several generators at once; each button only waits on its own job. Configure API keys under Settings.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1">
            <span className="flex flex-wrap items-baseline gap-2">
              <span className="text-xs font-black uppercase text-text-main/70">Id</span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-text-main/50">
                Auto-generated
              </span>
            </span>
            <input
              className="w-full cursor-not-allowed border-2 border-text-main bg-brand-cream/60 px-3 py-2 font-mono text-sm font-semibold text-text-main"
              value={input.id}
              readOnly
              tabIndex={-1}
              aria-readonly="true"
              title="Id is generated automatically"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Sort order</span>
            <input
              type="number"
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              value={input.sort_order}
              disabled={saving}
              onChange={(e) => setInput((s) => ({ ...s, sort_order: Number(e.target.value) || 0 }))}
            />
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-xs font-black uppercase text-text-main/70">Title</span>
          <input
            className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
            value={input.title}
            disabled={saving}
            onChange={(e) => setInput((s) => ({ ...s, title: e.target.value }))}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-black uppercase text-text-main/70">Category</span>
          <select
            className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
            value={input.category}
            disabled={saving}
            onChange={(e) => setInput((s) => ({ ...s, category: e.target.value }))}
          >
            {editorCategoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-3 border-t-2 border-text-main/15 pt-6">
          <p className="text-xs font-black uppercase text-text-main/70">1 · Cover image (Gemini image)</p>
          <p className="text-xs font-semibold text-text-main/60">
            Native image model — uploads to Storage and fills Image URL. Optional context is applied first (after the
            module title), then your AI module system prompt from Settings. Aspect ratio 3:2 (ModuleCard). Paste a URL or
            generate below; preview updates when the URL is https.
          </p>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Image URL (optional)</span>
            <input
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              value={input.image_url ?? ''}
              disabled={saving}
              onChange={(e) =>
                setInput((s) => ({ ...s, image_url: e.target.value.trim() || null }))
              }
              placeholder="Paste https://… or use Generate cover image below"
            />
          </label>
          <div className="border-2 border-text-main/25 bg-white p-3 space-y-3">
            <span className="block text-[10px] font-black uppercase text-text-main/60">Preview</span>
            {input.image_url?.startsWith('https://') ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={input.image_url}
                alt=""
                className="max-h-64 w-full object-contain"
                loading="lazy"
              />
            ) : (
              <p className="text-xs font-semibold text-text-main/50">No image yet — add a URL above or generate.</p>
            )}
            <label className="block space-y-1">
              <span className="text-xs font-black uppercase text-text-main/70">Cover context (optional)</span>
              <textarea
                className="min-h-[4.5rem] w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
                value={coverContext}
                disabled={saving}
                onChange={(e) => setCoverContext(e.target.value)}
                placeholder="e.g. dusk on the platform, only two travelers, extra red in the train livery, heavier black outlines…"
              />
            </label>
            <BrutalButton
              type="button"
              variant="secondary"
              disabled={saving || coverBusy}
              onClick={() => void onGenerateCoverImage()}
            >
              {coverBusy ? 'Generating cover…' : 'Generate cover image'}
            </BrutalButton>
            {coverNotice ? (
              <p className="text-sm font-semibold text-text-main/80" role="status">
                {coverNotice}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-3 border-t-2 border-text-main/15 pt-6">
          <p className="text-xs font-black uppercase text-text-main/70">2 · Module draft (Gemini text)</p>
          <p className="text-xs font-semibold text-text-main/60">
            Pha A JSON: teaching steps, vocabulary, voice practice, quiz. If the model returns an https image URL, it is
            downloaded to Storage and may set the cover — for a styled cover matching this editor, use section 1.
          </p>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Topic / brief</span>
            <textarea
              className="min-h-[5rem] w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              value={aiTopic}
              disabled={saving}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="e.g. Ordering cơm tấm at a street stall — phrases and a short quiz"
            />
          </label>
          <label className="block max-w-xs space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Step count (2–12)</span>
            <input
              type="number"
              min={2}
              max={12}
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              value={aiStepCount}
              disabled={saving}
              onChange={(e) => setAiStepCount(Math.min(12, Math.max(2, Number(e.target.value) || 2)))}
            />
          </label>
          <BrutalButton
            type="button"
            variant="secondary"
            disabled={saving || moduleBusy}
            onClick={() => void onGenerateModuleDraft()}
          >
            {moduleBusy ? 'Generating draft…' : 'Generate module draft'}
          </BrutalButton>
          {moduleNotice ? (
            <p className="text-sm font-semibold text-text-main/80" role="status">
              {moduleNotice}
            </p>
          ) : null}
        </div>

        <div className="space-y-3 border-t-2 border-text-main/15 pt-6">
          <p className="text-xs font-black uppercase text-text-main/70">3 · Audio (ElevenLabs)</p>
          <p className="text-xs font-semibold text-text-main/60">
            Synthesizes Vietnamese lines from the current steps and writes public audio URLs. Run after the draft looks
            good.
          </p>
          <BrutalButton
            type="button"
            variant="secondary"
            disabled={saving || audioBusy}
            onClick={() => void onGenerateAudio()}
          >
            {audioBusy ? 'Generating audio…' : 'Generate audio'}
          </BrutalButton>
          {audioNotice ? (
            <p className="text-sm font-semibold text-text-main/80" role="status">
              {audioNotice}
            </p>
          ) : null}
        </div>

        <ModuleStepsEditor
          steps={steps}
          onChange={setSteps}
          disabled={saving}
          uploadPrefix={input.id.trim()}
          moduleCategory={input.category}
          onSaveModule={() => save(false)}
        />

        <ModuleDraftHitlChecklist model={{ ...input, steps }} />

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <BrutalButton type="button" disabled={saving} onClick={() => void save(false)}>
            {busy ? 'Saving…' : 'Save module'}
          </BrutalButton>
          <button
            type="button"
            disabled={saving}
            title={layout === 'panel' ? 'Save and close' : 'Save and back to library'}
            aria-label={busy ? 'Saving' : layout === 'panel' ? 'Save and close' : 'Save and back to library'}
            className={formIconBtn}
            onClick={() => void save(true)}
          >
            <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          </button>
          {props.mode === 'edit' ? (
            <button
              type="button"
              disabled={saving}
              title="Delete module"
              aria-label="Delete module"
              className={formIconBtnDanger}
              onClick={() => void onDelete()}
            >
              <Trash2 className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </button>
          ) : null}
        </div>
      </BrutalCard>
    </section>
  );
}
