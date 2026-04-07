import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { calculateStatutoryForPayroll } from '@/lib/payroll-calc';
import { isBiweeklyClient } from '@/lib/biweekly-payroll';
import { mapOutsourcingClientsToAccountsClients } from '@/lib/payroll-accounts-link';

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

    const b = body as Record<string, unknown>;
    const month = typeof b.month === 'number' ? b.month : parseInt(String(b.month ?? ''), 10);
    const year = typeof b.year === 'number' ? b.year : parseInt(String(b.year ?? ''), 10);
    const clientId = typeof b.clientId === 'string' && b.clientId.trim() ? b.clientId.trim() : null;
    const departmentId = typeof b.departmentId === 'string' && b.departmentId.trim() ? b.departmentId.trim() : null;
    const defaultLeavePay =
      typeof b.defaultLeavePay === 'number' && !Number.isNaN(b.defaultLeavePay)
        ? Math.max(0, b.defaultLeavePay)
        : typeof b.defaultLeavePay === 'string'
          ? Math.max(0, parseFloat(b.defaultLeavePay) || 0)
          : 0;

    if (Number.isNaN(month) || month < 1 || month > 12 || Number.isNaN(year)) {
      return NextResponse.json({ error: 'Valid month (1-12) and year are required' }, { status: 400 });
    }

    let biweekly = false;
    let leavePayMode: string | null = 'none';
    if (clientId) {
      const c = await prisma.outsourcingClient.findUnique({
        where: { id: clientId },
        select: { payrollFrequency: true, leavePayMode: true },
      });
      biweekly = isBiweeklyClient(c?.payrollFrequency);
      leavePayMode = c?.leavePayMode ?? 'none';
    }

    const employees = await prisma.employee.findMany({
      where: {
        ...(clientId ? { outsourcingClientId: clientId } : {}),
        ...(departmentId ? { departmentId } : {}),
      },
      select: { id: true, baseSalary: true, outsourcingClientId: true },
    });

    const accountsByOutsourcing = await mapOutsourcingClientsToAccountsClients(
      employees.map((e) => e.outsourcingClientId),
    );

    const clientModes = new Map<string, string | null>();
    if (!clientId && employees.length) {
      const clientIds = [...new Set(employees.map((e) => e.outsourcingClientId))];
      const clients = await prisma.outsourcingClient.findMany({
        where: { id: { in: clientIds } },
        select: { id: true, leavePayMode: true, payrollFrequency: true },
      });
      for (const c of clients) {
        clientModes.set(c.id, c.leavePayMode);
      }
    }

    const existing = await prisma.payroll.findMany({
      where: {
        month,
        year,
        employeeId: { in: employees.map((e) => e.id) },
      },
      select: { employeeId: true },
    });
    const existingIds = new Set(existing.map((e) => e.employeeId));
    const toCreate = employees.filter((e) => !existingIds.has(e.id));

    if (toCreate.length === 0) {
      return NextResponse.json({
        created: 0,
        skipped: employees.length,
        message: 'All employees in scope already have payroll records for this month.',
      });
    }

    await prisma.$transaction(
      toCreate.map((e) => {
        const mode =
          clientId ? leavePayMode : clientModes.get(e.outsourcingClientId) ?? 'none';
        const basic = e.baseSalary != null ? Number(e.baseSalary) : 0;
        const lp =
          mode === 'included_in_gross' || mode === 'paye_only' ? defaultLeavePay : 0;
        if (biweekly && clientId && basic > 0) {
          const half = Math.round(basic / 2);
          const other = basic - half;
          const employmentGross = half + other;
          const stat = calculateStatutoryForPayroll(mode, employmentGross, lp, 0);
          return prisma.payroll.create({
            data: {
              employeeId: e.id,
              month,
              year,
              accountsClientId: accountsByOutsourcing.get(e.outsourcingClientId) ?? null,
              basicPay: new Decimal(employmentGross),
              period1Gross: new Decimal(half),
              period2Gross: new Decimal(other),
              grossPay: new Decimal(stat.grossPay),
              leavePay: new Decimal(lp),
              paye: new Decimal(stat.paye),
              nssf: new Decimal(stat.nssf),
              nhif: new Decimal(stat.nhif),
              ahl: new Decimal(stat.ahl),
              netPay: new Decimal(stat.netPay),
              allowances: [],
              deductions: [],
            },
          });
        }
        const stat = calculateStatutoryForPayroll(mode, basic, lp, 0);
        return prisma.payroll.create({
          data: {
            employeeId: e.id,
            month,
            year,
            accountsClientId: accountsByOutsourcing.get(e.outsourcingClientId) ?? null,
            basicPay: new Decimal(basic),
            grossPay: new Decimal(stat.grossPay),
            leavePay: new Decimal(lp),
            paye: new Decimal(stat.paye),
            nssf: new Decimal(stat.nssf),
            nhif: new Decimal(stat.nhif),
            ahl: new Decimal(stat.ahl),
            netPay: new Decimal(stat.netPay),
            allowances: [],
            deductions: [],
          },
        });
      })
    );

    return NextResponse.json({
      created: toCreate.length,
      skipped: employees.length - toCreate.length,
      message: `Created ${toCreate.length} draft payroll record(s) for ${month}/${year}.${biweekly ? ' (Bi-weekly)' : ''}`,
    });
  } catch (e) {
    console.error('[payroll/generate]', e);
    return NextResponse.json({ error: 'Failed to generate payroll' }, { status: 500 });
  }
}
