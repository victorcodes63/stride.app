'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CalendarCheck, Plus, X, Loader2 } from 'lucide-react';
import type { InterviewWithDetails, InterviewStatus, InterviewType } from '@/types/dashboard';
import type { ApplicationWithDetails } from '@/types/dashboard';

const TYPE_LABELS: Record<InterviewType, string> = {
  phone: 'Phone',
  video: 'Video',
  onsite: 'On-site',
};

const STATUS_STYLES: Record<InterviewStatus, string> = {
  scheduled: 'bg-indigo-50 text-indigo-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-neutral-100 text-neutral-600',
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function DashboardInterviewsPage() {
  const [interviews, setInterviews] = useState<InterviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    applicationId: '',
    scheduledAt: '',
    type: 'video' as InterviewType,
    locationOrLink: '',
    notes: '',
  });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/interviews')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setInterviews(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load interviews.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!scheduleOpen) return;
    setApplicationsLoading(true);
    fetch('/api/applications')
      .then((r) => r.json())
      .then((data) => {
        setApplications(Array.isArray(data) ? data : []);
      })
      .catch(() => setApplications([]))
      .finally(() => setApplicationsLoading(false));
  }, [scheduleOpen]);

  const handleOpenSchedule = () => {
    setFormError(null);
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setForm({
      applicationId: '',
      scheduledAt: now.toISOString().slice(0, 16),
      type: 'video',
      locationOrLink: '',
      notes: '',
    });
    setScheduleOpen(true);
  };

  const handleSubmitSchedule = async (e: React.FormEvent) => {
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
      setInterviews((prev) => [...prev, data].sort(
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      ));
      setScheduleOpen(false);
    } catch {
      setFormError('Failed to create interview.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-1">
            Interview management
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base">
            Schedule and manage interviews for candidates.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenSchedule}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm font-medium shrink-0"
        >
          <Plus className="w-4 h-4" />
          Schedule interview
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && interviews.length === 0 && (
        <motion.div
          className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 sm:p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <CalendarCheck className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 text-sm sm:text-base mb-4">
            No interviews scheduled. Schedule one from an application.
          </p>
          <button
            type="button"
            onClick={handleOpenSchedule}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Schedule interview
          </button>
        </motion.div>
      )}

      {!loading && !error && interviews.length > 0 && (
        <motion.div
          className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80">
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Date & time
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Job
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Location / link
                  </th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((i) => (
                  <tr key={i.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                    <td className="px-4 py-3 text-sm text-neutral-900 whitespace-nowrap">
                      {formatDateTime(i.scheduledAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900">
                      {i.application.candidate.firstName} {i.application.candidate.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700">
                      {i.application.job.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700 capitalize">
                      {TYPE_LABELS[i.type]}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_STYLES[i.status]}`}
                      >
                        {i.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 max-w-[200px] truncate">
                      {i.locationOrLink || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {scheduleOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !submitting && setScheduleOpen(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-primary-900">Schedule interview</h2>
                <button
                  type="button"
                  onClick={() => !submitting && setScheduleOpen(false)}
                  className="p-1 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmitSchedule} className="p-4 space-y-4">
                {formError && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Application (candidate – job)
                  </label>
                  <select
                    value={form.applicationId}
                    onChange={(e) => setForm((f) => ({ ...f, applicationId: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
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
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Date & time
                  </label>
                  <input
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, type: e.target.value as InterviewType }))
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    <option value="phone">Phone</option>
                    <option value="video">Video</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Location or meeting link (optional)
                  </label>
                  <input
                    type="text"
                    value={form.locationOrLink}
                    onChange={(e) => setForm((f) => ({ ...f, locationOrLink: e.target.value }))}
                    placeholder="e.g. Zoom link or office address"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => !submitting && setScheduleOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium inline-flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      'Schedule'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
