import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { FooterSection } from '@/components/sections/FooterSection';

export default function ReleaseNotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <main className="flex-grow flex flex-col">
        <div className="mx-auto w-full max-w-4xl flex-grow px-4 py-10 md:px-6 md:py-14">{children}</div>
      </main>
      <FooterSection />
    </div>
  );
}
