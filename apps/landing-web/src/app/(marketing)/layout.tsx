import { NavbarWrapper } from '../../components/layout/NavbarWrapper';
import { FooterSection } from '../../components/sections/FooterSection';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <main className="flex-grow flex flex-col">{children}</main>
      <FooterSection />
    </div>
  );
}
