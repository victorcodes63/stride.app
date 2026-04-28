'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type CaseRow = {
  id: string;
  caseNumber: string;
  type: string;
  severity: string;
  status: string;
  subject: string;
  createdAt: string;
  actionCount: number;
  employee: { firstName: string; lastName: string; employeeNumber: string | null };
};

type GrievanceRow = {
  id: string;
  grievanceNumber: string;
  status: string;
  category: string;
  subject: string;
  submittedAt: string;
  employee: { firstName: string; lastName: string };
};

export default function DisciplinaryPage() {
  const [tab, setTab] = useState<'cases' | 'grievances'>('cases');
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [grievances, setGrievances] = useState<GrievanceRow[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const [casesRes, grievancesRes] = await Promise.all([
        fetch(`/api/disciplinary/cases${statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : ''}`),
        fetch('/api/grievances'),
      ]);
      const [casesData, grievancesData] = await Promise.all([casesRes.json().catch(() => []), grievancesRes.json().catch(() => [])]);
      if (cancelled) return;
      setCases(Array.isArray(casesData) ? casesData : []);
      setGrievances(Array.isArray(grievancesData) ? grievancesData : []);
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  const statuses = useMemo(() => [...new Set(cases.map((c) => c.status))], [cases]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-primary-900">Disciplinary & Grievance Management</h1>
      <div className="flex gap-2">
        <button className={`rounded-lg px-4 py-2 text-sm ${tab === 'cases' ? 'bg-primary-900 text-white' : 'bg-neutral-100'}`} onClick={() => setTab('cases')}>Cases</button>
        <button className={`rounded-lg px-4 py-2 text-sm ${tab === 'grievances' ? 'bg-primary-900 text-white' : 'bg-neutral-100'}`} onClick={() => setTab('grievances')}>Grievances</button>
      </div>
      {tab === 'cases' ? (
        <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <select className="rounded border border-neutral-300 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              {statuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
            </select>
          </div>
          {loading ? <p className="text-sm text-neutral-500">Loading...</p> : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-neutral-500"><th>Case</th><th>Employee</th><th>Type</th><th>Severity</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {cases.map((item) => (
                  <tr key={item.id} className="border-t border-neutral-100">
                    <td className="py-2"><Link className="text-primary-700 hover:underline" href={`/dashboard/disciplinary/cases/${item.id}`}>{item.caseNumber}</Link></td>
                    <td>{item.employee.firstName} {item.employee.lastName}</td>
                    <td>{item.type.replaceAll('_', ' ')}</td>
                    <td>{item.severity}</td>
                    <td>{item.status.replaceAll('_', ' ')}</td>
                    <td>{item.actionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          {loading ? <p className="text-sm text-neutral-500">Loading...</p> : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-neutral-500"><th>Grievance</th><th>Employee</th><th>Category</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {grievances.map((item) => (
                  <tr key={item.id} className="border-t border-neutral-100">
                    <td>{item.grievanceNumber}</td>
                    <td>{item.employee.firstName} {item.employee.lastName}</td>
                    <td>{item.category.replaceAll('_', ' ')}</td>
                    <td>{item.status.replaceAll('_', ' ')}</td>
                    <td>{new Date(item.submittedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
