import { HOW_IT_WORKS_STEPS } from '@/lib/marketing-config';
import { MarketingEyebrow } from '@/components/marketing/MarketingEyebrow';
import { MarketingReveal } from '@/components/marketing/MarketingReveal';

export function MarketingHowSection() {
  return (
    <section id="how" className="bg-pub-surface px-6 py-[80px] sm:px-10 lg:py-[120px]">
      <div className="mx-auto max-w-[1120px]">
        <MarketingReveal>
          <MarketingEyebrow>How it works</MarketingEyebrow>
        </MarketingReveal>
        <MarketingReveal delay={0.08}>
          <h2 className="max-w-[640px] font-heading text-[clamp(1.875rem,4vw,3.125rem)] font-extrabold leading-[1.06] tracking-[-1.5px] text-pub-ink">
            Three steps to <span className="text-[var(--pub-primary)]">full speed.</span>
          </h2>
        </MarketingReveal>

        <div className="mt-[60px] grid gap-7 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <MarketingReveal key={step.step} delay={0.1 + i * 0.08}>
              <div
                className="border-t-[3px] pt-[26px]"
                style={{ borderColor: `rgba(255, 84, 54, ${1 - i * 0.25})` }}
              >
                <p className="mb-3.5 font-heading text-[13px] font-bold text-[var(--pub-primary)]">
                  {step.step}
                </p>
                <h3 className="mb-2.5 font-heading text-[21px] font-bold leading-tight tracking-[-0.4px] text-pub-ink">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-pub-ink-muted">{step.body}</p>
              </div>
            </MarketingReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
