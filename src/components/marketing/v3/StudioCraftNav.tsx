'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { List, X } from '@phosphor-icons/react';
import { StrideLogo } from '@/components/marketing/StrideMark';
import {
  MARKETING_CTAS,
  MARKETING_NAV_LINKS,
  MARKETING_ROUTES,
} from '@/lib/marketing-config';
import { MarketingPrimaryLink, MarketingSignInLink, StudioCraftContainer, TextRollLink } from './studio-craft-shared';

export function StudioCraftNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="relative z-20">
        <StudioCraftContainer className="p-2 sm:p-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center rounded-full bg-white px-3 py-1.5 shadow-[0_8px_32px_rgba(26,23,20,0.06)] sm:px-4 sm:py-2">
            <Link
              href={MARKETING_ROUTES.home}
              className="flex shrink-0 items-center justify-self-start"
              aria-label="Stride home"
            >
              <StrideLogo heightClass="h-6 sm:h-7" />
            </Link>

            <nav
              className="hidden items-center justify-center gap-6 md:flex"
              aria-label="Primary"
            >
              {MARKETING_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[14px] font-medium text-[var(--sc-ink)] transition-colors duration-300 hover:text-[var(--sc-ink-muted)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center justify-end gap-4 md:flex">
              <MarketingSignInLink className="px-4 py-2 text-[13px]" />
              <TextRollLink
                href={MARKETING_ROUTES.contact}
                label={MARKETING_CTAS.bookDemo}
                variant="coral"
              />
            </div>

            <button
              type="button"
              className="col-start-3 flex h-9 w-9 items-center justify-center justify-self-end rounded-full bg-[var(--sc-ink)] text-white md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
            </button>
          </div>
        </StudioCraftContainer>
      </nav>

      <div
        className={`fixed inset-0 z-50 md:hidden ${
          menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)' }}
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`marketing-mobile-drawer absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-white px-5 pb-8 pt-6 transition-transform duration-500 sm:px-6 ${
            menuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)' }}
        >
          <ul className="space-y-4">
            {MARKETING_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-[28px] font-medium text-[var(--sc-ink)] sm:text-[32px]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-3">
            <MarketingSignInLink
              className="w-full py-2.5 text-[15px]"
              onClick={() => setMenuOpen(false)}
            />
            <MarketingPrimaryLink
              href={MARKETING_ROUTES.contact}
              label={MARKETING_CTAS.bookDemo}
              variant="ink"
              fullWidth
              onClick={() => setMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
