'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Briefcase, User, FileText } from 'lucide-react';
import type { SearchResponse, SearchResultItem } from '@/app/api/search/route';

type FlattenedEntry =
  | { kind: 'section'; label: string }
  | { kind: 'item'; item: SearchResultItem; index: number };

function flattenResults(data: SearchResponse): FlattenedEntry[] {
  const out: FlattenedEntry[] = [];
  if (data.jobs.length) {
    out.push({ kind: 'section', label: 'Jobs' });
    data.jobs.forEach((item, i) => out.push({ kind: 'item', item, index: i }));
  }
  if (data.candidates.length) {
    out.push({ kind: 'section', label: 'Candidates' });
    data.candidates.forEach((item, i) => out.push({ kind: 'item', item, index: i }));
  }
  if (data.applications.length) {
    out.push({ kind: 'section', label: 'Applications' });
    data.applications.forEach((item, i) => out.push({ kind: 'item', item, index: i }));
  }
  return out;
}

function getSelectableIndexes(entries: FlattenedEntry[]): number[] {
  return entries
    .map((e, i) => (e.kind === 'item' ? i : -1))
    .filter((i) => i >= 0);
}

const ICONS: Record<SearchResultItem['type'], React.ComponentType<{ className?: string }>> = {
  job: Briefcase,
  candidate: User,
  application: FileText,
};

export default function CommandPalette({
  open,
  onClose,
  initialQuery = '',
}: {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResponse>({
    jobs: [],
    candidates: [],
    applications: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const entries = useMemo(() => flattenResults(results), [results]);
  const selectableIndexes = useMemo(() => getSelectableIndexes(entries), [entries]);
  const flatSelected = selectableIndexes[selectedIndex] ?? 0;

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    setSelectedIndex(0);
  }, [open]);

  useEffect(() => {
    const n = selectableIndexes.length;
    if (n > 0 && selectedIndex >= n) setSelectedIndex(n - 1);
  }, [selectableIndexes.length, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      if (query.trim().length < 2) {
        setResults({ jobs: [], candidates: [], applications: [] });
        return;
      }
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then((r) => r.json())
        .then((data: SearchResponse) => {
          setResults(data);
          setSelectedIndex(0);
        })
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(t);
  }, [query, open]);

  const handleSelect = useCallback(
    (item: SearchResultItem) => {
      onClose();
      router.push(item.href);
    },
    [onClose, router]
  );

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (selectableIndexes.length === 0) return;
        setSelectedIndex((i) => (i + 1) % selectableIndexes.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectableIndexes.length === 0) return;
        setSelectedIndex((i) => (i - 1 + selectableIndexes.length) % selectableIndexes.length);
        return;
      }
      if (e.key === 'Enter') {
        const idx = selectableIndexes[selectedIndex];
        if (idx !== undefined && entries[idx]?.kind === 'item') {
          e.preventDefault();
          handleSelect((entries[idx] as { kind: 'item'; item: SearchResultItem }).item);
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, selectableIndexes, selectedIndex, entries, handleSelect, onClose]);

  useEffect(() => {
    const idx = selectableIndexes[selectedIndex];
    if (idx === undefined) return;
    listRef.current?.querySelector(`[data-index="${idx}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex, selectableIndexes]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-neutral-900/40 backdrop-blur-sm">
      <div
        className="bg-white rounded-xl border border-neutral-200 shadow-xl w-full max-w-xl overflow-hidden"
        role="dialog"
        aria-label="Search"
      >
        <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, candidates, applications..."
            className="flex-1 min-w-0 py-2 bg-transparent text-primary-900 placeholder-neutral-400 focus:outline-none text-sm"
            aria-label="Search query"
          />
          <kbd className="hidden sm:inline text-xs text-neutral-400 border border-neutral-200 rounded px-1.5 py-0.5">
            Esc
          </kbd>
        </div>

        <div
          ref={listRef}
          className="max-h-[min(60vh,400px)] overflow-y-auto py-2"
        >
          {query.trim().length < 2 ? (
            <p className="px-4 py-6 text-sm text-neutral-500 text-center">
              Type at least 2 characters to search
            </p>
          ) : loading ? (
            <p className="px-4 py-6 text-sm text-neutral-500 text-center">
              Searching...
            </p>
          ) : entries.length === 0 ? (
            <p className="px-4 py-6 text-sm text-neutral-500 text-center">
              No results for &quot;{query}&quot;
            </p>
          ) : (
            <ul className="space-y-0.5">
              {entries.map((entry, i) => {
                if (entry.kind === 'section') {
                  return (
                    <li
                      key={entry.label}
                      className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500"
                    >
                      {entry.label}
                    </li>
                  );
                }
                const Icon = ICONS[entry.item.type];
                const isSelected = i === flatSelected;
                return (
                  <li key={`${entry.item.type}-${entry.item.id}`} data-index={i}>
                    <button
                      type="button"
                      onClick={() => handleSelect(entry.item)}
                      onMouseEnter={() => {
                        const pos = selectableIndexes.indexOf(i);
                        if (pos >= 0) setSelectedIndex(pos);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                        isSelected
                          ? 'bg-primary-50 text-primary-900'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span className="flex-1 min-w-0 truncate font-medium">
                        {entry.item.label}
                      </span>
                      {entry.item.subtitle && (
                        <span className="text-neutral-500 truncate max-w-[40%]">
                          {entry.item.subtitle}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-neutral-100 px-4 py-2 flex items-center justify-between text-xs text-neutral-400">
          <span>
            <kbd className="border border-neutral-200 rounded px-1">↑</kbd>
            <kbd className="border border-neutral-200 rounded px-1 ml-1">↓</kbd> navigate
          </span>
          <span>
            <kbd className="border border-neutral-200 rounded px-1">Enter</kbd> open
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 -z-10"
        aria-label="Close"
      />
    </div>
  );
}
