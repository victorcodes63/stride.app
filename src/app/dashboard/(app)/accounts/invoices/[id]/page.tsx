'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Loader2, AlertCircle, Printer, Download, Eye } from 'lucide-react';
import {
  InvoiceBankDisplay,
  InvoicePaymentBankSelect,
} from '@/components/accounts/InvoiceBankPanel';
import type { InvoicePaymentBankKind } from '@/lib/eagle-hr-bank-accounts';

type Line = {
  id: string;
  lineNo: number;
  item: string;
  description: string | null;
  amountExVat: string;
};

type InvoiceDetail = {
  id: string;
  invoiceNumber: number;
  clientName: string;
  issueDate: string;
  dueDate: string | null;
  currency: string;
  vatRateBps: number;
  status: string;
  paymentBank: InvoicePaymentBankKind;
  notes: string | null;
  subtotalExVat: number;
  vatAmount: number;
  totalIncVat: number;
  lines: Line[];
};

function money(n: number, currency: string) {
  return `${n.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export default function AccountsInvoiceDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const [data, setData] = useState<InvoiceDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingBank, setSavingBank] = useState(false);

  const load = useCallback(() => {
    if (!id) return Promise.resolve();
    return fetch(`/api/accounts/invoices/${id}`)
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || `Failed (${r.status})`);
        return j as InvoiceDetail;
      })
      .then((inv) => {
        setData(inv);
        setError(null);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load');
        setData(null);
      });
  }, [id]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Invalid invoice');
      return;
    }
    let cancelled = false;
    setLoading(true);
    load().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id, load]);

  const setPaymentBank = async (paymentBank: InvoicePaymentBankKind) => {
    if (!id || !data) return;
    setSavingBank(true);
    try {
      const r = await fetch(`/api/accounts/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentBank }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Could not update');
      setData((prev) => (prev ? { ...prev, paymentBank } : prev));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setSavingBank(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-neutral-600 py-12">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading invoice…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full min-w-0">
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
            <li>
              <Link href="/dashboard/accounts" className="hover:text-primary-700 transition-colors">
                Accounts
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/dashboard/accounts/invoices" className="hover:text-primary-700 transition-colors">
                Invoices
              </Link>
            </li>
          </ol>
        </nav>
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 flex gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error || 'Not found'}
        </div>
      </div>
    );
  }

  const vatPct = data.vatRateBps / 100;

  return (
    <div className="w-full min-w-0">
      <div className="print:hidden mb-6 space-y-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
            <li>
              <Link href="/dashboard/accounts" className="hover:text-primary-700 transition-colors">
                Accounts
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/dashboard/accounts/invoices" className="hover:text-primary-700 transition-colors">
                Invoices
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-primary-900 font-medium" aria-current="page">
              Invoice #{data.invoiceNumber}
            </li>
          </ol>
        </nav>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-900 text-white text-sm font-medium hover:bg-primary-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
          <a
            href={`/api/accounts/invoices/${id}/pdf?disposition=inline`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 bg-white text-sm font-medium text-neutral-800 hover:bg-neutral-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview PDF
          </a>
          <a
            href={`/api/accounts/invoices/${id}/pdf`}
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 bg-white text-sm font-medium text-neutral-800 hover:bg-neutral-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>
        <InvoicePaymentBankSelect
          value={data.paymentBank}
          onChange={setPaymentBank}
          saving={savingBank}
        />
      </div>

      {/* Print: full width between @page margins (0.5in L/R in globals.css); screen: full layout width */}
      <div className="w-full print:max-w-none print:w-full print:mx-0">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden print:shadow-none print:border print:border-neutral-300 print:rounded-none print:[print-color-adjust:exact]">
        <div className="px-6 sm:px-8 pt-6 sm:pt-8 print:px-7 print:pt-5">
          <div
            className="h-[3px] w-full bg-primary-900 mb-6 print:mb-5 rounded-sm print:h-[3px] print:min-h-[3px] print:bg-[#043d4a]"
            aria-hidden
          />
          <div className="flex items-center mb-8 print:mb-7">
            <Image
              src="/images/logo/logo_dark_ubxaCll.png"
              alt="Eagle HR Consultants"
              width={180}
              height={54}
              className="h-11 w-auto max-w-[10rem] sm:max-w-[11rem] object-contain object-left"
              priority
            />
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-8 sm:pb-10 print:px-7 print:pb-6 space-y-8 sm:space-y-10 print:space-y-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 lg:gap-12">
            <div className="min-w-0 lg:max-w-[55%]">
              <h1 className="text-xl sm:text-2xl font-bold text-primary-900 tracking-tight print:text-[18pt]">
                TAX INVOICE
              </h1>
              <div className="mt-8 sm:mt-10 print:mt-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">Invoice to</p>
                <p className="text-base sm:text-lg font-semibold text-primary-900 leading-snug">{data.clientName}</p>
              </div>
            </div>
            <div className="w-full lg:w-auto lg:min-w-[240px] shrink-0">
              <dl className="space-y-3 text-sm print:text-[10px]">
                <div className="flex justify-between gap-6 border-b border-transparent">
                  <dt className="text-neutral-500">Invoice no.</dt>
                  <dd className="font-semibold text-primary-900 tabular-nums text-right">{data.invoiceNumber}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-neutral-500">Issue date</dt>
                  <dd className="text-neutral-800 tabular-nums text-right">{data.issueDate}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-neutral-500">Due date</dt>
                  <dd className="text-neutral-800 tabular-nums text-right">{data.dueDate ?? '—'}</dd>
                </div>
              </dl>
            </div>
          </div>

          {data.notes?.trim() ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Notes</p>
              <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">{data.notes.trim()}</p>
            </div>
          ) : null}

          <section>
            <h2 className="text-sm font-bold text-primary-900 mb-4 sm:mb-5 print:text-xs print:mb-4">Line items</h2>
            <div className="border border-neutral-200 rounded-lg overflow-hidden print:border-neutral-300 print:rounded-sm">
              <table className="w-full text-sm print:text-[9px] table-fixed">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-600 print:bg-neutral-200 print:border-neutral-300">
                    <th className="py-3 px-3 font-semibold w-11 text-left">#</th>
                    <th className="py-3 px-3 font-semibold text-left">Description</th>
                    <th className="py-3 px-3 font-semibold text-right whitespace-nowrap w-[30%]">
                      Amount ({data.currency})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.lines.map((l) => (
                    <tr key={l.id} className="border-b border-neutral-100 last:border-b-0 print:border-neutral-200">
                      <td className="py-4 px-3 align-middle text-neutral-600 tabular-nums text-left">{l.lineNo}</td>
                      <td className="py-4 px-3 align-middle text-left">
                        <span className="font-semibold text-neutral-900 block">{l.item}</span>
                        {l.description?.trim() ? (
                          <span className="block text-neutral-600 text-xs sm:text-sm mt-1.5 leading-snug">
                            {l.description.trim()}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-4 px-3 align-middle text-right tabular-nums text-neutral-800 font-medium">
                        {Number(l.amountExVat).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start print:gap-8">
            <div className="order-2 lg:order-1 print:order-1">
              <InvoiceBankDisplay kind={data.paymentBank} />
            </div>
            <div className="order-1 lg:order-2 print:order-2 lg:justify-self-end w-full lg:max-w-sm">
              <div className="border border-neutral-200 rounded-lg p-5 sm:p-6 print:border-neutral-300 print:p-4 bg-white">
                <h2 className="text-sm font-bold text-primary-900 mb-4 print:text-xs print:mb-3">Summary</h2>
                <table className="w-full text-sm print:text-[9px]">
                  <tbody>
                    <tr>
                      <td className="py-2 pr-4 text-left text-neutral-700">Subtotal (ex-VAT)</td>
                      <td className="py-2 text-right tabular-nums font-medium text-neutral-900">
                        {money(data.subtotalExVat, data.currency)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-left text-neutral-700">VAT ({vatPct.toFixed(0)}%)</td>
                      <td className="py-2 text-right tabular-nums text-neutral-800">
                        {money(data.vatAmount, data.currency)}
                      </td>
                    </tr>
                    <tr className="border-t border-neutral-200 print:border-neutral-300">
                      <td className="py-3 pr-4 text-left font-semibold text-primary-900">Total (incl. VAT)</td>
                      <td className="py-3 text-right tabular-nums font-bold text-primary-900 text-base print:text-[10px]">
                        {money(data.totalIncVat, data.currency)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
