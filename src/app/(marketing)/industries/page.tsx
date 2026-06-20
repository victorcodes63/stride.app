import Link from 'next/link';
import { INDUSTRY_VERTICALS } from '@/lib/marketing-config';
import { MarketingCtaBand } from '@/components/marketing/MarketingCtaBand';
import { MarketingPageBody } from '@/components/marketing/MarketingPageBody';
import { MarketingPageHeader } from '@/components/marketing/MarketingPageHeader';

export const metadata = {
  title: 'Industries',
  description: 'Stride vertical solutions for logistics, SACCOs, healthcare, energy and construction.',
};

export default function IndustriesPage() {
  return (
    <>
      <MarketingPageHeader
        eyebrow="Industries"
        title="Built for your industry."
        description="The core runs your business. Vertical packs add sector-specific workflows on top — without a separate system or integration project."
      />

      <MarketingPageBody>
        <div className="grid gap-5 lg:grid-cols-2">
          {INDUSTRY_VERTICALS.map((vertical) => (
            <Link
              key={vertical.id}
              href={vertical.href}
              className="rounded-2xl border border-pub-border bg-white p-7 transition hover:-translate-y-0.5 hover:border-[var(--pub-primary)]/30 hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-2">
                <h2 className="font-heading text-xl font-bold text-pub-ink">{vertical.name}</h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    vertical.status === 'available'
                      ? 'bg-[var(--pub-primary-subtle)] text-[var(--pub-primary-hover)]'
                      : 'bg-pub-surface-muted text-pub-ink-subtle'
                  }`}
                >
                  {vertical.status === 'available' ? 'Available' : 'Coming soon'}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-pub-ink-muted">{vertical.description}</p>
            </Link>
          ))}
        </div>
      </MarketingPageBody>

      <MarketingCtaBand
        title="Your industry not listed?"
        description="The horizontal core is live today. Join a waitlist for upcoming vertical packs."
        primary={{ href: '/contact', label: 'Join waitlist' }}
        secondary={{ href: '/platform', label: 'See the core' }}
      />
    </>
  );
}
