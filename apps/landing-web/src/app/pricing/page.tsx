import { BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import type { Metadata } from 'next';
import { BrutalSection } from '../../components/layout/BrutalSection';
import { BrutalContainer } from '../../components/layout/BrutalContainer';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Fair pricing for full access to XinChao survival packs—details coming soon.',
};

export default function PricingPage() {
  return (
    <>
      <BrutalSection padding="lg" id="pricing-hero">
        <BrutalContainer maxWidth="4xl" className="text-center space-y-8">
          <BrutalTag backgroundColor="bg-brand-yellow" rotate="-rotate-1">ONE PRICE. ALL ACCESS.</BrutalTag>
          <BrutalHeading as="h1" className="text-text-main lowercase italic underline decoration-brand-red decoration-8 underline-offset-8">
            Fair Pricing
          </BrutalHeading>
        </BrutalContainer>
      </BrutalSection>

      <BrutalSection padding="lg" id="pricing-plans">
        <BrutalContainer maxWidth="7xl" className="space-y-12 flex flex-col items-center justify-center min-h-[40vh] text-center">
          <BrutalTag backgroundColor="bg-brand-red" className="text-white">UNDER CONSTRUCTION</BrutalTag>
          <BrutalHeading as="h2" className="text-5xl md:text-7xl lowercase italic">
            nothing here, <br />
            we working on it
          </BrutalHeading>
          <p className="text-xl font-bold opacity-50 italic text-text-muted">
            (Bình tĩnh, tụi tui đang làm...)
          </p>
        </BrutalContainer>
      </BrutalSection>
    </>
  );
}
