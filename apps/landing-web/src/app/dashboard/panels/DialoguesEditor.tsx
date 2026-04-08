'use client';

import type { Dialogue, MascotExpression, SurvivalStep } from '@xinchao/shared';
import { BrutalButton } from '@xinchao/ui-web';
import { ChevronDown, ChevronUp, Plus, RefreshCw, Trash2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { uploadSurvivalAudioAction } from '../library/actions';

const audioIconBtnClass =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0';

const stepToolbarIconClass =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0';

const phraseRemoveIconClass =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-red-600 shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 hover:bg-red-50 disabled:opacity-50 disabled:hover:translate-y-0';

const DIALOGUE_SPEAKERS: Dialogue['speaker'][] = ['app', 'user', 'seller', 'mascot'];
const MASCOT_OPTS: (MascotExpression | '')[] = ['', 'happy', 'neutral', 'sad', 'excited'];

const field =
  'w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main disabled:opacity-50';

function DialogueLineAudioField({
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
      <span className="text-xs font-black uppercase text-text-main/70">Line audio</span>
      <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={onPick} />

      {!hasUrl ? (
        <button
          type="button"
          disabled={busy}
          title={uploading ? 'Uploading…' : 'Upload line audio'}
          aria-label={uploading ? 'Uploading audio' : 'Upload line audio'}
          onClick={openPicker}
          className="flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-text-main/40 bg-brand-cream/50 px-4 py-6 text-text-main shadow-none transition-colors hover:bg-brand-cream disabled:opacity-50"
        >
          {uploading ? (
            <span className="text-sm font-bold">Uploading…</span>
          ) : (
            <Upload className="h-6 w-6 shrink-0" strokeWidth={2} aria-hidden />
          )}
        </button>
      ) : (
        <div className="space-y-2 border-2 border-text-main/20 bg-white p-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={busy}
              title="Replace audio"
              aria-label="Replace audio"
              className={audioIconBtnClass}
              onClick={openPicker}
            >
              <RefreshCw className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </button>
            <button
              type="button"
              disabled={busy}
              title="Clear audio"
              aria-label="Clear audio"
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
          {hasUrl ? 'Audio URL' : 'Or paste URL / storage key'}
        </span>
        <input
          className={field}
          disabled={busy}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value.trim() || undefined)}
          placeholder="https://… or key"
        />
      </label>
      {hint ? <p className="text-xs font-bold text-brand-primary">{hint}</p> : null}
    </div>
  );
}

function newDialogueId(existing: Dialogue[]): string {
  let id = `d_${Date.now()}`;
  const set = new Set(existing.map((e) => e.id));
  let n = 0;
  while (set.has(id)) {
    n += 1;
    id = `d_${Date.now()}_${n}`;
  }
  return id;
}

export function DialoguesEditor({
  stepId,
  dialogues,
  disabled,
  onChange,
  uploadPrefix,
}: {
  stepId: string;
  dialogues: SurvivalStep['dialogues'];
  disabled?: boolean;
  onChange: (v: Dialogue[] | undefined) => void;
  uploadPrefix: string;
}) {
  const list = dialogues ?? [];
  const setList = (next: Dialogue[]) => onChange(next.length ? next : undefined);

  const idsDatalistId = `dl-dialogue-ids-${stepId}`.replace(/[^a-zA-Z0-9_-]/g, '_');

  const duplicateIds = (() => {
    const seen = new Set<string>();
    const dups = new Set<string>();
    for (const d of list) {
      if (seen.has(d.id)) dups.add(d.id);
      seen.add(d.id);
    }
    return [...dups];
  })();

  const patchAt = (i: number, partial: Partial<Dialogue>) => {
    const next = [...list];
    next[i] = { ...next[i]!, ...partial };
    setList(next);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    const a = next[i]!;
    const b = next[j]!;
    next[i] = b;
    next[j] = a;
    setList(next);
  };

  const removeAt = (i: number) => setList(list.filter((_, k) => k !== i));

  const addLine = () =>
    setList([...list, { id: newDialogueId(list), speaker: 'app', text: '', tip: '' }]);

  const patchOption = (di: number, oi: number, partial: Partial<NonNullable<Dialogue['options']>[number]>) => {
    const d = list[di]!;
    const opts = [...(d.options ?? [])];
    opts[oi] = { ...opts[oi]!, ...partial };
    patchAt(di, { options: opts.length ? opts : undefined });
  };

  const addOption = (di: number) => {
    const d = list[di]!;
    const nextId = list[0]?.id ?? '';
    patchAt(di, {
      options: [...(d.options ?? []), { label: '', nextId }],
    });
  };

  const removeOption = (di: number, oi: number) => {
    const d = list[di]!;
    const opts = (d.options ?? []).filter((_, k) => k !== oi);
    patchAt(di, { options: opts.length ? opts : undefined });
  };

  return (
    <div className="space-y-4">
      <datalist id={idsDatalistId}>
        {list.map((d) => (
          <option key={d.id} value={d.id} />
        ))}
      </datalist>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-text-main/70">Roleplay dialogues</p>
          <p className="mt-1 text-xs font-semibold text-text-main/60">
            Flow graph: each line has an <span className="font-mono">id</span>. Use <span className="font-mono">nextId</span>{' '}
            or <span className="font-mono">options[].nextId</span> to link lines. Ids must be unique.
          </p>
        </div>
        <BrutalButton type="button" variant="secondary" disabled={disabled} onClick={addLine}>
          Add dialogue line
        </BrutalButton>
      </div>

      {duplicateIds.length > 0 ? (
        <p className="text-sm font-bold text-brand-primary">
          Duplicate ids: {duplicateIds.join(', ')} — fix before save.
        </p>
      ) : null}

      {list.length === 0 ? (
        <p className="border-2 border-dashed border-text-main/30 px-4 py-8 text-center text-sm font-bold text-text-main/60">
          No lines yet. Add a line to build the conversation.
        </p>
      ) : (
        list.map((d, i) => (
          <div
            key={`${i}-${d.id}`}
            className="space-y-3 border-2 border-text-main bg-brand-cream/30 p-4 md:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-black uppercase text-text-main">Line {i + 1}</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={disabled || i === 0}
                  title="Move up"
                  aria-label="Move line up"
                  className={stepToolbarIconClass}
                  onClick={() => move(i, -1)}
                >
                  <ChevronUp className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </button>
                <button
                  type="button"
                  disabled={disabled || i >= list.length - 1}
                  title="Move down"
                  aria-label="Move line down"
                  className={stepToolbarIconClass}
                  onClick={() => move(i, 1)}
                >
                  <ChevronDown className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  title="Remove line"
                  aria-label="Remove dialogue line"
                  className={phraseRemoveIconClass}
                  onClick={() => removeAt(i)}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="block space-y-1 md:col-span-2">
                <span className="text-xs font-black uppercase text-text-main/70">Line id</span>
                <input
                  className={`${field} font-mono text-sm`}
                  disabled={disabled}
                  value={d.id}
                  onChange={(e) => patchAt(i, { id: e.target.value.trim() || d.id })}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-black uppercase text-text-main/70">Speaker</span>
                <select
                  className={field}
                  disabled={disabled}
                  value={d.speaker}
                  onChange={(e) => patchAt(i, { speaker: e.target.value as Dialogue['speaker'] })}
                >
                  {DIALOGUE_SPEAKERS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-black uppercase text-text-main/70">Mascot expression (optional)</span>
                <select
                  className={field}
                  disabled={disabled}
                  value={d.mascotExpression ?? ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    patchAt(i, { mascotExpression: v === '' ? undefined : (v as MascotExpression) });
                  }}
                >
                  {MASCOT_OPTS.map((m) => (
                    <option key={m || 'none'} value={m}>
                      {m || '— none —'}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-1">
              <span className="text-xs font-black uppercase text-text-main/70">Text (optional)</span>
              <textarea
                className="min-h-[64px] w-full resize-y border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main disabled:opacity-50"
                disabled={disabled}
                value={d.text ?? ''}
                onChange={(e) => patchAt(i, { text: e.target.value.trim() || undefined })}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-black uppercase text-text-main/70">Tip (optional)</span>
              <textarea
                className="min-h-[56px] w-full resize-y border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main disabled:opacity-50"
                disabled={disabled}
                value={d.tip ?? ''}
                onChange={(e) => patchAt(i, { tip: e.target.value.trim() || undefined })}
              />
            </label>

            <DialogueLineAudioField
              value={d.audioUri}
              onChange={(audioUri) => patchAt(i, { audioUri })}
              disabled={disabled}
              uploadPrefix={`${uploadPrefix}/dlg_${d.id}`.replace(/[^a-zA-Z0-9/_-]/g, '_').slice(0, 100)}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-xs font-black uppercase text-text-main/70">nextId (default next line)</span>
                <input
                  className={`${field} font-mono text-sm`}
                  disabled={disabled}
                  value={d.nextId ?? ''}
                  list={idsDatalistId}
                  onChange={(e) => patchAt(i, { nextId: e.target.value.trim() || undefined })}
                  placeholder="e.g. d2"
                />
              </label>
              <label className="space-y-1 block">
                <span className="text-xs font-black uppercase text-text-main/70">timeLimit (seconds, optional)</span>
                <input
                  type="number"
                  min={0}
                  className={field}
                  disabled={disabled}
                  value={d.timeLimit ?? ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    patchAt(i, { timeLimit: v === '' ? undefined : Number(v) || undefined });
                  }}
                />
              </label>
              <label className="block space-y-1 md:col-span-2">
                <span className="text-xs font-black uppercase text-text-main/70">timeoutId (optional)</span>
                <input
                  className={`${field} font-mono text-sm`}
                  disabled={disabled}
                  value={d.timeoutId ?? ''}
                  list={idsDatalistId}
                  onChange={(e) => patchAt(i, { timeoutId: e.target.value.trim() || undefined })}
                />
              </label>
            </div>

            <div className="space-y-2 border-2 border-dashed border-text-main/25 bg-white/50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-black uppercase text-text-main/70">Choice branches</span>
                <button
                  type="button"
                  disabled={disabled}
                  title="Add branch"
                  aria-label="Add choice branch"
                  className={stepToolbarIconClass}
                  onClick={() => addOption(i)}
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </button>
              </div>
              {(d.options ?? []).length === 0 ? (
                <p className="text-xs font-semibold text-text-main/50">No branches — line uses nextId only.</p>
              ) : (
                (d.options ?? []).map((opt, oi) => (
                  <div
                    key={oi}
                    className="grid gap-2 border-2 border-text-main/15 p-3 md:grid-cols-2"
                  >
                    <label className="block space-y-1 md:col-span-2">
                      <span className="text-[10px] font-black uppercase text-text-main/60">Label</span>
                      <input
                        className={field}
                        disabled={disabled}
                        value={opt.label}
                        onChange={(e) => patchOption(i, oi, { label: e.target.value })}
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-black uppercase text-text-main/60">nextId</span>
                      <input
                        className={`${field} font-mono text-sm`}
                        disabled={disabled}
                        value={opt.nextId}
                        list={idsDatalistId}
                        onChange={(e) => patchOption(i, oi, { nextId: e.target.value.trim() })}
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-black uppercase text-text-main/60">xp (optional)</span>
                      <input
                        type="number"
                        min={0}
                        className={field}
                        disabled={disabled}
                        value={opt.xp ?? ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          patchOption(i, oi, { xp: v === '' ? undefined : Number(v) });
                        }}
                      />
                    </label>
                    <label className="block space-y-1 md:col-span-2">
                      <span className="text-[10px] font-black uppercase text-text-main/60">badge (optional)</span>
                      <input
                        className={field}
                        disabled={disabled}
                        value={opt.badge ?? ''}
                        onChange={(e) => patchOption(i, oi, { badge: e.target.value.trim() || undefined })}
                      />
                    </label>
                    <label className="block space-y-1 md:col-span-2">
                      <span className="text-[10px] font-black uppercase text-text-main/60">
                        Option audio URL (optional)
                      </span>
                      <input
                        className={`${field} font-mono text-sm`}
                        disabled={disabled}
                        value={opt.audioUri ?? ''}
                        onChange={(e) => patchOption(i, oi, { audioUri: e.target.value.trim() || undefined })}
                      />
                    </label>
                    <div className="flex justify-end md:col-span-2">
                      <button
                        type="button"
                        disabled={disabled}
                        title="Remove branch"
                        aria-label="Remove branch"
                        className={phraseRemoveIconClass}
                        onClick={() => removeOption(i, oi)}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
