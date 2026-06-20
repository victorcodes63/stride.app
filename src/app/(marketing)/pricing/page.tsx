import Link from 'next/link';
import { PRICING_TIERS } from '@/lib/marketing-config';
import { MarketingCtaBand } from '@/components/marketing/MarketingCtaBand';
import { MarketingPageBody } from '@/components/marketing/MarketingPageBody';
import { MarketingPageHeader } from '@/components/marketing/MarketingPageHeader';

export const metadata = {
  title: 'Pricing',
  description: 'Stride platform pricing — size-banded tiers in KES, not per-seat.',
};

export default function PricingPage() {
  return (
    <>
      <MarketingPageHeader
        eyebrow="Pricing"
        title="Simple tiers. Kenyan shillings."
        description="Platform access banded by organisation size. Add vertical packs when you need them. No per-seat surprises."
        align="center"
      />

      <MarketingPageBody>
        <div className="grid gap-5 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <article
              key={tier.id}
              className={`flex flex-col rounded-[20px] border p-8 ${
                tier.featured ? 'pub-on-ink border-pub-ink bg-pub-ink text-[#FBF8F4]' : 'border-pub-border bg-white'
              }`}
            >
              <p className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--pub-primary)]">
                {tier.name}
              </p>
              <p className={`mt-4 font-heading text-4xl font-extrabold ${tier.featured ? '' : 'text-pub-ink'}`}>
                {tier.price}
              </p>
              <p className={`text-sm ${tier.featured ? 'text-[#9C948A]' : 'text-pub-ink-subtle'}`}>
                {tier.unit}
              </p>
              <p
                className={`my-6 border-b pb-6 text-sm leading-relaxed ${
                  tier.featured
                    ? 'border-white/10 text-[#C9C0B6]'
                    : 'border-pub-border text-pub-ink-muted'
                }`}
              >
                {tier.description}
              </p>
              <ul className="mb-8 flex flex-1 flex-col gap-3 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className={tier.featured ? 'text-[#D8D2C9]' : 'text-pub-ink-muted'}>
                    <span className="text-[var(--pub-primary)]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`rounded-lg py-3 text-center text-sm font-semibold transition ${
                  tier.featured
                    ? 'bg-[var(--pub-primary)] text-white hover:bg-[var(--pub-primary-hover)]'
                    : 'border border-pub-border-strong text-pub-ink hover:border-pub-ink'
                }`}
              >
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-pub-ink-subtle">
          All plans include data migration support.
        </p>
      </MarketingPageBody>

      <MarketingCtaBand
        title="Not sure which tier fits?"
        description="Tell us your team size and modules — we will recommend a plan."
        primary={{ href: '/contact', label: 'Talk to us' }}
        variant="coral"
      />
    </>
  );
}
