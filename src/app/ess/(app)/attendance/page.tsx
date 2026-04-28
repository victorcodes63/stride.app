'use client';

import { useEffect, useMemo, useState } from 'react';

type AttendanceSummary = {
  month: string | null;
  totalDaysWorked: number;
  totalScheduledDays: number;
  totalHours: number;
  overtimeHours: number;
  lateCount: number;
  absentCount: number;
  pendingReviewCount: number;
};

type AttendanceRow = {
  date: string;
  shiftName: string;
  scheduledStart: string | null;
  scheduledEnd: string | null;
  clockIn: string | null;
  clockOut: string | null;
  totalHours: number;
  overtimeHours: number;
  lateMinutes: number;
  status: 'complete' | 'late' | 'pending_review' | 'corrected';
  note: string | null;
};

const STATUS_STYLES: Record<AttendanceRow['status'], string> = {
  complete: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  late: 'bg-amber-50 text-amber-700 border-amber-200',
  pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
  corrected: 'bg-neutral-100 text-neutral-700 border-neutral-200',
};

function toMonthInputValue(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function monthBounds(month: string): { from: string; to: string } {
  const [year, monthIndex] = month.split('-').map(Number);
  const first = new Date(Date.UTC(year, monthIndex - 1, 1));
  const next = new Date(Date.UTC(year, monthIndex, 1));
  const last = new Date(next.getTime() - 24 * 60 * 60 * 1000);
  return {
    from: first.toISOString().slice(0, 10),
    to: last.toISOString().slice(0, 10),
  };
}

function formatTime(value: string | null): string {
  if (!value) return '-';
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatStatus(status: AttendanceRow['status']): string {
  if (status === 'pending_review') return 'Pending review';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function EssAttendancePage() {
  const [month, setMonth] = useState(toMonthInputValue(new Date()));
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [error, setError] = useState('');

  const range = useMemo(() => monthBounds(month), [month]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    const listParams = new URLSearchParams({
      from: range.from,
      to: range.to,
      page: String(page),
      pageSize: '20',
    });

    Promise.all([
      fetch(`/api/ess/attendance/summary?month=${encodeURIComponent(month)}`),
      fetch(`/api/ess/attendance?${listParams.toString()}`),
    ])
      .then(async ([summaryRes, listRes]) => {
        const summaryJson = await summaryRes.json().catch(() => ({}));
        const listJson = await listRes.json().catch(() => ({}));

        if (!summaryRes.ok || !listRes.ok) {
          throw new Error(summaryJson.error || listJson.error || 'Failed to load attendance.');
        }

        if (cancelled) return;
        setSummary(summaryJson as AttendanceSummary);
        setRows(Array.isArray(listJson.items) ? (listJson.items as AttendanceRow[]) : []);
        setTotalPages(Number(listJson.totalPages) > 0 ? Number(listJson.totalPages) : 1);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setSummary(null);
        setRows([]);
        setTotalPages(1);
        setError(e instanceof Error ? e.message : 'Failed to load attendance.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [month, page, range.from, range.to]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Attendance</h1>
          <p className="text-sm text-neutral-600 mt-1">Read-only shift and clock history for your account.</p>
        </div>
        <label className="text-sm text-neutral-700 flex items-center gap-2">
          Month
          <input
            type="month"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value || toMonthInputValue(new Date()));
              setPage(1);
            }}
            className="px-3 py-2.5 border border-neutral-300 rounded-lg text-sm min-h-11"
          />
        </label>
      </div>

      {error ? (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
      ) : null}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-600">Days worked / scheduled</p>
          <p className="text-xl font-semibold text-primary-900 mt-1">
            {summary?.totalDaysWorked ?? 0} / {summary?.totalScheduledDays ?? 0}
          </p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-600">Total hours</p>
          <p className="text-xl font-semibold text-primary-900 mt-1">{summary?.totalHours ?? 0}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-600">Overtime hours</p>
          <p className="text-xl font-semibold text-primary-900 mt-1">{summary?.overtimeHours ?? 0}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-600">Late arrivals</p>
          <p className="text-xl font-semibold text-amber-700 mt-1">{summary?.lateCount ?? 0}</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-xl p-4 bg-amber-50/40">
          <p className="text-xs text-amber-800">Pending review items</p>
          <p className="text-xl font-semibold text-amber-700 mt-1">{summary?.pendingReviewCount ?? 0}</p>
        </div>
      </section>

      <section className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-3 py-2">Date</th>
                <th className="text-left px-3 py-2">Shift</th>
                <th className="text-left px-3 py-2">Clock in</th>
                <th className="text-left px-3 py-2">Clock out</th>
                <th className="text-left px-3 py-2">Hours</th>
                <th className="text-left px-3 py-2">Overtime</th>
                <th className="text-left px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date} className="border-b border-neutral-100">
                  <td className="px-3 py-2">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{row.shiftName}</td>
                  <td className="px-3 py-2">{formatTime(row.clockIn)}</td>
                  <td className="px-3 py-2">{formatTime(row.clockOut)}</td>
                  <td className="px-3 py-2">{row.totalHours.toFixed(1)}</td>
                  <td className="px-3 py-2">{row.overtimeHours.toFixed(1)}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${STATUS_STYLES[row.status]}`}>
                      {formatStatus(row.status)}
                    </span>
                    {row.note ? <p className="text-xs text-neutral-500 mt-1">{row.note}</p> : null}
                  </td>
                </tr>
              ))}
              {!loading && !rows.length ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-neutral-500">
                    No attendance records found for this month.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <p className="px-3 py-2 text-xs text-neutral-500 border-t border-neutral-100 sm:hidden">
          Scroll sideways to view full table.
        </p>
      </section>

      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-2.5 min-h-11 rounded-md border border-neutral-300 text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-sm text-neutral-600">
          Page {page} of {totalPages}
        </p>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-2.5 min-h-11 rounded-md border border-neutral-300 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
