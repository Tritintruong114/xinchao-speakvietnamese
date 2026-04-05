import React from 'react';
import { BrutalButton, BrutalHeading, BrutalTag, BrutalCard, cn } from '@xinchao/ui-web';
import { BrutalSection } from '../layout/BrutalSection';
import { BrutalContainer } from '../layout/BrutalContainer';

export const WaitlistSection: React.FC = () => {
  return (
    <BrutalSection id="waitlist" backgroundColor="bg-brand-pink" padding="lg">
      {/* Decorative pulse background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow rounded-full border-4 border-text-main brutal-shadow-lg -translate-y-1/2 translate-x-1/2 animate-pulse opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-mint rounded-full border-4 border-text-main brutal-shadow-lg translate-y-1/2 -translate-x-1/2 animate-pulse opacity-50" />

      <BrutalContainer className="relative z-10 text-center space-y-12">
        <div className="space-y-6 max-w-4xl mx-auto">
          <BrutalTag className="bg-brand-red text-white">EARLY BIRD SURVIVAL PACK</BrutalTag>
          <BrutalHeading as="h2" className="text-5xl md:text-8xl uppercase tracking-tighter text-text-main">
             GET <span className="text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">1 MONTH</span> PRO FREE!
          </BrutalHeading>
          <p className="text-2xl font-black md:text-3xl max-w-2xl mx-auto leading-tight italic">
             Join the "Survivor" waitlist and unlock all survival features for 30 days. No Wi-Fi required.
          </p>
        </div>

        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch gap-0 border-4 border-text-main rounded-2xl overflow-hidden brutal-shadow-lg bg-white">
          <input 
            type="email" 
            placeholder="your-email@survival.com" 
            className="flex-1 px-8 py-6 text-xl font-bold bg-transparent focus:outline-none focus:bg-brand-cream transition-colors placeholder:text-text-muted"
          />
          <button 
            className={cn(
              "px-10 py-6 text-xl font-black uppercase tracking-widest text-white transition-all bg-brand-red border-l-4 border-text-main",
              "hover:bg-text-main hover:text-brand-red active:translate-y-1"
            )}
          >
             GET PRO ACCESS
          </button>
        </div>

        <p className="font-bold text-lg opacity-80">
           Limited to first 5,000 survivors. Join now. 🚀
        </p>
      </BrutalContainer>
    </BrutalSection>
  );
};
