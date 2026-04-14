'use client';

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SurvivalModule } from '@xinchao/shared';
import { BrutalCard, BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import { GripVertical, Pencil, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type CSSProperties, type ReactNode, useEffect, useState, useTransition } from 'react';

import { reorderSurvivalModulesAction, updateSurvivalModuleCategoryAction } from '../library/actions';
import { ModuleDeleteButton } from './ModuleDeleteButton';

const editIconBtnClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-brand-yellow text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5';

const newIconBtnClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5';

const dragHandleClass =
  'inline-flex cursor-grab touch-none items-center justify-center rounded border border-text-main/25 bg-white/80 p-1.5 text-text-main/70 active:cursor-grabbing';

const categorySelectClass =
  'max-w-[11rem] rounded-md border-2 border-text-main bg-white px-2 py-1.5 text-sm font-semibold text-text-main shadow-[2px_2px_0_0_rgba(0,0,0,1)]';

function stepsCount(m: SurvivalModule & { steps?: unknown }) {
  const s = m.steps;
  return Array.isArray(s) ? s.length : 0;
}

interface Props {
  modules: SurvivalModule[];
  /** Labels from Dashboard → Categories (defines select options + library section order). */
  categoryOptions: string[];
  onNew: () => void;
  onEdit: (module: SurvivalModule) => void;
}

function categorySelectValues(m: SurvivalModule, categoryOptions: string[]): string[] {
  const base = categoryOptions.length > 0 ? [...categoryOptions] : ['Beginner', 'Survival', 'Legend'];
  if (!base.includes(m.category)) base.push(m.category);
  return base;
}

/** Shared row markup so SSR / pre-hydration table matches structure without @dnd-kit DOM (avoids aria-describedby hydration mismatch). */
function ModuleRowCells({
  m,
  index,
  dragHandle,
  groupHeading,
  categoryOptions,
  onEdit,
  onCategoryChange,
  categoryBusy,
}: {
  m: SurvivalModule;
  index: number;
  dragHandle: ReactNode;
  groupHeading: string | null;
  categoryOptions: string[];
  onEdit: (module: SurvivalModule) => void;
  onCategoryChange: (id: string, category: string) => void;
  categoryBusy: boolean;
}) {
  const selectValues = categorySelectValues(m, categoryOptions);
  return (
    <>
      <td className="w-12 px-2 py-3 align-middle">{dragHandle}</td>
      <td className="px-4 py-3 font-semibold text-text-main">
        {groupHeading ? (
          <div className="mb-1 text-[0.65rem] font-black uppercase tracking-wider text-brand-pink">{groupHeading}</div>
        ) : null}
        {m.title}
      </td>
      <td className="px-4 py-3">
        <select
          className={categorySelectClass}
          value={m.category}
          disabled={categoryBusy}
          aria-label={`Category for ${m.title}`}
          onChange={(e) => onCategoryChange(m.id, e.target.value)}
        >
          {selectValues.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 text-text-main/80">{stepsCount(m)}</td>
      <td className="px-4 py-3 text-text-main/80 tabular-nums">{index + 1}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            title="Edit module"
            aria-label={`Edit module ${m.id}`}
            className={editIconBtnClass}
            onClick={() => onEdit(m)}
          >
            <Pencil className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          </button>
          <ModuleDeleteButton id={m.id} title={m.title} />
        </div>
      </td>
    </>
  );
}

function StaticModuleRow(props: {
  m: SurvivalModule;
  index: number;
  groupHeading: string | null;
  categoryOptions: string[];
  onEdit: (module: SurvivalModule) => void;
  onCategoryChange: (id: string, category: string) => void;
  categoryBusy: boolean;
}) {
  const { m, index, groupHeading, categoryOptions, onEdit, onCategoryChange, categoryBusy } = props;
  return (
    <tr
      className={`border-b border-text-main/15 odd:bg-white even:bg-brand-cream/40 ${
        groupHeading ? 'border-t-4 border-text-main' : ''
      }`}
    >
      <ModuleRowCells
        m={m}
        index={index}
        groupHeading={groupHeading}
        categoryOptions={categoryOptions}
        onEdit={onEdit}
        onCategoryChange={onCategoryChange}
        categoryBusy={categoryBusy}
        dragHandle={
          <span
            className={`${dragHandleClass} pointer-events-none cursor-default opacity-60`}
            aria-hidden
            title="Loading drag controls…"
          >
            <GripVertical className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </span>
        }
      />
    </tr>
  );
}

function SortableRow({
  module: m,
  index,
  groupHeading,
  categoryOptions,
  onEdit,
  onCategoryChange,
  categoryBusy,
}: {
  module: SurvivalModule;
  index: number;
  groupHeading: string | null;
  categoryOptions: string[];
  onEdit: (module: SurvivalModule) => void;
  onCategoryChange: (id: string, category: string) => void;
  categoryBusy: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: m.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
    position: 'relative',
    zIndex: isDragging ? 2 : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-text-main/15 odd:bg-white even:bg-brand-cream/40 ${
        groupHeading ? 'border-t-4 border-text-main' : ''
      }`}
    >
      <ModuleRowCells
        m={m}
        index={index}
        groupHeading={groupHeading}
        categoryOptions={categoryOptions}
        onEdit={onEdit}
        onCategoryChange={onCategoryChange}
        categoryBusy={categoryBusy}
        dragHandle={
          <button
            type="button"
            className={dragHandleClass}
            aria-label={`Drag to reorder row ${index + 1}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </button>
        }
      />
    </tr>
  );
}

export function SurvivalModulesPanel({ modules, categoryOptions, onNew, onEdit }: Props) {
  const router = useRouter();
  /** Mount gate: @dnd-kit injects unstable a11y ids (e.g. DndDescribedBy-N); render DnD only after hydration. */
  const [dndReady, setDndReady] = useState(false);
  const [items, setItems] = useState<SurvivalModule[]>(modules);
  const [listError, setListError] = useState<string | null>(null);
  const [reorderPending, startReorder] = useTransition();
  const [categoryPending, startCategory] = useTransition();

  useEffect(() => {
    setDndReady(true);
  }, []);

  useEffect(() => {
    setItems(modules);
  }, [modules]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((x) => x.id === active.id);
    const newIndex = items.findIndex((x) => x.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(items, oldIndex, newIndex);
    const orderedIds = next.map((m) => m.id);
    setItems(next);
    startReorder(async () => {
      setListError(null);
      const { error } = await reorderSurvivalModulesAction(orderedIds);
      if (error) {
        setListError(error);
        setItems(modules);
        return;
      }
      router.refresh();
    });
  };

  const onCategoryChange = (id: string, category: string) => {
    const prev = items;
    setItems((rows) => rows.map((r) => (r.id === id ? { ...r, category } : r)));
    startCategory(async () => {
      setListError(null);
      const { error } = await updateSurvivalModuleCategoryAction(id, category);
      if (error) {
        setListError(error);
        setItems(prev);
        return;
      }
      router.refresh();
    });
  };

  const sortableIds = items.map((m) => m.id);

  return (
    <section className="space-y-6" aria-label="Survival modules">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <BrutalTag backgroundColor="bg-brand-pink" className="mb-2" rotate="rotate-1">
            Library
          </BrutalTag>
          <BrutalHeading as="h1" className="text-text-main">
            Survival modules
          </BrutalHeading>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-xl font-bold text-text-main/80">{modules.length} modules</p>
          <button
            type="button"
            onClick={onNew}
            title="New module"
            aria-label="New module"
            className={newIconBtnClass}
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </div>

      {listError ? (
        <p className="rounded-md border-2 border-red-600 bg-red-50 px-3 py-2 text-sm font-semibold text-red-900">
          {listError}
        </p>
      ) : null}

      <BrutalCard className="overflow-hidden border-2 border-text-main p-0">
        <div className="overflow-x-auto">
          {dndReady ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-text-main bg-brand-cream">
                    <th className="w-12 px-2 py-3 font-black uppercase tracking-wide" aria-hidden>
                      {/* drag */}
                    </th>
                    <th className="px-4 py-3 font-black uppercase tracking-wide">Title</th>
                    <th className="px-4 py-3 font-black uppercase tracking-wide">Category</th>
                    <th className="px-4 py-3 font-black uppercase tracking-wide">Steps</th>
                    <th className="px-4 py-3 font-black uppercase tracking-wide">Order</th>
                    <th className="px-4 py-3 font-black uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center font-bold text-text-main/60">
                        No modules yet.
                      </td>
                    </tr>
                  ) : (
                    <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                      {items.map((m, index) => (
                        <SortableRow
                          key={m.id}
                          module={m}
                          index={index}
                          groupHeading={
                            index === 0 || m.category !== items[index - 1]?.category ? m.category : null
                          }
                          categoryOptions={categoryOptions}
                          onEdit={onEdit}
                          onCategoryChange={onCategoryChange}
                          categoryBusy={categoryPending}
                        />
                      ))}
                    </SortableContext>
                  )}
                </tbody>
              </table>
            </DndContext>
          ) : (
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-text-main bg-brand-cream">
                  <th className="w-12 px-2 py-3 font-black uppercase tracking-wide" aria-hidden>
                    {/* drag */}
                  </th>
                  <th className="px-4 py-3 font-black uppercase tracking-wide">Title</th>
                  <th className="px-4 py-3 font-black uppercase tracking-wide">Category</th>
                  <th className="px-4 py-3 font-black uppercase tracking-wide">Steps</th>
                  <th className="px-4 py-3 font-black uppercase tracking-wide">Order</th>
                  <th className="px-4 py-3 font-black uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center font-bold text-text-main/60">
                      No modules yet.
                    </td>
                  </tr>
                ) : (
                  items.map((m, index) => (
                    <StaticModuleRow
                      key={m.id}
                      m={m}
                      index={index}
                      groupHeading={
                        index === 0 || m.category !== items[index - 1]?.category ? m.category : null
                      }
                      categoryOptions={categoryOptions}
                      onEdit={onEdit}
                      onCategoryChange={onCategoryChange}
                      categoryBusy={categoryPending}
                    />
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </BrutalCard>
      {reorderPending ? (
        <p className="text-xs font-semibold text-text-main/50">Saving order…</p>
      ) : null}
    </section>
  );
}
