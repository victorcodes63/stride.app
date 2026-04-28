'use client';

import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/toast';

type MePayload = {
  name: string;
  email: string;
  role: string;
  employee: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    jobTitle: string | null;
    employeeNumber: string | null;
    employmentStatus: string;
    dateOfJoining: string | null;
  } | null;
};

export default function EssProfilePage() {
  const [me, setMe] = useState<MePayload | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/ess/auth/me')
      .then((r) => r.json())
      .then((data) => {
        const payload = data as MePayload;
        setMe(payload);
        setPhone(payload.employee?.phone || '');
        setEmail(payload.employee?.email || '');
      })
      .catch(() => setMe(null));
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/ess/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || 'Could not update profile.');
        return;
      }
      toast.success('Profile updated successfully.');
      setMe((prev) =>
        prev
          ? {
              ...prev,
              employee: prev.employee
                ? { ...prev.employee, phone: data.phone ?? null, email: data.email ?? null }
                : prev.employee,
            }
          : prev,
      );
    } catch {
      toast.error('Could not update profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-900">Profile</h1>
      <section className="bg-white border border-neutral-200 rounded-xl p-4">
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-neutral-500">ESS name</dt>
            <dd className="text-neutral-900 font-medium">{me?.name || '-'}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">ESS email</dt>
            <dd className="text-neutral-900 font-medium">{me?.email || '-'}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Role</dt>
            <dd className="text-neutral-900 font-medium capitalize">{me?.role || '-'}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Employee number</dt>
            <dd className="text-neutral-900 font-medium">{me?.employee?.employeeNumber || '-'}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Job title</dt>
            <dd className="text-neutral-900 font-medium">{me?.employee?.jobTitle || '-'}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Employment status</dt>
            <dd className="text-neutral-900 font-medium capitalize">{me?.employee?.employmentStatus || '-'}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Phone</dt>
            <dd className="text-neutral-900 font-medium">{me?.employee?.phone || '-'}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Date joined</dt>
            <dd className="text-neutral-900 font-medium">
              {me?.employee?.dateOfJoining ? new Date(me.employee.dateOfJoining).toLocaleDateString() : '-'}
            </dd>
          </div>
        </dl>
      </section>
      <section className="bg-white border border-neutral-200 rounded-xl p-4 max-w-xl">
        <h2 className="text-sm font-semibold text-neutral-800 mb-3">Update contact details</h2>
        <form className="space-y-3" onSubmit={onSave}>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Employee email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </section>
    </div>
  );
}
