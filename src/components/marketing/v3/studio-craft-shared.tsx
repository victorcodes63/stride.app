'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';

const ROLL_EASE = 'cubic-bezier(0.25,0.1,0.25,1)';

type TextRollLinkProps = {
  href: string;
  label: string;
  variant?: 'ink' | 'coral';
  className?: string;
  showArrow?: boolean;
};

export function TextRollLink({
  href,
  label,
  variant = 'ink',
  className = '',
  showArrow = true,
}: TextRollLinkProps) {
  const isInk = variant === 'ink';

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
        isInk
          ? 'bg-[var(--sc-ink)] text-white hover:bg-[var(--sc-ink)]'
          : 'bg-[var(--sc-coral)] text-white hover:bg-[var(--sc-coral-deep)]'
      } ${className}`.trim()}
    >
      <span className="relative h-5 overflow-hidden">
        <RollLabel label={label} />
      </span>
      {showArrow ? (
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-500 group-hover:-rotate-45 ${
            isInk ? 'bg-white text-[var(--sc-ink)]' : 'bg-white text-[var(--sc-coral)]'
          }`}
          style={{ transitionTimingFunction: ROLL_EASE }}
        >
          <ArrowRight size={14} weight="bold" aria-hidden />
        </span>
      ) : null}
    </Link>
  );
}

type TextRollButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: 'ink' | 'coral';
  className?: string;
};

export function TextRollButton({
  label,
  onClick,
  variant = 'ink',
  className = '',
}: TextRollButtonProps) {
  const isInk = variant === 'ink';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
        isInk
          ? 'bg-[var(--sc-ink)] text-white'
          : 'bg-[var(--sc-coral)] text-white hover:bg-[var(--sc-coral-deep)]'
      } ${className}`.trim()}
    >
      <RollLabel label={label} />
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-500 group-hover:-rotate-45 ${
          isInk ? 'bg-white text-[var(--sc-ink)]' : 'bg-white text-[var(--sc-coral)]'
        }`}
        style={{ transitionTimingFunction: ROLL_EASE }}
      >
        <ArrowRight size={14} weight="bold" aria-hidden />
      </span>
    </button>
  );
}

export function RollLabel({ label }: { label: string }) {
  return (
    <span className="relative h-5 overflow-hidden">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
        <span className="block leading-5">{label}</span>
        <span className="block leading-5">{label}</span>
      </span>
    </span>
  );
}

export function SectionBadge({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3 sm:mb-8">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--sc-line)] text-sm font-medium text-[var(--sc-ink)]">
        {number}
      </span>
      <span className="rounded-full border border-[var(--sc-line)] bg-white px-3 py-1 text-[13px] text-[var(--sc-ink-muted)]">
        {label}
      </span>
    </div>
  );
}

export function StudioCraftContainer({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 ${className}`.trim()}>
      {children}
    </div>
  );
}
