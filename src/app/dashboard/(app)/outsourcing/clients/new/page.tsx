'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2 } from 'lucide-react';

const inputClass =
  'w-full min-w-0 px-4 py-2.5 sm:py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base';

export default function NewOutsourcingClientPage() {
  const router = useRouter();
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
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** True when user chose "Other" for payment terms so the text field stays visible */
  const [paymentTermsOther, setPaymentTermsOther] = useState(false);
  const PAYMENT_PRESETS = ['Net 15', 'Net 30', 'Net 45', 'Due on receipt', 'Monthly in advance'] as const;

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    };
    try {
      const res = await fetch('/api/outsourcing/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to create client.');
        setSubmitting(false);
        return;
      }
      const newId = typeof data.id === 'string' ? data.id : null;
      if (newId) {
        router.push(`/dashboard/outsourcing/clients/${newId}?welcome=1`);
      } else {
        router.push('/dashboard/outsourcing/clients');
      }
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <nav className="mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm text-neutral-500">
          <li>
            <Link href="/dashboard/outsourcing/clients" className="hover:text-primary-700">
              Outsourcing clients
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-neutral-900 font-medium">Add client</li>
        </ol>
      </nav>

      {/* Full-width hero across the content area (matches two-column form width below) */}
      <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-primary-50/60 to-white p-6 sm:p-8 mb-6 shadow-sm w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10">
          <div className="flex items-start gap-4 min-w-0">
            <div className="rounded-xl bg-primary-900 text-white p-3 shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Add outsourcing client</h1>
              <p className="text-neutral-600 text-sm mt-2 leading-relaxed lg:max-w-none">
                Only the company name is required. After saving, you’ll land on the client page to add
                departments and employees.
              </p>
            </div>
          </div>
          <div className="lg:shrink-0 lg:text-right lg:max-w-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-800/80">
              Next after save
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              Add departments, then employees or Excel import—IDs use your optional prefix (e.g. BW-001).
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">{error}</div>
        )}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 sm:p-6 lg:p-8 space-y-8">
          {/* Row 1: identity + contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-2">
                Company
              </h2>
              <div>
            <label htmlFor="name" className="block text-sm font-semibold text-neutral-900 mb-2">
              Client / company name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={update('name')}
              placeholder="e.g. ABC Healthcare Ltd"
              required
              className={inputClass}
            />
              </div>
              <div>
            <label htmlFor="employeeNumberPrefix" className="block text-sm font-semibold text-neutral-900 mb-2">
              Employee ID prefix <span className="text-neutral-400 font-normal">(optional)</span>
            </label>
            <input
              id="employeeNumberPrefix"
              type="text"
              value={form.employeeNumberPrefix}
              onChange={update('employeeNumberPrefix')}
              placeholder="e.g. BW → employees BW-001, BW-002"
              maxLength={8}
              className={inputClass}
            />
            <p className="text-xs text-neutral-500 mt-1.5">
              If empty, we derive from the company name (e.g. Apex Healthcare Group → <strong>AHG</strong>). Set{' '}
              <strong>BW</strong> for Blue Wave–style IDs.
            </p>
              </div>
            </div>

            <div className="space-y-5 lg:border-l lg:border-neutral-100 lg:pl-10">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-2">
                Contact person
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-neutral-800 mb-2">Contact name</label>
                  <input id="contactName" type="text" value={form.contactName} onChange={update('contactName')} placeholder="e.g. Jane Doe" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-neutral-800 mb-2">Email</label>
                  <input id="contactEmail" type="email" value={form.contactEmail} onChange={update('contactEmail')} placeholder="e.g. jane@company.com" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-neutral-800 mb-2">Phone</label>
                  <input id="contactPhone" type="tel" value={form.contactPhone} onChange={update('contactPhone')} placeholder="e.g. +254 700 123 456" className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: tax | banking (two columns on lg+) */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">
              Tax, banking & billing <span className="font-normal text-neutral-400">(optional)</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 sm:p-5 space-y-4">
                <p className="text-sm font-semibold text-neutral-800">Tax & registration (Kenya)</p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="kraPin" className="block text-sm font-medium text-neutral-700 mb-1.5">KRA PIN</label>
                    <input id="kraPin" type="text" value={form.kraPin} onChange={update('kraPin')} placeholder="e.g. P051234567X" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="nssfEmployerNumber" className="block text-sm font-medium text-neutral-700 mb-1.5">NSSF employer no.</label>
                    <input id="nssfEmployerNumber" type="text" value={form.nssfEmployerNumber} onChange={update('nssfEmployerNumber')} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="nhifEmployerNumber" className="block text-sm font-medium text-neutral-700 mb-1.5">NHIF employer no.</label>
                    <input id="nhifEmployerNumber" type="text" value={form.nhifEmployerNumber} onChange={update('nhifEmployerNumber')} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-neutral-700 mb-1.5">Company registration no.</label>
                    <input id="companyRegistrationNumber" type="text" value={form.companyRegistrationNumber} onChange={update('companyRegistrationNumber')} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="vatNumber" className="block text-sm font-medium text-neutral-700 mb-1.5">VAT number</label>
                    <input id="vatNumber" type="text" value={form.vatNumber} onChange={update('vatNumber')} className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 sm:p-5 space-y-4">
                <p className="text-sm font-semibold text-neutral-800">Banking & billing</p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-neutral-700 mb-1.5">Bank name</label>
                    <input id="bankName" type="text" value={form.bankName} onChange={update('bankName')} placeholder="e.g. KCB Bank" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-neutral-700 mb-1.5">Account no.</label>
                      <input id="bankAccountNumber" type="text" value={form.bankAccountNumber} onChange={update('bankAccountNumber')} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="bankBranch" className="block text-sm font-medium text-neutral-700 mb-1.5">Branch</label>
                      <input id="bankBranch" type="text" value={form.bankBranch} onChange={update('bankBranch')} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bankSwiftCode" className="block text-sm font-medium text-neutral-700 mb-1.5">Swift / BIC</label>
                    <input id="bankSwiftCode" type="text" value={form.bankSwiftCode} onChange={update('bankSwiftCode')} placeholder="e.g. KCBLKENX" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-neutral-700 mb-1.5">Currency</label>
                      <select id="currency" value={form.currency} onChange={update('currency')} className={inputClass}>
                        <option value="KES">KES</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="billingCycle" className="block text-sm font-medium text-neutral-700 mb-1.5">Billing cycle</label>
                      <select id="billingCycle" value={form.billingCycle} onChange={update('billingCycle')} className={inputClass}>
                        <option value="">—</option>
                        <option value="weekly">Weekly</option>
                        <option value="bi_weekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                  <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Outsourcing fee <span className="font-normal normal-case text-neutral-400">(optional)</span>
                    </p>
                    <div>
                      <label htmlFor="serviceFeeType" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        How do you charge this client?
                      </label>
                      <select
                        id="serviceFeeType"
                        value={form.serviceFeeType}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((f) => ({
                            ...f,
                            serviceFeeType: v,
                            ...(v === '' ? { serviceFeeAmount: '' } : {}),
                          }));
                        }}
                        className={inputClass}
                      >
                        <option value="">Select fee type…</option>
                        <option value="fixed">Fixed amount — one fee per billing period</option>
                        <option value="percentage">Percentage — % of agreed base (e.g. payroll)</option>
                        <option value="per_employee">Per employee — fee per person per period</option>
                      </select>
                    </div>
                    {form.serviceFeeType === 'fixed' && (
                      <div>
                        <label htmlFor="serviceFeeAmount" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Amount per billing period ({form.currency})
                        </label>
                        <input
                          id="serviceFeeAmount"
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.serviceFeeAmount}
                          onChange={update('serviceFeeAmount')}
                          placeholder="e.g. 50000"
                          className={inputClass}
                        />
                        <p className="text-xs text-neutral-500 mt-1">Flat fee each cycle (matches billing cycle above).</p>
                      </div>
                    )}
                    {form.serviceFeeType === 'percentage' && (
                      <div>
                        <label htmlFor="serviceFeeAmount" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Percentage (%)
                        </label>
                        <input
                          id="serviceFeeAmount"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={form.serviceFeeAmount}
                          onChange={update('serviceFeeAmount')}
                          placeholder="e.g. 2.5"
                          className={inputClass}
                        />
                        <p className="text-xs text-neutral-500 mt-1">Agree separately what the % applies to.</p>
                      </div>
                    )}
                    {form.serviceFeeType === 'per_employee' && (
                      <div>
                        <label htmlFor="serviceFeeAmount" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Amount per employee per period ({form.currency})
                        </label>
                        <input
                          id="serviceFeeAmount"
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.serviceFeeAmount}
                          onChange={update('serviceFeeAmount')}
                          placeholder="e.g. 2500"
                          className={inputClass}
                        />
                      </div>
                    )}
                    <div>
                      <label htmlFor="paymentTermsSelect" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Payment terms — when this client pays you
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
                        <option value="Net 15">Net 15 — due 15 days after invoice</option>
                        <option value="Net 30">Net 30 — due 30 days after invoice</option>
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
                          placeholder="e.g. Net 60, 50% on signing…"
                          className={`${inputClass} mt-2`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: address & contract full width */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 space-y-4">
            <p className="text-sm font-semibold text-neutral-800">Address & contract</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="postalAddress" className="block text-sm font-medium text-neutral-700 mb-1.5">Postal address</label>
                <input id="postalAddress" type="text" value={form.postalAddress} onChange={update('postalAddress')} placeholder="P.O. Box 12345, Nairobi" className={inputClass} />
              </div>
              <div>
                <label htmlFor="county" className="block text-sm font-medium text-neutral-700 mb-1.5">County</label>
                <input id="county" type="text" value={form.county} onChange={update('county')} placeholder="e.g. Nairobi" className={inputClass} />
              </div>
              <div>
                <label htmlFor="contractStartDate" className="block text-sm font-medium text-neutral-700 mb-1.5">Contract start</label>
                <input id="contractStartDate" type="date" value={form.contractStartDate} onChange={update('contractStartDate')} className={inputClass} />
              </div>
              <div>
                <label htmlFor="contractEndDate" className="block text-sm font-medium text-neutral-700 mb-1.5">Contract end</label>
                <input id="contractEndDate" type="date" value={form.contractEndDate} onChange={update('contractEndDate')} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="pt-6 mt-2 border-t border-neutral-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Link
              href="/dashboard/outsourcing/clients"
              className="inline-flex justify-center px-6 py-3 border border-neutral-300 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex justify-center px-6 py-3 bg-primary-900 text-white rounded-xl font-semibold hover:bg-primary-800 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save & open client'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
