'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import Link from 'next/link';
import { Handshake, Plus, Pencil, Trash2, Search, Filter, ChevronDown, Mail, Phone, User, Building2, Briefcase } from 'lucide-react';

interface ClientRecord {
  id: string;
  name: string;
  isAnonymous: boolean;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  jobCount?: number;
}

export default function DashboardClientsPage() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDisplay, setFilterDisplay] = useState<'all' | 'public' | 'anonymous'>('all');
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/clients');
      if (!res.ok) throw new Error('Failed to load clients');
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load clients');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const name = client.name.toLowerCase();
        const contact = [client.contactName, client.contactEmail, client.contactPhone]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!name.includes(q) && !contact.includes(q)) return false;
      }
      if (filterDisplay === 'public' && client.isAnonymous) return false;
      if (filterDisplay === 'anonymous' && !client.isAnonymous) return false;
      return true;
    });
  }, [clients, searchQuery, filterDisplay]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete client "${name}"? Jobs linked to this client will keep their current company display.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchClients();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete client');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-1">Clients</h1>
          <p className="text-neutral-600 text-sm sm:text-base">
            Manage client companies. Tie jobs to clients and choose whether to show the company name publicly or as anonymous.
          </p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] sm:min-h-0 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors shrink-0"
        >
          <Plus className="w-5 h-5" />
          Add client
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 sm:p-12">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-neutral-200 rounded w-1/3" />
            <div className="h-4 bg-neutral-100 rounded w-full" />
            <div className="h-4 bg-neutral-100 rounded w-5/6" />
          </div>
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 sm:p-12 text-center">
          <Handshake className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 mb-4">
            No clients yet. Add a client to tie jobs to companies and control public vs anonymous display.
          </p>
          <Link
            href="/dashboard/clients/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add client
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1 min-w-0 max-w-xs sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search by name or contact…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                <Filter className="w-3.5 h-3.5" />
                Filters
              </span>
              <select
                value={filterDisplay}
                onChange={(e) => setFilterDisplay(e.target.value as 'all' | 'public' | 'anonymous')}
                className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white text-neutral-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-0"
                title="Filter by display on job board"
              >
                <option value="all">All (public & anonymous)</option>
                <option value="public">Public (name shown)</option>
                <option value="anonymous">Anonymous (Confidential)</option>
              </select>
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 sm:p-12 text-center">
              <Filter className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 mb-2">No clients match your filters.</p>
              <p className="text-sm text-neutral-500 mb-4">Try changing the search or filter above.</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setFilterDisplay('all'); }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden min-w-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50/80">
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 px-4 sm:px-5 py-3">Client name</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 px-4 sm:px-5 py-3">Contact</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 px-4 sm:px-5 py-3">Jobs</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 px-4 sm:px-5 py-3">Display on job board</th>
                      <th className="text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 px-4 sm:px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredClients.map((client) => {
                      const isExpanded = expandedClientId === client.id;
                      return (
                        <Fragment key={client.id}>
                          <tr className="hover:bg-neutral-50/70 transition-colors">
                            <td className="px-4 sm:px-5 py-3">
                              <button
                                type="button"
                                onClick={() => setExpandedClientId(isExpanded ? null : client.id)}
                                className="flex items-center gap-2 w-full text-left group focus:outline-none focus:ring-0"
                              >
                                <ChevronDown
                                  className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                  aria-hidden
                                />
                                <span className="font-medium text-primary-900 text-sm group-hover:text-primary-700">
                                  {client.name}
                                </span>
                              </button>
                            </td>
                    <td className="px-4 sm:px-5 py-3 text-neutral-600 text-sm">
                      {client.contactName || client.contactEmail || client.contactPhone ? (
                        <span className="truncate max-w-[220px] block" title={[client.contactName, client.contactEmail, client.contactPhone].filter(Boolean).join(' · ')}>
                          {[client.contactName, client.contactEmail, client.contactPhone].filter(Boolean).join(' · ')}
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-neutral-600 text-sm tabular-nums">{client.jobCount ?? 0}</td>
                    <td className="px-4 sm:px-5 py-3">
                      {client.isAnonymous ? (
                        <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700">
                          Anonymous (Confidential)
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                          Public (company name shown)
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/clients/${client.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(client.id, client.name)}
                          disabled={deletingId === client.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${client.id}-detail`} className="bg-neutral-50/80">
                      <td colSpan={5} className="px-4 sm:px-5 py-4">
                        <div className="rounded-lg border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm">
                          <h3 className="text-base font-semibold text-primary-900 mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary-600" />
                            {client.name}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                            <div>
                              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Contact</p>
                              <div className="space-y-1.5 text-sm text-neutral-700">
                                {client.contactName ? (
                                  <p className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-neutral-400 shrink-0" />
                                    {client.contactName}
                                  </p>
                                ) : null}
                                {client.contactEmail ? (
                                  <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                                    <a href={`mailto:${client.contactEmail}`} className="text-primary-600 hover:underline">
                                      {client.contactEmail}
                                    </a>
                                  </p>
                                ) : null}
                                {client.contactPhone ? (
                                  <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                                    <a href={`tel:${client.contactPhone}`} className="text-primary-600 hover:underline">
                                      {client.contactPhone}
                                    </a>
                                  </p>
                                ) : null}
                                {!client.contactName && !client.contactEmail && !client.contactPhone && (
                                  <p className="text-neutral-400 text-sm">No contact details</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Display on job board</p>
                              <p className="text-sm text-neutral-700">
                                {client.isAnonymous ? (
                                  <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700">
                                    Anonymous (Confidential)
                                  </span>
                                ) : (
                                  <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                                    Public (company name shown)
                                  </span>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Jobs</p>
                              <p className="text-sm text-neutral-700 flex items-center gap-2 flex-wrap">
                                <Briefcase className="w-4 h-4 text-neutral-400 shrink-0" />
                                {(client.jobCount ?? 0) === 0
                                  ? 'No jobs linked'
                                  : `${client.jobCount} job${(client.jobCount ?? 0) === 1 ? '' : 's'} linked`}
                                {(client.jobCount ?? 0) > 0 && (
                                  <Link
                                    href="/dashboard/jobs"
                                    className="text-primary-600 hover:underline text-xs font-medium"
                                  >
                                    View jobs →
                                  </Link>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap gap-2">
                            <Link
                              href={`/dashboard/clients/${client.id}/edit`}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit client
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(client.id, client.name)}
                              disabled={deletingId === client.id}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete client
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
          )}
        </>
      )}
    </div>
  );
}
