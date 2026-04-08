'use client';

import { deleteModuleAction } from '../library/actions';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const iconBtn =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0';

export function ModuleDeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      title={`Delete “${title}”`}
      aria-label={`Delete module ${id}`}
      className={`${iconBtn} bg-white text-red-600 hover:bg-red-50`}
      onClick={async () => {
        if (!window.confirm(`Delete “${title}” (${id})?`)) return;
        setBusy(true);
        const { error } = await deleteModuleAction(id);
        setBusy(false);
        if (error) window.alert(error);
        else router.refresh();
      }}
    >
      <Trash2 className="h-4 w-4" strokeWidth={2.5} aria-hidden />
    </button>
  );
}
