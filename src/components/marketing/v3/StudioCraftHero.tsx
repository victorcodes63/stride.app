'use client';

import type { CSSProperties } from 'react';
import {
  MARKETING_BRAND,
  MARKETING_CTAS,
  MARKETING_DASHBOARD_HERO,
  MARKETING_HERO,
  MARKETING_ROUTES,
} from '@/lib/marketing-config';
import { HeroShaderBackground } from './HeroShaderBackground';
import { HeroDashboardShowcase } from './HeroDashboardShowcase';
import {
  MarketingPrimaryLink,
  MarketingSignInLink,
  StudioCraftContainer,
} from './studio-craft-shared';
import { StudioCraftNav } from './StudioCraftNav';
import './studio-craft-hero.css';

export function StudioCraftHero() {
  return (
    <section
      className="sc-hero-section relative flex min-h-[100svh] flex-col overflow-hidden"
      style={
        {
          '--sc-hero-dashboard-crop': MARKETING_DASHBOARD_HERO.visibleHeight,
        } as CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{
          background: `linear-gradient(165deg, ${MARKETING_BRAND.paper} 0%, ${MARKETING_BRAND.paper2} 48%, ${MARKETING_BRAND.paper} 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.32]"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 20%, ${MARKETING_BRAND.coral}22 0%, transparent 68%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
        <HeroShaderBackground />
      </div>

      <div className="sc-animate-fade-down relative z-20 shrink-0">
        <StudioCraftNav />
      </div>

      <div className="relative z-20 flex min-h-0 flex-1 flex-col">
        <StudioCraftContainer className="flex flex-1 flex-col items-center justify-center px-5 pb-4 pt-2 text-center sm:px-8 sm:pb-6">
          <p
            className="sc-animate-fade-up mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--sc-coral)]/[0.08] px-3 py-1 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--sc-coral)] sm:mb-5"
            style={{ animationDelay: '80ms' }}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--sc-coral)]" aria-hidden />
            {MARKETING_HERO.eyebrow}
          </p>

          <h1 className="font-normal leading-[1.05] tracking-tight text-[var(--sc-ink)] text-[clamp(2rem,9vw,2.75rem)] min-[400px]:text-[44px] sm:text-6xl lg:text-7xl xl:text-[80px]">
            <span className="block sc-animate-fade-up" style={{ animationDelay: '160ms' }}>
              {MARKETING_HERO.titleLines[0]}
            </span>
            <span className="block sc-animate-fade-up" style={{ animationDelay: '240ms' }}>
              business{' '}
              <span className="text-[var(--sc-coral)]">{MARKETING_HERO.titleAccent}</span>
            </span>
          </h1>

          <p
            className="sc-animate-fade-up mt-5 max-w-lg text-sm leading-relaxed text-[var(--sc-ink-muted)] sm:mt-6 sm:text-base lg:text-lg"
            style={{ animationDelay: '320ms' }}
          >
            {MARKETING_HERO.sub}
          </p>

          <div
            className="sc-animate-fade-up mt-4 flex flex-wrap items-center justify-center gap-3 sm:mt-5"
            style={{ animationDelay: '400ms' }}
          >
            <MarketingPrimaryLink
              href={MARKETING_ROUTES.contact}
              label={MARKETING_CTAS.bookDemo}
              variant="coral"
            />
            <MarketingSignInLink />
          </div>
        </StudioCraftContainer>

        <div className="sc-animate-hero-fade-in relative z-30 mt-auto w-full shrink-0 px-3 sm:px-6">
          <HeroDashboardShowcase />
        </div>
      </div>
    </section>
  );
}
