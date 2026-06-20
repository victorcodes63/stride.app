import type { ReactNode } from 'react';
import Link from 'next/link';

type CtaLink = { href: string; label: string };

type MarketingCtaBandProps = {
  title: ReactNode;
  description?: string;
  primary: CtaLink;
  secondary?: CtaLink;
  variant?: 'ink' | 'coral';
  className?: string;
};

export function MarketingCtaBand({
  title,
  description,
  primary,
  secondary,
  variant = 'ink',
  className = '',
}: MarketingCtaBandProps) {
  const onInk = variant === 'ink';

  return (
    <section
      className={`px-6 py-16 sm:px-12 lg:py-20 ${
        onInk ? 'pub-on-ink bg-pub-ink text-[#FBF8F4]' : 'bg-[var(--pub-primary)] text-white'
      } ${className}`.trim()}
    >
      <div className="mx-auto max-w-[720px] text-center">
        <h2 className="font-heading text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold tracking-[-1px] text-inherit">
          {title}
        </h2>
        {description ? (
          <p
            className={`mt-4 text-[15px] leading-relaxed ${
              onInk ? 'text-[#C9C0B6]' : 'text-white/90'
            }`}
          >
            {description}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={primary.href}
            className={
              onInk
                ? 'rounded-[10px] bg-[var(--pub-primary)] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--pub-primary-hover)]'
                : 'rounded-[10px] bg-white px-8 py-3.5 text-sm font-semibold text-[var(--pub-primary)] transition hover:bg-pub-surface'
            }
          >
            {primary.label}
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className={
                onInk
                  ? 'rounded-[10px] border border-white/25 px-8 py-3.5 text-sm font-semibold text-pub-surface transition hover:border-pub-surface'
                  : 'rounded-[10px] border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white'
              }
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
