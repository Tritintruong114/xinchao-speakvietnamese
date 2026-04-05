"use client";

import React from 'react';
import { useScroll } from '../hooks/useScroll';
import { cn } from '../utils/cn';

interface NavLinks {
  label: string;
  href: string;
  isPrimary?: boolean;
}

interface BrutalNavbarProps {
  logo?: React.ReactNode;
  links?: NavLinks[];
  className?: string;
}

export const BrutalNavbar: React.FC<BrutalNavbarProps> = ({
  logo,
  links = [],
  className
}) => {
  const { isScrolled } = useScroll();

  return (
    <nav className={cn(
      "p-6 border-b-2 border-text-main flex justify-between items-center bg-white sticky top-0 z-50 transition-all duration-200",
      isScrolled && "py-4 brutal-shadow",
      className
    )}>
      <div className="flex items-center gap-2">
        {logo}
      </div>
      <div className="hidden md:flex gap-8 font-bold">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.href}
            className={link.isPrimary ? 'text-brand-red' : 'hover:text-brand-red'}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
};
