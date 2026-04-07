'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Banknote,
  Building2,
  FileSignature,
  FileStack,
  FileText,
  Landmark,
  LayoutGrid,
  Loader2,
  Receipt,
  Scale,
  Users,
  Wallet,
} from 'lucide-react';

type ClientRow = {
  id: string;
  type: string;
};

type InvoiceRow = {
  id: string;
  invoiceNumber: number;
  clientName: string;
  issueDate: string;
  status: string;
  totalIncVat: number;
  currency: string;
};

const MODULES: {
  href: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}[] = [
  {
    href: '/dashboard/accounts/clients',
    title: 'Billing clients',
    desc: 'Sync from ATS & outsourcing, plus off-system clients',
    icon: Building2,
  },
  {
    href: '/dashboard/accounts/invoices',
    title: 'Invoices',
    desc: 'Multi-line, VAT, PDFs & numbering',
    icon: FileText,
    highlight: true,
  },
  {
    href: '/dashboard/accounts/receipts',
    title: 'Receipts & allocations',
    desc: 'Client payments → invoices',
    icon: Receipt,
  },
  {
    href: '/dashboard/people/contracts',
    title: 'Contracts',
    desc: 'Reminders & managers',
    icon: FileSignature,
  },
  {
    href: '/dashboard/accounts/vendors',
    title: 'Vendors',
    desc: 'Creditor profiles & spend history',
    icon: Wallet,
  },
  {
    href: '/dashboard/accounts/vendor-bills',
    title: 'Vendor bills',
    desc: 'AP lines, VAT & payment allocations',
    icon: FileStack,
  },
  {
    href: '/dashboard/accounts/statements',
    title: 'Statements',
    desc: 'Debtors & creditors views',
    icon: Scale,
  },
  {
    href: '/dashboard/accounts/payroll',
    title: 'Payroll',
    desc: 'Runs, payslips & statutory',
    icon: Banknote,
    highlight: true,
  },
];

export default function AccountsOverviewContent() {
  const [clients, setClients] = useState<ClientRow[] | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch('/api/accounts/clients').then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || 'Failed to load clients');
        return data as { clients?: ClientRow[] };
      }),
      fetch('/api/accounts/invoices').then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || 'Failed to load invoices');
        return data as { invoices?: InvoiceRow[] };
      }),
    ])
      .then(([c, inv]) => {
        setClients(Array.isArray(c.clients) ? c.clients : []);
        setInvoices(Array.isArray(inv.invoices) ? inv.invoices : []);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load Accounts data');
        setClients([]);
        setInvoices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const c = clients ?? [];
    const inv = invoices ?? [];
    const open = inv.filter((i) => i.status === 'unpaid' || i.status === 'partial').length;
    const linkedRec = c.filter((x) => x.type === 'recruitment').length;
    const linkedOut = c.filter((x) => x.type === 'outsourcing').length;
    return {
      clientsTotal: c.length,
      invoicesTotal: inv.length,
      openInvoices: open,
      linkedRec,
      linkedOut,
    };
  }, [clients, invoices]);

  const recentInvoices = useMemo(() => (invoices ?? []).slice(0, 6), [invoices]);

  const statCards = [
    {
      label: 'Billing clients',
      value: stats.clientsTotal,
      sub: `${stats.linkedRec} recruitment · ${stats.linkedOut} outsourcing`,
      icon: Users,
      tone: 'primary' as const,
    },
    {
      label: 'Invoices (loaded)',
      value: stats.invoicesTotal,
      sub: 'Latest 200 in system',
      icon: FileText,
      tone: 'primary' as const,
    },
    {
      label: 'Open invoices',
      value: stats.openInvoices,
      sub: 'Unpaid or partial',
      icon: Landmark,
      tone: 'indigo' as const,
    },
    {
      label: 'Custom ledgers',
      value: (clients ?? []).filter((x) => x.type === 'custom').length,
      sub: 'Standalone billing profiles',
      icon: Building2,
      tone: 'primary' as const,
    },
  ];

  if (loading) {
    return (
      <div className="w-full min-w-0 flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-9 h-9 text-primary-600 animate-spin" />
        <p className="text-sm text-neutral-500">Loading Accounts overview…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-w-0 space-y-4">
        <nav className="mb-2" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
            <li>
              <Link href="/dashboard" className="hover:text-primary-700 transition-colors">
                Dashboard
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-primary-900 font-medium">Accounts</li>
          </ol>
        </nav>
        <h1 className="text-2xl font-bold text-primary-900">Accounts</h1>
        <div className="rounded-2xl border border-red-100 bg-red-50/80 p-5 text-red-800 text-sm max-w-2xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-8 sm:space-y-10">
      <nav className="mb-2 sm:mb-0" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
          <li>
            <Link href="/dashboard" className="hover:text-primary-700 transition-colors">
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-primary-900 font-medium" aria-current="page">
            Accounts
          </li>
        </ol>
      </nav>

      {/* Hero — matches main dashboard overview */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-transparent pointer-events-none" />
        <div
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pl-1 sm:pl-2">
          <div className="min-w-0 space-y-3">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-700">
              Finance & payroll
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">Accounts</h1>
            <p className="text-neutral-600 text-sm sm:text-[15px] max-w-2xl leading-relaxed">
              Billing clients sync from recruitment and outsourcing. Manage invoices, receipts, contracts, vendors,
              statements, and payroll from one place.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/dashboard/accounts/clients"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-900 text-white text-sm font-semibold shadow-md shadow-primary-900/15 hover:bg-primary-800 hover:shadow-lg hover:shadow-primary-900/20 transition-all"
            >
              <Building2 className="w-4 h-4 opacity-90" />
              Billing clients
            </Link>
            <Link
              href="/dashboard/accounts/invoices"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-neutral-300 bg-white text-sm font-semibold text-primary-900 hover:bg-primary-50/80 hover:border-primary-200 transition-all"
            >
              <LayoutGrid className="w-4 h-4 opacity-90" />
              All invoices
            </Link>
          </div>
        </div>
      </div>

      {/* Snapshot */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 pb-1 border-b border-neutral-200">Live snapshot</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            const iconBg =
              s.tone === 'indigo' ? 'bg-indigo-100/80 text-indigo-700' : 'bg-primary-100/80 text-primary-800';
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 hover:border-neutral-300 transition-colors"
              >
                <div className={`inline-flex rounded-lg p-2 mb-3 ${iconBg}`}>
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                  {s.label}
                </p>
                <p
                  className={`text-2xl sm:text-3xl font-bold tabular-nums ${
                    s.tone === 'indigo' ? 'text-indigo-700' : 'text-primary-900'
                  }`}
                >
                  {s.value}
                </p>
                <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{s.sub}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Modules — Quick entry style */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-neutral-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Accounts modules</h2>
            <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
              Same destinations as the sidebar—open the area you need.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {MODULES.map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <motion.div
                key={tile.href}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + idx * 0.03 }}
              >
                <Link
                  href={tile.href}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md h-full ${
                    tile.highlight
                      ? 'bg-primary-900 text-white border-primary-900 hover:bg-primary-800'
                      : 'bg-white border-neutral-200 hover:border-primary-300 hover:bg-primary-50/40'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      tile.highlight ? 'bg-white/15' : 'bg-primary-50 text-primary-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${tile.highlight ? 'text-white' : ''}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-bold text-sm ${tile.highlight ? 'text-white' : 'text-primary-900'}`}
                    >
                      {tile.title}
                    </p>
                    <p
                      className={`text-xs line-clamp-2 ${tile.highlight ? 'text-primary-100' : 'text-neutral-500'}`}
                    >
                      {tile.desc}
                    </p>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 ${tile.highlight ? 'text-white' : 'text-neutral-300'}`}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Recent invoices */}
      <section className="space-y-4 pb-2">
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden min-w-0 shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/80 flex items-center justify-between gap-3">
            <h2 className="font-bold text-neutral-900">Recent invoices</h2>
            <Link
              href="/dashboard/accounts/invoices"
              className="text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentInvoices.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-neutral-500">
                No invoices yet. Create one from a billing client or use the sample seed in development.
              </div>
            ) : (
              recentInvoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/dashboard/accounts/invoices/${inv.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-primary-50/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm">
                    <span className="text-sm font-bold text-primary-800 tabular-nums">#{inv.invoiceNumber}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-primary-900 truncate">{inv.clientName}</p>
                    <p className="text-xs text-neutral-500 truncate">
                      {inv.issueDate} ·{' '}
                      {inv.totalIncVat.toLocaleString('en-KE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      {inv.currency}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 shrink-0 px-2 py-0.5 rounded-lg bg-neutral-100">
                    {inv.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
