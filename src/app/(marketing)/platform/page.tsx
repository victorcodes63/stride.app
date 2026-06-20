import Link from 'next/link';
import { CORE_MODULES, MARKETING_CTAS, MARKETING_ROUTES } from '@/lib/marketing-config';
import { MarketingCtaBand } from '@/components/marketing/MarketingCtaBand';
import { MarketingPageBody } from '@/components/marketing/MarketingPageBody';
import { MarketingPageHeader } from '@/components/marketing/MarketingPageHeader';
import { DashboardMockup } from '@/components/marketing/mockups/DashboardMockup';

export const metadata = {
  title: 'Platform',
  description: 'The Stride horizontal core — six modules every East African business runs on.',
};

export default function PlatformPage() {
  return (
    <>
      <MarketingPageHeader
        eyebrow="Platform"
        title="One core. Every business."
        description="Stride is built as a horizontal operations platform first. Payroll and HR are the wedge — because every business has people to pay — but finance, procurement, documents, projects and admin share the same data layer."
        visual={<DashboardMockup />}
      />

      <MarketingPageBody>
        <div className="grid gap-4 md:grid-cols-2">
          {CORE_MODULES.map((mod) => (
            <article key={mod.name} className="rounded-2xl border border-pub-border bg-white p-7">
              <p className="mb-3 font-heading text-sm font-bold text-[var(--pub-primary)]">{mod.num}</p>
              <h2 className="mb-2 font-heading text-xl font-bold text-pub-ink">{mod.name}</h2>
              <p className="text-sm leading-relaxed text-pub-ink-muted">{mod.description}</p>
            </article>
          ))}
        </div>

        <div className="pub-on-ink mt-16 rounded-2xl bg-pub-ink px-8 py-10 text-[#FBF8F4]">
          <h2 className="font-heading text-2xl font-bold text-[#FBF8F4]">Add vertical packs when you need them</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#C9C0B6]">
            Logistics & Cargo is live today. SACCOs, Healthcare, Energy and Construction are rolling
            out on the same core.
          </p>
          <Link
            href="/industries"
            className="mt-6 inline-flex text-sm font-semibold text-[var(--pub-primary)] hover:underline"
          >
            Explore industries →
          </Link>
        </div>
      </MarketingPageBody>

      <MarketingCtaBand
        title="Start with what you need"
        description="Enable core modules first, then add vertical packs as your operations grow."
        primary={{ href: MARKETING_ROUTES.contact, label: MARKETING_CTAS.bookDemo }}
        secondary={{ href: MARKETING_ROUTES.login, label: MARKETING_CTAS.signIn }}
      />
    </>
  );
}
