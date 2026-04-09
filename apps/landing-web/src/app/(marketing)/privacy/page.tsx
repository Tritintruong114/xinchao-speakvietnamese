import { BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import { buildPageMetadata } from '@/lib/seo';
import { BrutalSection } from '../../../components/layout/BrutalSection';
import { BrutalContainer } from '../../../components/layout/BrutalContainer';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description:
    'How XinChao handles your data—strict privacy, secure cloud where needed, minimal collection, no selling your learning moments to advertisers.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <BrutalSection padding="lg">
      <BrutalContainer maxWidth="4xl" className="space-y-12 bg-white p-12 border-4 border-text-main rounded-3xl brutal-shadow-lg">
        <div className="space-y-6">
          <BrutalTag backgroundColor="bg-brand-mint">PRIVACY</BrutalTag>
          <BrutalHeading as="h1" className="text-brand-red lowercase italic underline decoration-brand-yellow decoration-8 underline-offset-8">Data Safety</BrutalHeading>
          <p className="text-xl font-bold opacity-60">Last Updated: April 5, 2026</p>
        </div>

        <div className="prose prose-xl prose-slate max-w-none space-y-10 font-bold opacity-80 italic">
          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">1. We Value Your Privacy</h2>
            <p>
              XinChao is built privacy-first: strict safeguards, secure cloud infrastructure where a feature needs it, and minimal data collection. We don&apos;t sell your scans, practice sessions, or location history to third-party advertisers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">2. Information Collection</h2>
            <p>
              We collect minimal data to improve the app—like which survival phrases are used most often or if the menu scanner crashes. This data is anonymized and never linked to your personal identity.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">3. Camera & Microphone</h2>
            <p>
              We need camera access to scan menus and microphone access for speaking practice. Capturing happens on your phone; to return translations or feedback, image, audio, or derived text may be sent over encrypted connections to our backend or vetted AI providers. We don&apos;t use that content to profile you for ads, and we don&apos;t sell it.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">4. Third-Party Services</h2>
            <p>
              We use payment processors like RevenueCat and Google/Apple Pay for the survival kit. They handle your payment data securely; we never see your credit card number.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">5. Your Choices</h2>
            <p>
              You can delete your account and all associated data at any time via the internal settings. If you delete it, it's gone for good—just like that one Bánh Mì stall that disappeared overnight.
            </p>
          </section>
        </div>
      </BrutalContainer>
    </BrutalSection>
  );
}
