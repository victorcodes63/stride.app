'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

const inputClass =
  'w-full min-w-0 px-4 py-2.5 sm:py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base';

export default function EditOutsourcingClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [form, setForm] = useState({
    name: '',
    employeeNumberPrefix: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    kraPin: '',
    nssfEmployerNumber: '',
    nhifEmployerNumber: '',
    companyRegistrationNumber: '',
    vatNumber: '',
    bankName: '',
    bankAccountNumber: '',
    bankBranch: '',
    bankSwiftCode: '',
    currency: 'KES',
    billingCycle: '',
    serviceFeeType: '',
    serviceFeeAmount: '',
    paymentTerms: '',
    postalAddress: '',
    county: '',
    contractStartDate: '',
    contractEndDate: '',
    payrollFrequency: 'monthly',
    leavePayMode: 'none',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentTermsOther, setPaymentTermsOther] = useState(false);
  const PAYMENT_PRESETS = ['Net 15', 'Net 30', 'Net 45', 'Due on receipt', 'Monthly in advance'] as const;

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function fetchClient() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/outsourcing/clients/${id}`);
        if (!res.ok) throw new Error('Failed to load client');
        const data = await res.json();
        if (!cancelled) {
          setForm({
            name: data.name ?? '',
            employeeNumberPrefix: data.employeeNumberPrefix ?? '',
            contactName: data.contactName ?? '',
            contactEmail: data.contactEmail ?? '',
            contactPhone: data.contactPhone ?? '',
            kraPin: data.kraPin ?? '',
            nssfEmployerNumber: data.nssfEmployerNumber ?? '',
            nhifEmployerNumber: data.nhifEmployerNumber ?? '',
            companyRegistrationNumber: data.companyRegistrationNumber ?? '',
            vatNumber: data.vatNumber ?? '',
            bankName: data.bankName ?? '',
            bankAccountNumber: data.bankAccountNumber ?? '',
            bankBranch: data.bankBranch ?? '',
            bankSwiftCode: data.bankSwiftCode ?? '',
            currency: data.currency ?? 'KES',
            billingCycle: data.billingCycle ?? '',
            serviceFeeType: data.serviceFeeType ?? '',
            serviceFeeAmount: data.serviceFeeAmount ?? '',
            paymentTerms: data.paymentTerms ?? '',
            postalAddress: data.postalAddress ?? '',
            county: data.county ?? '',
            contractStartDate: data.contractStartDate ?? '',
            contractEndDate: data.contractEndDate ?? '',
            payrollFrequency: data.payrollFrequency ?? 'monthly',
            leavePayMode: data.leavePayMode ?? 'none',
          });
          const pt = (data.paymentTerms ?? '').trim();
          if (
            pt &&
            !PAYMENT_PRESETS.includes(pt as (typeof PAYMENT_PRESETS)[number])
          ) {
            setPaymentTermsOther(true);
          } else {
            setPaymentTermsOther(false);
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load client');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchClient();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    setSubmitting(true);
    const trimmed = form.name.trim();
    if (!trimmed) {
      setError('Client name is required.');
      setSubmitting(false);
      return;
    }
    const payload: Record<string, unknown> = {
      name: trimmed,
      employeeNumberPrefix: form.employeeNumberPrefix.trim() || null,
      contactName: form.contactName.trim() || null,
      contactEmail: form.contactEmail.trim() || null,
      contactPhone: form.contactPhone.trim() || null,
      kraPin: form.kraPin.trim() || null,
      nssfEmployerNumber: form.nssfEmployerNumber.trim() || null,
      nhifEmployerNumber: form.nhifEmployerNumber.trim() || null,
      companyRegistrationNumber: form.companyRegistrationNumber.trim() || null,
      vatNumber: form.vatNumber.trim() || null,
      bankName: form.bankName.trim() || null,
      bankAccountNumber: form.bankAccountNumber.trim() || null,
      bankBranch: form.bankBranch.trim() || null,
      bankSwiftCode: form.bankSwiftCode.trim() || null,
      currency: form.currency.trim() || null,
      billingCycle: form.billingCycle.trim() || null,
      serviceFeeType: form.serviceFeeType.trim() || null,
      serviceFeeAmount: form.serviceFeeAmount.trim() ? parseFloat(form.serviceFeeAmount) : null,
      paymentTerms: form.paymentTerms.trim() || null,
      postalAddress: form.postalAddress.trim() || null,
      county: form.county.trim() || null,
      contractStartDate: form.contractStartDate.trim() || null,
      contractEndDate: form.contractEndDate.trim() || null,
      payrollFrequency: form.payrollFrequency || 'monthly',
      leavePayMode: form.leavePayMode || 'none',
    };
    try {
      const res = await fetch(`/api/outsourcing/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to update client.');
        setSubmitting(false);
        return;
      }
      router.push('/dashboard/outsourcing/clients');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (!id) return null;
  if (loading) {
    return (
      <div className="w-full min-w-0">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-6 bg-neutral-200 rounded w-1/3" />
          <div className="h-10 bg-neutral-100 rounded w-full" />
          <div className="h-10 bg-neutral-100 rounded w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <nav className="mb-4 sm:mb-5" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm text-neutral-500">
          <li>
            <Link href="/dashboard/outsourcing/clients" className="hover:text-primary-700 transition-colors">
              Outsourcing Clients
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-primary-900 font-medium" aria-current="page">
            Edit client
          </li>
        </ol>
      </nav>
      <div className="mb-6 sm:mb-8 w-full min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-1">
          Edit outsourcing client
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base w-full">
          Update company details, tax info, banking, and contract.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6 sm:space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-primary-900 mb-2">
              Client / company name <span className="text-red-600">*</span>
            </label>
            <input id="name" type="text" value={form.name} onChange={update('name')} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="employeeNumberPrefix" className="block text-sm font-medium text-primary-900 mb-2">
              Employee ID prefix (e.g. BW → BW-001)
            </label>
            <input
              id="employeeNumberPrefix"
              type="text"
              value={form.employeeNumberPrefix}
              onChange={update('employeeNumberPrefix')}
              placeholder="Auto from company name if empty"
              maxLength={8}
              className={inputClass}
            />
          </div>

          <div className="border-t border-neutral-100 pt-5 sm:pt-6">
            <h2 className="text-base sm:text-lg font-semibold text-primary-900 mb-3 sm:mb-4">Contact person</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-primary-900 mb-2">Contact name</label>
                <input id="contactName" type="text" value={form.contactName} onChange={update('contactName')} placeholder="e.g. Jane Doe" className={inputClass} />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-primary-900 mb-2">Email</label>
                <input id="contactEmail" type="email" value={form.contactEmail} onChange={update('contactEmail')} placeholder="e.g. jane@company.com" className={inputClass} />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-primary-900 mb-2">Phone</label>
                <input id="contactPhone" type="tel" value={form.contactPhone} onChange={update('contactPhone')} placeholder="e.g. +254 700 123 456" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-5 sm:pt-6">
            <h2 className="text-base sm:text-lg font-semibold text-primary-900 mb-3 sm:mb-4">Tax & registration (Kenya)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label htmlFor="kraPin" className="block text-sm font-medium text-primary-900 mb-2">KRA PIN</label>
                <input id="kraPin" type="text" value={form.kraPin} onChange={update('kraPin')} placeholder="e.g. P051234567X" className={inputClass} />
              </div>
              <div>
                <label htmlFor="nssfEmployerNumber" className="block text-sm font-medium text-primary-900 mb-2">NSSF employer number</label>
                <input id="nssfEmployerNumber" type="text" value={form.nssfEmployerNumber} onChange={update('nssfEmployerNumber')} className={inputClass} />
              </div>
              <div>
                <label htmlFor="nhifEmployerNumber" className="block text-sm font-medium text-primary-900 mb-2">NHIF employer number</label>
                <input id="nhifEmployerNumber" type="text" value={form.nhifEmployerNumber} onChange={update('nhifEmployerNumber')} className={inputClass} />
              </div>
              <div>
                <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-primary-900 mb-2">Company registration number</label>
                <input id="companyRegistrationNumber" type="text" value={form.companyRegistrationNumber} onChange={update('companyRegistrationNumber')} className={inputClass} />
              </div>
              <div>
                <label htmlFor="vatNumber" className="block text-sm font-medium text-primary-900 mb-2">VAT number</label>
                <input id="vatNumber" type="text" value={form.vatNumber} onChange={update('vatNumber')} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-5 sm:pt-6">
            <h2 className="text-base sm:text-lg font-semibold text-primary-900 mb-3 sm:mb-4">Banking & billing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-primary-900 mb-2">Bank name</label>
                <input id="bankName" type="text" value={form.bankName} onChange={update('bankName')} placeholder="e.g. KCB Bank" className={inputClass} />
              </div>
              <div>
                <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-primary-900 mb-2">Account number</label>
                <input id="bankAccountNumber" type="text" value={form.bankAccountNumber} onChange={update('bankAccountNumber')} className={inputClass} />
              </div>
              <div>
                <label htmlFor="bankBranch" className="block text-sm font-medium text-primary-900 mb-2">Branch</label>
                <input id="bankBranch" type="text" value={form.bankBranch} onChange={update('bankBranch')} className={inputClass} />
              </div>
              <div>
                <label htmlFor="bankSwiftCode" className="block text-sm font-medium text-primary-900 mb-2">Swift / BIC code</label>
                <input id="bankSwiftCode" type="text" value={form.bankSwiftCode} onChange={update('bankSwiftCode')} placeholder="e.g. KCBLKENX" className={inputClass} />
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-primary-900 mb-2">Currency</label>
                <select id="currency" value={form.currency} onChange={update('currency')} className={inputClass}>
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <label htmlFor="billingCycle" className="block text-sm font-medium text-primary-900 mb-2">Billing cycle</label>
                <select id="billingCycle" value={form.billingCycle} onChange={update('billingCycle')} className={inputClass}>
                  <option value="">—</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi_weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-3 rounded-lg border border-neutral-200 bg-neutral-50/50 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Outsourcing fee (optional)</p>
                <div>
                  <label htmlFor="serviceFeeType" className="block text-sm font-medium text-primary-900 mb-2">
                    How do you charge this client?
                  </label>
                  <select
                    id="serviceFeeType"
                    value={form.serviceFeeType}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => ({ ...f, serviceFeeType: v, ...(v === '' ? { serviceFeeAmount: '' } : {}) }));
                    }}
                    className={inputClass}
                  >
                    <option value="">Select fee type…</option>
                    <option value="fixed">Fixed amount — one fee per billing period</option>
                    <option value="percentage">Percentage — % of agreed base</option>
                    <option value="per_employee">Per employee — per person per period</option>
                  </select>
                </div>
                {form.serviceFeeType === 'fixed' && (
                  <div>
                    <label htmlFor="serviceFeeAmount" className="block text-sm font-medium text-primary-900 mb-2">
                      Amount per period ({form.currency})
                    </label>
                    <input id="serviceFeeAmount" type="number" step="0.01" min="0" value={form.serviceFeeAmount} onChange={update('serviceFeeAmount')} placeholder="e.g. 50000" className={inputClass} />
                  </div>
                )}
                {form.serviceFeeType === 'percentage' && (
                  <div>
                    <label htmlFor="serviceFeeAmount" className="block text-sm font-medium text-primary-900 mb-2">
                      Percentage (%)
                    </label>
                    <input id="serviceFeeAmount" type="number" step="0.01" min="0" max="100" value={form.serviceFeeAmount} onChange={update('serviceFeeAmount')} placeholder="e.g. 2.5" className={inputClass} />
                  </div>
                )}
                {form.serviceFeeType === 'per_employee' && (
                  <div>
                    <label htmlFor="serviceFeeAmount" className="block text-sm font-medium text-primary-900 mb-2">
                      Per employee ({form.currency})
                    </label>
                    <input id="serviceFeeAmount" type="number" step="0.01" min="0" value={form.serviceFeeAmount} onChange={update('serviceFeeAmount')} placeholder="e.g. 2500" className={inputClass} />
                  </div>
                )}
                <div>
                  <label htmlFor="paymentTermsSelect" className="block text-sm font-medium text-primary-900 mb-2">
                    Payment terms
                  </label>
                  <select
                    id="paymentTermsSelect"
                    value={
                      paymentTermsOther
                        ? '__custom__'
                        : PAYMENT_PRESETS.includes(form.paymentTerms as (typeof PAYMENT_PRESETS)[number])
                          ? form.paymentTerms
                          : ''
                    }
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '__custom__') {
                        setPaymentTermsOther(true);
                        setForm((f) => ({ ...f, paymentTerms: '' }));
                      } else {
                        setPaymentTermsOther(false);
                        setForm((f) => ({ ...f, paymentTerms: v }));
                      }
                    }}
                    className={inputClass}
                  >
                    <option value="">Select terms…</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Due on receipt">Due on receipt</option>
                    <option value="Monthly in advance">Monthly in advance</option>
                    <option value="__custom__">Other — type below</option>
                  </select>
                  {paymentTermsOther && (
                    <input
                      id="paymentTerms"
                      type="text"
                      value={form.paymentTerms}
                      onChange={update('paymentTerms')}
                      placeholder="Custom terms…"
                      className={`${inputClass} mt-2`}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-5 sm:pt-6">
            <h2 className="text-base sm:text-lg font-semibold text-primary-900 mb-3 sm:mb-4">Payroll (outsourced staff)</h2>
            <p className="text-sm text-neutral-600 mb-4">
              How often you run payroll and how leave pay interacts with statutory deductions (varies by client).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label htmlFor="payrollFrequency" className="block text-sm font-medium text-primary-900 mb-2">
                  Payroll frequency
                </label>
                <select
                  id="payrollFrequency"
                  value={form.payrollFrequency}
                  onChange={update('payrollFrequency')}
                  className={inputClass}
                >
                  <option value="monthly">Monthly — one run per month</option>
                  <option value="biweekly">Bi-weekly — two gross amounts per month; statutory on combined gross</option>
                </select>
              </div>
              <div>
                <label htmlFor="leavePayMode" className="block text-sm font-medium text-primary-900 mb-2">
                  Leave pay (earning)
                </label>
                <select
                  id="leavePayMode"
                  value={form.leavePayMode}
                  onChange={update('leavePayMode')}
                  className={inputClass}
                >
                  <option value="none">None — no separate leave pay</option>
                  <option value="paye_only">
                    Client X — Leave pay: NSSF, SHIF & AHL on basic+allowances only (not on leave pay). PAYE uses basic+allowances+leave pay. Net adds leave pay after deductions.
                  </option>
                  <option value="included_in_gross">
                    Client Y — Leave pay in gross first; NSSF, SHIF, AHL & PAYE all on that full total
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-5 sm:pt-6">
            <h2 className="text-base sm:text-lg font-semibold text-primary-900 mb-3 sm:mb-4">Address & contract</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="sm:col-span-2">
                <label htmlFor="postalAddress" className="block text-sm font-medium text-primary-900 mb-2">Postal address</label>
                <input id="postalAddress" type="text" value={form.postalAddress} onChange={update('postalAddress')} placeholder="P.O. Box 12345, Nairobi" className={inputClass} />
              </div>
              <div>
                <label htmlFor="county" className="block text-sm font-medium text-primary-900 mb-2">County</label>
                <input id="county" type="text" value={form.county} onChange={update('county')} placeholder="e.g. Nairobi" className={inputClass} />
              </div>
              <div>
                <label htmlFor="contractStartDate" className="block text-sm font-medium text-primary-900 mb-2">Contract start date</label>
                <input id="contractStartDate" type="date" value={form.contractStartDate} onChange={update('contractStartDate')} className={inputClass} />
              </div>
              <div>
                <label htmlFor="contractEndDate" className="block text-sm font-medium text-primary-900 mb-2">Contract end date</label>
                <input id="contractEndDate" type="date" value={form.contractEndDate} onChange={update('contractEndDate')} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-neutral-200 flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard/outsourcing/clients"
              className="w-full sm:w-auto order-2 sm:order-1 px-6 py-3 min-h-[44px] sm:min-h-0 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors inline-flex items-center justify-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto order-1 sm:order-2 px-6 py-3 min-h-[44px] sm:min-h-0 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
