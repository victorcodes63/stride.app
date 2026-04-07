'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { KeyRound, Plus, X, Loader2, Pencil, Trash2, Handshake } from 'lucide-react';
import type { RecruitmentClientPortalUserSummary } from '@/types/dashboard';

type ClientOption = { id: string; name: string };

export default function RecruitmentClientLoginsPage() {
  const [rows, setRows] = useState<RecruitmentClientPortalUserSummary[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<RecruitmentClientPortalUserSummary | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [addForm, setAddForm] = useState({
    email: '',
    name: '',
    password: '',
    clientId: '',
    notes: '',
    isActive: true,
  });

  const [editForm, setEditForm] = useState({
    name: '',
    clientId: '',
    notes: '',
    isActive: true,
    newPassword: '',
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch('/api/recruitment-client-portal-users').then((r) => r),
      fetch('/api/clients').then((r) => r.json()),
    ])
      .then(([portalRes, clientsData]) => {
        if (portalRes.status === 403) {
          setForbidden(true);
          throw new Error('forbidden');
        }
        if (!portalRes.ok) throw new Error('portal');
        return Promise.all([portalRes.json(), clientsData]);
      })
      .then(([portalData, clientsData]) => {
        if (!cancelled) {
          setRows(Array.isArray(portalData) ? portalData : []);
          const list = Array.isArray(clientsData) ? clientsData : [];
          setClients(list.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error && err.message === 'forbidden'
              ? 'Only admins can manage recruitment client logins.'
              : 'Failed to load data.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const clientSelect = (
    value: string,
    onChange: (id: string) => void,
    id: string,
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1">
        Recruitment client
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
      >
        <option value="">Select client…</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <p className="text-xs text-neutral-500 mt-1">
        This login is tied to a single employer (recruitment ATS client).{' '}
        <Link href="/dashboard/clients" className="text-primary-600 hover:underline font-medium">
          Manage clients
        </Link>
      </p>
    </div>
  );

  const handleOpenAdd = () => {
    if (forbidden) return;
    setFormError(null);
    setAddForm({
      email: '',
      name: '',
      password: '',
      clientId: '',
      notes: '',
      isActive: true,
    });
    setAddOpen(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const email = addForm.email.trim().toLowerCase();
    const name = addForm.name.trim();
    const password = addForm.password;
    if (!email) {
      setFormError('Email is required.');
      return;
    }
    if (!name) {
      setFormError('Name is required.');
      return;
    }
    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    if (!addForm.clientId) {
      setFormError('Select a recruitment client.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/recruitment-client-portal-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          password,
          clientId: addForm.clientId,
          notes: addForm.notes.trim() || null,
          isActive: addForm.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to create login.');
        return;
      }
      setRows((prev) => [data, ...prev]);
      setAddOpen(false);
    } catch {
      setFormError('Failed to create login.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (row: RecruitmentClientPortalUserSummary) => {
    setFormError(null);
    setEditForm({
      name: row.name,
      clientId: row.clientId,
      notes: row.notes ?? '',
      isActive: row.isActive,
      newPassword: '',
    });
    setEditing(row);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setFormError(null);
    const name = editForm.name.trim();
    if (!name) {
      setFormError('Name is required.');
      return;
    }
    if (!editForm.clientId) {
      setFormError('Select a recruitment client.');
      return;
    }
    if (editForm.newPassword && editForm.newPassword.length < 6) {
      setFormError('New password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        name,
        clientId: editForm.clientId,
        notes: editForm.notes.trim() || null,
        isActive: editForm.isActive,
      };
      if (editForm.newPassword.trim()) body.password = editForm.newPassword.trim();
      const res = await fetch(`/api/recruitment-client-portal-users/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to update.');
        return;
      }
      setRows((prev) => prev.map((r) => (r.id === editing.id ? data : r)));
      setEditing(null);
    } catch {
      setFormError('Failed to update.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (row: RecruitmentClientPortalUserSummary) => {
    if (!window.confirm(`Remove login for "${row.name}" (${row.email})?`)) return;
    setDeletingId(row.id);
    try {
      const res = await fetch(`/api/recruitment-client-portal-users/${row.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete.');
        return;
      }
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch {
      setError('Failed to delete.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <p className="text-xs text-neutral-500 mb-1">
            <Link href="/dashboard/users/staff" className="text-primary-600 hover:underline font-medium">
              Staff
            </Link>
            <span className="mx-1.5 text-neutral-300">/</span>
            <span className="text-neutral-700">Recruitment client logins</span>
          </p>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-1">
            Recruitment client logins
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base">
            Employer portal accounts — separate from internal staff. A dedicated sign-in flow can be wired later;
            for now admins provision credentials here.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          disabled={forbidden}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm font-medium shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add login
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <motion.div
          className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 sm:p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <KeyRound className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 text-sm sm:text-base mb-4">
            No employer portal logins yet. Add one for a recruitment client contact.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            disabled={forbidden}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add login
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[720px]">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80">
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-primary-900">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{r.email}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700">
                      <span className="inline-flex items-center gap-1.5">
                        <Handshake className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        {r.clientName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{r.isActive ? 'Active' : 'Inactive'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(r)}
                          className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-primary-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r)}
                          disabled={deletingId === r.id}
                          className="p-2 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Remove"
                        >
                          {deletingId === r.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {addOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !submitting && setAddOpen(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-primary-900">Add recruitment client login</h2>
                <button
                  type="button"
                  onClick={() => !submitting && setAddOpen(false)}
                  className="p-1 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmitAdd} className="p-4 space-y-4">
                {formError && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={addForm.password}
                    onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    required
                    minLength={6}
                  />
                </div>
                {clientSelect(addForm.clientId, (clientId) => setAddForm((f) => ({ ...f, clientId })), 'add-client')}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Notes (optional)</label>
                  <textarea
                    value={addForm.notes}
                    onChange={(e) => setAddForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={addForm.isActive}
                    onChange={(e) => setAddForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  Active
                </label>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => !submitting && setAddOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium disabled:opacity-60"
                  >
                    {submitting ? 'Saving…' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editing && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !submitting && setEditing(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-primary-900">Edit login</h2>
                <button
                  type="button"
                  onClick={() => !submitting && setEditing(null)}
                  className="p-1 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmitEdit} className="p-4 space-y-4">
                <p className="text-xs text-neutral-500">
                  Email: <strong className="text-neutral-700">{editing.email}</strong> (identifier — contact dev to
                  change)
                </p>
                {formError && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                {clientSelect(
                  editForm.clientId,
                  (clientId) => setEditForm((f) => ({ ...f, clientId })),
                  'edit-client',
                )}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">New password (optional)</label>
                  <input
                    type="password"
                    value={editForm.newPassword}
                    onChange={(e) => setEditForm((f) => ({ ...f, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    minLength={6}
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  Active
                </label>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => !submitting && setEditing(null)}
                    className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium disabled:opacity-60"
                  >
                    {submitting ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
