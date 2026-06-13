'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { UserRole } from '@/types/dashboard';
import type { EnabledModulesMap } from '@/lib/nav-modules';
import {
  ALL_MODULES_ENABLED,
  buildDashboardNavSections,
  DASHBOARD_NAV_GROUPS,
  OVERVIEW_NAV_ITEM,
  resolveDashboardNavItems,
  type DashboardNavItem,
  type DashboardNavSection,
} from '@/lib/dashboard-nav-catalog';
import { ChevronRight, Pin, PinOff, type LucideIcon } from 'lucide-react';

const NAV_STORAGE_KEY = 'dashboard-nav-expanded';
const SIDEBAR_COLLAPSED_KEY = 'dashboard-sidebar-collapsed';

interface DashboardNavProps {
  currentUserRole: UserRole | null;
  hasAccountsAccess?: boolean;
  canViewSystemAnalytics?: boolean;
  enabledModules?: EnabledModulesMap;
  onNavigate?: () => void;
}

function isPathActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  const base = href.split('?')[0];
  return pathname === base || pathname.startsWith(base + '/');
}

function NavPinButton({
  href,
  isPinned,
  onTogglePin,
  variant = 'default',
}: {
  href: string;
  isPinned: boolean;
  onTogglePin: (href: string) => void;
  variant?: 'default' | 'onPrimary';
}) {
  const idleClass =
    variant === 'onPrimary'
      ? 'text-white/50 opacity-60 group-hover/link-row:opacity-100 group-hover/link-row:text-white hover:bg-white/15 hover:text-white'
      : 'text-neutral-400 opacity-50 group-hover/link-row:opacity-100 hover:bg-neutral-100 hover:text-primary-600';

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onTogglePin(href);
      }}
      className={`ml-auto flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:opacity-100 ${
        isPinned
          ? variant === 'onPrimary'
            ? 'text-white opacity-100 hover:bg-white/15'
            : 'text-primary-600 opacity-100'
          : idleClass
      }`}
      title={isPinned ? 'Unpin from top' : 'Pin to top'}
      aria-label={isPinned ? `Unpin ${href} from top` : `Pin ${href} to top`}
      aria-pressed={isPinned}
    >
      {isPinned ? <PinOff className="h-3.5 w-3.5" strokeWidth={1.75} /> : <Pin className="h-3.5 w-3.5" strokeWidth={1.75} />}
    </button>
  );
}

function NavSubLink({
  href,
  label,
  pathname,
  onNavigate,
  isPinned,
  onTogglePin,
  isLast = false,
  sectionActive = false,
}: {
  href: string;
  label: string;
  pathname: string;
  onNavigate?: () => void;
  isPinned: boolean;
  onTogglePin: (href: string) => void;
  isLast?: boolean;
  sectionActive?: boolean;
}) {
  const isActive = isPathActive(pathname, href);
  const connectorClass = sectionActive ? 'bg-primary-200' : 'bg-neutral-200';

  return (
    <div className="relative flex items-stretch">
      <div className="relative ml-3 w-4 flex-shrink-0">
        <span
          className={`absolute left-0 top-0 w-px ${connectorClass} ${isLast ? 'h-3.5' : 'bottom-0 h-full'}`}
          aria-hidden
        />
        <span className={`absolute left-0 top-3.5 h-px w-3 ${connectorClass}`} aria-hidden />
      </div>
      <Link
        href={href}
        onClick={onNavigate}
        title={label}
        className={`group/link-row mb-0.5 flex min-w-0 flex-1 items-center gap-1 rounded-md py-1 pl-1 pr-1 text-[12.5px] leading-snug transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 ${
          isActive
            ? 'bg-primary-50 font-medium text-primary-900'
            : 'font-normal text-neutral-600 hover:bg-neutral-50 hover:text-ink'
        }`}
      >
        <span className="truncate">{label}</span>
        <NavPinButton href={href} isPinned={isPinned} onTogglePin={onTogglePin} />
      </Link>
    </div>
  );
}

function NavRootLink({
  href,
  label,
  icon: Icon,
  pathname,
  onNavigate,
  isPinned,
  onTogglePin,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  pathname: string;
  onNavigate?: () => void;
  isPinned: boolean;
  onTogglePin: (href: string) => void;
}) {
  const isActive = isPathActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`group/link-row flex h-8 items-center gap-2 rounded-lg px-2 pr-1 text-[13px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 ${
        isActive
          ? 'bg-primary-600 font-medium text-white shadow-sm'
          : 'font-medium text-neutral-700 hover:bg-neutral-100/80 hover:text-ink'
      }`}
    >
      <Icon
        className={`h-4 w-4 flex-shrink-0 [stroke-width:1.75] ${isActive ? 'text-white' : 'text-neutral-500'}`}
      />
      <span className="truncate">{label}</span>
      <NavPinButton
        href={href}
        isPinned={isPinned}
        onTogglePin={onTogglePin}
        variant={isActive ? 'onPrimary' : 'default'}
      />
    </Link>
  );
}

function NavGroupLabel({ label }: { label: string }) {
  return (
    <p className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
      {label}
    </p>
  );
}

function getStoredExpanded(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(NAV_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function setStoredExpanded(expanded: Set<string>) {
  try {
    localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify([...expanded]));
  } catch {
    /* ignore */
  }
}

function getActiveSectionIds(sections: DashboardNavSection[], pathname: string): Set<string> {
  const active = new Set<string>();
  for (const section of sections) {
    if (section.items.some((item) => isPathActive(pathname, item.href))) {
      active.add(section.id);
    }
  }
  return active;
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
  hasAccountsAccess = false,
  canViewSystemAnalytics = false,
  enabledModules = ALL_MODULES_ENABLED,
  onNavigate,
}: DashboardNavProps) {
  const pathname = usePathname();
  const navOptions = useMemo(
    () => ({
      currentUserRole,
      hasAccountsAccess,
      canViewSystemAnalytics,
      enabledModules,
    }),
    [canViewSystemAnalytics, currentUserRole, enabledModules, hasAccountsAccess],
  );

  const sections = useMemo(() => buildDashboardNavSections(navOptions), [navOptions]);
  const groupLabelBySection = useMemo(() => {
    const map = new Map<string, string>();
    for (const group of DASHBOARD_NAV_GROUPS) {
      map.set(group.startSectionId, group.label);
    }
    return map;
  }, []);

  const [pinnedHrefs, setPinnedHrefs] = useState<string[]>([]);
  const [pinsLoaded, setPinsLoaded] = useState(false);

  const pinnedItems = useMemo(
    () => resolveDashboardNavItems(pinnedHrefs, sections),
    [pinnedHrefs, sections],
  );

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    let cancelled = false;
    fetch('/api/dashboard/nav-preferences')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { pinned?: string[] } | null) => {
        if (cancelled || !data?.pinned) return;
        setPinnedHrefs(Array.isArray(data.pinned) ? data.pinned : []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setPinsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;
    const stored = getStoredExpanded();
    const activeSections = getActiveSectionIds(sections, pathname);
    const expandedSet = new Set([...stored, ...activeSections]);
    setExpanded(expandedSet);
    setHydrated(true);
  }, [hasMounted, pathname, sections]);

  const persistPins = useCallback(async (next: string[]) => {
    try {
      const response = await fetch('/api/dashboard/nav-preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: next }),
      });
      if (!response.ok) return;
      const data = (await response.json()) as { pinned?: string[] };
      if (Array.isArray(data.pinned)) setPinnedHrefs(data.pinned);
    } catch {
      /* keep optimistic state */
    }
  }, []);

  const togglePin = useCallback(
    (href: string) => {
      setPinnedHrefs((prev) => {
        const next = prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href];
        void persistPins(next);
        return next;
      });
    },
    [persistPins],
  );

  const isPinned = useCallback((href: string) => pinnedHrefs.includes(href), [pinnedHrefs]);

  const toggleSection = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setStoredExpanded(next);
      return next;
    });
  };

  const renderPinnedLink = (item: DashboardNavItem) => (
    <NavRootLink
      key={item.href}
      {...item}
      pathname={pathname}
      onNavigate={onNavigate}
      isPinned={isPinned(item.href)}
      onTogglePin={togglePin}
    />
  );

  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-1.5 scrollbar-thin">
      {pinsLoaded && pinnedItems.length > 0 ? (
        <div className="mb-1">
          <NavGroupLabel label="Pinned" />
          <div className="space-y-0.5">{pinnedItems.map(renderPinnedLink)}</div>
        </div>
      ) : null}

      <NavRootLink
        {...OVERVIEW_NAV_ITEM}
        pathname={pathname}
        onNavigate={onNavigate}
        isPinned={isPinned(OVERVIEW_NAV_ITEM.href)}
        onTogglePin={togglePin}
      />

      {sections.map((section) => {
        const isExpanded = hasMounted && hydrated ? expanded.has(section.id) : false;
        const sectionActive = section.items.some((item) => isPathActive(pathname, item.href));
        const SectionIcon = section.icon;
        const groupLabel = groupLabelBySection.get(section.id);

        return (
          <div key={section.id}>
            {groupLabel ? <NavGroupLabel label={groupLabel} /> : null}
            <div>
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={`flex h-8 w-full items-center gap-2 rounded-lg px-2 text-left text-[13px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 ${
                  sectionActive
                    ? 'bg-neutral-100 font-semibold text-ink'
                    : 'font-medium text-neutral-600 hover:bg-neutral-50'
                }`}
                aria-expanded={isExpanded}
                aria-controls={`nav-section-${section.id}`}
                id={`nav-trigger-${section.id}`}
              >
                <SectionIcon
                  className={`h-4 w-4 flex-shrink-0 [stroke-width:1.75] ${
                    sectionActive ? 'text-primary-600' : 'text-neutral-400'
                  }`}
                />
                <span className="min-w-0 flex-1 truncate">{section.label}</span>
                <ChevronRight
                  className={`h-3.5 w-3.5 flex-shrink-0 text-neutral-400 transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>

              <div
                id={`nav-section-${section.id}`}
                role="region"
                aria-labelledby={`nav-trigger-${section.id}`}
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-0.5 pb-1 pt-0.5">
                    {section.items.map((item, index) => (
                      <NavSubLink
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        pathname={pathname}
                        onNavigate={onNavigate}
                        isPinned={isPinned(item.href)}
                        onTogglePin={togglePin}
                        isLast={index === section.items.length - 1}
                        sectionActive={sectionActive}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
