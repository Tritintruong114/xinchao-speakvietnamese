import React from 'react';
import { BrutalCard, BrutalHeading, BrutalTag } from '@xinchao/ui-web';
import { WifiOff, ScanIcon, MessageCircle } from 'lucide-react';
import { BrutalSection } from '../layout/BrutalSection';
import { BrutalContainer } from '../layout/BrutalContainer';

const USPs = [
  {
    id: 1,
    title: "STREET-SMART DATA",
    description: "Learn slang, bargaining phrases, and local tips that Google Translate and Duolingo miss. Speak like a local in 30 seconds.",
    icon: MessageCircle,
    color: "bg-brand-yellow"
  },
  {
    id: 2,
    title: "100% OFFLINE",
    description: "Zero reliance on 4G or Wi-Fi. Our Lightweight 'Survival Packs' work anywhere—from sleeper buses to remote mountain villages.",
    icon: WifiOff,
    color: "bg-brand-mint"
  },
  {
    id: 3,
    title: "SCAN & SURVIVE",
    description: "Instant OCR for menus and street signs. Just point your camera and know exactly what you're ordering or where you're going.",
    icon: ScanIcon,
    color: "bg-brand-pink"
  }
];

export const USPSection: React.FC = () => {
  return (
    <BrutalSection backgroundColor="bg-brand-cream" className="border-b-4 border-text-main" id="solutions">
      <BrutalContainer>
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
           <BrutalTag className="bg-brand-red text-white">THE SOLUTIONS</BrutalTag>
           <BrutalHeading as="h2" className="text-5xl md:text-7xl uppercase tracking-tighter">
              The <span className="text-brand-red">3-NO</span> Solution.
           </BrutalHeading>
           <p className="text-xl md:text-2xl font-bold leading-relaxed max-w-2xl text-text-muted mx-auto">
              We skip the grammar textbooks. We give you the weapons to survive 24 hours in Vietnam's streets.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {USPs.map((usp) => (
            <div key={usp.id} className="relative group">
               <BrutalCard 
                 backgroundColor={usp.color as any}
                 className="p-10 flex flex-col items-center text-center gap-8 border-4 brutal-shadow-lg h-full border-text-main"
               >
                 <div className="p-6 bg-white border-4 border-text-main rounded-2xl brutal-shadow-sm group-hover:rotate-12 transition-transform duration-300">
                    <usp.icon size={48} strokeWidth={2.5} className="text-text-main" />
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black italic">{usp.title}</h3>
                    <p className="text-lg font-bold leading-snug">
                       {usp.description}
                    </p>
                 </div>
               </BrutalCard>
            </div>
          ))}
        </div>
      </BrutalContainer>
    </BrutalSection>
  );
};
