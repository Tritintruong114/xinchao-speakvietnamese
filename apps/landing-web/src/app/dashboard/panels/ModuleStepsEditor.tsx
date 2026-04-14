'use client';

import type { MascotExpression, SurvivalCategory, SurvivalStep, SurvivalStepType } from '@xinchao/shared';
import { BrutalButton, BrutalCard } from '@xinchao/ui-web';
import { ChevronDown, ChevronUp, Plus, RefreshCw, Trash2, Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import {
  generateTeachingStepImageAction,
  regenerateTeachingStepAudioAction,
} from '../library/ai-actions';
import { uploadSurvivalAudioAction } from '../library/actions';
import { DialoguesEditor } from './DialoguesEditor';

const STEP_TYPES: SurvivalStepType[] = [
  'onboarding',
  'micro-learning',
  'voice_practice',
  'roleplay',
  'reward',
  'quiz',
  'teaching',
];

const MASCOT_OPTS: (MascotExpression | '')[] = ['', 'happy', 'neutral', 'sad', 'excited'];

const audioIconBtnClass =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0';

const stepToolbarIconClass =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0';

const phraseRemoveIconClass =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-red-600 shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 hover:bg-red-50 disabled:opacity-50 disabled:hover:translate-y-0';

function StepAudioField({
  value,
  onChange,
  disabled,
  uploadPrefix,
}: {
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  disabled?: boolean;
  uploadPrefix: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const openPicker = () => fileRef.current?.click();

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || disabled) return;
    setHint(null);
    setUploading(true);
    const fd = new FormData();
    fd.set('file', file);
    fd.set('prefix', uploadPrefix);
    const { url, error } = await uploadSurvivalAudioAction(fd);
    setUploading(false);
    if (error) {
      setHint(error);
      return;
    }
    if (url) onChange(url);
  };

  const busy = Boolean(disabled || uploading);
  const hasUrl = Boolean(value?.trim());

  return (
    <div className="space-y-2">
      <span className="text-xs font-black uppercase text-text-main/70">Step audio</span>
      <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={onPick} />

      {!hasUrl ? (
        <button
          type="button"
          disabled={busy}
          title={uploading ? 'Uploading…' : 'Upload step audio'}
          aria-label={uploading ? 'Uploading audio' : 'Upload step audio file'}
          onClick={openPicker}
          className="flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-text-main/40 bg-brand-cream/50 px-4 py-8 text-text-main shadow-none transition-colors hover:bg-brand-cream disabled:opacity-50"
        >
          {uploading ? (
            <span className="text-sm font-bold">Uploading…</span>
          ) : (
            <Upload className="h-8 w-8 shrink-0" strokeWidth={2} aria-hidden />
          )}
        </button>
      ) : (
        <div className="space-y-2 border-2 border-text-main/20 bg-white p-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={busy}
              title="Replace audio file"
              aria-label="Replace audio file"
              className={audioIconBtnClass}
              onClick={openPicker}
            >
              <RefreshCw className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </button>
            <button
              type="button"
              disabled={busy}
              title="Clear audio URL"
              aria-label="Clear audio URL"
              className={audioIconBtnClass}
              onClick={() => onChange(undefined)}
            >
              <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </button>
          </div>
          <audio src={value} controls className="h-9 w-full max-w-md" preload="metadata" />
        </div>
      )}

      <label className="block space-y-1">
        <span className="text-xs font-black uppercase text-text-main/70">
          {hasUrl ? 'Audio URL' : 'Or paste a public URL'}
        </span>
        <input
          className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
          disabled={busy}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value.trim() || undefined)}
          placeholder="https://…"
        />
      </label>
      {hint ? <p className="text-xs font-bold text-brand-primary">{hint}</p> : null}
    </div>
  );
}

function VocabularyEditor({
  items,
  disabled,
  onChange,
}: {
  items: NonNullable<SurvivalStep['vocabulary']>;
  disabled?: boolean;
  onChange: (v: NonNullable<SurvivalStep['vocabulary']>) => void;
}) {
  const patchRow = (i: number, patch: (typeof items)[number]) => {
    const next = [...items];
    next[i] = patch;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-black uppercase text-text-main/70">Vocabulary</span>
        <button
          type="button"
          disabled={disabled}
          title="Add phrase"
          aria-label="Add vocabulary phrase"
          className={stepToolbarIconClass}
          onClick={() => onChange([...items, { phrase: '', translation: '' }])}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        </button>
      </div>
      {items.map((row, i) => (
        <div key={i} className="grid gap-2 border-2 border-dashed border-text-main/25 p-3 md:grid-cols-2">
          <input
            className="border-2 border-text-main bg-white px-2 py-1 text-sm font-semibold text-text-main"
            placeholder="Phrase (VI)"
            disabled={disabled}
            value={row.phrase}
            onChange={(e) => patchRow(i, { ...row, phrase: e.target.value })}
          />
          <input
            className="border-2 border-text-main bg-white px-2 py-1 text-sm font-semibold text-text-main"
            placeholder="Translation"
            disabled={disabled}
            value={row.translation}
            onChange={(e) => patchRow(i, { ...row, translation: e.target.value })}
          />
          <input
            className="border-2 border-text-main bg-white px-2 py-1 text-sm font-semibold text-text-main md:col-span-2"
            placeholder="Audio URL (optional)"
            disabled={disabled}
            value={row.audioUri ?? ''}
            onChange={(e) =>
              patchRow(i, { ...row, audioUri: e.target.value.trim() || undefined })
            }
          />
          <input
            className="border-2 border-text-main bg-white px-2 py-1 text-sm font-semibold text-text-main md:col-span-2"
            placeholder="Tag (optional)"
            disabled={disabled}
            value={row.tag ?? ''}
            onChange={(e) => patchRow(i, { ...row, tag: e.target.value.trim() || undefined })}
          />
          <div className="flex justify-end md:col-span-2">
            <button
              type="button"
              disabled={disabled}
              title="Remove phrase"
              aria-label="Remove vocabulary phrase"
              className={phraseRemoveIconClass}
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function StepCard({
  step,
  index,
  total,
  disabled,
  onPatch,
  onRemove,
  onMove,
  uploadPrefix,
  moduleCategory,
  onSaveModule,
  expanded,
  onExpandChange,
}: {
  step: SurvivalStep;
  index: number;
  total: number;
  disabled?: boolean;
  onPatch: (p: Partial<SurvivalStep>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  uploadPrefix: string;
  moduleCategory: SurvivalCategory;
  onSaveModule: () => Promise<void>;
  expanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}) {
  const type = step.type;
  const voc = step.vocabulary ?? [];
  const [teachingImgBusy, setTeachingImgBusy] = useState(false);
  const [teachingImgErr, setTeachingImgErr] = useState<string | null>(null);
  const [teachingAudioBusy, setTeachingAudioBusy] = useState(false);
  const [teachingAudioErr, setTeachingAudioErr] = useState<string | null>(null);

  const onRegenerateTeachingAudio = useCallback(async () => {
    if (disabled || type !== 'teaching') return;
    const text = (step.content ?? '').trim();
    if (!text) return;
    setTeachingAudioErr(null);
    setTeachingAudioBusy(true);
    try {
      const res = await regenerateTeachingStepAudioAction({
        moduleId: uploadPrefix,
        text,
      });
      if (res.ok === false) {
        setTeachingAudioErr(res.error);
        return;
      }
      onPatch({ audioUri: res.audio_url });
    } finally {
      setTeachingAudioBusy(false);
    }
  }, [disabled, onPatch, step.content, type, uploadPrefix]);

  const onGenerateTeachingImage = useCallback(async () => {
    if (disabled) return;
    setTeachingImgErr(null);
    setTeachingImgBusy(true);
    try {
      const res = await generateTeachingStepImageAction({
        moduleId: uploadPrefix,
        moduleCategory,
        stepTitle: step.title,
        teachingContent: step.content ?? '',
        visualHighlight: step.visualHighlight,
      });
      if (res.ok === false) {
        setTeachingImgErr(res.error);
        return;
      }
      onPatch({ image_url: res.image_url });
    } finally {
      setTeachingImgBusy(false);
    }
  }, [disabled, moduleCategory, onPatch, step.content, step.title, step.visualHighlight, uploadPrefix]);

  const handleTypeChange = (t: SurvivalStepType) => {
    const patch: Partial<SurvivalStep> = { type: t };
    if (t === 'reward' && !step.reward) {
      patch.reward = { xp: 10, badge: '' };
    }
    onPatch(patch);
  };

  const summaryTitle = step.title?.trim() || 'Untitled step';

  return (
    <BrutalCard className="space-y-4 border-2 border-text-main p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 rounded-md text-left outline-none ring-text-main focus-visible:ring-2"
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse step ${index + 1}` : `Expand step ${index + 1}`}
          onClick={() => onExpandChange(!expanded)}
        >
          <span className="shrink-0 text-text-main" aria-hidden>
            {expanded ? '▼' : '▶'}
          </span>
          <span className="shrink-0 text-sm font-black uppercase text-text-main">Step {index + 1}</span>
          <span className="min-w-0 max-w-[min(12rem,40vw)] truncate text-sm font-semibold text-text-main/85 sm:max-w-[14rem] md:max-w-xs">
            {summaryTitle}
          </span>
          <span className="shrink-0 rounded border-2 border-text-main px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-text-main">
            {type}
          </span>
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={disabled || index === 0}
            title="Move step up"
            aria-label="Move step up"
            className={stepToolbarIconClass}
            onClick={() => onMove(-1)}
          >
            <ChevronUp className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          </button>
          <button
            type="button"
            disabled={disabled || index >= total - 1}
            title="Move step down"
            aria-label="Move step down"
            className={stepToolbarIconClass}
            onClick={() => onMove(1)}
          >
            <ChevronDown className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          </button>
          <button
            type="button"
            disabled={disabled}
            title="Remove step"
            aria-label="Remove step"
            className={phraseRemoveIconClass}
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </div>

      {!expanded ? (
        <div className="flex flex-col gap-2 border-t-2 border-text-main/15 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="truncate text-sm font-semibold text-text-main/70 sm:max-w-[60%]">{summaryTitle}</p>
          <BrutalButton type="button" disabled={disabled} onClick={() => void onSaveModule()}>
            Save module
          </BrutalButton>
        </div>
      ) : null}

      {expanded ? (
        <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
        <label className="block space-y-1 md:col-span-2">
          <span className="text-xs font-black uppercase text-text-main/70">Step id</span>
          <input
            className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
            disabled={disabled}
            value={step.id}
            onChange={(e) => onPatch({ id: e.target.value })}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-black uppercase text-text-main/70">Type</span>
          <select
            className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
            disabled={disabled}
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as SurvivalStepType)}
          >
            {STEP_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-black uppercase text-text-main/70">Mascot (optional)</span>
          <select
            className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
            disabled={disabled}
            value={step.mascotExpression ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              onPatch({
                mascotExpression: v === '' ? undefined : (v as MascotExpression),
              });
            }}
          >
            {MASCOT_OPTS.map((m) => (
              <option key={m || 'none'} value={m}>
                {m || '—'}
              </option>
            ))}
          </select>
        </label>
        </div>

      <label className="block space-y-1">
        <span className="text-xs font-black uppercase text-text-main/70">Title</span>
        <input
          className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
          disabled={disabled}
          value={step.title}
          onChange={(e) => onPatch({ title: e.target.value })}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-black uppercase text-text-main/70">Goal (optional)</span>
        <input
          className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
          disabled={disabled}
          value={step.goal ?? ''}
          onChange={(e) => onPatch({ goal: e.target.value.trim() || undefined })}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-black uppercase text-text-main/70">Description (optional)</span>
        <textarea
          className="min-h-[72px] w-full resize-y border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
          disabled={disabled}
          value={step.description ?? ''}
          onChange={(e) => onPatch({ description: e.target.value.trim() || undefined })}
        />
      </label>

      {(type === 'onboarding' ||
        type === 'micro-learning' ||
        type === 'voice_practice' ||
        type === 'roleplay' ||
        type === 'teaching') && (
        <>
          <StepAudioField
            value={step.audioUri}
            onChange={(audioUri) => onPatch({ audioUri })}
            disabled={disabled}
            uploadPrefix={uploadPrefix}
          />
          {type === 'teaching' && (
            <div className="space-y-2">
              <BrutalButton
                type="button"
                variant="secondary"
                disabled={disabled || teachingAudioBusy || !(step.content ?? '').trim()}
                onClick={() => void onRegenerateTeachingAudio()}
              >
                {teachingAudioBusy ? 'Regenerating audio…' : 'Regenerate audio from teaching content'}
              </BrutalButton>
              {teachingAudioErr ? (
                <p className="text-xs font-bold text-red-600" role="alert">
                  {teachingAudioErr}
                </p>
              ) : null}
              <p className="text-[10px] font-semibold text-text-main/55">
                ElevenLabs reads the teaching content field below. Save the module to persist the new URL.
              </p>
            </div>
          )}
        </>
      )}

      {type === 'teaching' && (
        <>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Teaching content</span>
            <textarea
              className="min-h-[120px] w-full resize-y border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              disabled={disabled}
              value={step.content ?? ''}
              onChange={(e) => onPatch({ content: e.target.value || undefined })}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Visual highlight (optional)</span>
            <input
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              disabled={disabled}
              value={step.visualHighlight ?? ''}
              onChange={(e) => onPatch({ visualHighlight: e.target.value.trim() || undefined })}
            />
          </label>
          <div className="space-y-2 border-2 border-dashed border-text-main/30 bg-brand-cream/40 p-3">
            <span className="text-xs font-black uppercase text-text-main/70">Step image (mobile hero)</span>
            <p className="text-xs font-semibold text-text-main/60">
              Uses the same Gemini image pipeline as the module cover, but the scene brief is built from this step’s
              title, teaching content, and visual highlight — matching how the app shows this screen.
            </p>
            <label className="block space-y-1">
              <span className="text-xs font-black uppercase text-text-main/70">Image URL (optional)</span>
              <input
                className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
                disabled={disabled}
                value={step.image_url ?? ''}
                onChange={(e) => onPatch({ image_url: e.target.value.trim() || undefined })}
                placeholder="https://… or generate below"
              />
            </label>
            {step.image_url?.startsWith('https://') ? (
              <div className="border-2 border-text-main/20 bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.image_url}
                  alt=""
                  className="max-h-40 w-full object-contain"
                  loading="lazy"
                />
              </div>
            ) : null}
            <BrutalButton
              type="button"
              variant="secondary"
              disabled={
                disabled ||
                teachingImgBusy ||
                (!step.title?.trim() && !(step.content ?? '').trim())
              }
              onClick={() => void onGenerateTeachingImage()}
            >
              {teachingImgBusy ? 'Generating step image…' : 'Generate image from teaching'}
            </BrutalButton>
            {teachingImgErr ? (
              <p className="text-xs font-bold text-red-600" role="alert">
                {teachingImgErr}
              </p>
            ) : null}
          </div>
        </>
      )}

      {type === 'voice_practice' && (
        <>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Target phrase</span>
            <input
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              disabled={disabled}
              value={step.targetPhrase ?? ''}
              onChange={(e) => onPatch({ targetPhrase: e.target.value.trim() || undefined })}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Target translation</span>
            <input
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              disabled={disabled}
              value={step.targetTranslation ?? ''}
              onChange={(e) => onPatch({ targetTranslation: e.target.value.trim() || undefined })}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Success feedback (optional)</span>
            <textarea
              className="min-h-[64px] w-full resize-y border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              disabled={disabled}
              value={step.successFeedback ?? ''}
              onChange={(e) => onPatch({ successFeedback: e.target.value.trim() || undefined })}
            />
          </label>
        </>
      )}

      {type === 'quiz' && (
        <>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Question</span>
            <textarea
              className="min-h-[64px] w-full resize-y border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              disabled={disabled}
              value={step.question ?? ''}
              onChange={(e) => onPatch({ question: e.target.value.trim() || undefined })}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Options (one per line)</span>
            <textarea
              className="min-h-[100px] w-full resize-y border-2 border-text-main bg-white px-3 py-2 font-mono text-sm text-text-main"
              disabled={disabled}
              value={(step.options ?? []).join('\n')}
              onChange={(e) => {
                const lines = e.target.value
                  .split('\n')
                  .map((s) => s.trim())
                  .filter((s) => s.length > 0);
                onPatch({ options: lines.length ? lines : undefined });
              }}
            />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-xs font-black uppercase text-text-main/70">Correct index (0-based)</span>
              <input
                type="number"
                min={0}
                className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
                disabled={disabled}
                value={step.correctIndex ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  onPatch({ correctIndex: v === '' ? undefined : Number(v) });
                }}
              />
            </label>
            <label className="block space-y-1 md:col-span-2">
              <span className="text-xs font-black uppercase text-text-main/70">Fact (optional)</span>
              <input
                className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
                disabled={disabled}
                value={step.fact ?? ''}
                onChange={(e) => onPatch({ fact: e.target.value.trim() || undefined })}
              />
            </label>
          </div>
        </>
      )}

      {type === 'reward' && (
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">XP</span>
            <input
              type="number"
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              disabled={disabled}
              value={step.reward?.xp ?? 0}
              onChange={(e) =>
                onPatch({
                  reward: {
                    xp: Number(e.target.value) || 0,
                    badge: step.reward?.badge ?? '',
                  },
                })
              }
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Badge</span>
            <input
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              disabled={disabled}
              value={step.reward?.badge ?? ''}
              onChange={(e) =>
                onPatch({
                  reward: {
                    xp: step.reward?.xp ?? 0,
                    badge: e.target.value,
                  },
                })
              }
            />
          </label>
        </div>
      )}

      {(type === 'micro-learning' || type === 'onboarding' || type === 'teaching') && (
        <VocabularyEditor
          items={voc}
          disabled={disabled}
          onChange={(v) => onPatch({ vocabulary: v.length ? v : undefined })}
        />
      )}

      {type === 'roleplay' && (
        <DialoguesEditor
          stepId={step.id}
          dialogues={step.dialogues}
          disabled={disabled}
          uploadPrefix={uploadPrefix}
          onChange={(d) => onPatch({ dialogues: d?.length ? d : undefined })}
        />
      )}

      <div className="border-t-2 border-text-main/15 pt-4">
        <BrutalButton type="button" disabled={disabled} onClick={() => void onSaveModule()}>
          Save module
        </BrutalButton>
        <p className="mt-2 text-xs font-semibold text-text-main/60">
          Saves title, metadata, and every step (you stay on this page).
        </p>
      </div>
        </div>
      ) : null}
    </BrutalCard>
  );
}

export interface ModuleStepsEditorProps {
  steps: SurvivalStep[];
  onChange: (steps: SurvivalStep[]) => void;
  disabled?: boolean;
  /** Sanitized module id (or `draft`) — prefixes Storage objects for step audio uploads. */
  uploadPrefix: string;
  /** Module category — used when generating teaching-step images. */
  moduleCategory: SurvivalCategory;
  /** Persist full module with current form state; editor stays on this route. */
  onSaveModule: () => Promise<void>;
}

/** `undefined` in map = expanded (default). Only `false` means collapsed. */
function isStepExpanded(map: Record<string, boolean>, stepId: string): boolean {
  return map[stepId] !== false;
}

export function ModuleStepsEditor({
  steps,
  onChange,
  disabled,
  uploadPrefix,
  moduleCategory,
  onSaveModule,
}: ModuleStepsEditorProps) {
  const [expandedByStepId, setExpandedByStepId] = useState<Record<string, boolean>>({});

  const allExpanded =
    steps.length > 0 && steps.every((s) => isStepExpanded(expandedByStepId, s.id));

  const collapseOrExpandAll = useCallback(() => {
    if (allExpanded) {
      setExpandedByStepId(Object.fromEntries(steps.map((s) => [s.id, false])));
    } else {
      setExpandedByStepId({});
    }
  }, [allExpanded, steps]);

  const setStepExpanded = useCallback((stepId: string, value: boolean) => {
    setExpandedByStepId((m) => ({ ...m, [stepId]: value }));
  }, []);

  const move = useCallback(
    (index: number, dir: -1 | 1) => {
      const j = index + dir;
      if (j < 0 || j >= steps.length) return;
      const next = [...steps];
      const a = next[index]!;
      const b = next[j]!;
      next[index] = b;
      next[j] = a;
      onChange(next);
    },
    [steps, onChange],
  );

  const patchStep = useCallback(
    (index: number, patch: Partial<SurvivalStep>) => {
      onChange(steps.map((s, i) => (i === index ? { ...s, ...patch } : s)));
    },
    [steps, onChange],
  );

  const remove = useCallback(
    (index: number) => {
      onChange(steps.filter((_, i) => i !== index));
    },
    [steps, onChange],
  );

  const add = useCallback(() => {
    const id = `step-${Date.now()}`;
    onChange([...steps, { id, type: 'teaching', title: '' }]);
  }, [steps, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={disabled || steps.length === 0}
          onClick={collapseOrExpandAll}
          title={allExpanded ? 'Collapse all steps' : 'Expand all steps'}
          aria-pressed={allExpanded}
          aria-label={allExpanded ? 'Collapse all steps' : 'Expand all steps'}
          className="text-xs font-black uppercase tracking-wide text-text-main underline decoration-2 underline-offset-4 disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
        >
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </button>
        <button
          type="button"
          disabled={disabled}
          title="Add step"
          aria-label="Add survival step"
          className={stepToolbarIconClass}
          onClick={add}
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
        </button>
      </div>

      {steps.length === 0 ? (
        <p className="border-2 border-dashed border-text-main/30 px-4 py-8 text-center text-sm font-bold text-text-main/60">
          No steps yet. Add a step or they will save as an empty list.
        </p>
      ) : (
        steps.map((step, index) => (
          <StepCard
            key={`${index}-${step.id}`}
            step={step}
            index={index}
            total={steps.length}
            disabled={disabled}
            onPatch={(p) => patchStep(index, p)}
            onRemove={() => remove(index)}
            onMove={(d) => move(index, d)}
            uploadPrefix={uploadPrefix}
            moduleCategory={moduleCategory}
            onSaveModule={onSaveModule}
            expanded={isStepExpanded(expandedByStepId, step.id)}
            onExpandChange={(v) => setStepExpanded(step.id, v)}
          />
        ))
      )}
    </div>
  );
}
