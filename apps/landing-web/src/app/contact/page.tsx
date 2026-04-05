'use client';

import React from 'react';
import { BrutalHeading, BrutalCard, BrutalTag, BrutalButton } from '@xinchao/ui-web';
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';
import { BrutalSection } from '../../components/layout/BrutalSection';
import { BrutalContainer } from '../../components/layout/BrutalContainer';

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
            Need help with the kit? Found a weird street slang? Or just want to grab a Cà Phê Muối? Our team is here.
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
                  <p className="text-xl font-bold">truongtritin.bee@gmail.com</p>
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
                  <p className="text-xl font-bold">Everywhere in Saigon</p>
                </div>
              </BrutalCard>
            </div>
          </div>

          <BrutalCard className="p-10 space-y-8 bg-white border-4 border-text-main brutal-shadow-lg">
            <h3 className="text-3xl font-black italic">Drop a Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="font-black uppercase text-sm">Your Name</label>
                <input type="text" placeholder="John Doe" className="w-full p-4 border-2 border-text-main rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-yellow transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="font-black uppercase text-sm">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full p-4 border-2 border-text-main rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-yellow transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="font-black uppercase text-sm">Survival Issue</label>
                <textarea rows={4} placeholder="I can't translate this Bún Riêu menu..." className="w-full p-4 border-2 border-text-main rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-yellow transition-all font-bold"></textarea>
              </div>
              <BrutalButton className="w-full py-5 text-2xl">
                SEND MESSAGE <Send size={20} />
              </BrutalButton>
            </form>
          </BrutalCard>
        </BrutalContainer>
      </BrutalSection>
    </>
  );
}
