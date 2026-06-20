import Link from 'next/link';
import { MarketingCtaBand } from '@/components/marketing/MarketingCtaBand';
import { MarketingPageBody } from '@/components/marketing/MarketingPageBody';
import { MarketingPageHeader } from '@/components/marketing/MarketingPageHeader';

export const metadata = {
  title: 'About',
  description:
    'Stride is an operations platform for East African businesses — built by Raven Tech Group in Nairobi.',
};

const VALUES = [
  {
    title: 'Built here, not ported',
    body: 'M-Pesa disbursements, KRA compliance, NSSF and SHIF logic, and multi-entity structures are first-class — not retrofitted from a global template.',
  },
  {
    title: 'Horizontal first, vertical when it matters',
    body: 'Every business runs on the same core: HR, finance, procurement, documents, projects and admin. Industry packs add the specialised 20% on top.',
  },
  {
    title: 'Honest about the roadmap',
    body: 'We ship what works. Verticals marked coming soon are on the roadmap — we do not pretend features exist when they do not.',
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <MarketingPageHeader
        eyebrow="About"
        title={
          <>
            Built in East Africa,
            <br />
            for East Africa.
          </>
        }
        description="Stride is the operations platform from Raven Tech Group — designed for businesses that need payroll, finance and sector workflows on one login, in Kenyan shillings, with compliance from day one."
      />

      <MarketingPageBody narrow>
        <div className="space-y-10 text-base leading-relaxed text-pub-ink-muted">
          <p>
            Most global ERPs were designed for other markets and adapted for Kenya. Stride flips that:
            a horizontal core every business needs, with vertical packs that add industry-specific depth
            without a separate integration project.
          </p>
          <p>
            We are based in Westlands, Nairobi. Our team builds and deploys Stride for SACCOs, fintechs,
            HR consultancies and logistics operators — organisations that outgrew spreadsheets but cannot
            afford eighteen-month ERP rollouts.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {VALUES.map((item) => (
            <article key={item.title} className="rounded-2xl border border-pub-border bg-white p-6">
              <h2 className="font-heading text-lg font-bold text-pub-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-pub-ink-muted">{item.body}</p>
            </article>
          ))}
        </div>

        <p className="mt-12 text-sm text-pub-ink-subtle">
          Stride is a{' '}
          <a
            href="https://raventechgroup.com"
            className="font-medium text-[var(--pub-primary)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Raven Tech Group
          </a>{' '}
          product.{' '}
          <Link href="/platform" className="font-medium text-[var(--pub-primary)] hover:underline">
            Explore the platform →
          </Link>
        </p>
      </MarketingPageBody>

      <MarketingCtaBand
        title="See Stride in action"
        description="Book a walkthrough of the core modules and the logistics vertical."
        primary={{ href: '/contact', label: 'Book a demo' }}
        secondary={{ href: '/pricing', label: 'View pricing' }}
      />
    </>
  );
}
