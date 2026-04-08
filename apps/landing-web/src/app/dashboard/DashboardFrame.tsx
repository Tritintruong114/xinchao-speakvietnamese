'use client';

import { BookOpen, MessageCircle, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function navButtonClass(active: boolean) {
  return [
    'relative z-10 flex h-12 w-12 items-center justify-center rounded-md border-2 border-text-main transition-transform',
    'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer',
    active ? 'bg-brand-yellow -translate-y-0.5' : 'bg-white hover:-translate-y-0.5',
  ].join(' ');
}

export function DashboardFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const segment = pathname.replace(/\/$/, '').split('/').pop() ?? '';
  const isWaitlist = pathname === '/dashboard' || pathname === '/dashboard/';
  const isContact = segment === 'contact';
  const isLibrary = segment === 'library';

  return (
    <div className="flex min-h-screen">
      <aside
        className="relative z-20 flex w-20 shrink-0 flex-col border-r-4 border-text-main bg-white md:w-24"
        aria-label="Dashboard navigation"
      >
        <div className="pointer-events-none flex-1 min-h-0" aria-hidden />
        <nav className="relative z-10 flex flex-col items-center gap-8 py-6">
          <Link
            href="/dashboard"
            prefetch
            title="Waitlist signups"
            aria-label="Waitlist signups"
            aria-current={isWaitlist ? 'page' : undefined}
            className={navButtonClass(isWaitlist)}
          >
            <UserPlus className="h-6 w-6 text-text-main pointer-events-none" strokeWidth={2.5} />
          </Link>
          <Link
            href="/dashboard/contact"
            prefetch
            title="Contact us messages"
            aria-label="Contact us messages"
            aria-current={isContact ? 'page' : undefined}
            className={navButtonClass(isContact)}
          >
            <MessageCircle className="h-6 w-6 text-text-main pointer-events-none" strokeWidth={2.5} />
          </Link>
          <Link
            href="/dashboard/library"
            prefetch
            title="Library (coming soon)"
            aria-label="Library (coming soon)"
            aria-current={isLibrary ? 'page' : undefined}
            className={navButtonClass(isLibrary)}
          >
            <BookOpen className="h-6 w-6 text-text-main pointer-events-none" strokeWidth={2.5} />
          </Link>
        </nav>
        <div className="pointer-events-none flex-1 min-h-0" aria-hidden />
      </aside>

      <div className="relative z-0 min-w-0 flex-1 overflow-auto p-6 md:p-10">{children}</div>
    </div>
  );
}
