'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import BrandLogo from '@/components/BrandLogo';
import { usePublicBrand } from '@/components/BrandProvider';

type AuthSplitShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthSplitShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: AuthSplitShellProps) {
  const { orgName, privacyPolicyUrl, termsUrl } = usePublicBrand();
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col font-pub lg:flex-row">
      <div className="auth-split-brand relative flex flex-col justify-between overflow-hidden px-7 py-8 sm:px-10 lg:min-h-screen lg:w-[440px] lg:flex-shrink-0 lg:px-12 lg:py-11">
        <div className="auth-split-glow pointer-events-none absolute inset-0" aria-hidden>
          <div className="auth-split-glow-purple" />
          <div className="auth-split-glow-teal" />
          <div className="auth-split-glow-orange" />
        </div>

        <div className="relative z-10">
          <Link href="/careers">
            <BrandLogo variant="auth" priority className="h-8 object-contain" />
          </Link>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0">
          <p className="auth-split-eyebrow text-[0.6875rem] font-semibold uppercase tracking-[0.1em]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-[15rem] text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] lg:text-[2rem]">
            {title}
          </h1>
          <p className="auth-split-subtitle mt-4 max-w-[15rem] text-[0.875rem] leading-[1.6]">
            {subtitle}
          </p>
        </div>

        <nav className="auth-split-footer relative z-10 mt-12 hidden items-center gap-4 text-[0.75rem] lg:mt-0 lg:flex">
          <span suppressHydrationWarning>
            © {year} {orgName}
          </span>
          <Link href="/careers" className="transition-colors">
            Careers
          </Link>
          <Link href={privacyPolicyUrl || '/privacy'} className="transition-colors">
            Privacy
          </Link>
          <Link href={termsUrl || '/terms'} className="transition-colors">
            Terms
          </Link>
        </nav>
      </div>

      <div className="auth-split-form relative flex flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-[380px]">{children}</div>
        </div>
        {footer}
      </div>
    </div>
  );
}

export function LoginCard({
  children,
  footer,
  className = '',
}: {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`auth-login-card w-full overflow-hidden rounded-xl bg-white ${className}`.trim()}>
      <div className="px-7 pb-7 pt-8">{children}</div>
      {footer ? <div className="border-t border-[#e3e8ee] bg-[#f7f8fa] px-7 py-3.5">{footer}</div> : null}
    </div>
  );
}
