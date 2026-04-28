'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type WorkflowRow = {
  id: string;
  type: 'ONBOARDING' | 'OFFBOARDING';
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt: string;
  employee: { firstName: string; lastName: string; department?: { name: string | null } | null };
  tasks: Array<{ status: string; dueDate?: string | null }>;
};

export default function OnboardingPage() {
  const [rows, setRows] = useState<WorkflowRow[]>([]);
  const [status, setStatus] = useState('');
  const [type, setType] = useState<'ONBOARDING' | 'OFFBOARDING'>('ONBOARDING');
  const [search, setSearch] = useState('');

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
          (task) => task.status === 'OVERDUE' || (task.status === 'PENDING' && task.dueDate && new Date(task.dueDate) < new Date()),
        ).length;
        return { ...row, total, complete, overdue };
      }),
    [rows],
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-primary-900">Onboarding & Offboarding</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className={`rounded-md px-3 py-1.5 text-sm ${type === 'ONBOARDING' ? 'bg-primary-900 text-white' : 'bg-white border'}`} onClick={() => setType('ONBOARDING')}>Onboarding</button>
        <button className={`rounded-md px-3 py-1.5 text-sm ${type === 'OFFBOARDING' ? 'bg-primary-900 text-white' : 'bg-white border'}`} onClick={() => setType('OFFBOARDING')}>Offboarding</button>
      </div>

      <div className="flex flex-wrap gap-2">
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Search employee name" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="rounded-md border px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-600">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Started</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Due tasks</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {view.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">
                  <Link className="text-primary-700 hover:underline" href={`/dashboard/onboarding/${row.id}`}>
                    {row.employee.firstName} {row.employee.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3">{row.employee.department?.name ?? '-'}</td>
                <td className="px-4 py-3">{new Date(row.startedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">{row.complete}/{row.total}</td>
                <td className={`px-4 py-3 ${row.overdue > 0 ? 'text-red-700 font-semibold' : ''}`}>{row.overdue}</td>
                <td className="px-4 py-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
