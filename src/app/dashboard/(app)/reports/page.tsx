'use client';

import { useMemo, useState } from 'react';
import { BadgeCheck, BarChart3, ClipboardList, Clock3, Download, Eye, FileSpreadsheet, Landmark, ShieldCheck } from 'lucide-react';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

type GenericPayload = Record<string, unknown>;

function todayYmd() {
 return new Date().toISOString().slice(0, 10);
}

function monthYm() {
 return new Date().toISOString().slice(0, 7);
}

const inputClass =
 'rounded-lg border border-neutral-300/90 bg-white/90 px-3 py-2 text-sm text-ink focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20';

function ActionButton({
 label,
 onClick,
 kind = 'primary',
}: {
 label: string;
 onClick: () => void;
 kind?: 'primary' | 'secondary';
}) {
 return (
 <button
 type="button"
 onClick={onClick}
 className={
 kind === 'primary'
 ? 'inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-900 transition hover:bg-primary-100'
 : 'inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/90 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50'
 }
 >
 {kind === 'primary' ? <Eye className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
 {label}
 </button>
 );
}

export default function ReportsPage() {
 const [headcountAsOf, setHeadcountAsOf] = useState(todayYmd());
 const [attendanceFrom, setAttendanceFrom] = useState(
 new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10),
 );
 const [attendanceTo, setAttendanceTo] = useState(todayYmd());
 const [payrollPeriod, setPayrollPeriod] = useState(monthYm());
 const [previewTitle, setPreviewTitle] = useState<string | null>(null);
 const [previewRows, setPreviewRows] = useState<Array<Record<string, unknown>>>([]);
 const [loading, setLoading] = useState(false);

 const statutoryLinks = useMemo(
 () => [
 { label: 'P9 CSV', type: 'p9' },
 { label: 'P10 CSV', type: 'p10' },
 { label: 'NSSF CSV', type: 'nssf' },
 { label: 'SHIF CSV', type: 'shif' },
 ],
 [],
 );

 async function preview(endpoint: string, title: string) {
 setLoading(true);
 setPreviewTitle(title);
 try {
 const res = await fetch(endpoint, { cache: 'no-store' });
 const data = (await res.json()) as GenericPayload;
 const rowCandidates = ['byDepartment', 'byEmployee', 'details', 'rows'] as const;
 const firstRowKey = rowCandidates.find((k) => Array.isArray(data[k]));
 const tableRows = firstRowKey ? (data[firstRowKey] as Array<Record<string, unknown>>) : [];
 setPreviewRows(tableRows);
 } catch {
 setPreviewRows([]);
 } finally {
 setLoading(false);
 }
 }

 function download(url: string) {
 window.open(url, '_blank');
 }

 const reportCards = [
 {
 title: 'Headcount',
 description: 'Employee breakdown by department, type, and workforce mix.',
 icon: BarChart3,
 controls: (
 <input type="date" value={headcountAsOf} onChange={(e) => setHeadcountAsOf(e.target.value)} className={inputClass} />
 ),
 onView: () => preview(`/api/reports/headcount?asOf=${headcountAsOf}`, 'Headcount Report'),
 onCsv: () => download(`/api/reports/headcount?asOf=${headcountAsOf}&format=csv`),
 },
 {
 title: 'Attendance',
 description: 'Hours, overtime, lateness, and absentee trends.',
 icon: Clock3,
 controls: (
 <div className="flex flex-wrap gap-2">
 <input type="date" value={attendanceFrom} onChange={(e) => setAttendanceFrom(e.target.value)} className={inputClass} />
 <input type="date" value={attendanceTo} onChange={(e) => setAttendanceTo(e.target.value)} className={inputClass} />
 </div>
 ),
 onView: () => preview(`/api/reports/attendance?from=${attendanceFrom}&to=${attendanceTo}`, 'Attendance Report'),
 onCsv: () => download(`/api/reports/attendance?from=${attendanceFrom}&to=${attendanceTo}&format=csv`),
 },
 {
 title: 'Payroll Cost',
 description: 'Gross, net, statutory deductions, and department totals.',
 icon: Landmark,
 controls: (
 <input type="month" value={payrollPeriod} onChange={(e) => setPayrollPeriod(e.target.value)} className={inputClass} />
 ),
 onView: () => preview(`/api/reports/payroll-cost?period=${payrollPeriod}`, 'Payroll Cost Report'),
 onCsv: () => download(`/api/reports/payroll-cost?period=${payrollPeriod}&format=csv`),
 },
 {
 title: 'Credentials',
 description: 'License validity, expiries, and renewal watchlist.',
 icon: ShieldCheck,
 controls: (
 <span className="inline-flex w-fit rounded-full border border-neutral-200 bg-neutral-50/80 px-2.5 py-1 text-xs text-neutral-600">
 Status badges ready
 </span>
 ),
 onView: () => preview('/api/reports/credentials', 'Credential Status Report'),
 onCsv: () => download('/api/reports/credentials?format=csv'),
 },
 ];

 return (
 <div className="page-shell">
      <DashboardPageHeader
        title="Reports"
        description="Unified HR, payroll, attendance, and statutory returns export center."
      />

 <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
 {reportCards.map((card) => {
 const Icon = card.icon;
 return (
 <section key={card.title} className="dashboard-surface flex flex-col gap-3 p-6 shadow-sm">
 <div className="flex items-center gap-2">
 <Icon className="h-5 w-5 text-primary-800" strokeWidth={1.75} />
 <h2 className="text-base font-semibold text-ink">{card.title}</h2>
 </div>
 <p className="text-sm text-neutral-500">{card.description}</p>
 {card.controls}
 <div className="flex flex-wrap gap-2">
 <ActionButton label="View" onClick={card.onView} />
 <ActionButton label="CSV" kind="secondary" onClick={card.onCsv} />
 </div>
 </section>
 );
 })}

 <section className="dashboard-surface flex flex-col gap-3 p-6 shadow-sm">
 <div className="flex items-center gap-2">
 <ClipboardList className="h-5 w-5 text-primary-800" strokeWidth={1.75} />
 <h2 className="text-base font-semibold text-ink">Statutory Returns</h2>
 </div>
 <p className="text-sm text-neutral-500">P9, P10, NSSF, and SHIF formats ready for submission portals.</p>
 <input type="month" value={payrollPeriod} onChange={(e) => setPayrollPeriod(e.target.value)} className={inputClass} />
 <div className="flex flex-wrap gap-2">
 {statutoryLinks.map((item) => (
 <button
 key={item.type}
 type="button"
 onClick={() => download(`/api/reports/statutory?period=${payrollPeriod}&type=${item.type}&format=csv`)}
 className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/90 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50"
 >
 <FileSpreadsheet className="h-3.5 w-3.5" />
 {item.label}
 </button>
 ))}
 </div>
 </section>
 </div>

 <section className="dashboard-surface p-6 shadow-sm">
 <div className="mb-4 flex items-center justify-between gap-3">
 <h3 className="text-sm font-semibold text-ink">{previewTitle ?? 'Preview'}</h3>
 {loading ? (
 <span className="text-xs text-neutral-500">Loading…</span>
 ) : (
 <BadgeCheck className="h-4 w-4 text-primary-600" />
 )}
 </div>
 {!loading && previewRows.length === 0 ? (
 <p className="text-sm text-neutral-500">Select a report and click View to preview tabular data.</p>
 ) : null}
 {!loading && previewRows.length > 0 ? (
 <div className="data-table-wrap">
 <div className="overflow-x-auto">
 <table className="data-table dashboard-data-table w-full text-xs">
 <thead>
 <tr>
 {Object.keys(previewRows[0]).map((key) => (
 <th key={key}>{key}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {previewRows.slice(0, 100).map((row, i) => (
 <tr key={`${previewTitle}-${i}`}>
 {Object.values(row).map((value, idx) => (
 <td key={idx} className="tabular-nums">
 {typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')}
 </td>
 ))}
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 ) : null}
 </section>
 </div>
 );
}
