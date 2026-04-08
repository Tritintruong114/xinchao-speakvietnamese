import type { SurvivalModule } from '@xinchao/shared';
import { BrutalCard, BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import { Pencil, Plus } from 'lucide-react';
import { ModuleDeleteButton } from './ModuleDeleteButton';

const editIconBtnClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-brand-yellow text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5';

const newIconBtnClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5';

function stepsCount(m: SurvivalModule & { steps?: unknown }) {
  const s = m.steps;
  return Array.isArray(s) ? s.length : 0;
}

interface Props {
  modules: SurvivalModule[];
  onNew: () => void;
  onEdit: (module: SurvivalModule) => void;
}

export function SurvivalModulesPanel({ modules, onNew, onEdit }: Props) {
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

      <BrutalCard className="overflow-hidden border-2 border-text-main p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-text-main bg-brand-cream">
                <th className="px-4 py-3 font-black uppercase tracking-wide">Title</th>
                <th className="px-4 py-3 font-black uppercase tracking-wide">Category</th>
                <th className="px-4 py-3 font-black uppercase tracking-wide">Steps</th>
                <th className="px-4 py-3 font-black uppercase tracking-wide">Order</th>
                <th className="px-4 py-3 font-black uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center font-bold text-text-main/60">
                    No modules yet.
                  </td>
                </tr>
              ) : (
                modules.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-text-main/15 odd:bg-white even:bg-brand-cream/40"
                  >
                    <td className="px-4 py-3 font-semibold text-text-main">{m.title}</td>
                    <td className="px-4 py-3 text-text-main/80">{m.category}</td>
                    <td className="px-4 py-3 text-text-main/80">{stepsCount(m)}</td>
                    <td className="px-4 py-3 text-text-main/80 tabular-nums">
                      {m.sort_order ?? '—'}
                    </td>
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
