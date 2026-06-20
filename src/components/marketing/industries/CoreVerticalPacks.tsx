'use client';

import { Reveal } from '@/components/marketing/motion/Reveal';
import { StudioCraftContainer } from '@/components/marketing/v3/studio-craft-shared';
import { CORE_PACKS_EXPLAINER } from './industries-content';
import { CoreVerticalPacksVisual } from './CoreVerticalPacksVisual';

export function CoreVerticalPacks() {
  return (
    <section className="border-y border-[var(--sc-line)] bg-[var(--sc-paper-2)] py-16 sm:py-20 lg:py-24">
      <StudioCraftContainer>
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--sc-coral)]">
            Platform architecture
          </p>
          <h2 className="mt-3 max-w-2xl font-heading text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] text-[var(--sc-ink)]">
            {CORE_PACKS_EXPLAINER.title}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--sc-ink-muted)]">
            {CORE_PACKS_EXPLAINER.caption}
          </p>
        </Reveal>
      </StudioCraftContainer>

      <div className="mt-10 sm:mt-14">
        <StudioCraftContainer>
          <CoreVerticalPacksVisual />
        </StudioCraftContainer>
      </div>
    </section>
  );
}
