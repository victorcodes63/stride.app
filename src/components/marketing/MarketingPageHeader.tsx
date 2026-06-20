import type { ReactNode } from 'react';

type MarketingPageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function MarketingPageHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: MarketingPageHeaderProps) {
  const centered = align === 'center';

  return (
    <header className={`px-6 pb-12 pt-[120px] sm:px-12 ${className}`.trim()}>
      <div className={`mx-auto max-w-[1100px] ${centered ? 'text-center' : ''}`}>
        <p
          className={`mb-5 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--pub-primary)] ${
            centered
              ? ''
              : 'flex items-center gap-2.5 before:h-px before:w-6 before:shrink-0 before:bg-[var(--pub-primary)]'
          }`}
        >
          {eyebrow}
        </p>
        <h1
          className={`font-heading text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold tracking-[-1.5px] text-pub-ink ${
            centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'
          }`}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={`mt-5 text-lg leading-relaxed text-pub-ink-muted ${
              centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'
            }`}
          >
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}
