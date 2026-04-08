'use client';

import type { SurvivalCategory, SurvivalModule, SurvivalModuleInput, SurvivalStep } from '@xinchao/shared';
import { BrutalButton, BrutalCard, BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import { CheckCircle2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { newDashboardEntityId } from '@/lib/dashboardEntityId';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { deleteModuleAction, saveModuleAction } from '../library/actions';
import { ModuleStepsEditor } from './ModuleStepsEditor';

const CATEGORIES: SurvivalCategory[] = ['Beginner', 'Survival', 'Legend'];

const formIconBtn =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0';

const formIconBtnDanger =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-red-600 shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 hover:bg-red-50 disabled:opacity-50 disabled:hover:translate-y-0';

const emptyInput = (): SurvivalModuleInput => ({
  id: '',
  title: '',
  category: 'Beginner',
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
};

type Props =
  | ({ mode: 'create'; initial: null } & BaseOpts)
  | ({ mode: 'edit'; initial: SurvivalModule } & BaseOpts);

export function SurvivalModuleEditor(props: Props) {
  const layout = props.layout ?? 'page';
  const router = useRouter();
  const [input, setInput] = useState<SurvivalModuleInput>(() =>
    props.mode === 'edit'
      ? moduleToInput(props.initial)
      : { ...emptyInput(), id: newDashboardEntityId('survival_module') },
  );
  const [steps, setSteps] = useState<SurvivalStep[]>(() =>
    props.mode === 'edit' ? [...(props.initial.steps ?? [])] : [],
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
          <span className="text-xs font-black uppercase text-text-main/70">Title</span>
          <input
            className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
            value={input.title}
            disabled={busy}
            onChange={(e) => setInput((s) => ({ ...s, title: e.target.value }))}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-black uppercase text-text-main/70">Category</span>
          <select
            className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
            value={input.category}
            disabled={busy}
            onChange={(e) =>
              setInput((s) => ({ ...s, category: e.target.value as SurvivalCategory }))
            }
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-black uppercase text-text-main/70">Image URL (optional)</span>
          <input
            className="w-full border-2 border-text-main bg-white px-3 py-2 font-semibold text-text-main"
            value={input.image_url ?? ''}
            disabled={busy}
            onChange={(e) =>
              setInput((s) => ({ ...s, image_url: e.target.value.trim() || null }))
            }
            placeholder="https://..."
          />
        </label>

        <ModuleStepsEditor
          steps={steps}
          onChange={setSteps}
          disabled={busy}
          uploadPrefix={input.id.trim()}
          onSaveModule={() => save(false)}
        />

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <BrutalButton type="button" disabled={busy} onClick={() => void save(false)}>
            {busy ? 'Saving…' : 'Save module'}
          </BrutalButton>
          <button
            type="button"
            disabled={busy}
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
              disabled={busy}
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
