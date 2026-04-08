import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { DashboardShell } from './DashboardShell';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Dashboard',
  description: 'Internal view of waitlist signups and contact messages.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
