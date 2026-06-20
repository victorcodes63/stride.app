'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/marketing/motion';
import { SectionBadge, StudioCraftContainer } from '@/components/marketing/v3/studio-craft-shared';
import { PLATFORM_COMPLIANCE, PLATFORM_PAGE } from '@/lib/marketing-config';

export function HomeComplianceBand() {
  const { compliance } = PLATFORM_PAGE;

  return (
    <section className="border-y border-[var(--sc-line)] bg-[var(--sc-paper-2)] py-16 sm:py-20 lg:py-24">
      <StudioCraftContainer>
        <Reveal>
          <SectionBadge number="4" label={compliance.badge} />
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="max-w-[640px] text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--sc-ink)]">
            {compliance.title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-[560px] text-base leading-relaxed text-[var(--sc-ink-muted)]">
            {compliance.body}
          </p>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" delayChildren={0.12}>
          {PLATFORM_COMPLIANCE.map((item) => (
            <StaggerItem
              key={item.label}
              as="article"
              className="rounded-2xl border border-[var(--sc-line)] bg-[var(--sc-paper)] p-5"
            >
              <p className="text-sm font-semibold text-[var(--sc-ink)]">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--sc-ink-muted)]">{item.detail}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </StudioCraftContainer>
    </section>
  );
}
