import { TRUST_CLIENTS } from '@/lib/marketing-config';
import { MarketingReveal } from '@/components/marketing/MarketingReveal';

export function MarketingTrustStrip() {
  return (
    <section className="relative z-[2] bg-pub-ink px-6 pb-20 pt-10 sm:px-10">
      <p className="mb-6 text-center text-xs uppercase tracking-[0.12em] text-pub-ink-subtle">
        Trusted by teams across East Africa
      </p>
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-x-12 gap-y-4">
        {TRUST_CLIENTS.map((name, i) => (
          <MarketingReveal key={name} delay={i * 0.08}>
            <span className="font-heading text-lg font-bold tracking-[-0.5px] text-[#F0EFE9]/40 transition-colors hover:text-[#F0EFE9]/75 md:text-[19px]">
              {name}
            </span>
          </MarketingReveal>
        ))}
      </div>
    </section>
  );
}
