import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { reconcileAttendanceDay, resolveReconcileWorkDatesForObservedAt } from '@/lib/attendance-reconciliation';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
    }
    const clientId = request.nextUrl.searchParams.get('clientId') || undefined;
    const from = request.nextUrl.searchParams.get('from') || undefined;
    const to = request.nextUrl.searchParams.get('to') || undefined;
    const employeeId = request.nextUrl.searchParams.get('employeeId') || undefined;

    const where = {
      ...(clientId ? { outsourcingClientId: clientId } : {}),
      ...(employeeId ? { employeeId } : {}),
      ...(from || to
        ? {
            workDate: {
              ...(from ? { gte: new Date(`${from}T00:00:00.000Z`) } : {}),
              ...(to ? { lte: new Date(`${to}T00:00:00.000Z`) } : {}),
            },
          }
        : {}),
    };

    const [summaries, exceptions] = await Promise.all([
      prisma.attendanceDaySummary.findMany({
        where,
        include: {
          employee: { select: { firstName: true, lastName: true, employeeNumber: true } },
        },
        orderBy: [{ workDate: 'desc' }, { employee: { lastName: 'asc' } }],
        take: 400,
      }),
      prisma.attendanceException.findMany({
        where: {
          ...(employeeId ? { employeeId } : {}),
          ...(from || to
            ? {
                workDate: {
                  ...(from ? { gte: new Date(`${from}T00:00:00.000Z`) } : {}),
                  ...(to ? { lte: new Date(`${to}T00:00:00.000Z`) } : {}),
                },
              }
            : {}),
        },
        include: {
          employee: { select: { firstName: true, lastName: true, employeeNumber: true } },
        },
        orderBy: [{ status: 'asc' }, { workDate: 'desc' }],
        take: 300,
      }),
    ]);

    return NextResponse.json({ summaries, exceptions, attendanceV2: isFeatureEnabled('attendanceV2') });
  } catch (error) {
    console.error('[outsourcing/attendance GET]', error);
    return NextResponse.json({ error: 'Failed to load attendance data.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
    }
    const body = (await request.json()) as Record<string, unknown>;
    const employeeId = typeof body.employeeId === 'string' ? body.employeeId.trim() : '';
    const observedAtRaw = typeof body.observedAt === 'string' ? body.observedAt.trim() : '';
    const kindRaw = typeof body.kind === 'string' ? body.kind.trim() : 'check_in';
    if (!employeeId || !observedAtRaw) {
      return NextResponse.json({ error: 'employeeId and observedAt are required.' }, { status: 400 });
    }
    const observedAt = new Date(observedAtRaw);
    if (Number.isNaN(observedAt.getTime())) {
      return NextResponse.json({ error: 'Invalid observedAt datetime.' }, { status: 400 });
    }
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { outsourcingClientId: true },
    });
    if (!employee) return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });

    const workDate = observedAt.toISOString().slice(0, 10);
    await prisma.attendanceEvent.create({
      data: {
        employeeId,
        outsourcingClientId: employee.outsourcingClientId,
        observedAt,
        workDate: new Date(`${workDate}T00:00:00.000Z`),
        source: 'manual',
        kind: kindRaw === 'check_out' ? 'check_out' : 'check_in',
        isApprovedOverride: true,
      },
    });
    const workDates = await resolveReconcileWorkDatesForObservedAt(prisma, employeeId, observedAt);
    const summaries = await Promise.all(
      workDates.map((dateKey) => reconcileAttendanceDay(prisma, { employeeId, workDate: dateKey }))
    );
    return NextResponse.json({ ok: true, summary: summaries[0] ?? null, reconciledDates: workDates });
  } catch (error) {
    console.error('[outsourcing/attendance POST]', error);
    return NextResponse.json({ error: 'Failed to add attendance event.' }, { status: 500 });
  }
}

