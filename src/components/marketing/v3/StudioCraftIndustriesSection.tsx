'use client';

import Link from 'next/link';
import { ArrowUpRight, LinkSimple } from '@phosphor-icons/react';
import { FleetBoardMockup } from '@/components/marketing/mockups/FleetBoardMockup';
import {
  INDUSTRY_VERTICALS,
  MARKETING_CTAS,
  MARKETING_INDUSTRIES_SECTION,
} from '@/lib/marketing-config';
import { SectionBadge, StudioCraftContainer } from './studio-craft-shared';

const ROLL_EASE = 'cubic-bezier(0.25,0.1,0.25,1)';

function IndustryCard({
  title,
  description,
  href,
  cta,
  dark = false,
  livePreview = false,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  dark?: boolean;
  livePreview?: boolean;
}) {
  return (
    <article className="group">
      <div
        className={`relative overflow-hidden rounded-2xl ${
          dark ? 'bg-[var(--sc-ink)]' : 'border border-[var(--sc-line)] bg-[var(--sc-paper-2)]'
        }`}
      >
        <div className="aspect-[16/10] overflow-hidden">
          {livePreview ? (
            <FleetBoardMockup className="h-full rounded-none border-0 shadow-none" />
          ) : (
            <div className="flex h-full flex-col justify-end bg-gradient-to-br from-[#2A2520] via-[#1A1714] to-[#120F0C] p-6">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wide text-white/45">Coming soon</p>
                <p className="mt-2 text-lg font-medium text-white">{title}</p>
              </div>
            </div>
          )}
        </div>

        <Link
          href={href}
          className={`absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-500 group-hover:h-auto group-hover:w-auto group-hover:gap-2 group-hover:px-4 ${
            dark ? 'bg-white text-[var(--sc-ink)]' : 'bg-[var(--sc-ink)] text-white'
          }`}
          style={{ transitionTimingFunction: ROLL_EASE }}
          aria-label={cta}
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-medium opacity-0 transition-all duration-500 group-hover:max-w-[180px] group-hover:opacity-100">
            {cta}
          </span>
          {livePreview ? (
            <LinkSimple size={18} weight="bold" aria-hidden />
          ) : (
            <ArrowUpRight size={18} weight="bold" aria-hidden />
          )}
        </Link>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[var(--sc-ink-muted)]">{description}</p>
      <h3 className="mt-1 text-xl font-medium text-[var(--sc-ink)]">{title}</h3>
    </article>
  );
}

export function StudioCraftIndustriesSection() {
  const logistics = INDUSTRY_VERTICALS.find((v) => v.id === 'logistics');
  const saccos = INDUSTRY_VERTICALS.find((v) => v.id === 'saccos');

  return (
    <section className="bg-[var(--sc-paper)] py-16 sm:py-20 lg:py-28">
      <StudioCraftContainer>
        <SectionBadge number="2" label={MARKETING_INDUSTRIES_SECTION.badge} />
        <h2 className="max-w-[640px] text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--sc-ink)]">
          {MARKETING_INDUSTRIES_SECTION.title}
        </h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-10">
          {logistics ? (
            <IndustryCard
              title={logistics.name}
              description={logistics.description}
              href={logistics.href}
              cta={MARKETING_CTAS.seeFleet}
              dark
              livePreview
            />
          ) : null}
          {saccos ? (
            <IndustryCard
              title={saccos.name}
              description={saccos.description}
              href={saccos.href}
              cta={MARKETING_CTAS.joinWaitlist}
            />
          ) : null}
        </div>
      </StudioCraftContainer>
    </section>
  );
}
