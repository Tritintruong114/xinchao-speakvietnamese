'use client';

import type { SavedPhrase } from '@xinchao/shared';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { DbErrorBanner } from '../panels/DbErrorBanner';
import { DashboardSlidePanel } from '../panels/DashboardSlidePanel';
import { SavedPhraseEditor } from '../panels/SavedPhraseEditor';
import { SavedPhrasesPanel } from '../panels/SavedPhrasesPanel';

type PanelState = { kind: 'closed' } | { kind: 'create' } | { kind: 'edit'; phrase: SavedPhrase };

function panelTitle(state: PanelState): string {
  if (state.kind === 'create') return 'New phrase';
  if (state.kind === 'edit') return `Edit: ${state.phrase.id}`;
  return '';
}

type Props = {
  dbError: string | null;
  phrases: SavedPhrase[];
};

export function OfflineSectionClient({ dbError, phrases }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createOpen = searchParams.get('create') === '1';
  const editId = searchParams.get('edit');

  const panel = useMemo((): PanelState => {
    if (editId) {
      const p = phrases.find((x) => x.id === editId);
      if (p) return { kind: 'edit', phrase: p };
      return { kind: 'closed' };
    }
    if (createOpen) return { kind: 'create' };
    return { kind: 'closed' };
  }, [phrases, editId, createOpen]);

  useEffect(() => {
    if (!editId) return;
    if (!phrases.some((p) => p.id === editId)) {
      router.replace(pathname, { scroll: false });
    }
  }, [editId, phrases, pathname, router]);

  const closePanel = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const openCreate = useCallback(() => {
    router.push(`${pathname}?create=1`, { scroll: false });
  }, [router, pathname]);

  const openEdit = useCallback(
    (p: SavedPhrase) => {
      router.push(`${pathname}?${new URLSearchParams({ edit: p.id }).toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  return (
    <div className="flex w-full flex-col md:h-[calc(100dvh-5rem)] md:min-h-[22rem] md:flex-row md:overflow-hidden md:items-stretch">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto md:pr-3">
        {dbError ? <DbErrorBanner message={dbError} /> : null}
        <SavedPhrasesPanel phrases={phrases} onNew={openCreate} onEdit={openEdit} />
      </div>

      <DashboardSlidePanel
        open={panel.kind !== 'closed'}
        title={panelTitle(panel)}
        onClose={closePanel}
      >
        {panel.kind === 'create' ? (
          <SavedPhraseEditor
            key="create"
            mode="create"
            initial={null}
            layout="panel"
            onSaved={closePanel}
            onDeleted={closePanel}
          />
        ) : panel.kind === 'edit' ? (
          <SavedPhraseEditor
            key={panel.phrase.id}
            mode="edit"
            initial={panel.phrase}
            layout="panel"
            onSaved={closePanel}
            onDeleted={closePanel}
          />
        ) : null}
      </DashboardSlidePanel>
    </div>
  );
}
