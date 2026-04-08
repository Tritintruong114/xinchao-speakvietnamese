import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { NavbarWrapper } from '../../components/layout/NavbarWrapper';
import { FooterSection } from '../../components/sections/FooterSection';

/** Ensures child pages resolve absolute Open Graph URLs under marketing routes. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <main className="flex-grow flex flex-col">{children}</main>
      <FooterSection />
    </div>
  );
}
