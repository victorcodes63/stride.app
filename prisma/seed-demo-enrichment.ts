/**
 * Enrich multi-vertical demo data: onboarding workflows, disciplinary cases,
 * people contracts, staff leave, and billing client links per entity.
 *
 * Run after seed-demo-multi-vertical (or seed-all-demo).
 */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PrismaClient,
  WorkflowType,
  WorkflowStatus,
  PayrollStatus,
  Prisma,
} from '@prisma/client';
import { startWorkflowForEmployee } from '../src/lib/onboarding-workflows';
import { calculateStatutoryForPayroll } from '../src/lib/payroll-calc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const prisma = new PrismaClient();

function daysFromNow(days: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(12, 0, 0, 0);
  return d;
}

function entityPrefix(entityCode: string) {
  return entityCode.replace(/__ke$/i, '').replace(/[^a-z0-9]+/gi, '-').toUpperCase();
}

async function ensureAccountsClients() {
  const { syncLinkedBillingClients } = await import('./lib/sync-linked-billing-clients.js');
  const result = await syncLinkedBillingClients(prisma);
  console.log(`→ Billing clients synced (${result.outsourcingSynced} outsourcing link(s))`);
}

async function seedContractsForEntity(
  accountsClientId: string,
  managerUserId: string,
  prefix: string,
) {
  const refs = [`EMP-${prefix}-001`, `CONS-${prefix}-001`];
  await prisma.accountsContract.deleteMany({ where: { reference: { in: refs } } });

  await prisma.accountsContract.create({
    data: {
      clientId: accountsClientId,
      title: 'Permanent employment agreement',
      reference: refs[0]!,
      startDate: daysFromNow(-400),
      endDate: daysFromNow(120),
      remindersDisabled: false,
      managers: { create: [{ userId: managerUserId }] },
    },
  });

  await prisma.accountsContract.create({
    data: {
      clientId: accountsClientId,
      title: 'Consultant services agreement',
      reference: refs[1]!,
      startDate: daysFromNow(-180),
      endDate: daysFromNow(45),
      remindersDisabled: false,
      managers: { create: [{ userId: managerUserId }] },
    },
  });
}

async function seedDisciplinaryForEntity(
  entityCode: string,
  employees: Array<{ id: string; firstName: string; lastName: string }>,
  hrUserId: string,
) {
  const prefix = entityPrefix(entityCode);
  const year = new Date().getUTCFullYear();
  const caseNumber = `DC-${prefix}-${year}`;
  const grievanceNumber = `GR-${prefix}-${year}`;

  await prisma.disciplinaryAction.deleteMany({
    where: { disciplinaryCase: { caseNumber } },
  });
  await prisma.disciplinaryDocument.deleteMany({
    where: { disciplinaryCase: { caseNumber } },
  });
  await prisma.disciplinaryCase.deleteMany({ where: { caseNumber } });
  await prisma.grievance.deleteMany({ where: { grievanceNumber } });

  if (employees.length === 0) return;

  await prisma.disciplinaryCase.create({
    data: {
      employeeId: employees[0]!.id,
      caseNumber,
      type: 'ABSENTEEISM',
      status: 'OPEN',
      severity: 'MINOR',
      laborJurisdiction: 'KE',
      subject: `Attendance pattern review — ${employees[0]!.firstName} ${employees[0]!.lastName}`,
      description:
        'Line manager flagged repeated late clock-in on early shifts. Informal counselling completed; formal warning issued pending improvement plan.',
      incidentDate: daysFromNow(-21),
      reportedById: hrUserId,
      actions: {
        create: {
          type: 'VERBAL_WARNING',
          description: 'Verbal warning issued with 14-day improvement window.',
          actionDate: daysFromNow(-7),
          performedById: hrUserId,
          employeeAcknowledged: true,
          acknowledgedAt: daysFromNow(-5),
        },
      },
    },
  });

  if (employees.length > 1) {
    await prisma.grievance.create({
      data: {
        employeeId: employees[1]!.id,
        grievanceNumber,
        status: 'INVESTIGATING',
        category: 'MANAGEMENT',
        subject: 'Shift rota communication',
        description:
          'Employee raised concern about short-notice rota changes. HR review scheduled with operations lead.',
        investigationNotes: 'Initial meeting held; rota process review in progress.',
      },
    });
  }
}

async function seedOnboardingForEntity(
  employees: Array<{ id: string; firstName: string; lastName: string }>,
) {
  for (const employee of employees.slice(0, 2)) {
    const existing = await prisma.onboardingWorkflow.findFirst({
      where: { employeeId: employee.id, type: WorkflowType.ONBOARDING, status: WorkflowStatus.IN_PROGRESS },
    });
    if (!existing) {
      await startWorkflowForEmployee({ employeeId: employee.id, type: WorkflowType.ONBOARDING });
    }
  }
}

async function backfillPayrollForEntity(clientId: string) {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth() + 1;
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const employees = await prisma.employee.findMany({
    where: { outsourcingClientId: clientId, employmentStatus: 'active' },
    select: { id: true, baseSalary: true },
  });

  for (const monthData of [
    { month: prevMonth, year: prevYear, status: PayrollStatus.approved },
    { month: currentMonth, year: currentYear, status: PayrollStatus.draft },
  ]) {
    for (const employee of employees) {
      const base = employee.baseSalary ? Number(employee.baseSalary) : 85000;
      const statutory = calculateStatutoryForPayroll('none', base, 0, 0);
      await prisma.payroll.upsert({
        where: {
          employeeId_month_year: {
            employeeId: employee.id,
            month: monthData.month,
            year: monthData.year,
          },
        },
        update: {
          basicPay: new Prisma.Decimal(base),
          grossPay: new Prisma.Decimal(statutory.grossPay),
          paye: new Prisma.Decimal(statutory.paye),
          nssf: new Prisma.Decimal(statutory.nssf),
          nhif: new Prisma.Decimal(statutory.nhif),
          ahl: new Prisma.Decimal(statutory.ahl),
          nita: new Prisma.Decimal(statutory.nita),
          netPay: new Prisma.Decimal(statutory.netPay),
          status: monthData.status,
        },
        create: {
          employeeId: employee.id,
          month: monthData.month,
          year: monthData.year,
          basicPay: new Prisma.Decimal(base),
          allowances: [],
          deductions: [],
          grossPay: new Prisma.Decimal(statutory.grossPay),
          leavePay: new Prisma.Decimal(0),
          paye: new Prisma.Decimal(statutory.paye),
          nssf: new Prisma.Decimal(statutory.nssf),
          nhif: new Prisma.Decimal(statutory.nhif),
          ahl: new Prisma.Decimal(statutory.ahl),
          nita: new Prisma.Decimal(statutory.nita),
          netPay: new Prisma.Decimal(statutory.netPay),
          status: monthData.status,
        },
      });
    }
  }
}

async function enrichKeClients() {
  const demoAdminEmail = (process.env.DEMO_UNIFIED_ADMIN_EMAIL ?? 'demo@demo.imara.co.ke').toLowerCase();
  const hrUser =
    (await prisma.user.findUnique({ where: { email: demoAdminEmail } })) ??
    (await prisma.user.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'asc' } }));
  if (!hrUser) {
    console.warn('No staff user found — skip enrichment.');
    return;
  }

  const keClients = await prisma.outsourcingClient.findMany({
    where: { entityCode: { endsWith: '__ke' } },
    orderBy: { entityCode: 'asc' },
  });

  for (const client of keClients) {
    const employees = await prisma.employee.findMany({
      where: { outsourcingClientId: client.id, employmentStatus: 'active' },
      orderBy: { employeeNumber: 'asc' },
      take: 4,
      select: { id: true, firstName: true, lastName: true },
    });
    if (employees.length === 0) {
      console.warn(`  · ${client.entityCode}: no employees — skipped`);
      continue;
    }

    await seedOnboardingForEntity(employees);
    await seedDisciplinaryForEntity(client.entityCode ?? client.id, employees, hrUser.id);
    await backfillPayrollForEntity(client.id);

    const accountsClient = await prisma.accountsClient.findUnique({
      where: { outsourcingClientId: client.id },
    });
    if (accountsClient) {
      await seedContractsForEntity(accountsClient.id, hrUser.id, entityPrefix(client.entityCode ?? client.id));
    }

    console.log(`  ✓ ${client.name} (${client.entityCode}) — ${employees.length} employees enriched`);
  }
}

async function seedStaffLeaveDemo() {
  execSync('node prisma/seed-staff-leave.js', { cwd: root, stdio: 'inherit', env: process.env });

  const year = new Date().getFullYear();
  const annualType = await prisma.staffLeaveType.findFirst({ where: { name: { contains: 'Annual', mode: 'insensitive' } } });
  if (!annualType) return;

  const applicant =
    (await prisma.user.findFirst({ where: { email: { contains: 'hr.demo' } } })) ??
    (await prisma.user.findFirst({ where: { staffUserType: 'business_manager', isActive: true } }));
  if (!applicant) return;

  const existing = await prisma.staffLeaveApplication.findFirst({
    where: { userId: applicant.id, status: 'pending', leaveTypeId: annualType.id },
  });
  if (existing) return;

  await prisma.staffLeaveApplication.create({
    data: {
      userId: applicant.id,
      leaveTypeId: annualType.id,
      startDate: daysFromNow(14),
      endDate: daysFromNow(18),
      totalDays: 5,
      reason: 'Family event — demo pending approval',
      status: 'pending',
    },
  });
  console.log(`→ Staff leave: pending request for ${applicant.email}`);
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set.');

  console.log('\nEnriching demo modules (onboarding, contracts, disciplinary, staff leave)…\n');

  execSync('npx tsx prisma/seed-onboarding-templates.ts', { cwd: root, stdio: 'inherit', env: process.env });
  await ensureAccountsClients();
  await enrichKeClients();
  await seedStaffLeaveDemo();

  console.log('\nDemo enrichment complete.\n');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
