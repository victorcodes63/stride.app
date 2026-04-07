import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const b = body as {
    employeeIds?: unknown;
    clientId?: unknown;
  };

  const employeeIds = Array.isArray(b.employeeIds)
    ? (b.employeeIds as unknown[]).filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
    : [];
  const clientId = typeof b.clientId === 'string' && b.clientId.trim().length > 0 ? b.clientId.trim() : null;

  if (employeeIds.length === 0) {
    return NextResponse.json({ error: 'employeeIds must be a non-empty array.' }, { status: 400 });
  }

  try {
    const result = await prisma.employee.deleteMany({
      where: {
        id: { in: employeeIds },
        ...(clientId ? { outsourcingClientId: clientId } : {}),
      },
    });

    return NextResponse.json({
      deleted: result.count,
      requested: employeeIds.length,
      skipped: Math.max(0, employeeIds.length - result.count),
    });
  } catch (e) {
    console.error('[employees/bulk-delete] error:', e);
    return NextResponse.json({ error: 'Failed to delete employees.' }, { status: 500 });
  }
}

