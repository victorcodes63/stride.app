'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarCheck, Users, Loader2 } from 'lucide-react';
import type { InterviewType, InterviewDurationMinutes } from '@/types/dashboard';
import type { ApplicationWithDetails } from '@/types/dashboard';

const DURATION_OPTIONS: { value: InterviewDurationMinutes; label: string }[] = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hr' },
];

const MAX_BULK = 10;

export default function ScheduleInterviewsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<{ id: string; title: string }[]>([]);
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [shortlistedApps, setShortlistedApps] = useState<ApplicationWithDetails[]>([]);
  const [shortlistedLoading, setShortlistedLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [bulkFormError, setBulkFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    applicationId: '',
    scheduledAt: '',
    durationMinutes: 45 as InterviewDurationMinutes,
    type: 'video' as InterviewType,
    locationOrLink: '',
    notes: '',
  });

  const [bulkJobId, setBulkJobId] = useState('');
  const [bulkDate, setBulkDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [bulkStartTime, setBulkStartTime] = useState('09:00');
  const [bulkDuration, setBulkDuration] = useState<InterviewDurationMinutes>(45);
  const [bulkType, setBulkType] = useState<InterviewType>('video');
  const [bulkLocation, setBulkLocation] = useState('');
  const [bulkSelectedAppIds, setBulkSelectedAppIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setForm((f) => ({ ...f, scheduledAt: now.toISOString().slice(0, 16) }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/jobs')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setJobs(data.map((j: { id: string; title: string }) => ({ id: j.id, title: j.title })));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setApplicationsLoading(true);
    fetch('/api/applications')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setApplications(Array.isArray(data) ? data : []);
      })
      .catch(() => { if (!cancelled) setApplications([]); })
      .finally(() => { if (!cancelled) setApplicationsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!bulkJobId) {
      setShortlistedApps([]);
      return;
    }
    setShortlistedLoading(true);
    fetch(`/api/applications?jobId=${encodeURIComponent(bulkJobId)}&status=shortlisted`)
      .then((r) => r.json())
      .then((data) => {
        setShortlistedApps(Array.isArray(data) ? data : []);
        setBulkSelectedAppIds(new Set());
      })
      .catch(() => setShortlistedApps([]))
      .finally(() => setShortlistedLoading(false));
  }, [bulkJobId]);

  const toggleBulkApp = (appId: string) => {
    setBulkSelectedAppIds((prev) => {
      const next = new Set(prev);
      if (next.has(appId)) next.delete(appId);
      else if (next.size < MAX_BULK) next.add(appId);
      return next;
    });
  };

  const handleSubmitSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.applicationId.trim()) {
      setFormError('Please select an application.');
      return;
    }
    const scheduledAt = new Date(form.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) {
      setFormError('Please set a valid date and time.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: form.applicationId,
          scheduledAt: scheduledAt.toISOString(),
          durationMinutes: form.durationMinutes,
          type: form.type,
          locationOrLink: form.locationOrLink.trim() || undefined,
          notes: form.notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to create interview.');
        return;
      }
      router.push('/dashboard/interviews');
      router.refresh();
    } catch {
      setFormError('Failed to create interview.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkFormError(null);
    if (!bulkJobId.trim()) {
      setBulkFormError('Select a job.');
      return;
    }
    if (bulkSelectedAppIds.size === 0) {
      setBulkFormError('Select at least one application (max 10).');
      return;
    }
    setBulkSubmitting(true);
    try {
      const res = await fetch('/api/interviews/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: bulkJobId,
          date: bulkDate,
          startTime: bulkStartTime,
          durationMinutes: bulkDuration,
          type: bulkType,
          applicationIds: Array.from(bulkSelectedAppIds),
          locationOrLink: bulkLocation.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBulkFormError(data.error || 'Failed to create interviews.');
        return;
      }
      router.push('/dashboard/interviews');
      router.refresh();
    } catch {
      setBulkFormError('Failed to create interviews.');
    } finally {
      setBulkSubmitting(false);
    }
  };

  const inputClass = 'w-full min-w-0 px-4 py-2.5 sm:py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base';

  return (
    <div className="w-full min-w-0">
      <nav className="mb-4 sm:mb-5" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm text-neutral-500">
          <li>
            <Link href="/dashboard/interviews" className="hover:text-primary-700 transition-colors">
              Interview management
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-primary-900 font-medium" aria-current="page">
            Schedule interviews
          </li>
        </ol>
      </nav>

      <div className="mb-6 sm:mb-8 w-full min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-1">
          Schedule interviews
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base w-full">
          Bulk schedule up to 10 interviews from a shortlisted job, or add a single interview. Times are auto-spaced for bulk.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Bulk schedule (max 10) */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
          <h2 className="text-base sm:text-lg font-semibold text-primary-900 flex items-center gap-2">
            <Users className="w-5 h-5 shrink-0" />
            Bulk schedule (max 10)
          </h2>
          <form onSubmit={handleBulkCreate} className="space-y-5 sm:space-y-6">
            {bulkFormError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {bulkFormError}
              </div>
            )}
            <div>
              <label htmlFor="bulk-job" className="block text-sm font-medium text-primary-900 mb-2">
                Job <span className="text-red-600">*</span>
              </label>
              <select
                id="bulk-job"
                value={bulkJobId}
                onChange={(e) => setBulkJobId(e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select job</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="min-w-0">
                <label htmlFor="bulk-date" className="block text-sm font-medium text-primary-900 mb-2">
                  Date <span className="text-red-600">*</span>
                </label>
                <input
                  id="bulk-date"
                  type="date"
                  value={bulkDate}
                  onChange={(e) => setBulkDate(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="min-w-0">
                <label htmlFor="bulk-time" className="block text-sm font-medium text-primary-900 mb-2">
                  Start time
                </label>
                <input
                  id="bulk-time"
                  type="time"
                  value={bulkStartTime}
                  onChange={(e) => setBulkStartTime(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="min-w-0">
                <label htmlFor="bulk-duration" className="block text-sm font-medium text-primary-900 mb-2">
                  Duration
                </label>
                <select
                  id="bulk-duration"
                  value={bulkDuration}
                  onChange={(e) => setBulkDuration(Number(e.target.value) as InterviewDurationMinutes)}
                  className={inputClass}
                >
                  {DURATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-0">
                <label htmlFor="bulk-type" className="block text-sm font-medium text-primary-900 mb-2">
                  Type
                </label>
                <select
                  id="bulk-type"
                  value={bulkType}
                  onChange={(e) => setBulkType(e.target.value as InterviewType)}
                  className={inputClass}
                >
                  <option value="phone">Phone</option>
                  <option value="video">Video</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="bulk-location" className="block text-sm font-medium text-primary-900 mb-2">
                Location / link (optional)
              </label>
              <input
                id="bulk-location"
                type="text"
                value={bulkLocation}
                onChange={(e) => setBulkLocation(e.target.value)}
                placeholder="e.g. Zoom link or office address"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Shortlisted candidates (select up to 10)
              </label>
              {shortlistedLoading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
              ) : shortlistedApps.length === 0 ? (
                <p className="text-sm text-neutral-500">Select a job with shortlisted applications.</p>
              ) : (
                <ul className="border border-neutral-200 rounded-lg divide-y divide-neutral-100 max-h-52 overflow-y-auto">
                  {shortlistedApps.map((app) => (
                    <li key={app.id} className="flex items-center gap-2 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={bulkSelectedAppIds.has(app.id)}
                        onChange={() => toggleBulkApp(app.id)}
                        disabled={!bulkSelectedAppIds.has(app.id) && bulkSelectedAppIds.size >= MAX_BULK}
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-900">
                        {app.candidate.firstName} {app.candidate.lastName}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {bulkSelectedAppIds.size > 0 && (
                <p className="mt-1 text-xs text-neutral-500">{bulkSelectedAppIds.size} selected (max {MAX_BULK})</p>
              )}
            </div>
            <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-neutral-200 flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-3 sm:gap-4">
              <Link
                href="/dashboard/interviews"
                className="w-full sm:w-auto order-2 sm:order-1 px-6 py-3 min-h-[44px] sm:min-h-0 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors inline-flex items-center justify-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={bulkSubmitting || bulkSelectedAppIds.size === 0}
                className="w-full sm:w-auto order-1 sm:order-2 px-6 py-3 min-h-[44px] sm:min-h-0 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
              >
                {bulkSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {bulkSubmitting ? 'Adding…' : `Add ${bulkSelectedAppIds.size} interview(s)`}
              </button>
            </div>
          </form>
        </div>

        {/* Add single interview */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
          <h2 className="text-base sm:text-lg font-semibold text-primary-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 shrink-0" />
            Add single interview
          </h2>
          <form onSubmit={handleSubmitSingle} className="space-y-5 sm:space-y-6">
            {formError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {formError}
              </div>
            )}
            <div>
              <label htmlFor="single-application" className="block text-sm font-medium text-primary-900 mb-2">
                Application (candidate – job) <span className="text-red-600">*</span>
              </label>
              <select
                id="single-application"
                value={form.applicationId}
                onChange={(e) => setForm((f) => ({ ...f, applicationId: e.target.value }))}
                className={inputClass}
                required
                disabled={applicationsLoading}
              >
                <option value="">Select application</option>
                {applications.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.candidate.firstName} {a.candidate.lastName} – {a.job.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="single-datetime" className="block text-sm font-medium text-primary-900 mb-2">
                Date & time <span className="text-red-600">*</span>
              </label>
              <input
                id="single-datetime"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="min-w-0">
                <label htmlFor="single-duration" className="block text-sm font-medium text-primary-900 mb-2">
                  Duration
                </label>
                <select
                  id="single-duration"
                  value={form.durationMinutes}
                  onChange={(e) => setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) as InterviewDurationMinutes }))}
                  className={inputClass}
                >
                  {DURATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-0">
                <label htmlFor="single-type" className="block text-sm font-medium text-primary-900 mb-2">
                  Type
                </label>
                <select
                  id="single-type"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as InterviewType }))}
                  className={inputClass}
                >
                  <option value="phone">Phone</option>
                  <option value="video">Video</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="single-location" className="block text-sm font-medium text-primary-900 mb-2">
                Location or meeting link (optional)
              </label>
              <input
                id="single-location"
                type="text"
                value={form.locationOrLink}
                onChange={(e) => setForm((f) => ({ ...f, locationOrLink: e.target.value }))}
                placeholder="e.g. Zoom link or office address"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="single-notes" className="block text-sm font-medium text-primary-900 mb-2">
                Notes (optional)
              </label>
              <textarea
                id="single-notes"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </div>
            <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-neutral-200 flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-3 sm:gap-4">
              <Link
                href="/dashboard/interviews"
                className="w-full sm:w-auto order-2 sm:order-1 px-6 py-3 min-h-[44px] sm:min-h-0 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors inline-flex items-center justify-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto order-1 sm:order-2 px-6 py-3 min-h-[44px] sm:min-h-0 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submitting ? 'Scheduling…' : 'Schedule interview'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
