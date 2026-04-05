import React from 'react';
import { cn } from '../utils/cn';

interface BrutalPhoneProps {
  children?: React.ReactNode;
  className?: string;
}

export const BrutalPhone: React.FC<BrutalPhoneProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "relative w-[320px] h-[640px] bg-text-main rounded-[40px] border-2 border-text-main brutal-shadow-lg animate-float flex flex-col p-3 rotate-[-15deg]",
      className
    )}>
      {/* Screen */}
      <div className="flex-1 bg-brand-cream border-2 border-text-main rounded-[30px] overflow-hidden relative flex flex-col">
        {/* Status Bar */}
        <div className="h-10 px-6 flex justify-between items-center bg-white/50 backdrop-blur-sm border-b-2 border-text-main/10">
          <span className="text-[10px] font-black tracking-widest">XINCHAO</span>
          <div className="flex gap-1 items-center">
            <div className="w-4 h-2 bg-text-main rounded-xs" />
            <div className="w-2 h-2 bg-text-main rounded-full" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 relative overflow-y-auto bg-brand-cream custom-scrollbar">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="h-8 flex items-center justify-center">
          <div className="w-24 h-1 bg-text-main/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};
