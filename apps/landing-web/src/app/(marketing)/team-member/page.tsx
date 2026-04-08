import { BrutalCard, BrutalHeading, BrutalTag, getBrutalButtonClassName } from '@xinchao/ui-web';
import { buildPageMetadata } from '@/lib/seo';
import { Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BrutalSection } from '../../../components/layout/BrutalSection';
import { BrutalContainer } from '../../../components/layout/BrutalContainer';

export const metadata = buildPageMetadata({
  title: 'Team',
  description: 'The small team building XinChao—survival Vietnamese for travelers and expats.',
  path: '/team-member',
});

export default function TeamMemberPage() {
  return (
    <>
      <BrutalSection padding="lg" id="team-hero">
        <BrutalContainer maxWidth="4xl" className="text-center space-y-8">
          <BrutalTag backgroundColor="bg-brand-red" rotate="-rotate-1" className="text-white uppercase">The Humans Behind</BrutalTag>
          <BrutalHeading as="h1" className="text-text-main lowercase italic underline decoration-brand-yellow decoration-8 underline-offset-8">
            Meet the Team
          </BrutalHeading>
          <p className="text-3xl font-bold italic leading-relaxed text-text-main/90">
            XinChao is built by travelers, for travelers. We're a small team dedicated to making your first 24 hours in Vietnam unforgettable.
          </p>
        </BrutalContainer>
      </BrutalSection>

      <BrutalSection padding="lg" backgroundColor="bg-white/30" id="founder">
        <BrutalContainer maxWidth="4xl">
          <BrutalCard className="p-10 bg-brand-yellow border-4 border-text-main brutal-shadow-lg flex flex-col md:flex-row gap-12 items-center">
            {/* Avatar / Photo */}
            <div className="w-56 h-[390px] bg-white border-4 border-text-main rounded-2xl flex items-center justify-center brutal-shadow-sm overflow-hidden flex-shrink-0">
               <Image
                 src="/bruno.jpg"
                 alt="Tín Trương"
                 width={224}
                 height={390}
                 className="w-full h-full object-cover transition-all duration-300"
                 sizes="(max-width: 768px) 100vw, 224px"
               />
            </div>

            <div className="space-y-6 flex-grow">
              <div className="space-y-2">
                <BrutalTag backgroundColor="bg-brand-red" className="text-white text-xs">FOUNDER</BrutalTag>
                <h2 className="text-5xl font-black italic">Tín Trương</h2>
                <p className="text-xl font-bold opacity-70">Part-time Human & Full-time Bánh Mì Eraser</p>
              </div>

              <p className="text-xl font-bold italic leading-relaxed">
                "I work every waking hour, but I can't resist a coffee date—I guess you could say I stay 'grounded.' Please send me a DM if you want to know more about the beauty and the chaos at the same level. Just kidding, you'll be fine!"
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="https://www.linkedin.com/in/truongtritin-bruno/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={getBrutalButtonClassName({
                    variant: 'primary',
                    className: 'flex items-center gap-2 py-3 px-6',
                  })}
                >
                  <Linkedin size={20} /> LinkedIn
                </Link>
                <Link
                  href="https://www.youtube.com/@tuhocproduct"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={getBrutalButtonClassName({
                    variant: 'secondary',
                    className: 'flex items-center gap-2 py-3 px-6',
                  })}
                >
                  <Youtube size={20} /> YouTube
                </Link>
              </div>
            </div>
          </BrutalCard>
        </BrutalContainer>
      </BrutalSection>

      <BrutalSection padding="lg" className="border-t-8 border-text-main text-center bg-brand-cream" id="join-us">
        <BrutalContainer maxWidth="4xl" className="space-y-8 flex flex-col items-center">
          <BrutalHeading as="h2" className="lowercase italic underline decoration-brand-red decoration-8 underline-offset-8">
             Want to join the mission?
          </BrutalHeading>
          <p className="text-2xl font-bold italic opacity-60 leading-relaxed">
            We're always looking for street-smart locals and passionate travelers to help us expand the kit.
          </p>
          <Link
            href="/contact"
            className={getBrutalButtonClassName({
              variant: 'primary',
              className: 'text-2xl px-12 py-6',
            })}
          >
            WORK WITH US
          </Link>
        </BrutalContainer>
      </BrutalSection>
    </>
  );
}
