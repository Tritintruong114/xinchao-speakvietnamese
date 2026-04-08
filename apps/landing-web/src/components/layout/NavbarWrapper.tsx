"use client";

import { BrutalNavbar } from '@xinchao/ui-web';
import Link from 'next/link';
import React from 'react';
import { BrandLogo } from '../common/BrandLogo';

export const NavbarWrapper: React.FC = () => {
  const navLinks = [
    { label: 'Our mission', href: '/about' },
    { label: 'Survival Kit', href: '/survival' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Get App', href: '/#waitlist', isPrimary: true },
  ];

  return (
    <BrutalNavbar
      logo={<BrandLogo />}
      links={navLinks}
      className="bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/90"
      renderLink={({ href, className, children, onNavigate }) => (
        <Link
          href={href}
          className={className}
          onClick={() => {
            if (onNavigate) {
              window.setTimeout(onNavigate, 0);
            }
          }}
        >
          {children}
        </Link>
      )}
    />
  );
};
