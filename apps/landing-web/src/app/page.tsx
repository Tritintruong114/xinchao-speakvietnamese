import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { MarqueeSection } from '../components/sections/MarqueeSection';
import { ReviewSection } from '../components/sections/ReviewSection';
import { USPSection } from '../components/sections/USPSection';
import { WaitlistSection } from '../components/sections/WaitlistSection';

export default function Home() {
  return (
    <>
      {/* Main Sections */}
      <HeroSection />
      
      <MarqueeSection />

      <USPSection />

      <ReviewSection />

      <WaitlistSection />
    </>
  );
}
