import { BrutalHeading, BrutalCard, BrutalTag, getBrutalButtonClassName } from '@xinchao/ui-web';
import { buildPageMetadata } from '@/lib/seo';
import { Shield, Zap, Globe, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { BrutalSection } from '../../../components/layout/BrutalSection';
import { BrutalContainer } from '../../../components/layout/BrutalContainer';

export const metadata = buildPageMetadata({
  title: 'Survival Kit',
  description:
    'Street slang, pocket phrase packs, menu OCR, and bargaining practice—your survival kit for Vietnam.',
  path: '/survival',
  keywords: ['Vietnamese slang', 'bargaining Vietnamese', 'menu OCR Vietnam'],
});

export default function SurvivalKitPage() {
  return (
    <>
      <BrutalSection padding="lg" id="survival-hero">
        <BrutalContainer maxWidth="4xl" className="text-center space-y-8">
          <BrutalTag backgroundColor="bg-brand-mint" rotate="rotate-1">ULTIMATE SURVIVAL</BrutalTag>
          <BrutalHeading as="h1" className="text-brand-red lowercase italic underline decoration-brand-yellow decoration-8 underline-offset-8">
            The Survival Kit
          </BrutalHeading>
          <p className="text-3xl font-bold italic leading-relaxed text-text-main/90">
            Everything you need to navigate Vietnam like a local. No fluff—just street-smart tools that stay with you on the road.
          </p>
        </BrutalContainer>
      </BrutalSection>

      <BrutalSection padding="lg" id="survival-features">
        <BrutalContainer className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BrutalCard className="p-8 space-y-4">
              <div className="w-16 h-16 bg-brand-red border-2 border-text-main rounded-xl flex items-center justify-center text-white brutal-shadow-sm">
                <Shield size={32} />
              </div>
              <h3 className="text-2xl font-black italic">Street-Smart Slang</h3>
              <p className="font-bold opacity-70 italic text-lg">
                "Bao nhiêu?" is fine, but "Bớt đi" gets you the local price. Learn the real Vietnamese spoken on the streets, not in textbooks.
              </p>
            </BrutalCard>

            <BrutalCard className="p-8 space-y-4 bg-brand-yellow">
              <div className="w-16 h-16 bg-white border-2 border-text-main rounded-xl flex items-center justify-center text-text-main brutal-shadow-sm">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-black italic">Instant Menu Scanner</h3>
              <p className="font-bold opacity-70 italic text-lg">
                Translate menus, street signs, and receipts fast. Point, scan, and keep moving—no typing marathon on the sidewalk.
              </p>
            </BrutalCard>

            <BrutalCard className="p-8 space-y-4">
              <div className="w-16 h-16 bg-brand-mint border-2 border-text-main rounded-xl flex items-center justify-center text-text-main brutal-shadow-sm">
                <Globe size={32} />
              </div>
              <h3 className="text-2xl font-black italic">Curated Maps &amp; Pins</h3>
              <p className="font-bold opacity-70 italic text-lg">
                Never get lost in the alleys of Hanoi or Saigon. Curated pins for the best Bún Chả, Bánh Mì, and hidden gems.
              </p>
            </BrutalCard>

            <BrutalCard className="p-8 space-y-4 bg-brand-pink">
              <div className="w-16 h-16 bg-white border-2 border-text-main rounded-xl flex items-center justify-center text-text-main brutal-shadow-sm">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-2xl font-black italic">Bargaining Logic</h3>
              <p className="font-bold opacity-70 italic text-lg">
                Interactive simulator to practice haggling at Chợ Bến Thành. Understand the "price ladder" and when to walk away.
              </p>
            </BrutalCard>
          </div>

          <div className="flex flex-col items-center gap-8 py-12">
            <BrutalHeading as="h2" className="text-center italic underline decoration-brand-red decoration-8 underline-offset-8">Ready to Survive?</BrutalHeading>
            <Link
              href="/#waitlist"
              className={getBrutalButtonClassName({
                variant: 'primary',
                className:
                  'text-3xl uppercase px-12 py-6 rounded-2xl brutal-shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all text-center',
              })}
            >
              DOWNLOAD THE KIT
            </Link>
          </div>
        </BrutalContainer>
      </BrutalSection>
    </>
  );
}
