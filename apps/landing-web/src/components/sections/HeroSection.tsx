import {
  BrutalChat,
  BrutalHeading,
  BrutalPhone,
  BrutalTag,
  getBrutalButtonClassName,
} from '@xinchao/ui-web';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BrutalSection } from '../layout/BrutalSection';
import { BrutalContainer } from '../layout/BrutalContainer';

export const HeroSection: React.FC = () => {
  return (
    <BrutalSection padding="lg" id="hero">
      <BrutalContainer className="flex flex-col md:flex-row items-center gap-16 relative">
        <div className="flex-1 space-y-8">
          <BrutalTag>The Traveler&apos;s Lifebuoy</BrutalTag>

          <BrutalHeading as="h1">
            Speak{' '}
            <span className="text-brand-red underline decoration-8 underline-offset-8">Vietnamese.</span>
            <br />
            Survive. <span className="text-brand-yellow">Connect.</span>
          </BrutalHeading>

          <p className="text-xl md:text-2xl font-bold leading-relaxed max-w-2xl text-text-muted">
            Don&apos;t just travel—live like a local. The pocket survival kit for street food, bargaining,
            and culture in your first days.
            <span className="text-text-main bg-brand-mint px-2 border-2 border-text-main mx-1">
              Built for real streets—not just classrooms.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/#waitlist"
              className={getBrutalButtonClassName({
                variant: 'primary',
                className: 'h-16 px-8 text-xl',
              })}
            >
              GET THE APP
            </Link>
            <Link
              href="https://www.youtube.com/@tuhocproduct"
              target="_blank"
              rel="noopener noreferrer"
              className={getBrutalButtonClassName({
                variant: 'secondary',
                className: 'h-16 px-8 text-xl',
              })}
            >
              WATCH REEL
            </Link>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-text-main bg-brand-lavender flex items-center justify-center font-black overflow-hidden relative"
                >
                  <Image
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${i}`}
                    alt=""
                    width={48}
                    height={48}
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
               <p className="font-bold text-sm">
                 <span className="text-brand-red">Travelers</span> use XinChao to navigate Vietnam with
                 confidence.
               </p>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center relative py-10">
          <div className="absolute w-[400px] h-[400px] bg-brand-yellow rounded-full border-4 border-text-main brutal-shadow -z-10 animate-pulse" />

          <BrutalPhone>
            <BrutalChat />
          </BrutalPhone>

          <div className="absolute top-1/4 -right-4 bg-white border-2 border-text-main p-4 rounded-xl brutal-shadow font-black animate-bounce hidden xl:block whitespace-nowrap">
            Your pocket Vietnamese coach
          </div>
        </div>
      </BrutalContainer>
    </BrutalSection>
  );
};
