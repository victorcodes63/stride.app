'use client';

import Link from 'next/link';
import { CountUp, Reveal, Stagger, StaggerItem } from '@/components/marketing/motion';
import { SectionBadge, StudioCraftContainer } from '@/components/marketing/v3/studio-craft-shared';
import {
  ABOUT_PAGE,
  ABOUT_PRINCIPLES,
  HOW_IT_WORKS_STEPS,
  MARKETING_ROUTES,
} from '@/lib/marketing-config';

function StatValue({ value }: { value: string }) {
  const numericMatch = value.match(/^(\d+)(.*)$/);

  if (numericMatch) {
    const num = Number.parseInt(numericMatch[1], 10);
    const suffix = numericMatch[2] ?? '';
    return (
      <CountUp
        value={num}
        suffix={suffix}
        className="text-[clamp(2rem,4.5vw,3rem)] font-medium leading-none tracking-[-0.03em] text-[var(--sc-coral)]"
      />
    );
  }

  return (
    <span className="text-[clamp(2rem,4.5vw,3rem)] font-medium leading-none tracking-[-0.03em] text-[var(--sc-coral)]">
      {value}
    </span>
  );
}

export function AboutStorySection() {
  const { story } = ABOUT_PAGE;

  return (
    <section className="border-y border-[var(--sc-line)] bg-[var(--sc-paper-2)] py-12 sm:py-20 lg:py-24">
      <StudioCraftContainer>
        <Reveal>
          <SectionBadge number="1" label={story.badge} />
        </Reveal>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <Reveal delay={0.06}>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--sc-ink)]">
              {story.title}
            </h2>
          </Reveal>
          <Stagger className="space-y-5" delayChildren={0.1}>
            {story.paragraphs.map((paragraph) => (
              <StaggerItem key={paragraph.slice(0, 24)}>
                <p className="text-base leading-relaxed text-[var(--sc-ink-muted)]">{paragraph}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </StudioCraftContainer>
    </section>
  );
}

export function AboutStatsBand() {
  return (
    <section className="bg-[var(--sc-ink)] py-14 text-[var(--sc-paper)] sm:py-16 lg:py-20">
      <StudioCraftContainer>
        <Stagger
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          delayChildren={0.08}
        >
          {ABOUT_PAGE.stats.map((stat) => (
            <StaggerItem key={stat.label} className="border-t border-white/10 pt-5">
              <StatValue value={stat.value} />
              <p className="mt-3 text-sm leading-relaxed text-[var(--sc-paper)]/65">{stat.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </StudioCraftContainer>
    </section>
  );
}

export function AboutPrinciplesSection() {
  const { principles } = ABOUT_PAGE;

  return (
    <section className="bg-[var(--sc-paper)] py-16 sm:py-20 lg:py-28">
      <StudioCraftContainer>
        <Reveal>
          <SectionBadge number="2" label={principles.badge} />
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="max-w-[680px] text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--sc-ink)]">
            {principles.title}
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid gap-5 md:grid-cols-3" delayChildren={0.12}>
          {ABOUT_PRINCIPLES.map((item, i) => (
            <StaggerItem
              key={item.title}
              as="article"
              className="flex h-full flex-col rounded-2xl border border-[var(--sc-line)] bg-[var(--sc-paper-2)] p-6 sm:p-7"
            >
              <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--sc-coral)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-lg font-medium tracking-tight text-[var(--sc-ink)]">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--sc-ink-muted)]">{item.body}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.16} className="mt-12">
          <p className="text-sm text-[var(--sc-ink-muted)]">
            <Link href={MARKETING_ROUTES.platform} className="font-medium text-[var(--sc-coral)] hover:underline">
              Explore the platform →
            </Link>
          </p>
        </Reveal>
      </StudioCraftContainer>
    </section>
  );
}

export function AboutRolloutSection() {
  return (
    <section className="border-t border-[var(--sc-line)] bg-[var(--sc-paper-2)] py-16 sm:py-20 lg:py-24">
      <StudioCraftContainer>
        <Reveal>
          <SectionBadge number="3" label="Getting started" />
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="max-w-[640px] text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--sc-ink)]">
            Live in <span className="text-[var(--sc-coral)]">days, not months.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-[620px] text-base leading-relaxed text-[var(--sc-ink-muted)]">
            We onboard teams with guided setup, data import and local support — the same rollout path whether
            you start on the core or add a vertical pack.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-8 md:grid-cols-3 lg:mt-14" delayChildren={0.14}>
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <StaggerItem key={step.step}>
              <div
                className="border-t-2 border-[var(--sc-coral)] pt-6"
                style={{
                  borderColor: `color-mix(in srgb, var(--sc-coral, #ff5436) ${100 - i * 22}%, transparent)`,
                }}
              >
                <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--sc-coral)]">
                  {step.step}
                </p>
                <h3 className="mb-3 text-xl font-medium leading-tight tracking-[-0.02em] text-[var(--sc-ink)]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--sc-ink-muted)]">{step.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </StudioCraftContainer>
    </section>
  );
}
