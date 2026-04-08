'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

const headerBtnClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-text-main bg-white text-text-main shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5';

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function DashboardSlidePanel({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <aside
      role={open ? 'dialog' : undefined}
      aria-modal={open ? 'true' : undefined}
      className={[
        'flex shrink-0 flex-col overflow-hidden bg-brand-cream transition-[width,max-height] duration-300 ease-out',
        open
          ? 'max-h-[min(88vh,40rem)] w-full border-t border-text-main/25 md:max-h-none md:w-[min(42rem,58vw)] md:border-t-0'
          : 'max-h-0 w-0 border-0 md:max-h-none',
      ].join(' ')}
      aria-hidden={!open}
    >
      {open ? (
        <>
          <header className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-text-main bg-brand-cream px-4 py-3 md:px-6 md:pr-8">
            <h2 className="min-w-0 truncate text-sm font-black uppercase tracking-wide text-text-main">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className={headerBtnClass}
            >
              <X className="h-5 w-5" strokeWidth={2.5} aria-hidden />
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-5 pb-8 pr-6 md:px-6 md:pt-6 md:pb-10 md:pr-8">
            {children}
          </div>
        </>
      ) : null}
    </aside>
  );
}
