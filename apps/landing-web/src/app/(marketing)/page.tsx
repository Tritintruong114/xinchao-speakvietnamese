import type { Metadata } from 'next';
import { HeroSection } from '../../components/sections/HeroSection';
import { MarqueeSection } from '../../components/sections/MarqueeSection';
import { ReviewSection } from '../../components/sections/ReviewSection';
import { USPSection } from '../../components/sections/USPSection';
import { WaitlistSection } from '../../components/sections/WaitlistSection';

export const metadata: Metadata = {
  title: 'Survival Vietnamese for Travelers',
  description:
    'Street-smart phrases, offline survival packs, and menu scanning for Vietnam—learn what textbooks skip.',
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <USPSection />
      <ReviewSection />
      <WaitlistSection />
    </>
  );
}
