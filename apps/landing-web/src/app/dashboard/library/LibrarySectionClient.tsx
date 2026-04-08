'use client';

import type { SurvivalModule } from '@xinchao/shared';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { DbErrorBanner } from '../panels/DbErrorBanner';
import { DashboardSlidePanel } from '../panels/DashboardSlidePanel';
import { SurvivalModuleEditor } from '../panels/SurvivalModuleEditor';
import { SurvivalModulesPanel } from '../panels/SurvivalModulesPanel';

type PanelState = { kind: 'closed' } | { kind: 'create' } | { kind: 'edit'; module: SurvivalModule };

function panelTitle(state: PanelState): string {
  if (state.kind === 'create') return 'New module';
  if (state.kind === 'edit') return `Edit: ${state.module.id}`;
  return '';
}

type Props = {
  dbError: string | null;
  modules: SurvivalModule[];
};

export function LibrarySectionClient({ dbError, modules }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createOpen = searchParams.get('create') === '1';
  const editId = searchParams.get('edit');

  const panel = useMemo((): PanelState => {
    if (editId) {
      const mod = modules.find((m) => m.id === editId);
      if (mod) return { kind: 'edit', module: mod };
      return { kind: 'closed' };
    }
    if (createOpen) return { kind: 'create' };
    return { kind: 'closed' };
  }, [modules, editId, createOpen]);

  useEffect(() => {
    if (!editId) return;
    if (!modules.some((m) => m.id === editId)) {
      router.replace(pathname, { scroll: false });
    }
  }, [editId, modules, pathname, router]);

  const closePanel = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const openCreate = useCallback(() => {
    router.push(`${pathname}?create=1`, { scroll: false });
  }, [router, pathname]);

  const openEdit = useCallback(
    (m: SurvivalModule) => {
      router.push(`${pathname}?${new URLSearchParams({ edit: m.id }).toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  return (
    <div className="flex w-full flex-col md:h-[calc(100dvh-5rem)] md:min-h-[22rem] md:flex-row md:overflow-hidden md:items-stretch">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto md:pr-3">
        {dbError ? <DbErrorBanner message={dbError} /> : null}
        <SurvivalModulesPanel modules={modules} onNew={openCreate} onEdit={openEdit} />
      </div>

      <DashboardSlidePanel
        open={panel.kind !== 'closed'}
        title={panelTitle(panel)}
        onClose={closePanel}
      >
        {panel.kind === 'create' ? (
          <SurvivalModuleEditor
            key="create"
            mode="create"
            initial={null}
            layout="panel"
            onSaved={closePanel}
            onDeleted={closePanel}
          />
        ) : panel.kind === 'edit' ? (
          <SurvivalModuleEditor
            key={panel.module.id}
            mode="edit"
            initial={panel.module}
            layout="panel"
            onSaved={closePanel}
            onDeleted={closePanel}
          />
        ) : null}
      </DashboardSlidePanel>
    </div>
  );
}
