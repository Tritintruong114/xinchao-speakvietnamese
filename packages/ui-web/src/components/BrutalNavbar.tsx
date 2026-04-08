"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';
import { useScroll } from '../hooks/useScroll';
import { cn } from '../utils/cn';

export interface BrutalNavLink {
  label: string;
  href: string;
  isPrimary?: boolean;
}

export type BrutalNavLinkRenderer = (props: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}) => React.ReactNode;

interface BrutalNavbarProps {
  logo?: React.ReactNode;
  links?: BrutalNavLink[];
  className?: string;
  /** Use Next.js `<Link>` for SPA navigation & prefetch. Defaults to `<a>`. */
  renderLink?: BrutalNavLinkRenderer;
}

const defaultRenderLink: BrutalNavLinkRenderer = ({
  href,
  className,
  children,
  onNavigate,
}) => (
  <a href={href} className={className} onClick={onNavigate}>
    {children}
  </a>
);

export const BrutalNavbar: React.FC<BrutalNavbarProps> = ({
  logo,
  links = [],
  className,
  renderLink = defaultRenderLink,
}) => {
  const { isScrolled } = useScroll();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [navBottomPx, setNavBottomPx] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const sync = () => {
      setNavBottomPx(Math.round(el.getBoundingClientRect().bottom));
    };

    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);

    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [mobileOpen, isScrolled]);

  const closeMobile = () => setMobileOpen(false);

  const linkClass = (isPrimary?: boolean) =>
    cn(
      'py-3 px-1 border-b-2 border-transparent md:border-0 md:py-0',
      isPrimary ? 'text-brand-red' : 'text-text-main hover:text-brand-red',
      'transition-colors md:inline-block',
    );

  const mobileDrawer =
    mounted &&
    mobileOpen &&
    typeof document !== 'undefined' &&
    createPortal(
      <>
        <button
          type="button"
          className="fixed left-0 right-0 z-[90] bg-text-main/40 md:hidden"
          style={{ top: navBottomPx, bottom: 0 }}
          aria-label="Close menu"
          onClick={closeMobile}
        />
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed left-0 right-0 z-[100] md:hidden border-b-4 border-text-main bg-white shadow-brutal-lg px-6 py-4 flex flex-col font-bold max-h-[70vh] overflow-y-auto overscroll-contain"
          style={{ top: navBottomPx }}
        >
          {links.map((link) => (
            <React.Fragment key={`${link.href}-${link.label}-m`}>
              {renderLink({
                href: link.href,
                className: cn(linkClass(link.isPrimary), 'block w-full text-left'),
                children: link.label,
                onNavigate: closeMobile,
              })}
            </React.Fragment>
          ))}
        </div>
      </>,
      document.body,
    );

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          'relative p-6 border-b-2 border-text-main flex justify-between items-center gap-3 bg-white sticky top-0 z-[60] transition-all duration-200',
          isScrolled && 'py-4 brutal-shadow',
          className,
        )}
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-2 min-w-0">{logo}</div>

        <div className="hidden md:flex gap-8 font-bold items-center">
          {links.map((link) => (
            <React.Fragment key={`${link.href}-${link.label}`}>
              {renderLink({
                href: link.href,
                className: cn(linkClass(link.isPrimary), 'hover:text-brand-red'),
                children: link.label,
              })}
            </React.Fragment>
          ))}
        </div>

        <button
          type="button"
          className={cn(
            'md:hidden p-3 border-2 border-text-main rounded-lg bg-white brutal-shadow-sm shrink-0 touch-manipulation',
            'relative z-[70]',
          )}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
          onClick={() => {
            if (!mobileOpen && navRef.current) {
              setNavBottomPx(Math.round(navRef.current.getBoundingClientRect().bottom));
            }
            setMobileOpen((o) => !o);
          }}
        >
          {mobileOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </nav>
      {mobileDrawer}
    </>
  );
};
