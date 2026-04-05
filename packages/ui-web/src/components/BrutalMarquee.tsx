import React from 'react';

interface BrutalMarqueeProps {
  items: string[];
  backgroundColor?: string;
  className?: string;
}

export const BrutalMarquee: React.FC<BrutalMarqueeProps> = ({ 
  items, 
  backgroundColor = 'bg-brand-cyan', 
  className 
}) => {
  return (
    <section className={`${backgroundColor} border-y-4 border-text-main py-10 overflow-hidden ${className}`}>
         <div className="flex animate-marquee whitespace-nowrap gap-12 font-black text-4xl uppercase italic text-text-main">
            {[1, 2, 3, 4, 5].map((idx) => (
              <React.Fragment key={idx}>
                {items.map((item, itemIdx) => (
                  <React.Fragment key={itemIdx}>
                    <span>{item}</span>
                    <span className="text-white opacity-50">●</span>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
         </div>
      </section>
  );
};
