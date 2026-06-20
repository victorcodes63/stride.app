import Link from 'next/link';
import { PRICING_TIERS } from '@/lib/marketing-config';
import { MarketingEyebrow } from '@/components/marketing/MarketingEyebrow';
import { MarketingReveal } from '@/components/marketing/MarketingReveal';

export function MarketingPricingSection() {
  return (
    <section id="pricing" className="bg-pub-surface-muted px-6 py-[80px] sm:px-10 lg:py-[120px]">
      <div className="mx-auto max-w-[1080px] text-center">
        <MarketingReveal>
          <MarketingEyebrow withRule={false} className="text-center">
            Pricing
          </MarketingEyebrow>
        </MarketingReveal>
        <MarketingReveal delay={0.08}>
          <h2 className="mx-auto max-w-[640px] font-heading text-[clamp(1.875rem,4vw,3.125rem)] font-extrabold leading-[1.06] tracking-[-1.5px] text-pub-ink">
            Priced for your <span className="text-[var(--pub-primary)]">size</span>, not per seat.
          </h2>
        </MarketingReveal>
        <MarketingReveal delay={0.16}>
          <p className="mx-auto mt-[18px] max-w-[520px] text-[17px] text-pub-ink-muted">
            Platform tiers banded by organisation size, billed in Kenyan shillings. Add modules as you
            grow.
          </p>
        </MarketingReveal>
      </div>

      <div className="mx-auto mt-14 grid max-w-[1080px] gap-[18px] text-left lg:grid-cols-3">
        {PRICING_TIERS.map((tier, i) => (
          <MarketingReveal key={tier.id} delay={0.1 + i * 0.08}>
            <article
              className={`relative flex h-full flex-col rounded-[20px] border p-[34px] transition hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(26,23,20,0.09)] ${
                tier.featured
                  ? 'pub-on-ink border-pub-ink bg-pub-ink'
                  : 'border-pub-border bg-white'
              }`}
            >
              {tier.featured ? (
                <span className="absolute right-[18px] top-[18px] rounded-full bg-[var(--pub-primary)]/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--pub-primary)]">
                  Most popular
                </span>
              ) : null}
              <p className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--pub-primary)]">
                {tier.name}
              </p>
              <p
                className={`mt-3.5 font-heading text-[40px] font-extrabold leading-none tracking-[-1.5px] ${
                  tier.featured ? 'text-pub-surface' : 'text-pub-ink'
                }`}
              >
                {tier.price}
              </p>
              <p className={`mt-1.5 text-[13px] ${tier.featured ? 'text-[#9C948A]' : 'text-pub-ink-subtle'}`}>
                {tier.unit}
              </p>
              <p
                className={`my-[22px] border-b pb-[22px] text-sm leading-relaxed ${
                  tier.featured
                    ? 'border-white/10 text-[#C9C0B6]'
                    : 'border-pub-border text-pub-ink-muted'
                }`}
              >
                {tier.description}
              </p>
              <ul className="mb-7 flex flex-1 flex-col gap-2.5 text-sm">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className={`leading-snug ${tier.featured ? 'text-[#D8D2C9]' : 'text-pub-ink-muted'}`}
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`rounded-[9px] py-3.5 text-center text-[15px] font-semibold transition ${
                  tier.featured
                    ? 'bg-[var(--pub-primary)] text-white hover:bg-[var(--pub-primary-hover)]'
                    : 'border-[1.5px] border-pub-border-strong text-pub-ink hover:border-pub-ink'
                }`}
              >
                {tier.cta}
              </Link>
            </article>
          </MarketingReveal>
        ))}
      </div>

      <MarketingReveal delay={0.2}>
        <p className="mx-auto mt-[34px] max-w-[1080px] text-center text-[13px] text-pub-ink-subtle">
          All plans include free data migration and no setup fee. Prices exclusive of VAT.
          Illustrative — confirm before launch.{' '}
          <Link href="/pricing" className="font-semibold text-[var(--pub-primary)] hover:underline">
            View full pricing →
          </Link>
        </p>
      </MarketingReveal>
    </section>
  );
}
