import Link from 'next/link';
import { MARKETING_CTAS, MARKETING_ROUTES } from '@/lib/marketing-config';
import { MarketingReveal } from '@/components/marketing/MarketingReveal';

export function MarketingFinalCta() {
  return (
    <section className="pub-on-ink relative overflow-hidden bg-pub-ink px-6 py-[130px] text-center sm:px-10">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,84,54,0.18) 0%, transparent 70%)',
        }}
        aria-hidden
      />
      <MarketingReveal>
        <h2 className="relative z-[1] font-heading text-[clamp(2.375rem,5.5vw,4.5rem)] font-extrabold leading-none tracking-[-2px] text-[#FBF8F4]">
          Ready to
          <br />
          hit your <span className="text-[var(--pub-primary)]">stride?</span>
        </h2>
      </MarketingReveal>
      <MarketingReveal delay={0.08}>
        <p className="relative z-[1] mx-auto mt-[22px] max-w-xl text-[17px] leading-relaxed text-[#F0EFE9]/70">
          No setup fee. No lock-in. Local support from day one.
          <br />
          Your whole business, finally moving as one.
        </p>
      </MarketingReveal>
      <MarketingReveal delay={0.16}>
        <div className="relative z-[1] mt-11 flex flex-wrap justify-center gap-3.5">
          <Link
            href={MARKETING_ROUTES.contact}
            className="inline-flex rounded-[10px] bg-[var(--pub-primary)] px-9 py-4 text-base font-semibold text-pub-ink transition hover:-translate-y-0.5 hover:bg-[var(--pub-primary-hover)] hover:shadow-[0_16px_36px_rgba(255,84,54,0.18)]"
          >
            {MARKETING_CTAS.bookDemo}
          </Link>
          <Link
            href={MARKETING_ROUTES.login}
            className="inline-flex rounded-[10px] border border-white/[0.14] bg-white/[0.06] px-9 py-4 text-base font-semibold text-pub-surface transition hover:bg-white/[0.12]"
          >
            {MARKETING_CTAS.signIn}
          </Link>
        </div>
      </MarketingReveal>
    </section>
  );
}
