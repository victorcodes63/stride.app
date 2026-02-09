'use client';

import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  Eye,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  FileText,
  X,
  Building2,
  Calendar,
  ZoomIn,
  ZoomOut,
  FileSpreadsheet,
} from 'lucide-react';
import type { ApplicationWithDetails, ApplicationStatus } from '@/types/dashboard';

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const styles: Record<ApplicationStatus, string> = {
    pending: 'bg-amber-50 text-amber-700',
    reviewed: 'bg-blue-50 text-blue-700',
    shortlisted: 'bg-indigo-50 text-indigo-700',
    rejected: 'bg-red-50 text-red-700',
    hired: 'bg-emerald-50 text-emerald-700',
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

const EDUCATION_LEVEL_OPTIONS = [
  { value: '', label: 'All education levels' },
  { value: 'high_school', label: 'High School' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'masters', label: 'Masters' },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: '', label: 'All employment types' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Freelance', label: 'Freelance' },
];

const STATUS_OPTIONS: { value: 'all' | ApplicationStatus; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hired', label: 'Hired' },
];

type ClientOption = { id: string; name: string };

export default function DashboardApplicationsPage() {
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientFilter, setClientFilter] = useState('');
  const [educationLevelFilter, setEducationLevelFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(
    null
  );
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(
    null
  );
  const [pdfZoom, setPdfZoom] = useState(100);
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/clients')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setClients(data.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (clientFilter.trim()) params.set('clientId', clientFilter.trim());
    if (educationLevelFilter.trim()) params.set('educationLevel', educationLevelFilter.trim());
    if (employmentTypeFilter.trim()) params.set('employmentType', employmentTypeFilter.trim());
    fetch(`/api/applications?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setApplications(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load applications.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [clientFilter, educationLevelFilter, employmentTypeFilter]);

  const allApplications = applications;

  const filteredApplications = useMemo(() => {
    if (!searchQuery.trim()) return allApplications;
    const q = searchQuery.toLowerCase();
    return allApplications.filter(
      (a) =>
        `${a.candidate.firstName} ${a.candidate.lastName}`.toLowerCase().includes(q) ||
        a.candidate.email.toLowerCase().includes(q) ||
        a.job.title.toLowerCase().includes(q)
    );
  }, [allApplications, searchQuery]);

  const stats = useMemo(
    () => ({
      total: allApplications.length,
      pending: allApplications.filter((a) => a.status === 'pending').length,
      shortlisted: allApplications.filter((a) => a.status === 'shortlisted')
        .length,
      hired: allApplications.filter((a) => a.status === 'hired').length,
    }),
    [allApplications]
  );

  const handleStatusChange = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    setStatusDropdownOpen(null);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: updated.status } : a))
      );
      setSelectedApp((prev) =>
        prev && prev.id === applicationId
          ? { ...prev, status: newStatus }
          : prev
      );
    } catch (_e) {
      // keep UI state
    }
  };

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-1">
            Applications
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base">
            Review and manage job applications. Update status to notify
            applicants via email.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm min-w-0"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-neutral-600 truncate">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-primary-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600 opacity-80 shrink-0" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm min-w-0"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-neutral-600 truncate">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.pending}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm min-w-0"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-neutral-600 truncate">Shortlisted</p>
              <p className="text-xl sm:text-2xl font-bold text-indigo-600">
                {stats.shortlisted}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm min-w-0"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-neutral-600 truncate">Hired</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.hired}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative max-w-md md:max-w-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, email, or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <span className="text-sm font-medium text-neutral-600">Filter:</span>
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[160px] text-sm"
              aria-label="Client"
            >
              <option value="">All clients</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={educationLevelFilter}
              onChange={(e) => setEducationLevelFilter(e.target.value)}
              className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[160px] text-sm"
              aria-label="Education level"
            >
              {EDUCATION_LEVEL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              value={employmentTypeFilter}
              onChange={(e) => setEmploymentTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[160px] text-sm"
              aria-label="Employment type"
            >
              {EMPLOYMENT_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <a
              href={`/api/applications/export?${new URLSearchParams({
                ...(clientFilter.trim() && { clientId: clientFilter.trim() }),
                ...(educationLevelFilter.trim() && { educationLevel: educationLevelFilter.trim() }),
                ...(employmentTypeFilter.trim() && { employmentType: employmentTypeFilter.trim() }),
              }).toString()}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-lg bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 text-sm font-medium transition-colors ml-auto"
              download
              title="Export applications (current filters)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export to Excel
            </a>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 sm:p-12 text-center">
          <p className="text-neutral-600">Loading applications...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 sm:p-12 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 sm:p-12 text-center">
          <Users className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600">
            No applications match your filters.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden min-w-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 px-5 py-3">
                    Candidate
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 px-5 py-3">
                    Job
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 px-5 py-3">
                    Client
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 px-5 py-3">
                    Applied
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 px-5 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
              {filteredApplications.map((app) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-neutral-50/70 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-700 font-semibold text-sm">
                          {app.candidate.firstName[0]}
                          {app.candidate.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-primary-900 text-sm">
                          {app.candidate.firstName} {app.candidate.lastName}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {app.candidate.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium text-primary-900 text-sm">
                        {app.job.title}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {app.job.company} · {app.job.location}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-600 text-sm">
                    {app.job.clientName ?? '—'}
                  </td>
                  <td className="px-5 py-3 text-neutral-600 text-sm tabular-nums">
                    {formatDate(app.appliedDate)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setStatusDropdownOpen(
                            statusDropdownOpen === app.id ? null : app.id
                          )
                        }
                        className="inline-flex items-center gap-1"
                      >
                        <StatusBadge status={app.status} />
                        <ChevronDown className="w-4 h-4 text-neutral-400" />
                      </button>
                      {statusDropdownOpen === app.id && (
                        <div className="absolute left-0 top-full mt-1 py-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                          {(
                            STATUS_OPTIONS.filter(
                              (o) => o.value !== 'all'
                            ) as { value: ApplicationStatus; label: string }[]
                          ).map((o) => (
                            <button
                              key={o.value}
                              type="button"
                              onClick={() =>
                                handleStatusChange(app.id, o.value)
                              }
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-100"
                            >
                              {o.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {selectedApp && (
        <>
          <div
            className="fixed inset-0 bg-neutral-900/20 z-40"
            onClick={() => setSelectedApp(null)}
            aria-hidden
          />
          <div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-neutral-200 shadow-sm z-50 overflow-y-auto rounded-l-xl"
          >
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 flex items-center justify-between rounded-tl-xl">
              <h2 className="text-lg font-semibold text-primary-900">
                Application details
              </h2>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-2 text-neutral-500 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Candidate
                </h3>
                <p className="text-xl font-semibold text-primary-900">
                  {selectedApp.candidate.firstName}{' '}
                  {selectedApp.candidate.lastName}
                </p>
                <div className="mt-2 space-y-1 text-sm text-neutral-600">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    {selectedApp.candidate.email}
                  </p>
                  {selectedApp.candidate.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-neutral-400" />
                      {selectedApp.candidate.phone}
                    </p>
                  )}
                  {selectedApp.candidate.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-neutral-400" />
                      {selectedApp.candidate.location}
                    </p>
                  )}
                  <p>
                    {selectedApp.candidate.experience} years experience
                    {selectedApp.candidate.education &&
                      ` · ${selectedApp.candidate.education}`}
                  </p>
                  {selectedApp.candidate.skills?.length > 0 && (
                    <p>
                      Skills:{' '}
                      {Array.isArray(selectedApp.candidate.skills)
                        ? selectedApp.candidate.skills.join(', ')
                        : selectedApp.candidate.skills}
                    </p>
                  )}
                </div>
              </div>

              {(selectedApp.candidate.resumePath || selectedApp.resumePath) && (
                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                      Resume
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPdfZoom((z) => Math.max(50, z - 25))}
                        className="p-1.5 rounded-md text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                        title="Zoom out"
                        aria-label="Zoom out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-neutral-500 min-w-[2.5rem] text-center tabular-nums">
                        {pdfZoom}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setPdfZoom((z) => Math.min(200, z + 25))}
                        className="p-1.5 rounded-md text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                        title="Zoom in"
                        aria-label="Zoom in"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 overflow-auto min-h-[320px] h-[50vh] max-h-[420px]">
                    <div
                      className="origin-top-left"
                      style={{
                        transform: `scale(${pdfZoom / 100})`,
                        width: `${(100 * 100) / pdfZoom}%`,
                        height: `${(400 * 100) / pdfZoom}px`,
                        minHeight: `${(320 * 100) / pdfZoom}px`,
                      }}
                    >
                      <iframe
                        title="Resume preview"
                        src={(selectedApp.resumePath || selectedApp.candidate.resumePath) || ''}
                        className="w-full border-0 min-h-[320px] h-[400px]"
                      />
                    </div>
                  </div>
                  <a
                    href={(selectedApp.resumePath || selectedApp.candidate.resumePath) || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                  >
                    <FileText className="w-4 h-4" />
                    View resume in new tab
                  </a>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Job
                </h3>
                <p className="font-semibold text-primary-900">
                  {selectedApp.job.title}
                </p>
                <p className="text-sm text-neutral-600 flex items-center gap-1 mt-1">
                  <Building2 className="w-4 h-4" />
                  {selectedApp.job.company} · {selectedApp.job.location}
                </p>
                {selectedApp.job.clientName && (
                  <p className="text-sm text-neutral-500 mt-1">
                    Client: {selectedApp.job.clientName}
                  </p>
                )}
                <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-4 h-4" />
                  Applied {formatDate(selectedApp.appliedDate)}
                </p>
                <div className="mt-2">
                  <StatusBadge status={selectedApp.status} />
                </div>
              </div>

              {selectedApp.coverLetter && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                    Cover letter
                  </h3>
                  <p className="text-sm text-neutral-700 whitespace-pre-wrap bg-neutral-50 p-4 rounded-lg">
                    {selectedApp.coverLetter}
                  </p>
                </div>
              )}

              {selectedApp.notes && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                    Internal notes
                  </h3>
                  <p className="text-sm text-neutral-700 whitespace-pre-wrap bg-amber-50/50 p-4 rounded-lg border border-amber-100">
                    {selectedApp.notes}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-200">
                <p className="text-xs text-neutral-500 mb-3">
                  Update status
                </p>
                <div className="flex flex-wrap gap-2">
                  {(STATUS_OPTIONS.filter(
                    (o) => o.value !== 'all'
                  ) as { value: ApplicationStatus; label: string }[]).map(
                    (o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => {
                          handleStatusChange(selectedApp.id, o.value);
                          setSelectedApp({
                            ...selectedApp,
                            status: o.value,
                          });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedApp.status === o.value
                            ? 'bg-primary-900 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                    >
                      {o.label}
                    </button>
                  )
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
