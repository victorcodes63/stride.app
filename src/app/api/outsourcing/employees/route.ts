import { NextRequest, NextResponse } from 'next/server';
import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '@/lib/prisma';
import {
  allocateNextEmployeeNumber,
  deriveEmployeePrefixFromName,
} from '@/lib/outsourcing-employee-number';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([], { status: 200 });
    }
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') || undefined;
    const departmentId = searchParams.get('departmentId') || undefined;
    const jobTitle = searchParams.get('jobTitle') || undefined;

    const employees = await prisma.employee.findMany({
      where: {
        ...(clientId ? { outsourcingClientId: clientId } : {}),
        ...(departmentId ? { departmentId } : {}),
        ...(jobTitle?.trim() ? { jobTitle: { equals: jobTitle.trim(), mode: 'insensitive' } } : {}),
      },
      include: {
        client: { select: { id: true, name: true } },
        department: { select: { id: true, name: true } },
      },
      orderBy: [{ client: { name: 'asc' } }, { lastName: 'asc' }, { firstName: 'asc' }],
    });

    const list = employees.map((e) => ({
      id: e.id,
      employeeNumber: e.employeeNumber ?? null,
      firstName: e.firstName,
      lastName: e.lastName,
      email: e.email,
      phone: e.phone ?? null,
      jobTitle: e.jobTitle ?? null,
      kraPin: e.kraPin ?? null,
      nssfNumber: e.nssfNumber ?? null,
      nhifNumber: e.nhifNumber ?? null,
      idNumber: e.idNumber ?? null,
      dateOfJoining: e.dateOfJoining?.toISOString().slice(0, 10) ?? null,
      bankName: e.bankName ?? null,
      bankBranch: e.bankBranch ?? null,
      bankAccountNumber: e.bankAccountNumber ?? null,
      baseSalary: e.baseSalary != null ? Number(e.baseSalary) : null,
      clientId: e.outsourcingClientId,
      clientName: e.client.name,
      departmentId: e.departmentId,
      departmentName: e.department?.name ?? null,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }));

    return NextResponse.json(list);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[outsourcing/employees]', e);
    return NextResponse.json(
      {
        error: 'Failed to load employees',
        ...(process.env.NODE_ENV === 'development' && { detail: msg }),
      },
      { status: 500 }
    );
  }
}

function strField(b: Record<string, unknown>, key: string): string | null {
  const v = b[key];
  return typeof v === 'string' ? v.trim() || null : null;
}

/** Create a single employee (form or API). Requires clientId, firstName, lastName, email. */
export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    const clientId = strField(body, 'clientId');
    const firstName = strField(body, 'firstName') ?? '';
    const lastName = strField(body, 'lastName') ?? '';
    const email = strField(body, 'email') ?? '';
    if (!clientId) {
      return NextResponse.json({ error: 'clientId is required.' }, { status: 400 });
    }
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'firstName, lastName, and email are required.' },
        { status: 400 }
      );
    }
    const client = await prisma.outsourcingClient.findUnique({
      where: { id: clientId },
      include: { departments: { select: { id: true } } },
    });
    const clientRecord = client as typeof client & { employeeNumberPrefix?: string | null };
    if (!client) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }
    let employeeNumber = strField(body, 'employeeNumber');
    if (!employeeNumber?.trim()) {
      const prefix =
        clientRecord.employeeNumberPrefix?.trim() ||
        deriveEmployeePrefixFromName(client.name);
      employeeNumber = await allocateNextEmployeeNumber(prisma, clientId, prefix);
    }
    let departmentId: string | null = strField(body, 'departmentId');
    if (departmentId) {
      const ok = client.departments.some((d) => d.id === departmentId);
      if (!ok) departmentId = null;
    } else {
      departmentId = null;
    }
    const dateOfJoiningRaw = strField(body, 'dateOfJoining');
    let dateOfJoining: Date | undefined;
    if (dateOfJoiningRaw) {
      const d = new Date(dateOfJoiningRaw);
      if (!Number.isNaN(d.getTime())) dateOfJoining = d;
    }
    const employee = await prisma.employee.create({
      data: {
        outsourcingClientId: clientId,
        departmentId: departmentId ?? undefined,
        employeeNumber,
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone: strField(body, 'phone') ?? undefined,
        idNumber: strField(body, 'idNumber') ?? undefined,
        kraPin: strField(body, 'kraPin') ?? undefined,
        nssfNumber: strField(body, 'nssfNumber') ?? undefined,
        nhifNumber: strField(body, 'nhifNumber') ?? undefined,
        jobTitle: strField(body, 'jobTitle') ?? undefined,
        dateOfJoining: dateOfJoining ?? undefined,
        bankName: strField(body, 'bankName') ?? undefined,
        bankBranch: strField(body, 'bankBranch') ?? undefined,
        bankAccountNumber: strField(body, 'bankAccountNumber') ?? undefined,
        baseSalary:
          body.baseSalary != null && String(body.baseSalary).trim() !== ''
            ? new Decimal(Math.max(0, parseFloat(String(body.baseSalary).replace(/,/g, '')) || 0))
            : undefined,
      },
      include: {
        client: { select: { id: true, name: true } },
        department: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json({
      id: employee.id,
      employeeNumber: employee.employeeNumber,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      clientId: employee.outsourcingClientId,
      clientName: employee.client.name,
      departmentId: employee.departmentId,
      departmentName: employee.department?.name ?? null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('Unique constraint') && msg.includes('email')) {
      return NextResponse.json(
        { error: 'An employee with this email already exists.' },
        { status: 409 }
      );
    }
    console.error('[outsourcing/employees POST]', e);
    return NextResponse.json(
      { error: 'Failed to create employee', ...(process.env.NODE_ENV === 'development' && { detail: msg }) },
      { status: 500 }
    );
  }
}
