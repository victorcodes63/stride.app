'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BarChart3,
  FileCheck,
  Briefcase,
  CalendarCheck,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import type { ApplicationWithDetails, ApplicationStatus, UserSummary } from '@/types/dashboard';
import type { InterviewWithDetails } from '@/types/dashboard';

type JobItem = { id: string; title: string; company: string; isActive: boolean; applicationCount?: number };
type Application = ApplicationWithDetails;

function getMonthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonth(monthKey: string) {
  const [y, m] = monthKey.split('-').map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
  hired: 'Hired',
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  pending: 'bg-amber-500',
  reviewed: 'bg-blue-500',
  shortlisted: 'bg-indigo-500',
  rejected: 'bg-red-500',
  hired: 'bg-emerald-500',
};

export default function DashboardAnalyticsPage() {
  const router = useRouter();
  const [access, setAccess] = useState<'unknown' | 'allowed' | 'denied'>('unknown');
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<InterviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((me: UserSummary | null) => {
        if (cancelled) return;
        if (!me?.canViewSystemAnalytics) {
          setAccess('denied');
          router.replace('/dashboard');
          return;
        }
        setAccess('allowed');
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (access !== 'allowed') return;
    let cancelled = false;
    Promise.all([
      fetch('/api/jobs').then((r) => r.json()),
      fetch('/api/applications').then((r) => r.json()),
      fetch('/api/interviews').then((r) => r.json()),
    ])
      .then(([jobsRes, appsRes, interviewsRes]) => {
        if (cancelled) return;
        setJobs(Array.isArray(jobsRes) ? jobsRes : []);
        setApplications(Array.isArray(appsRes) ? appsRes : []);
        setInterviews(Array.isArray(interviewsRes) ? interviewsRes : []);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load analytics data.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [access]);

  const statusBreakdown = useMemo(() => {
    const counts: Record<ApplicationStatus, number> = {
      pending: 0,
      reviewed: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    };
    applications.forEach((a) => {
      counts[a.status]++;
    });
    const total = applications.length;
    return (Object.entries(counts) as [ApplicationStatus, number][]).map(([status, count]) => ({
      status,
      label: STATUS_LABELS[status],
      count,
      pct: total > 0 ? (count / total) * 100 : 0,
    }));
  }, [applications]);

  const applicationsByMonth = useMemo(() => {
    const map: Record<string, number> = {};
    applications.forEach((a) => {
      const key = getMonthKey(a.appliedDate);
      map[key] = (map[key] || 0) + 1;
    });
    const entries = Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
    const now = new Date();
    const last12: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last12.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      );
    }
    return last12.map((key) => ({
      month: key,
      label: formatMonth(key),
      count: map[key] || 0,
    }));
  }, [applications]);

  const maxByMonth = useMemo(
    () => Math.max(1, ...applicationsByMonth.map((m) => m.count)),
    [applicationsByMonth]
  );

  const topJobsByApplications = useMemo(() => {
    const byJob: Record<string, { jobId: string; title: string; company: string; count: number }> = {};
    applications.forEach((a) => {
      if (!byJob[a.jobId]) {
        byJob[a.jobId] = {
          jobId: a.jobId,
          title: a.job.title,
          company: a.job.company,
          count: 0,
        };
      }
      byJob[a.jobId].count++;
    });
    return Object.values(byJob)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [applications]);

  const interviewBreakdown = useMemo(() => {
    const scheduled = interviews.filter((i) => i.status === 'scheduled').length;
    const completed = interviews.filter((i) => i.status === 'completed').length;
    const cancelled = interviews.filter((i) => i.status === 'cancelled').length;
    return [
      { status: 'scheduled', label: 'Scheduled', count: scheduled, color: 'bg-indigo-500' },
      { status: 'completed', label: 'Completed', count: completed, color: 'bg-emerald-500' },
      { status: 'cancelled', label: 'Cancelled', count: cancelled, color: 'bg-neutral-400' },
    ];
  }, [interviews]);

  const summary = useMemo(() => {
    const hired = applications.filter((a) => a.status === 'hired').length;
    const pending = applications.filter((a) => a.status === 'pending').length;
    const scheduledInterviews = interviews.filter((i) => i.status === 'scheduled').length;
    const activeJobs = jobs.filter((j) => j.isActive).length;
    return {
      totalApplications: applications.length,
      hired,
      pending,
      scheduledInterviews,
      activeJobs,
      totalInterviews: interviews.length,
    };
  }, [applications, interviews, jobs]);

  if (access === 'unknown') {
    return (
      <div className="w-full min-w-0 flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (access === 'denied') {
    return (
      <div className="w-full min-w-0 max-w-lg mx-auto py-16 text-center space-y-4">
        <p className="text-neutral-600 text-sm">Redirecting…</p>
        <Link href="/dashboard" className="text-primary-700 font-medium text-sm underline">
          Back to overview
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-w-0 flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-w-0">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-1">
            Analytics
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-1">
          Analytics
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base max-w-prose">
          Executive summary: application and hiring metrics across the system.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm min-w-0"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-neutral-600 truncate">
                Total applications
              </p>
              <p className="text-xl sm:text-2xl font-bold text-primary-900">
                {summary.totalApplications}
              </p>
            </div>
            <FileCheck className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600 opacity-80 shrink-0" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.03 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm min-w-0"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-neutral-600 truncate">Hired</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600">{summary.hired}</p>
            </div>
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 opacity-80 shrink-0" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm min-w-0"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-neutral-600 truncate">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600">{summary.pending}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.09 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm min-w-0"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-neutral-600 truncate">
                Active jobs
              </p>
              <p className="text-xl sm:text-2xl font-bold text-primary-900">{summary.activeJobs}</p>
            </div>
            <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600 opacity-80 shrink-0" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm min-w-0"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-neutral-600 truncate">
                Interviews
              </p>
              <p className="text-xl sm:text-2xl font-bold text-indigo-600">
                {summary.totalInterviews}
                <span className="text-sm font-normal text-neutral-500">
                  {' '}({summary.scheduledInterviews} scheduled)
                </span>
              </p>
            </div>
            <CalendarCheck className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 opacity-80 shrink-0" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Application status breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-6"
        >
          <h2 className="text-base sm:text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            Applications by status
          </h2>
          {applications.length === 0 ? (
            <p className="text-neutral-500 text-sm">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {statusBreakdown.map(({ status, label, count, pct }) => (
                <div key={status} className="flex items-center gap-3">
                  <div className="w-24 sm:w-28 text-sm text-neutral-700 shrink-0">{label}</div>
                  <div className="flex-1 h-8 bg-neutral-100 rounded-lg overflow-hidden min-w-0">
                    <div
                      className={`h-full rounded-lg ${STATUS_COLORS[status]} transition-all duration-500`}
                      style={{ width: `${Math.max(0, pct)}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm font-medium text-neutral-900 shrink-0">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Applications over time (last 12 months) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-6"
        >
          <h2 className="text-base sm:text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Applications over time (last 12 months)
          </h2>
          {applicationsByMonth.every((m) => m.count === 0) ? (
            <p className="text-neutral-500 text-sm">No application data in this period.</p>
          ) : (
            <div className="space-y-2">
              {applicationsByMonth.map(({ month, label, count }) => (
                <div key={month} className="flex items-center gap-3">
                  <div className="w-14 sm:w-16 text-xs text-neutral-600 shrink-0">{label}</div>
                  <div className="flex-1 h-6 bg-neutral-100 rounded overflow-hidden min-w-0">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${maxByMonth > 0 ? (count / maxByMonth) * 100 : 0}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-full bg-primary-500 rounded"
                    />
                  </div>
                  <div className="w-8 text-right text-sm font-medium text-neutral-700 shrink-0">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Top jobs by applications */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-6"
        >
          <h2 className="text-base sm:text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary-600" />
            Top jobs by applications
          </h2>
          {topJobsByApplications.length === 0 ? (
            <p className="text-neutral-500 text-sm">No applications yet.</p>
          ) : (
            <div className="space-y-2">
              {topJobsByApplications.map((job, idx) => {
                const maxCount = topJobsByApplications[0]?.count ?? 1;
                const pct = (job.count / maxCount) * 100;
                return (
                  <div key={job.jobId} className="flex items-center gap-3">
                    <div className="w-6 text-sm text-neutral-500 shrink-0">{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary-900 truncate">{job.title}</p>
                      <p className="text-xs text-neutral-500 truncate">{job.company}</p>
                    </div>
                    <div className="w-24 sm:w-32 h-6 bg-neutral-100 rounded overflow-hidden shrink-0">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.4, delay: 0.25 + idx * 0.03 }}
                        className="h-full bg-primary-500 rounded"
                      />
                    </div>
                    <div className="w-8 text-right text-sm font-medium text-neutral-900 shrink-0">
                      {job.count}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Interview breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-6"
        >
          <h2 className="text-base sm:text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            Interviews by status
          </h2>
          {interviews.length === 0 ? (
            <p className="text-neutral-500 text-sm">No interviews scheduled yet.</p>
          ) : (
            <div className="space-y-3">
              {interviewBreakdown.map(({ status, label, count, color }) => {
                const total = interviews.length;
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className="w-24 sm:w-28 text-sm text-neutral-700 shrink-0">{label}</div>
                    <div className="flex-1 h-8 bg-neutral-100 rounded-lg overflow-hidden min-w-0">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-lg ${color}`}
                      />
                    </div>
                    <div className="w-12 text-right text-sm font-medium text-neutral-900 shrink-0">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
