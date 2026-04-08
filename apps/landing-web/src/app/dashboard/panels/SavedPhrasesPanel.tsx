import type { SavedPhrase } from '@xinchao/shared';
import { BrutalCard, BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import { Pencil, Plus } from 'lucide-react';
import { PhraseDeleteButton } from './PhraseDeleteButton';

const editIconBtnClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-brand-yellow text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5';

const newIconBtnClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5';

interface Props {
  phrases: SavedPhrase[];
  onNew: () => void;
  onEdit: (phrase: SavedPhrase) => void;
}

export function SavedPhrasesPanel({ phrases, onNew, onEdit }: Props) {
  return (
    <section className="space-y-6" aria-label="Saved phrases">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <BrutalTag backgroundColor="bg-brand-blue" className="mb-2" rotate="-rotate-1">
            Offline
          </BrutalTag>
          <BrutalHeading as="h1" className="text-text-main">
            Saved phrases
          </BrutalHeading>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-xl font-bold text-text-main/80">{phrases.length} phrases</p>
          <button
            type="button"
            onClick={onNew}
            title="New phrase"
            aria-label="New phrase"
            className={newIconBtnClass}
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </div>

      <BrutalCard className="overflow-hidden border-2 border-text-main p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-text-main bg-brand-cream">
                <th className="px-4 py-3 font-black uppercase tracking-wide">VI</th>
                <th className="px-4 py-3 font-black uppercase tracking-wide">EN</th>
                <th className="px-4 py-3 font-black uppercase tracking-wide">Categories</th>
                <th className="px-4 py-3 font-black uppercase tracking-wide">Order</th>
                <th className="px-4 py-3 font-black uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {phrases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center font-bold text-text-main/60">
                    No rows yet. Seed or create phrases.
                  </td>
                </tr>
              ) : (
                phrases.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-text-main/15 odd:bg-white even:bg-brand-cream/40"
                  >
                    <td className="max-w-[12rem] truncate px-4 py-3 font-semibold text-text-main">{p.vietnamese}</td>
                    <td className="max-w-[12rem] truncate px-4 py-3 text-text-main/80">{p.english}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-text-main/80">
                      {(p.categories ?? []).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-text-main/80">{p.sort_order ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          title="Edit phrase"
                          aria-label={`Edit phrase ${p.id}`}
                          className={editIconBtnClass}
                          onClick={() => onEdit(p)}
                        >
                          <Pencil className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                        </button>
                        <PhraseDeleteButton id={p.id} label={p.vietnamese} />
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
