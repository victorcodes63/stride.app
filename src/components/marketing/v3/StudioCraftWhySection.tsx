import Link from 'next/link';
import { DashboardMockup } from '@/components/marketing/mockups/DashboardMockup';
import { FleetBoardMockup } from '@/components/marketing/mockups/FleetBoardMockup';
import { MARKETING_CTAS, MARKETING_WHY_STRIDE } from '@/lib/marketing-config';
import {
  RollLabel,
  SectionBadge,
  StudioCraftContainer,
} from './studio-craft-shared';

export function StudioCraftWhySection() {
  return (
    <section className="bg-[var(--sc-paper-2)] py-16 sm:py-20 lg:py-28">
      <StudioCraftContainer>
        <SectionBadge number="1" label={MARKETING_WHY_STRIDE.badge} />

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--sc-ink)]">
              {MARKETING_WHY_STRIDE.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-[520px] text-base leading-relaxed text-[var(--sc-ink-muted)] sm:text-lg">
              {MARKETING_WHY_STRIDE.body}
            </p>
            <Link
              href="/platform"
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--sc-line)] bg-white px-4 py-2 text-[13px] font-medium text-[var(--sc-ink)] transition-colors duration-500 hover:border-[var(--sc-ink-muted)]"
            >
              <RollLabel label={MARKETING_CTAS.explorePlatform} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr] sm:items-end">
            <div className="aspect-[438/346] overflow-hidden rounded-2xl">
              <DashboardMockup className="h-full" />
            </div>
            <div className="aspect-[3/2] overflow-hidden rounded-2xl">
              <FleetBoardMockup className="h-full" />
            </div>
          </div>
        </div>
      </StudioCraftContainer>
    </section>
  );
}
