'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { UserRole } from '@/types/dashboard';
import {
  LayoutDashboard,
  Briefcase,
  Handshake,
  Users,
  FileCheck,
  CalendarCheck,
  BarChart3,
  UserCog,
  BookOpen,
  Folder,
  FolderOpen,
  ChevronRight,
  Building2,
  Banknote,
  CalendarDays,
  Clock,
  ClipboardList,
  TrendingUp,
  Landmark,
  FileText,
  Wallet,
  FileSignature,
  Store,
  ScrollText,
  FileStack,
  KeyRound,
  UsersRound,
  Newspaper,
} from 'lucide-react';

const NAV_STORAGE_KEY = 'dashboard-nav-expanded';
const SIDEBAR_COLLAPSED_KEY = 'dashboard-sidebar-collapsed';

interface DashboardNavProps {
  currentUserRole: UserRole | null;
  collapsed: boolean;
  /** When true, show Accounts section (admin or AccountsStaffAccess in dashboard API). */
  hasAccountsAccess?: boolean;
  /** Executive analytics (/dashboard/analytics) — admin or Director staff type. */
  canViewSystemAnalytics?: boolean;
}

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

type AccordionSection = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
};

const accordionSections: AccordionSection[] = [
  {
    id: 'recruitment',
    label: 'Recruitment',
    icon: Folder,
    items: [
      { href: '/dashboard/clients', label: 'Clients', icon: Handshake },
      { href: '/dashboard/jobs', label: 'Job openings', icon: Briefcase },
      { href: '/dashboard/applications', label: 'Applications', icon: FileCheck },
      { href: '/dashboard/candidates', label: 'Candidates', icon: Users },
      { href: '/dashboard/interviews', label: 'Interview Management', icon: CalendarCheck },
    ],
  },
  {
    id: 'people-hr',
    label: 'People & HR',
    icon: Users,
    items: [
      { href: '/dashboard/staff-leave', label: 'Staff leave', icon: CalendarDays },
      { href: '/dashboard/people/tasks', label: 'Assigned tasks', icon: ClipboardList },
      { href: '/dashboard/people/contracts', label: 'Contracts', icon: FileSignature },
      { href: '/dashboard/people/performance', label: 'Performance', icon: TrendingUp },
    ],
  },
  {
    id: 'outsourcing',
    label: 'Outsourcing',
    icon: Folder,
    items: [
      { href: '/dashboard/outsourcing/clients', label: 'Clients', icon: Building2 },
      { href: '/dashboard/outsourcing/departments', label: 'Departments', icon: FolderOpen },
      { href: '/dashboard/outsourcing/employees', label: 'Employees', icon: Users },
      { href: '/dashboard/outsourcing/leave', label: 'Leave Management', icon: CalendarDays },
      { href: '/dashboard/outsourcing/attendance', label: 'Attendance', icon: Clock },
    ],
  },
];

const contentSection: AccordionSection = {
  id: 'content',
  label: 'Content',
  icon: Newspaper,
  items: [{ href: '/dashboard/insights', label: 'Insights', icon: BookOpen }],
};

const usersSection: AccordionSection = {
  id: 'users',
  label: 'Users',
  icon: UsersRound,
  items: [
    { href: '/dashboard/users/staff', label: 'Staff', icon: UserCog },
    { href: '/dashboard/users/recruitment-clients', label: 'Recruitment client logins', icon: KeyRound },
  ],
};

const accountsSection: AccordionSection = {
  id: 'accounts',
  label: 'Accounts',
  icon: Landmark,
  items: [
    { href: '/dashboard/accounts', label: 'Overview', icon: LayoutDashboard },
    {
      href: '/dashboard/accounts/clients',
      label: 'Clients',
      icon: Building2,
    },
    { href: '/dashboard/accounts/invoices', label: 'Invoices', icon: FileText },
    { href: '/dashboard/accounts/receipts', label: 'Receipts & allocations', icon: Wallet },
    { href: '/dashboard/accounts/vendors', label: 'Vendors', icon: Store },
    { href: '/dashboard/accounts/vendor-bills', label: 'Vendor bills', icon: FileStack },
    { href: '/dashboard/accounts/statements', label: 'Statements', icon: ScrollText },
    {
      href: '/dashboard/accounts/payroll',
      label: 'Payroll',
      icon: Banknote,
    },
  ],
};

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
  indent = false,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  pathname: string;
  indent?: boolean;
}) {
  const isActive =
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      title={label}
      className={`flex items-center gap-3 rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
        indent ? 'ml-2 pl-3 py-2.5' : 'px-3 py-2.5'
      } ${
        isActive
          ? 'bg-primary-50 text-primary-900 font-semibold border border-primary-100'
          : 'text-neutral-600 hover:bg-neutral-100/90 hover:text-primary-900 border border-transparent'
      }`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-700' : ''}`} />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function NavLinkIcon({
  href,
  label,
  icon: Icon,
  pathname,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  pathname: string;
}) {
  const isActive =
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      className={`flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
        isActive
          ? 'bg-primary-100 text-primary-900 shadow-sm'
          : 'text-neutral-500 hover:bg-neutral-100 hover:text-primary-800'
      }`}
    >
      <Icon className="w-5 h-5" />
    </Link>
  );
}

function getStoredExpanded(fallbackSectionIds: string[]): Set<string> {
  if (typeof window === 'undefined') return new Set(fallbackSectionIds);
  try {
    const raw = localStorage.getItem(NAV_STORAGE_KEY);
    if (!raw) return new Set(fallbackSectionIds);
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set(fallbackSectionIds);
  }
}

function setStoredExpanded(expanded: Set<string>) {
  try {
    localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify([...expanded]));
  } catch {
    /* ignore */
  }
}

export function readSidebarCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';
  } catch {
    return false;
  }
}

export function writeSidebarCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0');
  } catch {
    /* ignore */
  }
}

export default function DashboardNav({
  currentUserRole,
  collapsed,
  hasAccountsAccess = false,
  canViewSystemAnalytics = false,
}: DashboardNavProps) {
  const pathname = usePathname();
  const sections = useMemo<AccordionSection[]>(() => {
    const chunks: AccordionSection[] = [...accordionSections, contentSection];
    if (currentUserRole === 'admin') {
      chunks.push(usersSection);
    }
    if (hasAccountsAccess) {
      chunks.push(accountsSection);
    }
    return chunks;
  }, [hasAccountsAccess, currentUserRole]);

  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set([...accordionSections.map((s) => s.id), contentSection.id])
  );

  useEffect(() => {
    const stored = getStoredExpanded(sections.map((s) => s.id));
    const expandedSet = new Set(stored);
    for (const section of sections) {
      const isActive = section.items.some(
        (item) => pathname === item.href || pathname.startsWith(item.href + '/')
      );
      if (isActive) expandedSet.add(section.id);
    }
    setExpanded(expandedSet);
  }, [pathname, sections]);

  const toggleSection = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setStoredExpanded(next);
      return next;
    });
  };

  if (collapsed) {
    const flatItems: NavItem[] = [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
      ...sections.flatMap((s) => s.items),
      ...(canViewSystemAnalytics
        ? [{ href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 } as NavItem]
        : []),
    ];
    return (
      <nav className="flex-1 py-2 px-1 overflow-y-auto overflow-x-hidden flex flex-col items-center gap-0.5">
        {flatItems.map((item) => (
          <NavLinkIcon key={item.href} {...item} pathname={pathname} />
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
      <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Menu</p>
      <NavLink href="/dashboard" label="Overview" icon={LayoutDashboard} pathname={pathname} />

      {sections.map((section) => {
        const isExpanded = expanded.has(section.id);
        const FolderIcon = isExpanded ? FolderOpen : section.icon;
        return (
          <div key={section.id} className="pt-2">
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/80"
              aria-expanded={isExpanded}
              aria-controls={`nav-section-${section.id}`}
              id={`nav-trigger-${section.id}`}
            >
              <ChevronRight
                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 text-neutral-400 ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
              <FolderIcon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-[11px] font-bold uppercase tracking-widest">{section.label}</span>
            </button>
            <div
              id={`nav-section-${section.id}`}
              role="region"
              aria-labelledby={`nav-trigger-${section.id}`}
              className={`overflow-hidden transition-all duration-200 ${
                isExpanded ? 'max-h-[560px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {/* Right padding so active state (border) is not clipped by overflow-hidden */}
              <div className="mt-1 space-y-0.5 border-l-2 border-neutral-100 ml-4 pl-2 pr-2.5 pb-0.5">
                {section.items.map((item) => (
                  <NavLink key={item.href} {...item} pathname={pathname} indent />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {canViewSystemAnalytics ? (
        <div className="pt-2 border-t border-neutral-100 mt-2">
          <NavLink href="/dashboard/analytics" label="Analytics" icon={BarChart3} pathname={pathname} />
        </div>
      ) : null}
    </nav>
  );
}
