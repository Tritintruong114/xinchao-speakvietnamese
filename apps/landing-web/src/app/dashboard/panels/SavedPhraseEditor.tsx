'use client';

import type { PhraseCategory, SavedPhrase, SavedPhraseInput } from '@xinchao/shared';
import { PHRASE_CATEGORY_OPTIONS } from '@xinchao/shared';
import { BrutalButton, BrutalCard, BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import { newDashboardEntityId } from '@/lib/dashboardEntityId';
import { RefreshCw, Trash2, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { uploadSurvivalAudioAction } from '../library/actions';
import { deletePhraseAction, savePhraseAction } from '../offline/actions';

const audioIconBtnClass =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0';

const deleteIconBtnClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-red-600 shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 hover:bg-red-50 disabled:opacity-50 disabled:hover:translate-y-0';

function emptyInput(): SavedPhraseInput {
  return {
    id: '',
    vietnamese: '',
    english: '',
    audio_url: null,
    categories: [],
    sort_order: 0,
    is_bookmarked: false,
  };
}

function phraseToInput(p: SavedPhrase): SavedPhraseInput {
  return {
    id: p.id,
    vietnamese: p.vietnamese,
    english: p.english,
    audio_url: p.audioUri?.trim() || null,
    categories: [...(p.categories ?? [])],
    sort_order: p.sort_order ?? 0,
    is_bookmarked: p.isBookmarked ?? false,
  };
}

type BaseOpts = {
  layout?: 'page' | 'panel';
  onSaved?: () => void;
  onDeleted?: () => void;
};

type Props =
  | ({ mode: 'create'; initial: null } & BaseOpts)
  | ({ mode: 'edit'; initial: SavedPhrase } & BaseOpts);

export function SavedPhraseEditor(props: Props) {
  const layout = props.layout ?? 'page';
  const router = useRouter();
  const [input, setInput] = useState<SavedPhraseInput>(() =>
    props.mode === 'edit'
      ? phraseToInput(props.initial)
      : { ...emptyInput(), id: newDashboardEntityId('saved_phrase') },
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadHint, setUploadHint] = useState<string | null>(null);

  const uploadPrefix = props.mode === 'edit' ? props.initial.id : input.id.trim();

  const onPickAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || busy) return;
    setUploadHint(null);
    setBusy(true);
    const fd = new FormData();
    fd.set('file', file);
    fd.set('prefix', `pocket/${uploadPrefix}`.replace(/[^a-zA-Z0-9/_-]/g, '_').slice(0, 80));
    const { url, error } = await uploadSurvivalAudioAction(fd);
    setBusy(false);
    if (error) {
      setUploadHint(error);
      return;
    }
    if (url) setInput((s) => ({ ...s, audio_url: url }));
  };

  const toggleCategory = (c: PhraseCategory) => {
    setInput((s) => {
      const has = s.categories.includes(c);
      return {
        ...s,
        categories: has ? s.categories.filter((x) => x !== c) : [...s.categories, c],
      };
    });
  };

  const onSubmit = useCallback(async () => {
    setErr(null);
    setBusy(true);
    const { error } = await savePhraseAction(input);
    setBusy(false);
    if (error) {
      setErr(error);
      return;
    }
    router.refresh();
    if (layout === 'panel') {
      props.onSaved?.();
    } else {
      router.push('/dashboard/offline');
    }
  }, [input, router, layout, props]);

  const onDelete = useCallback(async () => {
    if (props.mode !== 'edit') return;
    if (!window.confirm(`Delete phrase "${props.initial.id}"?`)) return;
    setBusy(true);
    const { error } = await deletePhraseAction(props.initial.id);
    setBusy(false);
    if (error) {
      setErr(error);
      return;
    }
    router.refresh();
    if (layout === 'panel') {
      props.onDeleted?.();
    } else {
      router.push('/dashboard/offline');
    }
  }, [props, router, layout]);

  const hasAudio = Boolean(input.audio_url?.trim());

  const sectionClass =
    layout === 'panel' ? 'mx-0 max-w-none space-y-4' : 'mx-auto max-w-3xl space-y-6';

  return (
    <section className={sectionClass}>
      {layout === 'page' ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <BrutalTag backgroundColor="bg-brand-pink" className="mb-2" rotate="-rotate-1">
              Offline
            </BrutalTag>
            <BrutalHeading as="h1" className="text-text-main">
              {props.mode === 'create' ? 'New Pocket phrase' : `Edit: ${props.initial.id}`}
            </BrutalHeading>
          </div>
          <Link
            href="/dashboard/offline"
            className="text-sm font-black uppercase tracking-wide text-text-main underline decoration-2 underline-offset-4"
          >
            Back
          </Link>
        </div>
      ) : null}

      {err ? (
        <div className="border-2 border-text-main bg-brand-cream px-4 py-3 text-sm font-bold text-text-main">
          {err}
        </div>
      ) : null}

      <BrutalCard className="space-y-4 border-2 border-text-main p-6 md:p-8">
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
              disabled={busy}
              onChange={(e) => setInput((s) => ({ ...s, sort_order: Number(e.target.value) || 0 }))}
            />
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-xs font-black uppercase text-text-main/70">Vietnamese</span>
          <input
            className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
            value={input.vietnamese}
            disabled={busy}
            onChange={(e) => setInput((s) => ({ ...s, vietnamese: e.target.value }))}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-black uppercase text-text-main/70">English</span>
          <input
            className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
            value={input.english}
            disabled={busy}
            onChange={(e) => setInput((s) => ({ ...s, english: e.target.value }))}
          />
        </label>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={input.is_bookmarked}
            disabled={busy}
            onChange={(e) => setInput((s) => ({ ...s, is_bookmarked: e.target.checked }))}
            className="h-4 w-4 border-2 border-text-main"
          />
          <span className="text-sm font-bold text-text-main">Bookmarked</span>
        </label>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase text-text-main/70">Audio</span>
          <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={onPickAudio} />
          {!hasAudio ? (
            <button
              type="button"
              disabled={busy}
              title="Upload audio"
              aria-label="Upload audio file"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-text-main/40 bg-brand-cream/50 px-4 py-8 text-text-main disabled:opacity-50"
            >
              <Upload className="h-8 w-8 shrink-0" strokeWidth={2} aria-hidden />
            </button>
          ) : (
            <div className="space-y-2 border-2 border-text-main/20 bg-white p-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={busy}
                  title="Replace audio"
                  aria-label="Replace audio file"
                  className={audioIconBtnClass}
                  onClick={() => fileRef.current?.click()}
                >
                  <RefreshCw className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </button>
                <button
                  type="button"
                  disabled={busy}
                  title="Clear audio"
                  aria-label="Clear audio"
                  className={audioIconBtnClass}
                  onClick={() => setInput((s) => ({ ...s, audio_url: null }))}
                >
                  <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </button>
              </div>
              <audio src={input.audio_url!} controls className="h-9 w-full max-w-md" preload="metadata" />
            </div>
          )}
          <label className="block space-y-1">
            <span className="text-xs font-black uppercase text-text-main/70">Audio URL (optional)</span>
            <input
              className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
              value={input.audio_url ?? ''}
              disabled={busy}
              onChange={(e) =>
                setInput((s) => ({ ...s, audio_url: e.target.value.trim() || null }))
              }
              placeholder="https://…"
            />
          </label>
          {uploadHint ? <p className="text-xs font-bold text-brand-primary">{uploadHint}</p> : null}
        </div>

        <fieldset className="space-y-2 border-2 border-text-main/25 p-4">
          <legend className="px-1 text-xs font-black uppercase text-text-main/70">Categories</legend>
          <div className="flex flex-wrap gap-2">
            {PHRASE_CATEGORY_OPTIONS.map((c) => {
              const on = input.categories.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  disabled={busy}
                  onClick={() => toggleCategory(c)}
                  className={
                    on
                      ? 'border-2 border-text-main bg-brand-yellow px-2 py-1 text-xs font-black uppercase text-text-main'
                      : 'border-2 border-text-main/30 bg-white px-2 py-1 text-xs font-bold uppercase text-text-main/70'
                  }
                >
                  {c}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <BrutalButton type="button" onClick={() => void onSubmit()} disabled={busy}>
            {busy ? 'Saving…' : 'Save phrase'}
          </BrutalButton>
          {props.mode === 'edit' ? (
            <button
              type="button"
              disabled={busy}
              title="Delete phrase"
              aria-label="Delete phrase"
              className={deleteIconBtnClass}
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
