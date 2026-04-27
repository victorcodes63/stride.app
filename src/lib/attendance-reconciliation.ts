import type { PrismaClient } from '@prisma/client';

type ReconcileOptions = {
  employeeId: string;
  workDate: string; // YYYY-MM-DD
  actorUserId?: string | null;
};

function toWorkDate(input: string): Date {
  return new Date(`${input}T00:00:00.000Z`);
}

function toYmdUtc(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function resolveReconcileWorkDatesForObservedAt(
  db: PrismaClient,
  employeeId: string,
  observedAt: Date
): Promise<string[]> {
  const base = toYmdUtc(observedAt);
  const dates = new Set<string>([base]);
  const toleranceMs = 4 * 60 * 60 * 1000;
  const candidateAssignments = await db.shiftAssignment.findMany({
    where: {
      employeeId,
      startsAt: { lte: new Date(observedAt.getTime() + toleranceMs) },
      endsAt: { gte: new Date(observedAt.getTime() - toleranceMs) },
    },
    select: { workDate: true },
    take: 5,
    orderBy: { startsAt: 'desc' },
  });
  for (const item of candidateAssignments) {
    dates.add(toYmdUtc(item.workDate));
  }
  return [...dates];
}

export async function reconcileAttendanceDay(db: PrismaClient, options: ReconcileOptions) {
  const workDate = toWorkDate(options.workDate);

  const employee = await db.employee.findUnique({
    where: { id: options.employeeId },
    select: { id: true, outsourcingClientId: true, attendancePolicyAssignments: { orderBy: { effectiveFrom: 'desc' }, take: 1 } },
  });
  if (!employee) throw new Error('Employee not found');

  const assignment = await db.shiftAssignment.findFirst({
    where: {
      employeeId: options.employeeId,
      workDate,
    },
    orderBy: { startsAt: 'asc' },
  });

  const toleranceMs = 4 * 60 * 60 * 1000;
  const rangeStart = assignment
    ? new Date(assignment.startsAt.getTime() - toleranceMs)
    : workDate;
  const rangeEnd = assignment
    ? new Date(assignment.endsAt.getTime() + toleranceMs)
    : new Date(workDate.getTime() + 24 * 60 * 60 * 1000);

  const events = await db.attendanceEvent.findMany({
    where: {
      employeeId: options.employeeId,
      observedAt: { gte: rangeStart, lt: rangeEnd },
    },
    orderBy: { observedAt: 'asc' },
  });

  const firstIn = events.find((e) => e.kind === 'check_in');
  const lastOut = [...events].reverse().find((e) => e.kind === 'check_out');
  let minutesWorked = 0;
  let overtimeMinutes = 0;
  if (firstIn && lastOut && lastOut.observedAt > firstIn.observedAt) {
    minutesWorked = Math.round((lastOut.observedAt.getTime() - firstIn.observedAt.getTime()) / 60000);
    if (assignment) {
      const scheduledMinutes = Math.max(
        0,
        Math.round((assignment.endsAt.getTime() - assignment.startsAt.getTime()) / 60000) - assignment.breakMinutes
      );
      overtimeMinutes = Math.max(0, minutesWorked - scheduledMinutes);
    }
  }

  const attendancePolicyId = employee.attendancePolicyAssignments[0]?.attendancePolicyId ?? null;
  const summary = await db.attendanceDaySummary.upsert({
    where: { employeeId_workDate: { employeeId: options.employeeId, workDate } },
    create: {
      employeeId: options.employeeId,
      outsourcingClientId: employee.outsourcingClientId,
      workDate,
      attendancePolicyId,
      firstInAt: firstIn?.observedAt ?? null,
      lastOutAt: lastOut?.observedAt ?? null,
      minutesWorked,
      overtimeMinutes,
      status: events.length > 0 ? 'reconciled' : 'draft',
      sourceBreakdown: {
        biometric: events.filter((e) => e.source === 'biometric').length,
        manual: events.filter((e) => e.source === 'manual').length,
        rota: events.filter((e) => e.source === 'rota').length,
      },
    },
    update: {
      attendancePolicyId,
      firstInAt: firstIn?.observedAt ?? null,
      lastOutAt: lastOut?.observedAt ?? null,
      minutesWorked,
      overtimeMinutes,
      status: events.length > 0 ? 'reconciled' : 'draft',
      sourceBreakdown: {
        biometric: events.filter((e) => e.source === 'biometric').length,
        manual: events.filter((e) => e.source === 'manual').length,
        rota: events.filter((e) => e.source === 'rota').length,
      },
    },
  });

  await db.attendanceException.deleteMany({
    where: { employeeId: options.employeeId, workDate, status: 'open' },
  });

  const exceptionRows: Array<{ type: 'missing_check_in' | 'missing_check_out'; description: string }> = [];
  if (!firstIn) exceptionRows.push({ type: 'missing_check_in', description: 'No check-in event found for this shift/day window.' });
  if (!lastOut) exceptionRows.push({ type: 'missing_check_out', description: 'No check-out event found for this shift/day window.' });

  if (exceptionRows.length > 0) {
    await db.attendanceException.createMany({
      data: exceptionRows.map((item) => ({
        employeeId: options.employeeId,
        attendanceDaySummaryId: summary.id,
        workDate,
        type: item.type,
        description: item.description,
      })),
    });
  }

  return summary;
}

