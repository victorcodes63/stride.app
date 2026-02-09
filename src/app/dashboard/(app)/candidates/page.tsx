'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, MapPin, FileText, Filter, Loader2 } from 'lucide-react';
import type { CandidateSummary } from '@/types/dashboard';

const inputBase =
  'h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white';

export default function DashboardCandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');
  const [educationFilter, setEducationFilter] = useState('');
  const [candidates, setCandidates] = useState<CandidateSummary[]>([]);
  const [jobOptions, setJobOptions] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (jobFilter) params.set('jobId', jobFilter);
    if (minExperience.trim()) params.set('minExperience', minExperience.trim());
    if (maxExperience.trim()) params.set('maxExperience', maxExperience.trim());
    if (educationFilter.trim()) params.set('education', educationFilter.trim());
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    Promise.all([
      fetch(`/api/candidates?${params}`).then((r) => r.json()),
      fetch('/api/jobs').then((r) => r.json()),
    ])
      .then(([cands, jobs]: [CandidateSummary[], { id: string; title: string }[]]) => {
        if (!cancelled) {
          setCandidates(Array.isArray(cands) ? cands : []);
          setJobOptions(Array.isArray(jobs) ? jobs.map((j) => ({ id: j.id, title: j.title })) : []);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load candidates.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [jobFilter, minExperience, maxExperience, educationFilter, searchQuery]);

  const filtered = candidates;
  const hasActiveFilters =
    jobFilter || minExperience.trim() || maxExperience.trim() || educationFilter.trim();

  return (
    <div className="w-full min-w-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-1">
          Candidates
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base">
          Your candidate database. Search and view all applicants and talent pool.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 ${inputBase}`}
              aria-label="Search candidates"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <Filter className="w-4 h-4 text-neutral-400 shrink-0" aria-hidden />
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className={`min-w-[140px] ${inputBase}`}
                aria-label="Filter by job"
              >
                <option value="">All jobs</option>
                {jobOptions.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="number"
              placeholder="Min yrs"
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
              min={0}
              className={`w-20 ${inputBase}`}
              aria-label="Minimum experience in years"
            />
            <input
              type="number"
              placeholder="Max yrs"
              value={maxExperience}
              onChange={(e) => setMaxExperience(e.target.value)}
              min={0}
              className={`w-20 ${inputBase}`}
              aria-label="Maximum experience in years"
            />
            <input
              type="text"
              placeholder="Education (e.g. MBA, B.Com)"
              value={educationFilter}
              onChange={(e) => setEducationFilter(e.target.value)}
              title="Filter by education field"
              className={`min-w-[180px] flex-1 max-w-[220px] ${inputBase}`}
              aria-label="Filter by education"
            />
          </div>
        </div>
        {!loading && (
          <p className="mt-3 text-xs text-neutral-500">
            {filtered.length === 0
              ? hasActiveFilters
                ? 'No candidates match your filters.'
                : 'No candidates yet.'
              : `${filtered.length} candidate${filtered.length !== 1 ? 's' : ''}`}
          </p>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 sm:p-12 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 sm:p-12 text-center">
          <Users className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 mb-4">
            {hasActiveFilters
              ? 'No candidates match your filters. Try adjusting or clearing the filters above.'
              : 'No candidates in the database yet. Candidates will appear here once applications are submitted.'}
          </p>
          {!hasActiveFilters && (
            <Link
              href="/dashboard/applications"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
            >
              View applications
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden min-w-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 px-5 py-3">
                  Candidate
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 px-5 py-3">
                  Email
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 px-5 py-3">
                  Experience
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 px-5 py-3">
                  Skills
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary-700">
                          {candidate.firstName[0]}
                          {candidate.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-primary-900 text-sm">
                          {candidate.firstName} {candidate.lastName}
                        </p>
                        {candidate.location && (
                          <p className="text-xs text-neutral-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {candidate.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-600 text-sm">
                    <span className="truncate max-w-[200px] block">{candidate.email}</span>
                  </td>
                  <td className="px-5 py-3 text-neutral-600 text-sm">
                    {candidate.experience} years
                    {candidate.education && (
                      <span className="text-neutral-500"> · {candidate.education}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {candidate.skills && Array.isArray(candidate.skills) && candidate.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {s}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="text-xs text-neutral-500">+{candidate.skills.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-neutral-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {candidate.resumePath && (
                        <a
                          href={candidate.resumePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Resume
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
}
