'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalendarDays, Check, Loader2, X } from 'lucide-react';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

type LeaveRow = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string | null;
  departmentName: string | null;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  reason: string | null;
};

function statusBadge(status: string) {
  if (status === 'pending') return 'bg-amber-100 text-amber-900';
  if (status === 'approved') return 'bg-emerald-100 text-emerald-900';
  if (status === 'rejected') return 'bg-red-100 text-red-900';
  return 'bg-neutral-100 text-neutral-700';
}

export default function OutsourcingLeavePage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-neutral-500">Loading leave…</div>}>
      <OutsourcingLeaveContent />
    </Suspense>
  );
}

function OutsourcingLeaveContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'pending';
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [rows, setRows] = useState<LeaveRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/outsourcing/leave/applications?${params.toString()}`, {
        cache: 'no-store',
      });
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data.error || 'Failed to load leave applications');
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load leave applications');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const fromUrl = searchParams.get('status');
    if (fromUrl && fromUrl !== statusFilter) setStatusFilter(fromUrl);
  }, [searchParams, statusFilter]);

  const pendingCount = useMemo(() => rows.filter((r) => r.status === 'pending').length, [rows]);

  async function review(id: string, status: 'approved' | 'rejected') {
    setActingId(id);
    try {
      const res = await fetch(`/api/outsourcing/leave/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Action failed');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="page-shell space-y-5">
      <DashboardPageHeader
        title="Workforce leave"
        description="Review and action leave requests for employees in the active company context."
      />

      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        {statusFilter === 'pending' && pendingCount > 0 ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
            {pendingCount} awaiting action
          </span>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      ) : null}

      <div className="dashboard-surface overflow-x-auto rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading leave requests…
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarDays className="mx-auto mb-3 h-10 w-10 text-neutral-300" />
            <p className="text-sm text-neutral-600">No leave requests match this filter.</p>
          </div>
        ) : (
          <table className="data-table dashboard-data-table min-w-full text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-600">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Days</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{row.employeeName}</div>
                    <div className="text-xs text-neutral-500">{row.employeeNumber ?? '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{row.departmentName ?? '—'}</td>
                  <td className="px-4 py-3">{row.leaveTypeName}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {row.startDate} → {row.endDate}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{row.days}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={actingId === row.id}
                          onClick={() => review(row.id, 'approved')}
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={actingId === row.id}
                          onClick={() => review(row.id, 'rejected')}
                          className="inline-flex items-center gap-1 rounded-md border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                        >
                          <X className="h-3.5 w-3.5" />
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
