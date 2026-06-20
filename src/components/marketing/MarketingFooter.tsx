import Link from 'next/link';
import { Linkedin } from 'lucide-react';
import { StrideWordmarkLockup } from '@/components/marketing/StrideMark';
import { StudioCraftContainer } from '@/components/marketing/v3/studio-craft-shared';
import {
  MARKETING_LINKEDIN_URL,
  MARKETING_SALES_EMAIL,
} from '@/lib/marketing-config';

const FOOTER_PRODUCT_LINKS = [
  { href: '/platform', label: 'Platform' },
  { href: '/industries', label: 'Industries' },
  { href: '/pricing', label: 'Pricing' },
] as const;

const FOOTER_COMPANY_LINKS = [
  { href: '/careers', label: 'Careers' },
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
] as const;

export function MarketingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[var(--sc-ink)] px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(130%_90%_at_50%_100%,rgba(255,84,54,0.34)_0%,rgba(255,84,54,0.16)_28%,rgba(255,84,54,0.07)_45%,rgba(26,23,20,0)_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(26,23,20,0.02)_0%,rgba(26,23,20,0.12)_42%,rgba(26,23,20,0)_100%)]"
      />

      <StudioCraftContainer className="relative px-0">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <Link href="/">
                <StrideWordmarkLockup theme="on-ink" markClassName="h-6" wordClassName="text-xl" />
              </Link>
              <p className="mt-3 text-sm italic !text-[var(--sc-coral)]">Hit your stride.</p>
              <a
                href={`mailto:${MARKETING_SALES_EMAIL}`}
                className="mt-2 block text-sm text-[#C9C0B6] transition-colors hover:text-[var(--sc-coral)]"
              >
                {MARKETING_SALES_EMAIL}
              </a>
            </div>
            <nav aria-label="Footer">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-2">
                {FOOTER_PRODUCT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#C9C0B6] transition-colors hover:text-[var(--sc-coral)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li aria-hidden className="hidden h-4 w-px shrink-0 bg-white/15 sm:block" />
                {FOOTER_COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#C9C0B6] transition-colors hover:text-[var(--sc-coral)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={MARKETING_LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-[#C9C0B6] transition-colors hover:text-[var(--sc-coral)]"
                    aria-label="Stride on LinkedIn (opens in new tab)"
                  >
                    <Linkedin className="h-5 w-5" aria-hidden />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="border-t border-white/10 pt-6 text-xs text-[#8A8076]">
            <p suppressHydrationWarning>
              © {new Date().getFullYear()} Stride. A Raven Tech Group product. ODPC-registered data
              processor.
            </p>
          </div>
        </div>
      </StudioCraftContainer>
    </footer>
  );
}
