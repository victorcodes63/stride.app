import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { allocateNextEmployeeNumber, deriveEmployeePrefixFromName } from '@/lib/outsourcing-employee-number';

type MissingSeed = {
  nationalId: string;
  employeeName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

function splitName(fullName: string | null | undefined): { firstName: string; lastName: string } {
  const clean = (fullName ?? '').trim();
  if (!clean) return { firstName: '', lastName: '' };
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    const b = body as { clientId?: string; missingRows?: MissingSeed[] };
    const clientId = typeof b.clientId === 'string' ? b.clientId.trim() : '';
    const missingRows = Array.isArray(b.missingRows) ? b.missingRows : [];
    if (!clientId || missingRows.length === 0) {
      return NextResponse.json({ error: 'clientId and missingRows[] are required.' }, { status: 400 });
    }

    const client = await prisma.outsourcingClient.findUnique({
      where: { id: clientId },
      select: { id: true, name: true, employeeNumberPrefix: true },
    });
    if (!client) return NextResponse.json({ error: 'Client not found.' }, { status: 404 });

    const existingById = await prisma.employee.findMany({
      where: {
        outsourcingClientId: clientId,
        idNumber: { in: missingRows.map((r) => String(r.nationalId || '').trim()).filter(Boolean) },
      },
      select: { idNumber: true },
    });
    const existingIds = new Set(existingById.map((e) => (e.idNumber ?? '').trim().toLowerCase()));

    const prefix = client.employeeNumberPrefix?.trim() || deriveEmployeePrefixFromName(client.name);
    const created: Array<{ id: string; nationalId: string; name: string }> = [];
    const skipped: Array<{ nationalId: string; reason: string }> = [];
    for (const seed of missingRows) {
      const nationalId = String(seed.nationalId || '').trim();
      if (!nationalId) continue;
      const key = nationalId.toLowerCase();
      if (existingIds.has(key)) {
        skipped.push({ nationalId, reason: 'Already exists.' });
        continue;
      }
      const fallbackSplit = splitName(seed.employeeName);
      const firstName = (seed.firstName ?? '').trim() || fallbackSplit.firstName;
      const lastName = (seed.lastName ?? '').trim() || fallbackSplit.lastName;
      if (!firstName || !lastName) {
        skipped.push({
          nationalId,
          reason: 'Skipped: missing employee first/last name in upload row.',
        });
        continue;
      }
      const fallbackEmail = `${firstName}.${lastName}.${nationalId}`.toLowerCase().replace(/[^a-z0-9.]/g, '') + '@placeholder.local';
      const providedEmail = typeof seed.email === 'string' && seed.email.includes('@') ? seed.email.trim().toLowerCase() : null;
      const email = providedEmail || fallbackEmail;
      const employeeNumber = await allocateNextEmployeeNumber(prisma, clientId, prefix);
      const createdEmployee = await prisma.employee.create({
        data: {
          outsourcingClientId: clientId,
          employeeNumber,
          firstName,
          lastName,
          email,
          idNumber: nationalId,
        },
        select: { id: true, firstName: true, lastName: true, idNumber: true },
      });
      existingIds.add(key);
      created.push({
        id: createdEmployee.id,
        nationalId,
        name: `${createdEmployee.firstName} ${createdEmployee.lastName}`,
      });
    }

    return NextResponse.json({ createdCount: created.length, skippedCount: skipped.length, created, skipped });
  } catch (e) {
    console.error('[outsourcing/payroll/import/create-missing-employees]', e);
    return NextResponse.json({ error: 'Failed to create missing employees.' }, { status: 500 });
  }
}
