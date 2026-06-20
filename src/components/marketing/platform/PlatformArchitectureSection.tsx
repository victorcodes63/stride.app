'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { IndustryWireframePreview } from '@/components/marketing/mockups/IndustryWireframePreview';
import { Reveal } from '@/components/marketing/motion/Reveal';
import { StudioCraftContainer } from '@/components/marketing/v3/studio-craft-shared';
import {
  CORE_CAPABILITIES,
  CORE_PACKS_EXPLAINER,
  INDUSTRY_DEEP_DIVES,
  VERTICAL_PACKS,
  type IndustryDeepDive,
} from '@/components/marketing/industries/industries-content';

const PACK_COLORS = Object.fromEntries(VERTICAL_PACKS.map((p) => [p.id, p.color]));
const CARD_COUNT = INDUSTRY_DEEP_DIVES.length + 1;

function stickyTop(index: number) {
  return `calc(var(--nav-h) + 1.25rem + ${index * 0.75}rem)`;
}

function CoreFoundationCard({
  index,
  setRef,
}: {
  index: number;
  setRef: (el: HTMLElement | null) => void;
}) {
  return (
    <article
      ref={setRef}
      data-architecture-card="core"
      className="rounded-2xl border border-[var(--sc-line)] bg-[var(--sc-ink)] p-5 shadow-[0_20px_50px_-24px_rgba(26,23,20,0.35)] sm:p-6 lg:sticky lg:mb-6"
      style={{ top: stickyTop(index), zIndex: index + 1 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
            {CORE_PACKS_EXPLAINER.coreLabel}
          </p>
          <h3 className="mt-2 text-xl font-medium tracking-tight text-[var(--sc-paper)] sm:text-2xl">
            Shared platform layer
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--sc-coral)]/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--sc-coral)]">
          Always on
        </span>
      </div>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
        HR, payroll, finance, procurement, documents, projects and admin — one login, one data layer
        every vertical pack inherits.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {CORE_CAPABILITIES.map((cap) => (
          <span
            key={cap}
            className="rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/90"
          >
            {cap}
          </span>
        ))}
      </div>
    </article>
  );
}

function VerticalPackCard({
  dive,
  index,
  setRef,
}: {
  dive: IndustryDeepDive;
  index: number;
  setRef: (el: HTMLElement | null) => void;
}) {
  const accent = PACK_COLORS[dive.id] ?? '#FF5436';
  const isAvailable = dive.status === 'available';

  return (
    <article
      ref={setRef}
      data-architecture-card={dive.id}
      className="overflow-hidden rounded-2xl border border-[var(--sc-line)] bg-white shadow-[0_16px_40px_-20px_rgba(26,23,20,0.12)] lg:sticky lg:mb-6"
      style={{ top: stickyTop(index), zIndex: index + 1 }}
    >
      <div className="h-1 w-full" style={{ backgroundColor: accent }} aria-hidden />

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] text-[var(--sc-ink-subtle,#8A8076)]">
              {String(index).padStart(2, '0')} / {String(CARD_COUNT - 1).padStart(2, '0')}
            </p>
            <h3 className="mt-1 text-xl font-medium tracking-tight text-[var(--sc-ink)] sm:text-2xl">
              {dive.name}
            </h3>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
              isAvailable
                ? 'bg-[var(--sc-coral)]/12 text-[var(--sc-coral)]'
                : 'bg-[var(--sc-paper-2)] text-[var(--sc-ink-subtle,#8A8076)]'
            }`}
          >
            {isAvailable ? 'Available' : 'Coming soon'}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[var(--sc-ink-muted)]">{dive.positioning}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--sc-ink-subtle,#8A8076)]">{dive.strideRuns}</p>

        <div className="mt-5 overflow-hidden rounded-xl border border-[var(--sc-line)] bg-[var(--sc-paper-2)] p-3 sm:p-4">
          <div className="aspect-[16/10]">
            <IndustryWireframePreview industryId={dive.mediaKey} className="h-full" />
          </div>
        </div>

        <Link
          href={dive.href}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:gap-2"
          style={{ color: accent }}
        >
          {dive.ctaLabel}
          <ArrowUpRight size={16} weight="bold" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

function useActiveArchitectureCard(cardIds: string[]) {
  const [activeId, setActiveId] = useState('core');
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const stickyTopPx = (index: number) => {
      const navH =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 84;
      return navH + 20 + index * 12;
    };

    const update = () => {
      let next = cardIds[0];

      for (let i = cardIds.length - 1; i >= 0; i--) {
        const id = cardIds[i];
        const el = cardRefs.current[id];
        if (!el) continue;

        const { top } = el.getBoundingClientRect();
        if (top <= stickyTopPx(i) + 4) {
          next = id;
          break;
        }
      }

      setActiveId(next);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [cardIds]);

  return { activeId, cardRefs };
}

export function PlatformArchitectureSection({ leadSection = false }: { leadSection?: boolean }) {
  const cardIds = ['core', ...INDUSTRY_DEEP_DIVES.map((d) => d.id)];
  const { activeId, cardRefs } = useActiveArchitectureCard(cardIds);

  return (
    <section
      className={
        leadSection
          ? 'border-y border-[var(--sc-line)] bg-[var(--sc-paper-2)] pt-4 pb-16 sm:pt-6 sm:pb-20 lg:pt-8 lg:pb-28'
          : 'border-y border-[var(--sc-line)] bg-[var(--sc-paper-2)] py-16 sm:py-20 lg:py-28'
      }
    >
      <StudioCraftContainer>
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--sc-coral)]">
            Platform architecture
          </p>
          <h2 className="mt-3 max-w-2xl text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--sc-ink)]">
            {CORE_PACKS_EXPLAINER.title}
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--sc-ink-muted)]">
            {CORE_PACKS_EXPLAINER.caption}
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10 lg:mt-14 lg:flex-row lg:gap-14">
          <aside className="lg:w-80 lg:shrink-0">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+1.25rem)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--sc-coral)]">
                Scroll the stack
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--sc-ink-muted)]">
                The core platform is always underneath. Vertical packs dock on top when your sector needs
                specialised workflows — without a separate integration project.
              </p>
              <ul className="mt-6 space-y-2 border-t border-[var(--sc-line)] pt-6">
                <li
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    activeId === 'core'
                      ? 'font-medium text-[var(--sc-ink)]'
                      : 'text-[var(--sc-ink-muted)]'
                  }`}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full bg-[var(--sc-ink)] transition-opacity ${
                      activeId === 'core' ? 'opacity-100' : 'opacity-35'
                    }`}
                    aria-hidden
                  />
                  {CORE_PACKS_EXPLAINER.coreLabel}
                </li>
                {VERTICAL_PACKS.map((pack) => (
                  <li
                    key={pack.id}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      activeId === pack.id
                        ? 'font-medium text-[var(--sc-ink)]'
                        : 'text-[var(--sc-ink-muted)]'
                    }`}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full transition-opacity"
                      style={{
                        backgroundColor: pack.color,
                        opacity: activeId === pack.id ? 1 : 0.35,
                      }}
                      aria-hidden
                    />
                    {pack.label}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="relative min-w-0 flex-1 pb-16 lg:pb-[min(32vh,18rem)]">
            <CoreFoundationCard index={0} setRef={(el) => { cardRefs.current.core = el; }} />
            {INDUSTRY_DEEP_DIVES.map((dive, i) => (
              <VerticalPackCard
                key={dive.id}
                dive={dive}
                index={i + 1}
                setRef={(el) => {
                  cardRefs.current[dive.id] = el;
                }}
              />
            ))}
          </div>
        </div>
      </StudioCraftContainer>
    </section>
  );
}
