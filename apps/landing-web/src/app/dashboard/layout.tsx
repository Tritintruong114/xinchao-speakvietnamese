import type { Metadata } from 'next';
import { DashboardFrame } from './DashboardFrame';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Internal view of waitlist signups and contact messages.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardFrame>{children}</DashboardFrame>;
}
