import { Prisma, WorkflowType, WorkflowStatus, OnboardingTaskStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getHrUserIds, sendNotification } from '@/lib/notifications';

const CLINICAL_KEYWORDS = [
  'doctor',
  'nurse',
  'clinical',
  'lab',
  'pharmac',
  'theatre',
  'icu',
  'radiolog',
  'surgeon',
  'anesth',
];

function isClinicalEmployee(input: { jobTitle?: string | null; departmentName?: string | null }): boolean {
  const text = `${input.jobTitle ?? ''} ${input.departmentName ?? ''}`.toLowerCase();
  return CLINICAL_KEYWORDS.some((keyword) => text.includes(keyword));
}

export function getRoleKeysForUser(user: { role: string; staffUserType?: string | null }): string[] {
  const roles = new Set<string>();
  if (user.role === 'admin') roles.add('admin');
  if (user.role === 'admin' || user.staffUserType === 'business_manager' || user.staffUserType === 'operations') roles.add('hr');
  if (user.role === 'admin' || user.staffUserType === 'operations') roles.add('it');
  if (user.role === 'admin' || user.staffUserType === 'director' || user.staffUserType === 'business_manager') {
    roles.add('department_head');
  }
  return [...roles];
}

async function selectDefaultTemplate(employeeId: string, type: WorkflowType, tx: Prisma.TransactionClient) {
  const employee = await tx.employee.findUnique({
    where: { id: employeeId },
    select: { jobTitle: true, department: { select: { name: true } } },
  });
  if (!employee) return null;

  const clinical = isClinicalEmployee({
    jobTitle: employee.jobTitle,
    departmentName: employee.department?.name,
  });

  const baseWhere: Prisma.OnboardingTemplateWhereInput = { type, isDefault: true };
  if (type === WorkflowType.ONBOARDING) {
    const preferredName = clinical ? 'clinical' : 'non-clinical';
    const preferred = await tx.onboardingTemplate.findFirst({
      where: { ...baseWhere, name: { contains: preferredName, mode: 'insensitive' } },
      include: { steps: { orderBy: { order: 'asc' } } },
    });
    if (preferred) return preferred;
  }

  return tx.onboardingTemplate.findFirst({
    where: baseWhere,
    include: { steps: { orderBy: { order: 'asc' } } },
  });
}

export async function startWorkflowForEmployee(params: { employeeId: string; type: WorkflowType }) {
  const { employeeId, type } = params;

  const result = await prisma.$transaction(async (tx) => {
    const employee = await tx.employee.findUnique({
      where: { id: employeeId },
      select: { id: true, firstName: true, lastName: true },
    });
    if (!employee) return null;

    const existing = await tx.onboardingWorkflow.findFirst({
      where: { employeeId, type, status: WorkflowStatus.IN_PROGRESS },
      include: { tasks: true },
    });
    if (existing) return { employee, workflow: existing, created: false };

    const template = await selectDefaultTemplate(employeeId, type, tx);
    if (!template) return null;

    const workflow = await tx.onboardingWorkflow.create({
      data: { employeeId, templateId: template.id, type, status: WorkflowStatus.IN_PROGRESS },
    });

    if (template.steps.length > 0) {
      await tx.onboardingTask.createMany({
        data: template.steps.map((step) => ({
          workflowId: workflow.id,
          title: step.title,
          description: step.description,
          assignedRole: step.assignedRole,
          category: step.category,
          order: step.order,
          isRequired: step.isRequired,
          dueDate: new Date(Date.now() + step.dueDaysOffset * 86400000),
          status: OnboardingTaskStatus.PENDING,
        })),
      });
    }

    const full = await tx.onboardingWorkflow.findUnique({
      where: { id: workflow.id },
      include: { tasks: true },
    });
    return full ? { employee, workflow: full, created: true } : null;
  });

  if (result?.created) {
    try {
      const hrUserIds = await getHrUserIds();
      const typeLabel = result.workflow.type === WorkflowType.ONBOARDING ? 'onboarding' : 'offboarding';
      await sendNotification({
        event: 'employee_created',
        recipientUserIds: hrUserIds,
        title: `${typeLabel[0].toUpperCase()}${typeLabel.slice(1)} workflow started`,
        body: `${typeLabel} started for ${result.employee.firstName} ${result.employee.lastName}. ${result.workflow.tasks.length} tasks created.`,
        href: `/dashboard/onboarding/${result.workflow.id}`,
        priority: 'action_required',
        channel: 'in_app',
      });
    } catch (error) {
      console.error('[onboarding] Failed to send start notification:', error);
    }
  }

  return result;
}

export async function maybeCompleteWorkflow(workflowId: string) {
  const workflow = await prisma.onboardingWorkflow.findUnique({
    where: { id: workflowId },
    include: {
      employee: { select: { firstName: true, lastName: true } },
      tasks: { select: { isRequired: true, status: true } },
    },
  });
  if (!workflow || workflow.status !== WorkflowStatus.IN_PROGRESS) return null;

  const hasPendingRequired = workflow.tasks.some(
    (task) => task.isRequired && task.status !== OnboardingTaskStatus.COMPLETED,
  );
  if (hasPendingRequired) return null;

  const completed = await prisma.onboardingWorkflow.update({
    where: { id: workflowId },
    data: { status: WorkflowStatus.COMPLETED, completedAt: new Date() },
  });

  try {
    const hrUserIds = await getHrUserIds();
    await sendNotification({
      event: 'employee_created',
      recipientUserIds: hrUserIds,
      title: 'Workflow completed',
      body: `${workflow.type === WorkflowType.ONBOARDING ? 'Onboarding' : 'Offboarding'} completed for ${workflow.employee.firstName} ${workflow.employee.lastName}.`,
      href: `/dashboard/onboarding/${workflowId}`,
      priority: 'info',
      channel: 'in_app',
    });
  } catch (error) {
    console.error('[onboarding] Failed to send completion notification:', error);
  }

  return completed;
}
