'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Building2, Loader2, Plus, Search, Users, Layers } from 'lucide-react';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

type Client = {
 id: string;
 name: string;
 contactName: string | null;
 contactEmail: string | null;
 contactPhone: string | null;
 county: string | null;
 employeeCount: number;
 departmentCount: number;
 contractStartDate: string | null;
 contractEndDate: string | null;
 currency: string;
};

export default function OutsourcingClientsPage() {
 const [clients, setClients] = useState<Client[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [q, setQ] = useState('');

 useEffect(() => {
 async function load() {
 setLoading(true);
 setError(null);
 try {
 const res = await fetch('/api/outsourcing/clients');
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'Failed to load clients');
 setClients(Array.isArray(data) ? data : []);
 } catch (e) {
 setError(e instanceof Error ? e.message : 'Failed to load clients');
 } finally {
 setLoading(false);
 }
 }
 void load();
 }, []);

 const filtered = useMemo(() => {
 const query = q.trim().toLowerCase();
 if (!query) return clients;
 return clients.filter(
 (c) =>
 c.name.toLowerCase().includes(query) ||
 (c.contactName || '').toLowerCase().includes(query) ||
 (c.contactEmail || '').toLowerCase().includes(query) ||
 (c.county || '').toLowerCase().includes(query)
 );
 }, [clients, q]);

 const totals = useMemo(() => {
 const totalEmployees = clients.reduce((sum, c) => sum + c.employeeCount, 0);
 const totalDepts = clients.reduce((sum, c) => sum + c.departmentCount, 0);
 return { totalEmployees, totalDepts, totalClients: clients.length };
 }, [clients]);

 return (
 <div className="page-shell">
 <DashboardPageHeader
 icon={Building2}
 title="Workspace Clients"
 description="Manage client organizations, contracts, and workforce allocation."
 actions={[
 { href: '/dashboard/outsourcing/clients/new', label: 'Add client', icon: Plus, variant: 'primary' },
 ]}
 />

 {error && (
 <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
 {error}
 </div>
 )}

 <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
 <article className="relative overflow-hidden dashboard-stat-card shadow-sm border-l-[4px] border-l-primary-500">
 <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Total clients</p>
 <p className="mt-2 text-[28px] font-semibold leading-none tabular-nums text-ink">{totals.totalClients}</p>
 <p className="mt-2 text-sm text-neutral-500">Active managed contracts</p>
 </article>
 <article className="relative overflow-hidden dashboard-stat-card shadow-sm border-l-[4px] border-l-emerald-500">
 <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Total employees</p>
 <p className="mt-2 text-[28px] font-semibold leading-none tabular-nums text-ink">{totals.totalEmployees}</p>
 <p className="mt-2 text-sm text-neutral-500">Across all clients</p>
 </article>
 <article className="relative overflow-hidden dashboard-stat-card shadow-sm border-l-[4px] border-l-amber-500">
 <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Departments</p>
 <p className="mt-2 text-[28px] font-semibold leading-none tabular-nums text-ink">{totals.totalDepts}</p>
 <p className="mt-2 text-sm text-neutral-500">Organizational units</p>
 </article>
 </section>

 <div className="dashboard-surface shadow-sm overflow-hidden">
 <div className="p-4 border-b border-neutral-200">
 <div className="relative max-w-md">
 <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
 <input
 value={q}
 onChange={(e) => setQ(e.target.value)}
 placeholder="Search by name, contact, county..."
 className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
 />
 </div>
 </div>

 {loading ? (
 <div className="py-16 flex items-center justify-center">
 <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
 </div>
 ) : filtered.length === 0 ? (
 <div className="py-16 text-center">
 <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
 <h2 className="text-base font-semibold text-ink">No clients found</h2>
 <p className="mt-1 text-sm text-neutral-500">
 {q ? 'Try different search terms.' : 'Add your first client to get started.'}
 </p>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="data-table dashboard-data-table w-full text-left min-w-[760px]">
 <thead className="bg-neutral-50 border-b border-neutral-200">
 <tr>
 <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">Client</th>
 <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">Contact</th>
 <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">County</th>
 <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase text-center">Employees</th>
 <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase text-center">Departments</th>
 <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">Contract</th>
 </tr>
 </thead>
 <tbody>
 {filtered.map((client) => (
 <tr key={client.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
 <td className="px-4 py-3">
 <Link
 href={`/dashboard/outsourcing/clients/${client.id}`}
 className="text-sm font-medium text-primary-700 hover:text-primary-900"
 >
 {client.name}
 </Link>
 </td>
 <td className="px-4 py-3">
 <div className="text-sm text-neutral-700">{client.contactName || '—'}</div>
 {client.contactEmail && (
 <div className="text-xs text-neutral-500">{client.contactEmail}</div>
 )}
 </td>
 <td className="px-4 py-3 text-sm text-neutral-600">{client.county || '—'}</td>
 <td className="px-4 py-3 text-center">
 <span className="inline-flex items-center gap-1 text-sm text-neutral-700">
 <Users className="w-3.5 h-3.5 text-neutral-400" />
 {client.employeeCount}
 </span>
 </td>
 <td className="px-4 py-3 text-center">
 <span className="inline-flex items-center gap-1 text-sm text-neutral-700">
 <Layers className="w-3.5 h-3.5 text-neutral-400" />
 {client.departmentCount}
 </span>
 </td>
 <td className="px-4 py-3 text-sm text-neutral-600">
 {client.contractStartDate
 ? `${client.contractStartDate}${client.contractEndDate ? ` → ${client.contractEndDate}` : ' → ongoing'}`
 : '—'}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 </div>
 );
}
