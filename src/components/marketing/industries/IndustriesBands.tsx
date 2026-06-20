'use client';

import { Check, X } from '@phosphor-icons/react';
import { Reveal, Stagger, StaggerItem } from '@/components/marketing/motion';
import { StudioCraftContainer } from '@/components/marketing/v3/studio-craft-shared';
import { CORE_CAPABILITIES, CORE_CAPABILITIES_BAND, STRIDE_VS_ALTERNATIVE } from './industries-content';

export function CoreCapabilitiesBand() {
  return (
    <section className="border-y border-[var(--sc-line)] bg-[var(--sc-ink)] py-14 text-white sm:py-16 lg:py-20">
      <StudioCraftContainer>
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--sc-coral)]">
            {CORE_CAPABILITIES_BAND.eyebrow}
          </p>
          <h2 className="mt-3 max-w-xl font-heading text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold tracking-[-0.03em] text-white">
            {CORE_CAPABILITIES_BAND.title}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
            {CORE_CAPABILITIES_BAND.description}
          </p>
        </Reveal>

        <Stagger
          as="ul"
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
          delayChildren={0.1}
        >
          {CORE_CAPABILITIES.map((item) => (
            <StaggerItem
              key={item}
              as="li"
              className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3"
            >
              <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-[var(--sc-coral)]" aria-hidden />
              <span className="text-sm font-medium text-white/90">{item}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </StudioCraftContainer>
    </section>
  );
}

export function StrideVsAlternativeStrip() {
  return (
    <section className="bg-[var(--sc-paper)] py-16 sm:py-20 lg:py-24">
      <StudioCraftContainer>
        <Reveal>
          <h2 className="text-center font-heading text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold tracking-[-0.03em] text-[var(--sc-ink)]">
            {STRIDE_VS_ALTERNATIVE.title}
          </h2>
        </Reveal>

        <div className="relative mt-12 grid gap-8 lg:grid-cols-2 lg:gap-0">
          <Reveal className="rounded-2xl border border-[var(--sc-line)] bg-[var(--sc-paper-2)] p-6 sm:p-8 lg:rounded-r-none lg:border-r-0">
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--sc-ink-subtle,#8A8076)]">
              {STRIDE_VS_ALTERNATIVE.alternative.heading}
            </h3>
            <ul className="mt-5 space-y-3">
              {STRIDE_VS_ALTERNATIVE.alternative.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--sc-ink-muted)]">
                  <X size={16} weight="bold" className="mt-0.5 shrink-0 text-[var(--sc-ink-subtle,#8A8076)]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="rounded-2xl border border-[var(--sc-coral)]/25 bg-white p-6 shadow-[0_16px_40px_-16px_rgba(255,84,54,0.2)] sm:p-8 lg:rounded-l-none">
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--sc-coral)]">
              {STRIDE_VS_ALTERNATIVE.stride.heading}
            </h3>
            <ul className="mt-5 space-y-3">
              {STRIDE_VS_ALTERNATIVE.stride.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-[var(--sc-ink)]">
                  <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-[var(--sc-coral)]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={0.15}
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--sc-line)] bg-white text-xs font-bold text-[var(--sc-ink-subtle,#8A8076)] lg:flex"
            aria-hidden
          >
            vs
          </Reveal>
        </div>
      </StudioCraftContainer>
    </section>
  );
}
