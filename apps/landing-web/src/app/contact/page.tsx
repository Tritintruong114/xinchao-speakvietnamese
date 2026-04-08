import { BrutalHeading, BrutalCard, BrutalTag } from '@xinchao/ui-web';
import type { Metadata } from 'next';
import { Mail, MessageCircle, MapPin } from 'lucide-react';
import { SITE_CONTACT_EMAIL } from '@/lib/site';
import { BrutalSection } from '../../components/layout/BrutalSection';
import { BrutalContainer } from '../../components/layout/BrutalContainer';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Reach the XinChao team for survival kit help, street slang tips, or partnership questions.',
};

export default function ContactPage() {
  return (
    <>
      <BrutalSection padding="lg" id="contact-hero">
        <BrutalContainer maxWidth="4xl" className="text-center space-y-8">
          <BrutalTag backgroundColor="bg-brand-yellow">GET IN TOUCH</BrutalTag>
          <BrutalHeading as="h1" className="text-text-main lowercase italic underline decoration-brand-red decoration-8 underline-offset-8">
            Say Xin Chào
          </BrutalHeading>
          <p className="text-3xl font-bold italic leading-relaxed text-text-main/90">
            Need help with the kit? Found a weird street slang? Or just want to grab a Cà Phê Muối? Our team
            is here.
          </p>
        </BrutalContainer>
      </BrutalSection>

      <BrutalSection padding="lg" id="contact-content">
        <BrutalContainer maxWidth="7xl" className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="space-y-6">
              <BrutalCard className="p-6 flex items-center gap-6">
                <div className="w-12 h-12 bg-brand-mint border-2 border-text-main rounded-lg flex items-center justify-center brutal-shadow-sm">
                  <Mail />
                </div>
                <div>
                  <p className="text-sm font-black opacity-50 uppercase">Email Us</p>
                  <p className="text-xl font-bold break-all">{SITE_CONTACT_EMAIL}</p>
                </div>
              </BrutalCard>

              <BrutalCard className="p-6 flex items-center gap-6">
                <div className="w-12 h-12 bg-brand-pink border-2 border-text-main rounded-lg flex items-center justify-center brutal-shadow-sm">
                  <MessageCircle />
                </div>
                <div>
                  <p className="text-sm font-black opacity-50 uppercase">WhatsApp / Zalo</p>
                  <p className="text-xl font-bold">0385611407</p>
                </div>
              </BrutalCard>

              <BrutalCard className="p-6 flex items-center gap-6">
                <div className="w-12 h-12 bg-brand-yellow border-2 border-text-main rounded-lg flex items-center justify-center brutal-shadow-sm">
                  <MapPin />
                </div>
                <div>
                  <p className="text-sm font-black opacity-50 uppercase">Office</p>
                  <p className="text-xl font-bold">Remote-first · Saigon</p>
                </div>
              </BrutalCard>
            </div>
          </div>

          <ContactForm />
        </BrutalContainer>
      </BrutalSection>
    </>
  );
}
