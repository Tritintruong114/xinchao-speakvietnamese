import { BrutalCard, BrutalHeading, BrutalTag, getBrutalButtonClassName } from '@xinchao/ui-web';
import { buildPageMetadata } from '@/lib/seo';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { BrutalContainer } from '../../../components/layout/BrutalContainer';
import { BrutalSection } from '../../../components/layout/BrutalSection';

export const metadata = buildPageMetadata({
  title: 'Our mission',
  description:
    'Why XinChao exists: survival-first Vietnamese for travelers and expats—pocket packs, street slang, and no grammar fluff.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      {/* Hero Section - The "Why" */}
      <BrutalSection padding="lg" id="about-hero">
        <BrutalContainer maxWidth="4xl" className="text-center space-y-8">
          <BrutalTag backgroundColor="bg-brand-red" rotate="rotate-1" className="text-white">OUR STORY</BrutalTag>
          <BrutalHeading as="h1" className="text-text-main lowercase italic underline decoration-brand-yellow decoration-8 underline-offset-8">
            The Traveler&apos;s Lifebuoy
          </BrutalHeading>
          <p className="text-3xl font-bold italic leading-relaxed text-text-main/90">
            "XinChao wasn't built in a sleek office. It was born out of the 'Survival Shock' we felt in our first 24 hours in Saigon."
          </p>
        </BrutalContainer>
      </BrutalSection>

      {/* Transparency Section - Heart to Heart */}
      <BrutalSection padding="lg" backgroundColor="bg-white/30" id="transparency">
        <BrutalContainer className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <BrutalHeading as="h2" className="text-brand-red">The Problem</BrutalHeading>
            <div className="space-y-4 text-xl font-bold italic opacity-80 leading-relaxed">
              <p>
                We saw backpackers panic when faced with too many zeros on a 500,000 VND note. We saw expats struggle to order "no sugar" in their coffee. We saw the frustration of losing Wi-Fi exactly when you need to find your way home.
              </p>
              <p>
                Google Translate is great for textbooks. But it doesn't teach you how to bark back at a pushy vendor or how to use "Street Slang" to get the local price.
              </p>
            </div>
          </div>
          <BrutalCard className="p-10 bg-brand-yellow space-y-6">
            <Heart className="text-brand-red" size={48} />
            <h3 className="text-3xl font-black italic">Heart to Heart</h3>
            <p className="text-xl font-bold italic opacity-90">
              We built XinChao to be the friend we wished we had. We don't want you to just visit Vietnam; we want you to survive it with confidence and connect with the people who make this country beautiful.
            </p>
          </BrutalCard>
        </BrutalContainer>
      </BrutalSection>

      {/* The 3 NOs Section */}
      <BrutalSection padding="lg" id="manifesto">
        <BrutalContainer className="space-y-12">
          <div className="text-center">
            <BrutalHeading as="h2" className="underline decoration-brand-mint decoration-8 underline-offset-8">Our Tuyên Ngôn (Manifesto)</BrutalHeading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BrutalCard className="p-8 border-4 space-y-4">
              <div className="text-4xl font-black text-brand-red">01.</div>
              <h4 className="text-2xl font-black italic uppercase">No Grammar Fluff</h4>
              <p className="font-bold italic opacity-70">
                We won't bore you with linguistic theory. We teach you how to buy a Bánh Mì, how to tell a driver "Stop here," and how to count your change.
              </p>
            </BrutalCard>
            <BrutalCard className="p-8 border-4 space-y-4 bg-white">
              <div className="text-4xl font-black text-brand-yellow">02.</div>
              <h4 className="text-2xl font-black italic uppercase">No Typing Allowed</h4>
              <p className="font-bold italic opacity-70">
                When you're hungry on a busy sidewalk, you don't want to type. Point your camera, scan the menu, and see the translation instantly.
              </p>
            </BrutalCard>
            <BrutalCard className="p-8 border-4 space-y-4">
              <div className="text-4xl font-black text-brand-mint">03.</div>
              <h4 className="text-2xl font-black italic uppercase">Keeps up when networks don&apos;t</h4>
              <p className="font-bold italic opacity-70">
                Small, powerful Survival Packs load on your phone so a weak signal never leaves you tongue-tied. The best adventures rarely come with perfect Wi-Fi.
              </p>
            </BrutalCard>
          </div>
        </BrutalContainer>
      </BrutalSection>

      {/* Our Mission Call to Action */}
      <BrutalSection padding="lg" className="border-t-8 border-text-main text-center" id="cta">
        <BrutalContainer className="space-y-12">
          <BrutalHeading as="h2" className="text-4xl md:text-6xl">Biến mọi du khách trở thành "người bản địa" ngay trong 24h đầu.</BrutalHeading>
          <p className="text-2xl font-bold italic opacity-60">
            (Turning every traveler into a &quot;native&quot; in their first 24 hours.)
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/#waitlist"
              className={getBrutalButtonClassName({
                variant: 'primary',
                className: 'text-2xl px-12 py-6',
              })}
            >
              START YOUR SURVIVAL
            </Link>
            <Link
              href="/team-member"
              className={getBrutalButtonClassName({
                variant: 'secondary',
                className: 'text-2xl px-12 py-6',
              })}
            >
              TALK TO THE TEAM
            </Link>
          </div>
        </BrutalContainer>
      </BrutalSection>
    </>
  );
}
