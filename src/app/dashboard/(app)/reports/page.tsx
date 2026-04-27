'use client';

import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        color: '#64748B',
      }}
    >
      <BarChart3 size={48} strokeWidth={1.5} style={{ marginBottom: 16, color: '#94A3B8' }} />
      <h2 style={{ fontSize: 16, fontWeight: 500, color: '#0B1F2A', margin: '0 0 8px' }}>All reports</h2>
      <p style={{ fontSize: 14, margin: 0 }}>View workforce, attendance, leave, and payroll reporting in one place.</p>
    </div>
  );
}
