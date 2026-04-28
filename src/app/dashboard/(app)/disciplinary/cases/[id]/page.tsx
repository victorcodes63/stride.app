'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type CaseDetail = {
  id: string;
  caseNumber: string;
  subject: string;
  type: string;
  severity: string;
  status: string;
  employee: { firstName: string; lastName: string; employeeNumber: string | null };
  actions: Array<{ id: string; type: string; description: string; actionDate: string; employeeAcknowledged: boolean; performedBy: { name: string } }>;
  documents: Array<{ id: string; title: string; fileName: string }>;
};

export default function DisciplinaryCasePage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<CaseDetail | null>(null);
  const [actionType, setActionType] = useState('VERBAL_WARNING');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch(`/api/disciplinary/cases/${params.id}`);
    const body = await res.json().catch(() => null);
    if (res.ok) setData(body);
  }

  useEffect(() => {
    void load();
  }, [params.id]);

  async function addAction() {
    setError(null);
    const res = await fetch(`/api/disciplinary/cases/${params.id}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: actionType, description }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error || 'Failed to add action');
      return;
    }
    setDescription('');
    await load();
  }

  async function generateLetter(letterType: string, actionId?: string) {
    await fetch(`/api/disciplinary/cases/${params.id}/generate-letter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ letterType, actionId }),
    });
    await load();
  }

  if (!data) return <div className="text-sm text-neutral-500">Loading case...</div>;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-neutral-200 bg-white p-4 lg:col-span-2">
        <h1 className="text-xl font-semibold text-primary-900">{data.caseNumber} - {data.subject}</h1>
        <p className="mt-1 text-sm text-neutral-600">{data.employee.firstName} {data.employee.lastName} | {data.type.replaceAll('_', ' ')} | {data.severity}</p>
        <div className="mt-4 space-y-3">
          {data.actions.map((action) => (
            <div key={action.id} className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
              <p className="text-sm font-semibold">{new Date(action.actionDate).toLocaleDateString()} - {action.type.replaceAll('_', ' ')}</p>
              <p className="text-sm text-neutral-700">{action.description}</p>
              <p className="text-xs text-neutral-500">Issued by {action.performedBy.name} | Acknowledged: {action.employeeAcknowledged ? 'Yes' : 'Pending'}</p>
              <button onClick={() => generateLetter(action.type, action.id)} className="mt-2 rounded border border-neutral-300 px-2 py-1 text-xs">Generate letter</button>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-neutral-100 p-3">
          <p className="text-sm font-semibold">Add action</p>
          <div className="mt-2 flex gap-2">
            <select value={actionType} onChange={(e) => setActionType(e.target.value)} className="rounded border border-neutral-300 px-2 py-1 text-sm">
              {['VERBAL_WARNING','WRITTEN_WARNING','FINAL_WARNING','SHOW_CAUSE_LETTER','HEARING','SUSPENSION','DEMOTION','TERMINATION','CASE_DISMISSED'].map((t) => <option key={t} value={t}>{t.replaceAll('_', ' ')}</option>)}
            </select>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="flex-1 rounded border border-neutral-300 px-2 py-1 text-sm" placeholder="Action details" />
            <button onClick={addAction} className="rounded bg-primary-900 px-3 py-1 text-sm text-white">Save</button>
          </div>
          {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
        </div>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="text-sm font-semibold text-primary-900">Documents</p>
        <div className="mt-2 space-y-2">
          {data.documents.map((doc) => (
            <a key={doc.id} className="block text-sm text-primary-700 hover:underline" href={`/api/disciplinary/cases/${data.id}/documents/${doc.id}`}>
              {doc.title} ({doc.fileName})
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
