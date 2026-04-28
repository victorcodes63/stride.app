'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Plus, Wallet } from 'lucide-react';

type AttendanceRow = {
  id: string;
  employee?: { firstName?: string; lastName?: string };
  workDate: string;
  firstInAt?: string | null;
  lateMinutes?: number;
};
type MyTaskRow = {
  id: string;
  title: string;
  dueDate?: string | null;
  status: string;
  workflow: { employee: { firstName: string; lastName: string } };
};

export default function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [totalStaff, setTotalStaff] = useState(0);
  const [onDuty, setOnDuty] = useState(0);
  const [onLeave, setOnLeave] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);
  const [grossTotal, setGrossTotal] = useState(0);
  const [netTotal, setNetTotal] = useState(0);
  const [deductionsTotal, setDeductionsTotal] = useState(0);
  const [myOnboardingTasks, setMyOnboardingTasks] = useState<MyTaskRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    Promise.all([
      fetch('/api/outsourcing/employees').then((r) => r.json().catch(() => [])),
      fetch('/api/outsourcing/attendance').then((r) => r.json().catch(() => ({ summaries: [] }))),
      fetch('/api/staff/leave/applications?scope=team&status=pending').then((r) => r.json().catch(() => [])),
      fetch(`/api/outsourcing/payroll?month=${month}&year=${year}`).then((r) => r.json().catch(() => [])),
      fetch('/api/onboarding/tasks?mine=true&statuses=PENDING,OVERDUE').then((r) => r.json().catch(() => [])),
    ]).then(([employees, attendance, leaves, payroll, myTasks]) => {
      if (cancelled) return;
      const employeeList = Array.isArray(employees) ? employees : [];
      const attendanceList = Array.isArray(attendance?.summaries) ? attendance.summaries : [];
      const leaveList = Array.isArray(leaves) ? leaves : [];
      const payrollList = Array.isArray(payroll) ? payroll : [];
      const taskList = Array.isArray(myTasks) ? myTasks : [];
      setTotalStaff(employeeList.length);
      setOnDuty(attendanceList.filter((r: AttendanceRow) => Boolean(r.firstInAt)).length);
      setOnLeave(leaveList.filter((l: { status?: string }) => l.status === 'approved').length);
      setPendingApprovals(leaveList.length);
      setAttendanceRows(attendanceList.slice(0, 10));
      setGrossTotal(payrollList.reduce((sum: number, r: { grossPay?: string }) => sum + Number(r.grossPay ?? 0), 0));
      setNetTotal(payrollList.reduce((sum: number, r: { netPay?: string }) => sum + Number(r.netPay ?? 0), 0));
      setDeductionsTotal(payrollList.reduce((sum: number, r: { paye?: string; nssf?: string; nhif?: string; ahl?: string }) => sum + Number(r.paye ?? 0) + Number(r.nssf ?? 0) + Number(r.nhif ?? 0) + Number(r.ahl ?? 0), 0));
      setMyOnboardingTasks(taskList.slice(0, 5));
      setLoading(false);
    }).catch(() => {
      if (cancelled) return;
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const onDutyRate = useMemo(() => (totalStaff ? Math.round((onDuty / totalStaff) * 100) : 0), [onDuty, totalStaff]);
  const money = (v: number) => `KES ${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (loading) {
    return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-32" />)}</div>;
  }

  return (
    <div className="page-shell space-y-6">
      <header className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-description">Operational snapshot for people, attendance, leave, and payroll.</p>
        </div>
        <Link href="/dashboard/employees/new" className="btn-primary inline-flex items-center">Add employee</Link>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total staff', value: totalStaff, note: 'Clinical and non-clinical', accent: 'border-l-[4px] border-l-[#00a2c9]' },
          { label: 'On duty', value: onDuty, note: `${onDutyRate}% rate`, accent: 'border-l-[4px] border-l-green-700' },
          { label: 'On leave', value: onLeave, note: 'Approved leave', accent: 'border-l-[4px] border-l-amber-700' },
          { label: 'Pending approvals', value: pendingApprovals, note: 'Needs review', accent: 'border-l-[4px] border-l-blue-800' },
        ].map((tile) => (
          <article key={tile.label} className={`rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-sm ${tile.accent}`}>
            <p className="text-xs uppercase tracking-[0.04em] text-neutral-500">{tile.label}</p>
            <p className="mt-2 text-[34px] font-semibold leading-none text-[#0b1f2a] tabular-nums">{tile.value}</p>
            <p className="mt-2 text-sm text-neutral-500">{tile.note}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3 data-table-wrap">
          <div className="border-b border-neutral-200 px-4 py-3"><h2 className="text-base font-medium text-[#0b1f2a]">Today&apos;s attendance</h2></div>
          <table className="data-table">
            <thead><tr><th>Time</th><th>Employee</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>{attendanceRows.map((r) => <tr key={r.id}><td>{r.firstInAt ? new Date(r.firstInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td><td>{`${r.employee?.firstName ?? ''} ${r.employee?.lastName ?? ''}`.trim() || 'Unknown'}</td><td>{new Date(r.workDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td><td><span className={`badge-status ${Number(r.lateMinutes ?? 0) > 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{Number(r.lateMinutes ?? 0) > 0 ? 'Late' : 'On time'}</span></td></tr>)}</tbody>
          </table>
        </div>
        <div className="xl:col-span-2 rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
          <h2 className="text-base font-medium text-[#0b1f2a]">Alerts</h2>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Pending leave approvals: {pendingApprovals}</div>
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">Missing clock-outs require review in attendance.</div>
          <Link href="/dashboard/staff-leave" className="text-sm font-medium text-[#00a2c9]">View all</Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3 rounded-lg border border-neutral-200 bg-white p-4">
          <h2 className="text-base font-medium text-[#0b1f2a] mb-4">Payroll summary</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div><p className="text-xs uppercase tracking-[0.04em] text-neutral-500">Gross</p><p className="mt-1 text-sm font-semibold text-[#0b1f2a] tabular-nums">{money(grossTotal)}</p></div>
            <div><p className="text-xs uppercase tracking-[0.04em] text-neutral-500">Net</p><p className="mt-1 text-sm font-semibold text-[#0b1f2a] tabular-nums">{money(netTotal)}</p></div>
            <div><p className="text-xs uppercase tracking-[0.04em] text-neutral-500">Deductions</p><p className="mt-1 text-sm font-semibold text-[#0b1f2a] tabular-nums">{money(deductionsTotal)}</p></div>
          </div>
        </div>
        <div className="xl:col-span-2">
          <h2 className="mb-3 text-base font-medium text-[#0b1f2a]">Quick actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[{ href: '/dashboard/payroll', label: 'Run payroll', icon: Wallet }, { href: '/dashboard/staff-leave', label: 'Approve leave', icon: CalendarDays }, { href: '/dashboard/rota', label: 'View rota', icon: CalendarDays }, { href: '/dashboard/employees/new', label: 'Add employee', icon: Plus }].map((action) => <Link key={action.href} href={action.href} className="rounded-md border border-neutral-200 bg-white p-4 hover:bg-primary-50"><action.icon className="h-6 w-6 text-[#00a2c9]" strokeWidth={1.75} /><p className="mt-2 text-sm text-[#0b1f2a]">{action.label}</p></Link>)}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="text-base font-medium text-[#0b1f2a]">My onboarding tasks ({myOnboardingTasks.length})</h2>
        <div className="mt-3 space-y-2">
          {myOnboardingTasks.map((task) => (
            <div key={task.id} className="rounded border border-neutral-200 p-3 text-sm">
              <p className="font-medium text-neutral-900">{task.title} - {task.workflow.employee.firstName} {task.workflow.employee.lastName}</p>
              <p className={`text-xs ${task.status === 'OVERDUE' ? 'text-red-700' : 'text-neutral-500'}`}>
                {task.status} {task.dueDate ? `• Due ${new Date(task.dueDate).toLocaleDateString()}` : ''}
              </p>
            </div>
          ))}
          {myOnboardingTasks.length === 0 ? <p className="text-sm text-neutral-500">No pending onboarding tasks.</p> : null}
        </div>
      </section>
    </div>
  );
}
