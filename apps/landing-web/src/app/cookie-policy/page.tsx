import { BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import type { Metadata } from 'next';
import { BrutalSection } from '../../components/layout/BrutalSection';
import { BrutalContainer } from '../../components/layout/BrutalContainer';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How XinChao uses cookies for sessions, preferences, and performance.',
};

export default function CookiePolicyPage() {
  return (
    <BrutalSection padding="lg">
      <BrutalContainer maxWidth="4xl" className="space-y-12 bg-white p-12 border-4 border-text-main rounded-3xl brutal-shadow-lg">
        <div className="space-y-6">
          <BrutalTag backgroundColor="bg-brand-yellow">COOKIES</BrutalTag>
          <BrutalHeading as="h1" className="text-text-main lowercase italic underline decoration-brand-mint decoration-8 underline-offset-8">Cookie Policy</BrutalHeading>
          <p className="text-xl font-bold opacity-60">Last Updated: April 5, 2026</p>
        </div>

        <div className="prose prose-xl prose-slate max-w-none space-y-10 font-bold opacity-80 italic">
          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">1. What are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device. In the world of XinChao, think of them like small "vouchers" that help us remember who you are and what your preferences are while you navigate our street-smart app.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">2. Why we use them?</h2>
            <p>
              We use cookies to ensure the app works smoothly. They help us remember your language settings, your login session, and how you interact with our survival tools so we can make them even better.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">3. Types of Cookies</h2>
            <ul className="list-disc pl-8 space-y-2">
              <li><strong>Essential:</strong> Needed for the app to function. You can't survive without these.</li>
              <li><strong>Performance:</strong> Help us understand how the app is doing.</li>
              <li><strong>Functionality:</strong> Remember your "Street Slang" preferences.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-text-main not-italic">4. Control Your Cookies</h2>
            <p>
              You can control or delete cookies through your browser settings. However, disabling them might make some survival tools less effective.
            </p>
          </section>
        </div>
      </BrutalContainer>
    </BrutalSection>
  );
}
