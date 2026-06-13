'use client';

import { useEffect, useState } from 'react';
import { Fingerprint, RefreshCw } from 'lucide-react';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

type Device = {
 id: string;
 name: string;
 adapterKind: string;
 isActive: boolean;
 clientName: string;
 punchCount: number;
 lastObservedAt: string | null;
};

export default function BiometricDevicesPage() {
 const [devices, setDevices] = useState<Device[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 async function load() {
 try {
 setLoading(true);
 setError(null);
 const res = await fetch('/api/biometric/devices', { cache: 'no-store' });
 const json = await res.json();
 if (!res.ok) throw new Error(json.error || 'Failed to load biometric devices');
 setDevices(json.devices ?? []);
 } catch (e) {
 setError(e instanceof Error ? e.message : 'Failed to load biometric devices');
 } finally {
 setLoading(false);
 }
 }

 useEffect(() => {
 void load();
 }, []);

 return (
 <div className="page-shell">
 <DashboardPageHeader
 title="Biometric devices"
 icon={Fingerprint}
 iconClassName="h-7 w-7 shrink-0 text-primary-700"
 description="Monitor device health and punch sync activity."
 actions={
 <button
 type="button"
 onClick={() => void load()}
 className="btn-secondary inline-flex items-center gap-2"
 >
 <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
 Refresh
 </button>
 }
 className="mb-6"
 />

 {error ? <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

 <div className="dashboard-surface overflow-hidden">
 <table className="data-table dashboard-data-table w-full text-sm">
 <thead className="bg-neutral-50 text-neutral-600">
 <tr>
 <th className="px-3 py-2">Device</th>
 <th className="px-3 py-2">Client</th>
 <th className="px-3 py-2">Adapter</th>
 <th className="px-3 py-2 col-center">Punches</th>
 <th className="px-3 py-2 col-center">Last Seen</th>
 <th className="px-3 py-2 col-center">Status</th>
 </tr>
 </thead>
 <tbody>
 {devices.map((device) => (
 <tr key={device.id} className="border-t border-neutral-100">
 <td className="px-3 py-2 font-medium">{device.name}</td>
 <td className="px-3 py-2">{device.clientName}</td>
 <td className="px-3 py-2">{device.adapterKind}</td>
 <td className="px-3 py-2 col-center tabular-nums">{device.punchCount}</td>
 <td className="px-3 py-2 col-center tabular-nums">{device.lastObservedAt ? new Date(device.lastObservedAt).toLocaleString() : 'Never'}</td>
 <td className="px-3 py-2 col-center">{device.isActive ? 'Active' : 'Disabled'}</td>
 </tr>
 ))}
 {!loading && devices.length === 0 ? (
 <tr><td colSpan={6} className="px-3 py-8 text-center text-neutral-500">No biometric devices registered yet.</td></tr>
 ) : null}
 </tbody>
 </table>
 </div>
 </div>
 );
}
