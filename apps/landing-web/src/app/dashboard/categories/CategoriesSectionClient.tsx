'use client';

import type { SurvivalModuleCategoryRecord } from '../data';
import { arrayMove } from '@dnd-kit/sortable';
import { BrutalButton, BrutalCard, BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { DbErrorBanner } from '../panels/DbErrorBanner';
import {
  createCategoryAction,
  deleteCategoryAction,
  renameCategoryAction,
  reorderCategoriesAction,
} from './actions';

const inputClass =
  'w-full min-w-0 rounded-md border-2 border-text-main bg-white px-3 py-2 text-sm font-semibold text-text-main shadow-[2px_2px_0_0_rgba(0,0,0,1)]';

type Props = {
  dbError: string | null;
  initialCategories: SurvivalModuleCategoryRecord[];
};

export function CategoriesSectionClient({ dbError, initialCategories }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<SurvivalModuleCategoryRecord[]>(initialCategories);
  const [newName, setNewName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setItems(initialCategories);
  }, [initialCategories]);

  const refresh = () => router.refresh();

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    startTransition(async () => {
      setFormError(null);
      const { error } = await createCategoryAction(name);
      if (error) {
        setFormError(error);
        return;
      }
      setNewName('');
      refresh();
    });
  };

  const onMove = (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const next = arrayMove(items, index, j);
    const orderedIds = next.map((c) => c.id);
    setItems(next);
    startTransition(async () => {
      setFormError(null);
      const { error } = await reorderCategoriesAction(orderedIds);
      if (error) {
        setFormError(error);
        refresh();
        return;
      }
      refresh();
    });
  };

  const onDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete category “${name}”? Modules must not use it.`)) return;
    startTransition(async () => {
      setFormError(null);
      const { error } = await deleteCategoryAction(id);
      if (error) {
        setFormError(error);
        return;
      }
      setEditingId(null);
      refresh();
    });
  };

  const startEdit = (c: SurvivalModuleCategoryRecord) => {
    setEditingId(c.id);
    setEditingName(c.name);
    setFormError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = () => {
    if (!editingId) return;
    const name = editingName.trim();
    if (!name) return;
    const id = editingId;
    startTransition(async () => {
      setFormError(null);
      const { error } = await renameCategoryAction(id, name);
      if (error) {
        setFormError(error);
        return;
      }
      cancelEdit();
      refresh();
    });
  };

  return (
    <section className="space-y-6" aria-label="Survival module categories">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <BrutalTag backgroundColor="bg-brand-mint" className="mb-2" rotate="-rotate-1">
            Library
          </BrutalTag>
          <BrutalHeading as="h1" className="text-text-main">
            Categories
          </BrutalHeading>
          <p className="mt-2 max-w-xl text-sm font-semibold text-text-main/75">
            Names here match the <strong className="text-text-main">category</strong> field on survival modules.
            The library groups modules by this order.
          </p>
        </div>
      </div>

      {dbError ? <DbErrorBanner message={dbError} /> : null}
      {formError ? (
        <p className="rounded-md border-2 border-red-600 bg-red-50 px-3 py-2 text-sm font-semibold text-red-900">
          {formError}
        </p>
      ) : null}

      <BrutalCard className="border-2 border-text-main p-4">
        <h2 className="mb-3 text-lg font-black uppercase tracking-wide text-text-main">New category</h2>
        <form onSubmit={onCreate} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1">
            <span className="mb-1 block text-xs font-bold uppercase text-text-main/70">Name</span>
            <input
              className={inputClass}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Food & drink"
              maxLength={120}
              disabled={pending}
            />
          </label>
          <BrutalButton type="submit" disabled={pending || !newName.trim()} className="shrink-0 gap-2">
            <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            Add
          </BrutalButton>
        </form>
      </BrutalCard>

      <BrutalCard className="overflow-hidden border-2 border-text-main p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[20rem] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-text-main bg-brand-cream">
                <th className="px-4 py-3 font-black uppercase tracking-wide">Order</th>
                <th className="px-4 py-3 font-black uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 font-black uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center font-bold text-text-main/60">
                    No categories yet. Add one above.
                  </td>
                </tr>
              ) : (
                items.map((c, index) => (
                  <tr
                    key={c.id}
                    className="border-b border-text-main/15 odd:bg-white even:bg-brand-cream/40"
                  >
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-text-main bg-white text-text-main shadow-[2px_2px_0_0_rgba(0,0,0,1)] disabled:opacity-40"
                          aria-label="Move up"
                          disabled={pending || index === 0}
                          onClick={() => onMove(index, -1)}
                        >
                          <ArrowUp className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-text-main bg-white text-text-main shadow-[2px_2px_0_0_rgba(0,0,0,1)] disabled:opacity-40"
                          aria-label="Move down"
                          disabled={pending || index === items.length - 1}
                          onClick={() => onMove(index, 1)}
                        >
                          <ArrowDown className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-text-main">
                      {editingId === c.id ? (
                        <input
                          className={inputClass}
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          maxLength={120}
                          disabled={pending}
                          aria-label="Edit category name"
                        />
                      ) : (
                        c.name
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {editingId === c.id ? (
                          <>
                            <BrutalButton
                              type="button"
                              disabled={pending}
                              onClick={saveEdit}
                              className="!px-4 !py-2 !text-sm"
                            >
                              Save
                            </BrutalButton>
                            <BrutalButton
                              type="button"
                              variant="ghost"
                              disabled={pending}
                              onClick={cancelEdit}
                              className="!px-4 !py-2 !text-sm"
                            >
                              Cancel
                            </BrutalButton>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              title="Rename"
                              aria-label={`Rename ${c.name}`}
                              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-brand-yellow text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                              disabled={pending}
                              onClick={() => startEdit(c)}
                            >
                              <Pencil className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                            </button>
                            <button
                              type="button"
                              title="Delete category"
                              aria-label={`Delete ${c.name}`}
                              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-red-600 shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 hover:bg-red-50 disabled:opacity-50"
                              disabled={pending}
                              onClick={() => onDelete(c.id, c.name)}
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </BrutalCard>
    </section>
  );
}
