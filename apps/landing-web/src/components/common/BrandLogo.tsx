import { cn } from '@xinchao/ui-web';
import Link from 'next/link';
import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className, size = 'md' }) => {
  const containerSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';

  return (
    <Link href="/" className={cn("flex items-center gap-2 group shrink-0", className)}>
      <div className={cn(
        "border-2 border-text-main rounded-xl overflow-hidden brutal-shadow-sm flex-shrink-0 bg-brand-yellow",
        containerSize
      )}>
        <img src="/logo-horizontal.png" alt="XinChao logo" className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform" />
      </div>
      <span className={cn(
        "font-black italic tracking-tighter uppercase",
        size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-4xl' : 'text-3xl'
      )}>
        XINCHAO
      </span>
    </Link>
  );
};
