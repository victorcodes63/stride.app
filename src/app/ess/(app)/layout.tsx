'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Clock3 } from 'lucide-react';

type EssMe = {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager' | 'hr';
  mustResetPassword: boolean;
};

export default function EssAppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<EssMe | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/ess/auth/me')
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Unauthorized');
        return data as EssMe;
      })
      .then((data) => {
        if (cancelled) return;
        setMe(data);
      })
      .catch(() => {
        if (!cancelled) router.replace('/ess/login');
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!me?.mustResetPassword) return;
    if (pathname !== '/ess/account-security') {
      router.replace('/ess/account-security');
    }
  }, [me?.mustResetPassword, pathname, router]);

  async function onLogout() {
    await fetch('/api/ess/auth/logout', { method: 'POST' });
    router.replace('/ess/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">Employee Self Service</p>
            <p className="text-sm font-semibold text-primary-900">{me?.name || 'Loading...'}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 rounded-md border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <nav className="mb-6 flex flex-wrap gap-2">
          {[
            { href: '/ess', label: 'Overview' },
            { href: '/ess/profile', label: 'Profile' },
            { href: '/ess/leave', label: 'Leave' },
            { href: '/ess/attendance', label: 'Attendance', icon: Clock3 },
            ...(me?.role === 'manager' || me?.role === 'hr'
              ? [{ href: '/ess/leave-approvals', label: 'Leave approvals' }]
              : []),
            { href: '/ess/payslips', label: 'Payslips' },
            { href: '/ess/account-security', label: 'Account security' },
          ].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm border ${
                  active
                    ? 'border-primary-200 bg-primary-50 text-primary-700 font-medium'
                    : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {item.icon ? <item.icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        {children}
      </div>
    </div>
  );
}
