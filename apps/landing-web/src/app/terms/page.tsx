import { BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import type { Metadata } from 'next';
import { BrutalSection } from '../../components/layout/BrutalSection';
import { BrutalContainer } from '../../components/layout/BrutalContainer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms for using XinChao survival Vietnamese tools and content.',
};

export default function TermsPage() {
  return (
    <BrutalSection padding="lg">
      <BrutalContainer maxWidth="4xl" className="space-y-12 bg-white p-12 border-4 border-text-main rounded-3xl brutal-shadow-lg">
        <div className="space-y-6">
          <BrutalTag backgroundColor="bg-brand-red" className="text-white">LEGAL</BrutalTag>
          <BrutalHeading as="h1" className="text-text-main lowercase italic underline decoration-brand-yellow decoration-8 underline-offset-8">Terms of Service</BrutalHeading>
          <p className="text-xl font-bold opacity-60">Last Updated: April 5, 2026</p>
        </div>

        <div className="prose prose-xl prose-slate max-w-none space-y-10 font-bold opacity-80 italic">
          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">1. Agreement to Terms</h2>
            <p>
              By using the XinChao app, you're agreeing to these street rules. If you don't agree, please don't use the app. We're here to help you survive, not to cause trouble.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">2. Service Description</h2>
            <p>
              XinChao provides survival Vietnamese tools including translation, phrasebooks, and cultural guides. While we strive for 100% accuracy, street slang evolves fast. Use our tools as a guide, not as absolute law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">3. User Responsibility</h2>
            <p>
              You are responsible for your interactions with locals. XinChao is not liable for any misunderstandings, bad deals at the market, or if you accidentally order something you're allergic to. (Though we try our best to prevent that!).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">4. Intellectual Property</h2>
            <p>
              All content, logos, and the "Bé Ghế Nhựa" mascot are owned by tuhocproduct.com. Don't copy our slang or sell our kit as your own. That's not cool.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">5. Termination</h2>
            <p>
              We reserve the right to ban any user who uses our survival tools for illegal activities or to harass locals. Respect the culture, respect the people.
            </p>
          </section>
        </div>
      </BrutalContainer>
    </BrutalSection>
  );
}
