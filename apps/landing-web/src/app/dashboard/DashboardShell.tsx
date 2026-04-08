'use client';

import { usePathname } from 'next/navigation';
import { DashboardFrame } from './DashboardFrame';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  if (pathname.startsWith('/dashboard/login')) {
    return <>{children}</>;
  }
  return <DashboardFrame>{children}</DashboardFrame>;
}
