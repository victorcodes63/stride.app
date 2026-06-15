'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

type WorkflowRow = {
  id: string;
  type: 'ONBOARDING' | 'OFFBOARDING';
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt: string;
  employee: { firstName: string; lastName: string; department?: { name: string | null } | null };
  tasks: Array<{ status: string; dueDate?: string | null }>;
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-neutral-500">Loading onboarding…</div>}>
      <OnboardingPageContent />
    </Suspense>
  );
}

function OnboardingPageContent() {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<WorkflowRow[]>([]);
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [type, setType] = useState<'ONBOARDING' | 'OFFBOARDING'>('ONBOARDING');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fromUrl = searchParams.get('status');
    if (fromUrl !== null && fromUrl !== status) setStatus(fromUrl);
  }, [searchParams, status]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('type', type);
    if (status) params.set('status', status);
    if (search.trim()) params.set('search', search.trim());
    fetch(`/api/onboarding/workflows?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => setRows([]));
  }, [status, type, search]);

  const view = useMemo(
    () =>
      rows.map((row) => {
        const total = row.tasks.length;
        const complete = row.tasks.filter((task) => task.status === 'COMPLETED').length;
        const overdue = row.tasks.filter(
          (task) =>
            task.status === 'OVERDUE' ||
            (task.status === 'PENDING' && task.dueDate && new Date(task.dueDate) < new Date()),
        ).length;
        return { ...row, total, complete, overdue };
      }),
    [rows],
  );

  return (
    <div className="space-y-5">
      <DashboardPageHeader title="Onboarding & Offboarding" />

      <div className="flex flex-wrap gap-2">
        <button
          className={`rounded-md px-3 py-1.5 text-sm ${type === 'ONBOARDING' ? 'bg-primary-900 text-white' : 'bg-white border'}`}
          onClick={() => setType('ONBOARDING')}
        >
          Onboarding
        </button>
        <button
          className={`rounded-md px-3 py-1.5 text-sm ${type === 'OFFBOARDING' ? 'bg-primary-900 text-white' : 'bg-white border'}`}
          onClick={() => setType('OFFBOARDING')}
        >
          Offboarding
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Search employee name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="dashboard-surface overflow-x-auto rounded-lg">
        <table className="data-table dashboard-data-table min-w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-600">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Department</th>
              <th className="col-center px-4 py-3">Started</th>
              <th className="col-center px-4 py-3">Progress</th>
              <th className="col-center px-4 py-3">Due tasks</th>
              <th className="col-center px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {view.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">
                  <Link href={`/dashboard/onboarding/${row.id}`} className="font-medium text-primary-800 hover:underline">
                    {row.employee.firstName} {row.employee.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3">{row.employee.department?.name ?? '—'}</td>
                <td className="col-center px-4 py-3 tabular-nums">{row.startedAt.slice(0, 10)}</td>
                <td className="col-center px-4 py-3 tabular-nums">
                  {row.complete}/{row.total}
                </td>
                <td className="col-center px-4 py-3 tabular-nums">{row.overdue > 0 ? row.overdue : '—'}</td>
                <td className="col-center px-4 py-3">{row.status.replace('_', ' ')}</td>
              </tr>
            ))}
            {view.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                  No onboarding workflows match this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
