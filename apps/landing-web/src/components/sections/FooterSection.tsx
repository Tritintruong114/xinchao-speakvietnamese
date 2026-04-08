import React from 'react';
import { BrutalTag, BrutalButton } from '@xinchao/ui-web';
import { Mail, Youtube, Smartphone, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { SITE_CONTACT_EMAIL } from '@/lib/site';
import { BrandLogo } from '../common/BrandLogo';
import { BrutalSection } from '../layout/BrutalSection';
import { BrutalContainer } from '../layout/BrutalContainer';

export const FooterSection: React.FC = () => {
  return (
    <BrutalSection as="footer" padding="lg" backgroundColor="bg-brand-cream" className="border-t-8 border-text-main" id="footer">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 -rotate-12 translate-x-20 -translate-y-20 border-2 border-text-main rounded-full"></div>
      
      <BrutalContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          {/* Brand Column */}
          <div className="space-y-6">
            <BrandLogo size="lg" />
            <p className="text-xl font-bold italic opacity-80 leading-relaxed">
              The Traveler&apos;s Lifebuoy. <br />
              <span className="text-brand-red">Survive</span>, <span className="text-brand-yellow">Connect</span>, and <br />
              Live like a local in 24 hours.
            </p>
            <BrutalTag className="bg-brand-mint text-text-main border-text-main">100% OFFLINE-FIRST</BrutalTag>
            
            <div className="flex gap-4 pt-4">
              <a
                href={`mailto:${SITE_CONTACT_EMAIL}`}
                className="p-3 bg-white border-2 border-text-main rounded-lg brutal-shadow-sm hover:bg-brand-yellow transition-colors"
                aria-label="Email us"
              >
                <Mail size={24} />
              </a>
              <a
                href="https://www.youtube.com/@tuhocproduct"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white border-2 border-text-main rounded-lg brutal-shadow-sm hover:bg-brand-red hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-6">
            <h4 className="text-2xl font-black italic underline decoration-brand-red decoration-4 underline-offset-4 uppercase">The Product</h4>
            <ul className="space-y-4 font-bold text-lg italic">
              <li><Link href="/survival" className="hover:text-brand-red transition-colors flex items-center gap-2 group">Survival Kit <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link href="/survival" className="hover:text-brand-red transition-colors">Scan & Translate</Link></li>
              <li><Link href="/survival" className="hover:text-brand-red transition-colors">Bargaining Logic</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-yellow transition-colors">Pricing Bans</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-6">
            <h4 className="text-2xl font-black italic underline decoration-brand-yellow decoration-4 underline-offset-4 uppercase">Support</h4>
            <ul className="space-y-4 font-bold text-lg italic">
              <li><Link href="/contact" className="hover:text-brand-yellow transition-colors">Contact Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-yellow transition-colors">Help Center</Link></li>
              <li><Link href="/" className="hover:text-brand-yellow transition-colors">Safety Tips</Link></li>
              <li>
                <a
                  href={`mailto:${SITE_CONTACT_EMAIL}`}
                  className="hover:text-brand-yellow transition-colors flex items-center gap-2 italic"
                >
                  <Mail size={18} /> Email Support
                </a>
              </li>
            </ul>
          </div>

          {/* Download Column */}
          <div className="space-y-8">
            <h4 className="text-2xl font-black italic underline decoration-brand-mint decoration-4 underline-offset-4 uppercase">Get the app</h4>
            <div className="space-y-4">
              <BrutalButton variant="primary" className="w-full flex justify-start pl-6 gap-4 py-4 rounded-xl">
                 <Smartphone />
                 <div className="text-left">
                   <p className="text-[10px] opacity-70 leading-none">Download on the</p>
                   <p className="text-lg leading-tight uppercase tracking-tight">App Store</p>
                 </div>
              </BrutalButton>
              <BrutalButton variant="secondary" className="w-full flex justify-start pl-6 gap-4 py-4 rounded-xl">
                 <Smartphone />
                 <div className="text-left">
                   <p className="text-[10px] opacity-70 leading-none">Get it on</p>
                   <p className="text-lg leading-tight uppercase tracking-tight">Google Play</p>
                 </div>
              </BrutalButton>
            </div>
            <p className="text-sm font-black opacity-50 text-center italic">Supported Offline in 63 provinces 🇻🇳</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-12 border-t-4 border-text-main flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
            <p className="font-black italic opacity-60 text-lg">
              © 2026 XINCHAO SURVIVAL APP.
            </p>
            <div className="flex gap-6 font-bold text-sm underline decoration-2 underline-offset-4 opacity-70">
              <Link href="/privacy" className="hover:text-brand-red">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-brand-yellow">Terms of Use</Link>
              <Link href="/cookie-policy" className="hover:text-brand-mint">Cookie Policy</Link>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="font-black text-xl italic hover:text-brand-mint cursor-pointer transition-colors">
               Made with ❤️ and <span className="text-brand-red">☕</span> in Saigon.
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
               A product of tuhocproduct.com
            </p>
          </div>
        </div>
      </BrutalContainer>
    </BrutalSection>
  );
};
