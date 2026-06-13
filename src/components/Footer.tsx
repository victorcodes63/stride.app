'use client';

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { usePublicBrand } from '@/components/BrandProvider';

const Footer = () => {
  const { orgName, tagline, contactPhone, contactEmail, contactAddress, publicFooterText } =
    usePublicBrand();
  const productLinks = [
    { name: 'Open roles', href: '/careers' },
    { name: 'Staff sign in', href: '/dashboard/login' },
    { name: 'Employee portal', href: '/ess/login' },
  ];

  const legalLinks = [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ];

  return (
    <footer className="relative border-t border-pub-border bg-pub-surface-muted">
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/careers" className="mb-5 inline-flex items-center gap-3">
              <BrandLogo variant="markLg" />
              <span className="text-sm font-medium text-pub-ink">{orgName}</span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-pub-ink-muted">
              {publicFooterText?.trim() || tagline}
            </p>
            <div className="mt-5 space-y-2 text-sm text-pub-ink-subtle">
              {contactEmail ? (
                <a href={`mailto:${contactEmail}`} className="block hover:text-pub-primary">
                  {contactEmail}
                </a>
              ) : null}
              {contactPhone ? <span className="block">{contactPhone}</span> : null}
              {contactAddress ? <span className="block">{contactAddress}</span> : null}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-wider text-pub-ink-subtle">Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-pub-ink-muted transition-colors hover:text-pub-ink">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-wider text-pub-ink-subtle">{orgName}</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-pub-ink-muted transition-colors hover:text-pub-ink">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-pub-border pt-8 sm:flex-row">
          <p className="text-sm text-pub-ink-subtle">
            © {new Date().getFullYear()} {orgName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-pub-ink-subtle transition-colors hover:text-pub-ink"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 hidden h-10 w-10 items-center justify-center rounded-full border border-pub-border bg-white text-pub-ink-muted shadow-md transition-all hover:border-pub-primary hover:text-pub-primary md:flex"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </footer>
  );
};

export default Footer;
