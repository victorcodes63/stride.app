'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNav, { readSidebarCollapsed, writeSidebarCollapsed } from '@/components/dashboard/DashboardNav';
import DashboardTopbar from '@/components/dashboard/DashboardTopbar';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import type { UserSummary } from '@/types/dashboard';

export default function DashboardAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSummary | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarReady, setSidebarReady] = useState(false);

  useEffect(() => {
    setSidebarCollapsed(readSidebarCollapsed());
    setSidebarReady(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((c) => {
      const next = !c;
      writeSidebarCollapsed(next);
      return next;
    });
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((r) => {
        if (r.status === 401 || r.status === 403) {
          throw new Error('unauthorized');
        }
        if (!r.ok) throw new Error('Failed to load current user');
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setCurrentUser(data as UserSummary);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setCurrentUser(null);
        if (error instanceof Error && error.message === 'unauthorized') {
          router.replace('/dashboard/login?error=inactive');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const displayName = currentUser?.name || 'Staff User';
  const displayEmail = currentUser?.email || 'staff@eaglehr.co.ke';
  const initials = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('') || 'SU';

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/dashboard/login';
  };

  return (
    <div className="h-screen overflow-hidden flex bg-neutral-100/80">
      {/* Sidebar — collapsible for more content width on laptops */}
      <aside
        className={`print:hidden relative h-screen flex-shrink-0 flex flex-col border-r border-neutral-200/90 bg-white shadow-[4px_0_24px_-12px_rgba(0,0,0,0.06)] transition-[width] duration-200 ease-out overflow-visible ${
          sidebarReady && sidebarCollapsed ? 'w-[4.5rem]' : 'w-64'
        } ${!sidebarReady ? 'w-64' : ''}`}
      >
        {/* Vertically centered collapse/expand — sits on sidebar edge, arrow out when collapsed */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="absolute top-1/2 -translate-y-1/2 left-full -translate-x-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-md hover:bg-primary-50 hover:text-primary-800 hover:border-primary-200 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!sidebarCollapsed}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" strokeWidth={2.25} />
          ) : (
            <ChevronLeft className="w-5 h-5" strokeWidth={2.25} />
          )}
        </button>

        <div className="flex-shrink-0 border-b border-neutral-100/90 bg-gradient-to-b from-white to-neutral-50/50 overflow-hidden">
          <div
            className={`flex w-full items-center justify-center ${
              sidebarCollapsed ? 'py-3 px-2' : 'py-4 px-4'
            }`}
          >
            <Link
              href="/"
              className="flex w-full justify-center items-center rounded-xl hover:bg-neutral-100/80 transition-colors py-1"
              title="Eagle HR home"
            >
              {sidebarCollapsed ? (
                <Image
                  src="/images/logo/logo_dark_ubxaCll.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain mx-auto"
                />
              ) : (
                <Image
                  src="/images/logo/logo_dark_ubxaCll.png"
                  alt="Eagle HR Consultants"
                  width={150}
                  height={45}
                  className="h-11 w-auto object-contain mx-auto max-w-[10rem]"
                />
              )}
            </Link>
          </div>
        </div>

        <DashboardNav currentUserRole={currentUser?.role ?? null} collapsed={sidebarReady && sidebarCollapsed} />

        <div className={`mt-auto flex-shrink-0 border-t border-neutral-100 bg-neutral-50/30 ${sidebarCollapsed ? 'p-2' : 'p-3'}`}>
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center"
                title={displayName}
              >
                <span className="text-xs font-bold text-primary-800">{initials}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-neutral-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl hover:bg-white/80 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm">
                  <span className="text-sm font-semibold text-primary-800">{initials}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-primary-900 truncate">{displayName}</p>
                  <p className="text-xs text-neutral-500 truncate">{displayEmail}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-neutral-600 hover:text-red-700 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar currentUser={currentUser} />
        <main className="flex-1 overflow-auto">
          <div className="w-full min-w-0 max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
