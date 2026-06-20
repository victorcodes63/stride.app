import Link from 'next/link';
import { StrideWordmarkLockup } from '@/components/marketing/StrideMark';

const FOOTER_LINKS = [
  { href: '/platform', label: 'Platform' },
  { href: '/industries', label: 'Industries' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/careers', label: 'Careers' },
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
] as const;

export function MarketingFooter() {
  return (
    <footer className="pub-on-ink border-t border-white/10 bg-pub-ink px-6 py-12 sm:px-12">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <Link href="/">
              <StrideWordmarkLockup theme="on-ink" markClassName="h-6" wordClassName="text-xl" />
            </Link>
            <p className="mt-3 text-sm italic text-[#8A8076]">Hit your stride.</p>
          </div>
          <ul className="flex flex-wrap gap-7">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-[#C9C0B6] transition-colors hover:text-primary-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#8A8076]">
          <p suppressHydrationWarning>© {new Date().getFullYear()} Stride. A Raven Tech Group product.</p>
          <p className="italic">Westlands, Nairobi</p>
        </div>
      </div>
    </footer>
  );
}
