'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function fetchClient() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/clients/${id}`);
        if (!res.ok) throw new Error('Failed to load client');
        const data = await res.json();
        if (!cancelled) {
          setName(data.name ?? '');
          setIsAnonymous(data.isAnonymous ?? false);
          setContactName(data.contactName ?? '');
          setContactEmail(data.contactEmail ?? '');
          setContactPhone(data.contactPhone ?? '');
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load client');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchClient();
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    setSubmitting(true);
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Client name is required.');
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmed,
          isAnonymous,
          contactName: contactName.trim() || null,
          contactEmail: contactEmail.trim() || null,
          contactPhone: contactPhone.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to update client.');
        setSubmitting(false);
        return;
      }
      router.push('/dashboard/clients');
      router.refresh();
    } catch (err) {
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
            <Link href="/dashboard/clients" className="hover:text-primary-700 transition-colors">
              Clients
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-primary-900 font-medium" aria-current="page">Edit client</li>
        </ol>
      </nav>
      <div className="mb-6 sm:mb-8 w-full min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-1">Edit client</h1>
        <p className="text-neutral-600 text-sm sm:text-base w-full">
          Update the company name or whether jobs are shown as anonymous on the job board.
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
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full min-w-0 px-4 py-2.5 sm:py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
            />
          </div>
          <div className="flex items-start gap-3">
            <input
              id="isAnonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="isAnonymous" className="text-sm text-neutral-700">
              <span className="font-medium text-primary-900">List jobs as anonymous</span>
              <span className="block mt-0.5 text-neutral-600">
                When checked, the job board shows &quot;Confidential&quot; instead of this company name for jobs tied to this client.
              </span>
            </label>
          </div>

          <div className="border-t border-neutral-100 pt-5 sm:pt-6">
            <h2 className="text-base sm:text-lg font-semibold text-primary-900 mb-3 sm:mb-4">Contact person</h2>
            <p className="text-sm text-neutral-600 mb-4">
              Primary contact at this company (optional). Used for internal reference and outreach.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="sm:col-span-2 lg:col-span-1">
                <label htmlFor="contactName" className="block text-sm font-medium text-primary-900 mb-2">
                  Contact name
                </label>
                <input
                  id="contactName"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full min-w-0 px-4 py-2.5 sm:py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-primary-900 mb-2">
                  Email
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. jane@company.com"
                  className="w-full min-w-0 px-4 py-2.5 sm:py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-primary-900 mb-2">
                  Phone
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +254 700 123 456"
                  className="w-full min-w-0 px-4 py-2.5 sm:py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-neutral-200 flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard/clients"
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
