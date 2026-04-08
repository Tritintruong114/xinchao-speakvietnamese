import React from 'react';
import { BrutalCard, BrutalHeading, BrutalTag, cn } from '@xinchao/ui-web';
import { Star, MessageCircle, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BrutalSection } from '../layout/BrutalSection';
import { BrutalContainer } from '../layout/BrutalContainer';

const REVIEWS = [
  {
    id: 1,
    name: 'Alex Johnson',
    level: 'Backpacker',
    location: 'Hanoi Old Quarter',
    content:
      'The scan-to-translate flow is fast. I finally knew what was in my phở without awkward pointing.',
    borderColor: 'border-brand-mint',
    avatarId: 'alex',
  },
  {
    id: 2,
    name: 'Sarah Miller',
    level: 'Digital Nomad',
    location: 'HCMC Sleeper Bus',
    content:
      'Offline mode is the lifebuoy. On a long bus with no signal, I could still ask for water and the next stop.',
    borderColor: 'border-brand-lavender',
    avatarId: 'sarah',
  },
  {
    id: 3,
    name: 'John Smith',
    level: 'Expat',
    location: 'Da Nang Market',
    content:
      'So many apps skew textbook. Street slang and bargaining patterns helped me feel less like a walking tourist price tag.',
    borderColor: 'border-brand-pink',
    avatarId: 'john',
  },
  {
    id: 4,
    name: 'Elena Rossi',
    level: 'Culture Seeker',
    location: 'Sapa Mountains',
    content:
      "The street-smart phrases go beyond literal translation—it's the tone and context that matter at a tea stall.",
    borderColor: 'border-brand-yellow',
    avatarId: 'elena',
  },
  {
    id: 5,
    name: 'David Chen',
    level: 'Business Traveler',
    location: 'Hanoi',
    content:
      'Fast, practical, no grammar fluff. Bargaining scripts gave me structure before I walked into a negotiation.',
    borderColor: 'border-brand-red',
    avatarId: 'david',
  },
  {
    id: 6,
    name: 'Lina Meyer',
    level: 'Solo Traveler',
    location: 'Hoi An',
    content:
      'Point the camera, get the gist of a handwritten sign—handy when you just need to decide "safe enough to try."',
    borderColor: 'border-brand-cyan',
    avatarId: 'lina',
  },
];

export const ReviewSection: React.FC = () => {
  return (
    <BrutalSection
      backgroundColor="bg-brand-cream"
      className="border-y-8 border-text-main"
      padding="lg"
      id="reviews"
    >
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-yellow opacity-10 rounded-full border-4 border-dashed border-text-main animate-spin-slow pointer-events-none" />

      <BrutalContainer className="relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <div className="max-w-3xl space-y-6">
            <BrutalTag className="bg-brand-yellow border-2 border-text-main shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] px-4 py-1 text-sm">
              SURVIVAL STORIES
            </BrutalTag>
            <BrutalHeading as="h2" className="text-5xl md:text-8xl uppercase tracking-tighter leading-[0.9]">
              Voices from the road.
              <br />
              <span className="text-brand-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">Survival-first.</span>
            </BrutalHeading>
            <p className="text-sm md:text-base font-bold text-text-muted max-w-xl">
              Illustrative traveler scenarios—inspired by common situations in Vietnam, not verified individual
              endorsements.
            </p>
          </div>
          <div className="bg-white border-4 border-text-main p-6 brutal-shadow-sm max-w-sm rotate-2">
            <p className="text-lg font-black leading-tight italic">
              “Stop paying the traveler premium—learn the phrases that actually move conversations.”
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {REVIEWS.map((review) => (
            <div key={review.id} className="group perspective-1000">
              <BrutalCard
                backgroundColor="bg-white"
                className={cn(
                  'p-8 flex flex-col gap-8 justify-between border-4 brutal-shadow-lg h-full relative overflow-hidden transition-all duration-500',
                  'hover:-translate-y-4 hover:rotate-1 hover:shadow-brutal-2xl',
                  review.borderColor
                )}
              >
                <div className="absolute top-4 right-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                  <Quote size={80} className="text-text-main" />
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-0.5" aria-hidden>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          fill="currentColor"
                          stroke="none"
                          className="text-brand-yellow drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xl font-bold leading-[1.3] text-text-main group-hover:text-brand-red transition-colors">
                    &ldquo;{review.content}&rdquo;
                  </p>
                </div>

                <div className="pt-6 border-t-2 border-text-main/10 flex justify-between items-end">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-xl border-2 border-text-main bg-brand-cream overflow-hidden brutal-shadow-sm group-hover:rotate-3 transition-transform shrink-0 relative">
                      <Image
                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${review.avatarId}`}
                        alt=""
                        width={56}
                        height={56}
                        unoptimized
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-xl uppercase tracking-tight leading-none truncate">
                        {review.name}
                      </p>
                      <div className="flex flex-col mt-1">
                        <span className="text-[10px] font-black text-brand-red uppercase tracking-wider">
                          {review.level}
                        </span>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                          {review.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <MessageCircle size={28} className="text-text-main opacity-20 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </BrutalCard>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/contact"
            className="inline-block bg-text-main text-white px-8 py-4 border-4 border-text-main brutal-shadow font-black text-2xl uppercase tracking-widest hover:bg-brand-red transition-colors"
          >
            Share your story
          </Link>
        </div>
      </BrutalContainer>
    </BrutalSection>
  );
};
