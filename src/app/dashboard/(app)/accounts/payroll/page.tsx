'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Banknote, FileText, Mail, Loader2, Pencil, Calculator, Search } from 'lucide-react';
import PayrollEditModal from '@/components/payroll/PayrollEditModal';

interface PayrollRecord {
  id: string;
  employeeId: string;
  accountsClientId: string | null;
  accountsClientName: string | null;
  employeeName: string;
  employeeNumber: string | null;
  clientName: string;
  departmentName: string | null;
  month: number;
  year: number;
  basicPay: string;
  grossPay: string;
  paye: string;
  nssf: string;
  nhif: string;
  ahl: string;
  netPay: string;
  status: string;
  payrollFrequency?: string;
  period1Gross?: string | null;
  period2Gross?: string | null;
}

interface ClientOption {
  id: string;
  name: string;
}

interface DepartmentOption {
  id: string;
  name: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AccountsPayrollPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [scope, setScope] = useState<'all' | 'client' | 'department'>('all');
  const [clientId, setClientId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generateResult, setGenerateResult] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [editPayrollId, setEditPayrollId] = useState<string | null>(null);
  const [editEmployeeName, setEditEmployeeName] = useState('');
  const [recalculating, setRecalculating] = useState(false);

  // Table-level filters (search + status)
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPayrolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('month', String(month));
      params.set('year', String(year));
      if (scope === 'client' && clientId.trim()) params.set('clientId', clientId.trim());
      if (scope === 'department' && departmentId.trim()) params.set('departmentId', departmentId.trim());
      const res = await fetch(`/api/outsourcing/payroll?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load payroll');
      setPayrolls(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load payroll');
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/outsourcing/clients');
      const data = await res.json().catch(() => []);
      if (res.ok && Array.isArray(data)) {
        setClients(data.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
      }
    } catch {
      setClients([]);
    }
  };

  const fetchDepartments = async (cid: string) => {
    try {
      const res = await fetch(`/api/outsourcing/clients/${cid}/departments`);
      const data = await res.json().catch(() => []);
      if (res.ok && Array.isArray(data)) {
        setDepartments(data.map((d: { id: string; name: string }) => ({ id: d.id, name: d.name })));
      } else {
        setDepartments([]);
      }
    } catch {
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchPayrolls();
  }, [month, year, scope, clientId, departmentId]);

  useEffect(() => {
    if (scope === 'department' && clientId.trim()) {
      fetchDepartments(clientId.trim());
    } else {
      setDepartments([]);
      setDepartmentId('');
    }
  }, [scope, clientId]);

  const uniqueStatuses = useMemo(() => {
    const set = new Set<string>();
    payrolls.forEach((p) => {
      if (p.status?.trim()) set.add(p.status.trim());
    });
    return Array.from(set).sort();
  }, [payrolls]);

  const toNumber = (val: string | number | null | undefined): number => {
    const n = typeof val === 'number' ? val : parseFloat(String(val ?? ''));
    return Number.isFinite(n) ? n : 0;
  };

  const filteredPayrolls = useMemo(() => {
    const q = tableSearchQuery.trim().toLowerCase();
    const status = statusFilter.trim().toLowerCase();

    return payrolls.filter((p) => {
      const statusOk = status ? p.status?.toLowerCase() === status : true;
      if (!statusOk) return false;

      if (!q) return true;

      const haystack = [
        p.employeeName,
        p.employeeNumber ?? '',
        p.clientName,
        p.accountsClientName ?? '',
        p.departmentName ?? '',
        p.status,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [payrolls, tableSearchQuery, statusFilter]);

  const totalsInView = useMemo(() => {
    const records = filteredPayrolls.length;
    const grossTotal = filteredPayrolls.reduce((s, p) => s + toNumber(p.grossPay), 0);
    const netTotal = filteredPayrolls.reduce((s, p) => s + toNumber(p.netPay), 0);
    const paidCount = filteredPayrolls.filter((p) => p.status === 'paid').length;
    const approvedCount = filteredPayrolls.filter((p) => p.status === 'approved').length;
    const draftCount = records - paidCount - approvedCount;
    return { records, grossTotal, netTotal, paidCount, approvedCount, draftCount };
  }, [filteredPayrolls]);

  const hasActiveTableFilters = !!tableSearchQuery.trim() || !!statusFilter.trim();
  const clearTableFilters = () => {
    setTableSearchQuery('');
    setStatusFilter('');
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateResult(null);
    setError(null);
    try {
      const body: Record<string, unknown> = { month, year };
      if (scope === 'client' && clientId.trim()) body.clientId = clientId.trim();
      if (scope === 'department' && departmentId.trim()) body.departmentId = departmentId.trim();
      const res = await fetch('/api/outsourcing/payroll/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      setGenerateResult(data.message || `Created ${data.created ?? 0} payroll record(s).`);
      await fetchPayrolls();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate payroll');
    } finally {
      setGenerating(false);
    }
  };

  const payslipUrl = () => {
    const params = new URLSearchParams();
    params.set('month', String(month));
    params.set('year', String(year));
    if (scope === 'client' && clientId.trim()) params.set('clientId', clientId.trim());
    if (scope === 'department' && departmentId.trim()) params.set('departmentId', departmentId.trim());
    return `/dashboard/accounts/payroll/payslips?${params}`;
  };

  const canGenerate = scope === 'all' || (scope === 'client' && clientId.trim()) || (scope === 'department' && departmentId.trim());

  const handleSendPayslip = async (employeeId: string, employeeName: string) => {
    setSendingId(employeeId);
    try {
      const res = await fetch('/api/outsourcing/payroll/send-payslips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, year, employeeIds: [employeeId] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      if (data.errors?.length) {
        setError(data.errors[0] || 'Failed to send payslip');
      } else if (data.sent > 0) {
        setGenerateResult(`Payslip sent to ${employeeName}.`);
      } else if (data.skipped > 0) {
        setError(`${employeeName} has no email on file.`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send payslip');
    } finally {
      setSendingId(null);
    }
  };

  const handleRecalculateStatutory = async () => {
    setRecalculating(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { month, year };
      if (scope === 'client' && clientId.trim()) body.clientId = clientId.trim();
      if (scope === 'department' && departmentId.trim()) body.departmentId = departmentId.trim();
      const res = await fetch('/api/outsourcing/payroll/recalculate-statutory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to recalculate');
      setGenerateResult(data.message || `Recalculated statutory for ${data.updated ?? 0} record(s).`);
      await fetchPayrolls();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to recalculate statutory');
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <nav className="mb-4 sm:mb-5" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm text-neutral-500 flex-wrap">
          <li>
            <Link href="/dashboard/accounts" className="hover:text-primary-700 transition-colors">
              Accounts
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-primary-900 font-medium" aria-current="page">
            Payroll
          </li>
        </ol>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-1">
            Payroll
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base">
            Generate payroll and payslips by month. Scope by all employees, client, or department.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {generateResult && (
        <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg text-primary-800 text-sm flex items-center justify-between">
          <span>{generateResult}</span>
          <button type="button" onClick={() => setGenerateResult(null)} className="text-primary-600 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-6 mb-6">
        <h2 className="text-base font-semibold text-primary-900 mb-4 flex items-center gap-2">
          <Banknote className="w-5 h-5 text-primary-600" />
          Payroll run
        </h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10) || year)}
              min={2020}
              max={2030}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-sm w-24 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Scope</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as 'all' | 'client' | 'department')}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All employees</option>
              <option value="client">By client</option>
              <option value="department">By department</option>
            </select>
          </div>
          {scope === 'client' && (
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Client</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 min-w-[200px]"
              >
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
          {scope === 'department' && (
            <>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Client</label>
                <select
                  value={clientId}
                  onChange={(e) => { setClientId(e.target.value); setDepartmentId(''); }}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 min-w-[200px]"
                >
                  <option value="">Select client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Department</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  disabled={!clientId.trim()}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 min-w-[180px] disabled:opacity-50"
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate || generating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating…' : 'Generate payroll'}
            </button>
            <Link
              href={payslipUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <FileText className="w-4 h-4" />
              View payslips
            </Link>
            <button
              type="button"
              onClick={handleRecalculateStatutory}
              disabled={payrolls.length === 0 || recalculating}
              title="Recalculate PAYE, NSSF, SHIF, AHL for all in scope"
              className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {recalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
              Recalculate statutory (all)
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <h2 className="text-base font-semibold text-primary-900 px-4 sm:px-6 py-4 border-b border-neutral-100">
          Payroll records ({month}/{year})
        </h2>
        {loading ? (
          <div className="p-8 animate-pulse">
            <div className="h-4 bg-neutral-100 rounded w-full mb-4" />
            <div className="h-4 bg-neutral-100 rounded w-5/6 mb-4" />
            <div className="h-4 bg-neutral-100 rounded w-4/6" />
          </div>
        ) : payrolls.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">
            No payroll records for this period. Use &quot;Generate payroll&quot; to create draft records for employees in scope.
          </div>
        ) : (
          <>
            <div className="px-4 sm:px-6 py-4 border-b border-neutral-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                <div className="rounded-xl border border-neutral-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Records in view</p>
                  <p className="text-2xl font-bold text-primary-900 tabular-nums">{totalsInView.records}</p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Total gross</p>
                  <p className="text-2xl font-bold text-primary-700 tabular-nums">{totalsInView.grossTotal.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Total net</p>
                  <p className="text-2xl font-bold text-emerald-700 tabular-nums">{totalsInView.netTotal.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Status</p>
                  <p className="text-sm text-neutral-700">
                    Paid: <span className="font-semibold text-emerald-700 tabular-nums">{totalsInView.paidCount}</span> · Approved:{' '}
                    <span className="font-semibold text-blue-700 tabular-nums">{totalsInView.approvedCount}</span>
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 tabular-nums">Draft: {totalsInView.draftCount}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Search employee, client, dept, status…"
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    aria-label="Search payroll table"
                  />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500"
                    aria-label="Filter by status"
                  >
                    <option value="">All statuses</option>
                    {uniqueStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {hasActiveTableFilters && (
                    <button
                      type="button"
                      onClick={clearTableFilters}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      Clear table filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {filteredPayrolls.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-sm">
                  No payroll records match your search/filters.
                </div>
              ) : (
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50/80">
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Employee</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Billing profile</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Dept</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">Basic</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">Gross</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">PAYE</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">NSSF</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">SHIF</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">AHL</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">Net pay</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Status</th>
                  <th className="w-10 px-4 py-3 text-center font-medium text-neutral-600">Edit</th>
                  <th className="w-10 px-4 py-3 text-right font-medium text-neutral-600">Send</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayrolls.map((p, index) => (
                      <tr
                        key={p.id}
                        className={`border-b border-neutral-100 hover:bg-neutral-50/50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/40'
                        }`}
                      >
                        <td className="px-4 py-3">
                      <span className="font-medium text-primary-900">{p.employeeName}</span>
                      {p.employeeNumber && (
                        <span className="block text-xs text-neutral-500">{p.employeeNumber}</span>
                      )}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">
                      {p.clientName}
                      {p.payrollFrequency === 'biweekly' && (
                        <span className="ml-1 text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-1 rounded">2wk</span>
                      )}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">
                          {p.accountsClientId && p.accountsClientName ? (
                            <Link
                              href={`/dashboard/accounts/clients/${p.accountsClientId}`}
                              className="text-primary-700 hover:text-primary-900 hover:underline text-xs font-medium"
                              title="Open billing client profile"
                            >
                              {p.accountsClientName}
                            </Link>
                          ) : (
                            <span className="text-neutral-400 text-xs">No linked profile</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">{p.departmentName ?? '—'}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{Number(p.basicPay).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{Number(p.grossPay).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{Number(p.paye).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{Number(p.nssf).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{Number(p.nhif).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{Number(p.ahl ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right tabular-nums font-medium">{Number(p.netPay).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            p.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.status === 'approved'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-amber-50 text-amber-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setEditPayrollId(p.id);
                              setEditEmployeeName(p.employeeName);
                            }}
                            title={`Edit pay for ${p.employeeName}`}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleSendPayslip(p.employeeId, p.employeeName)}
                            disabled={sendingId === p.employeeId}
                            title={`Send payslip for ${MONTHS[month - 1]} ${year} to ${p.employeeName}`}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-neutral-600 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {sendingId === p.employeeId ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Mail className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>

      {editPayrollId && (
        <PayrollEditModal
          payrollId={editPayrollId}
          employeeName={editEmployeeName}
          month={month}
          year={year}
          onClose={() => { setEditPayrollId(null); setEditEmployeeName(''); }}
          onSaved={fetchPayrolls}
        />
      )}
    </div>
  );
}
