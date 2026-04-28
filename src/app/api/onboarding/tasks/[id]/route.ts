import { NextRequest, NextResponse } from 'next/server';
import { OnboardingTaskStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireStaffUser } from '@/lib/staff-api-auth';
import { maybeCompleteWorkflow } from '@/lib/onboarding-workflows';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireStaffUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const task = await prisma.onboardingTask.findUnique({
    where: { id },
    include: {
      workflow: { include: { employee: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
      completedBy: { select: { id: true, name: true, email: true } },
    },
  });
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  return NextResponse.json(task);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireStaffUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const status = body.status as OnboardingTaskStatus | undefined;
  const nextStatus = status ?? undefined;
  const task = await prisma.onboardingTask.update({
    where: { id },
    data: {
      status: nextStatus,
      notes: typeof body.notes === 'string' ? body.notes : undefined,
      completedAt:
        nextStatus === OnboardingTaskStatus.COMPLETED || nextStatus === OnboardingTaskStatus.SKIPPED
          ? new Date()
          : null,
      completedById:
        nextStatus === OnboardingTaskStatus.COMPLETED || nextStatus === OnboardingTaskStatus.SKIPPED
          ? user.id
          : null,
    },
  });

  await maybeCompleteWorkflow(task.workflowId);
  return NextResponse.json(task);
}
