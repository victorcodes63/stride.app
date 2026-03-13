import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaffUser, isAdmin } from '@/lib/staff-api-auth';
import { workingDaysBetween } from '@/lib/staff-leave-days';

export async function GET(request: NextRequest) {
  const user = await requireStaffUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const scope = request.nextUrl.searchParams.get('scope') || 'me';
  const status = request.nextUrl.searchParams.get('status') as
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'cancelled'
    | null;

  const where: Record<string, unknown> = {};
  if (scope === 'team' && isAdmin(user)) {
    if (status) where.status = status;
  } else {
    where.userId = user.id;
    if (status) where.status = status;
  }

  const list = await prisma.staffLeaveApplication.findMany({
    where,
    include: {
      leaveType: { select: { id: true, name: true, color: true } },
      user: { select: { id: true, name: true, email: true } },
      reviewedBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  const user = await requireStaffUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const leaveTypeId = String(body.leaveTypeId || '').trim();
  const start = new Date(String(body.startDate || ''));
  const end = new Date(String(body.endDate || ''));
  if (!leaveTypeId || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json({ error: 'leaveTypeId, startDate, endDate required' }, { status: 400 });
  }
  if (end < start) return NextResponse.json({ error: 'endDate before startDate' }, { status: 400 });

  const type = await prisma.staffLeaveType.findFirst({ where: { id: leaveTypeId, active: true } });
  if (!type) return NextResponse.json({ error: 'Leave type not found' }, { status: 404 });

  const totalDays =
    body.totalDays != null ? Math.max(1, parseInt(String(body.totalDays), 10) || 1) : workingDaysBetween(start, end);
  if (totalDays < 1) return NextResponse.json({ error: 'At least 1 working day' }, { status: 400 });

  const year = start.getFullYear();
  let balance = await prisma.staffLeaveBalance.findUnique({
    where: { userId_leaveTypeId_year: { userId: user.id, leaveTypeId, year } },
  });
  if (!balance) {
    balance = await prisma.staffLeaveBalance.create({
      data: {
        userId: user.id,
        leaveTypeId,
        year,
        entitledDays: type.daysPerYear,
        usedDays: 0,
        carriedOver: 0,
      },
    });
  }

  const skipBalance = type.daysPerYear <= 0; // e.g. unpaid leave
  const pendingSum = await prisma.staffLeaveApplication.aggregate({
    where: { userId: user.id, leaveTypeId, status: 'pending', startDate: { gte: new Date(year, 0, 1) } },
    _sum: { totalDays: true },
  });
  const pendingDays = pendingSum._sum.totalDays ?? 0;
  const available = balance.entitledDays + balance.carriedOver - balance.usedDays - pendingDays;
  if (!skipBalance && type.requiresApproval && available < totalDays) {
    return NextResponse.json(
      { error: `Insufficient balance. Available: ${available} days (pending requests count).` },
      { status: 400 }
    );
  }

  if (!type.requiresApproval) {
    const app = await prisma.$transaction(async (tx) => {
      const a = await tx.staffLeaveApplication.create({
        data: {
          userId: user.id,
          leaveTypeId,
          startDate: start,
          endDate: end,
          totalDays,
          reason: body.reason ? String(body.reason).trim() || null : null,
          status: 'approved',
          reviewedById: user.id,
          reviewedAt: new Date(),
          reviewNote: 'Auto-approved (no approval required)',
        },
        include: { leaveType: true, user: { select: { name: true, email: true } } },
      });
      await tx.staffLeaveBalance.update({
        where: { id: balance!.id },
        data: { usedDays: { increment: totalDays } },
      });
      return a;
    });
    return NextResponse.json(app);
  }

  const app = await prisma.staffLeaveApplication.create({
    data: {
      userId: user.id,
      leaveTypeId,
      startDate: start,
      endDate: end,
      totalDays,
      reason: body.reason ? String(body.reason).trim() || null : null,
      status: 'pending',
    },
    include: { leaveType: true, user: { select: { name: true, email: true } } },
  });
  return NextResponse.json(app);
}
