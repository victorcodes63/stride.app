'use client';

import { DashboardMockup } from '@/components/marketing/mockups/DashboardMockup';
import { Reveal, Stagger, StaggerItem } from '@/components/marketing/motion';
import { MARKETING_CTAS, MARKETING_WHY_STRIDE } from '@/lib/marketing-config';
import {
  SectionBadge,
  StudioCraftContainer,
  TextRollLink,
} from '@/components/marketing/v3/studio-craft-shared';

export function StudioCraftWhySection() {
  return (
    <section className="bg-[var(--sc-paper-2)] py-16 sm:py-20 lg:py-28">
      <StudioCraftContainer>
        <Reveal>
          <SectionBadge number="1" label={MARKETING_WHY_STRIDE.badge} />
        </Reveal>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <Reveal delay={0.06}>
              <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--sc-ink)]">
                <span className="block">{MARKETING_WHY_STRIDE.titleLines[0]}</span>
                <span className="block text-[var(--sc-coral)]">{MARKETING_WHY_STRIDE.titleLines[1]}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-[520px] text-base leading-relaxed text-[var(--sc-ink-muted)] sm:text-lg">
                {MARKETING_WHY_STRIDE.body}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <TextRollLink
                href="/platform"
                label={MARKETING_CTAS.explorePlatform}
                variant="coral"
                className="mt-8"
              />
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-[var(--sc-line)] shadow-[0_24px_60px_rgba(26,23,20,0.08)]">
              <DashboardMockup className="w-full" />
            </div>
          </Reveal>
        </div>
      </StudioCraftContainer>
    </section>
  );
}
