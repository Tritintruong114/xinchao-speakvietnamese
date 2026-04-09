import { buildPageMetadata } from '@/lib/seo';
import { HeroSection } from '../../components/sections/HeroSection';
import { MarqueeSection } from '../../components/sections/MarqueeSection';
import { ReviewSection } from '../../components/sections/ReviewSection';
import { USPSection } from '../../components/sections/USPSection';
import { WaitlistSection } from '../../components/sections/WaitlistSection';

export const metadata = buildPageMetadata({
  title: 'Survival Vietnamese for Travelers',
  description:
    'Street-smart phrases, pocket survival packs, and menu scanning for Vietnam—learn what textbooks skip.',
  path: '/',
  keywords: ['Vietnam food phrases', 'tourist Vietnamese', 'Vietnamese travel phrases'],
});

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
