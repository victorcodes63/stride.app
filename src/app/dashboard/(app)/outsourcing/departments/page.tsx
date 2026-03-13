'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FolderOpen,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  Users,
} from 'lucide-react';

interface ClientOption {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  employeeCount: number;
}

function DepartmentsPageInner() {
  const searchParams = useSearchParams();
  const urlClientId = searchParams.get('clientId')?.trim() ?? '';

  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientId, setClientId] = useState(urlClientId);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (urlClientId) setClientId(urlClientId);
  }, [urlClientId]);

  useEffect(() => {
    fetch('/api/outsourcing/clients')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClients(data.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
        }
      })
      .catch(() => setClients([]))
      .finally(() => setLoadingClients(false));
  }, []);

  const selectedClient = clients.find((c) => c.id === clientId);

  const loadDepartments = async (cid: string) => {
    if (!cid) {
      setDepartments([]);
      return;
    }
    setLoadingDepts(true);
    setError(null);
    try {
      const res = await fetch(`/api/outsourcing/clients/${cid}/departments`);
      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch {
      setDepartments([]);
      setError('Failed to load departments.');
    } finally {
      setLoadingDepts(false);
    }
  };

  useEffect(() => {
    if (clientId) loadDepartments(clientId);
    else setDepartments([]);
  }, [clientId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !newName.trim()) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch(`/api/outsourcing/clients/${clientId}/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add');
      setDepartments((prev) => [...prev, data]);
      setNewName('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add department');
    } finally {
      setAdding(false);
    }
  };

  const handleSaveEdit = async (deptId: string) => {
    if (!clientId || !editName.trim()) return;
    try {
      const res = await fetch(`/api/outsourcing/clients/${clientId}/departments/${deptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      setDepartments((prev) => prev.map((d) => (d.id === deptId ? { ...d, name: data.name } : d)));
      setEditingId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update');
    }
  };

  const handleDelete = async (deptId: string, name: string) => {
    if (!clientId) return;
    if (!window.confirm(`Delete department "${name}"? Employees in it will be unassigned.`)) return;
    setDeletingId(deptId);
    try {
      const res = await fetch(`/api/outsourcing/clients/${clientId}/departments/${deptId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete');
      }
      setDepartments((prev) => prev.filter((d) => d.id !== deptId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  if (loadingClients) {
    return (
      <div className="animate-pulse h-40 bg-neutral-100 rounded-2xl w-full" />
    );
  }

  return (
    <div className="w-full min-w-0">
      <nav className="mb-4 text-sm text-neutral-500">
        <Link href="/dashboard/outsourcing/clients" className="hover:text-primary-700">
          Outsourcing clients
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-900 font-medium">Departments</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center gap-2">
          <FolderOpen className="w-7 h-7 text-primary-600" />
          Departments
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base mt-2">
          Choose a client, then add or edit departments here. This stays separate from{' '}
          <Link href="/dashboard/outsourcing/clients/new" className="text-primary-700 font-medium hover:underline">
            adding a client
          </Link>
          — create the company first, then set up departments.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm space-y-6">
        <div>
          <label htmlFor="clientSelect" className="block text-sm font-semibold text-neutral-900 mb-2">
            Client <span className="text-red-600">*</span>
          </label>
          <select
            id="clientSelect"
            value={clientId}
            onChange={(e) => {
              const v = e.target.value;
              setClientId(v);
              window.history.replaceState(
                null,
                '',
                v ? `/dashboard/outsourcing/departments?clientId=${encodeURIComponent(v)}` : '/dashboard/outsourcing/departments'
              );
            }}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-base focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">Select a client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {clients.length === 0 && (
            <p className="text-sm text-amber-800 mt-2">
              No clients yet.{' '}
              <Link href="/dashboard/outsourcing/clients/new" className="font-medium underline">
                Add an outsourcing client
              </Link>{' '}
              first.
            </p>
          )}
        </div>

        {clientId && selectedClient && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100">
            <Link
              href={`/dashboard/outsourcing/clients/${clientId}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              Client profile: {selectedClient.name}
            </Link>
            <Link
              href={`/dashboard/outsourcing/employees/new?clientId=${encodeURIComponent(clientId)}`}
              className="text-sm text-neutral-600 hover:text-primary-700"
            >
              Add employee
            </Link>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>
        )}

        {clientId && (
          <>
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Department name (e.g. Finance, Stores)"
                className="flex-1 min-w-0 px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={adding || !newName.trim()}
                className="inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-primary-900 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {adding ? 'Adding…' : 'Add department'}
              </button>
            </form>
            <p className="text-xs text-neutral-500">
              Excel import matches the <strong>Department Name</strong> column to these names (exact spelling helps).
            </p>

            {loadingDepts ? (
              <p className="text-sm text-neutral-500 py-6">Loading departments…</p>
            ) : departments.length === 0 ? (
              <p className="text-sm text-neutral-500 py-6 border border-dashed border-neutral-200 rounded-xl text-center">
                No departments yet for this client. Add one above.
              </p>
            ) : (
              <ul className="space-y-2">
                {departments.map((dept) => (
                  <li
                    key={dept.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3"
                  >
                    {editingId === dept.id ? (
                      <div className="flex flex-1 flex-wrap gap-2 items-center">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 min-w-[12rem] px-3 py-2 border rounded-lg text-sm"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(dept.id)}
                          className="px-3 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-2 border rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="min-w-0 flex items-center gap-3">
                          <FolderOpen className="w-5 h-5 text-neutral-400 shrink-0" />
                          <div>
                            <p className="font-semibold text-neutral-900">{dept.name}</p>
                            <p className="text-xs text-neutral-500 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {dept.employeeCount} employee{dept.employeeCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(dept.id);
                              setEditName(dept.name);
                            }}
                            className="p-2 rounded-lg text-neutral-600 hover:bg-white border border-transparent hover:border-neutral-200"
                            aria-label="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(dept.id, dept.name)}
                            disabled={deletingId === dept.id}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {!clientId && clients.length > 0 && (
          <p className="text-sm text-neutral-500 py-4 text-center border border-dashed rounded-xl">
            Select a client to add or edit departments.
          </p>
        )}
      </div>
    </div>
  );
}

export default function OutsourcingDepartmentsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-48 bg-neutral-100 rounded-2xl" />}>
      <DepartmentsPageInner />
    </Suspense>
  );
}
