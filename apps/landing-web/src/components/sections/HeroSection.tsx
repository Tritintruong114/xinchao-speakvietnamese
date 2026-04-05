import {
  BrutalButton,
  BrutalChat,
  BrutalHeading,
  BrutalPhone,
  BrutalTag
} from '@xinchao/ui-web';
import React from 'react';
import { BrutalSection } from '../layout/BrutalSection';
import { BrutalContainer } from '../layout/BrutalContainer';

export const HeroSection: React.FC = () => {
  return (
    <BrutalSection padding="lg" id="hero">
      <BrutalContainer className="flex flex-col md:flex-row items-center gap-16 relative">
        <div className="flex-1 space-y-8">
          <BrutalTag>
            The Traveler's Lifebuoy
          </BrutalTag>

          <BrutalHeading as="h1">
            Speak <span className="text-brand-red underline decoration-8 underline-offset-8">Vietnamese.</span><br />
            Survive. <span className="text-brand-yellow">Connect.</span>
          </BrutalHeading>

          <p className="text-xl md:text-2xl font-bold leading-relaxed max-w-2xl text-text-muted">
            Don't just travel—Live like a local. The Pocket Survival Kit for
            navigating street food, bargaining, and culture in 24 hours.
            <span className="text-text-main bg-brand-mint px-2 border-2 border-text-main mx-1">100% Offline.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <BrutalButton variant="primary" className="h-16 px-8 text-xl">
              GET THE APP
            </BrutalButton>
            <BrutalButton variant="secondary" className="h-16 px-8 text-xl">
              WATCH REEL
            </BrutalButton>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-12 h-12 rounded-full border-2 border-text-main bg-brand-lavender flex items-center justify-center font-black overflow-hidden`}>
                  <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="font-bold text-sm">
              <span className="text-brand-red">10,000+</span> Travelers surviving Vietnam today.
            </p>
          </div>
        </div>

        {/* Mascot / Stool Representation */}
        <div className="flex-1 flex justify-center items-center relative py-10">
          {/* Decorative Background for Phone */}
          <div className="absolute w-[400px] h-[400px] bg-brand-yellow rounded-full border-4 border-text-main brutal-shadow -z-10 animate-pulse" />

          <BrutalPhone>
            <BrutalChat />
          </BrutalPhone>

          {/* Floating Badge */}
          <div className="absolute top-1/4 -right-4 bg-white border-2 border-text-main p-4 rounded-xl brutal-shadow font-black animate-bounce hidden xl:block whitespace-nowrap">
            100% Offline AI! 🚀
          </div>
        </div>
      </BrutalContainer>
    </BrutalSection>
  );
};
