import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { calculateStatutoryForPayroll } from '@/lib/payroll-calc';
import { isBiweeklyClient } from '@/lib/biweekly-payroll';

function toDecimal(n: number): Decimal {
  return new Decimal(Math.round(n * 100) / 100);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const month = body.month != null ? parseInt(String(body.month), 10) : undefined;
    const year = body.year != null ? parseInt(String(body.year), 10) : undefined;
    const clientId = typeof body.clientId === 'string' ? body.clientId : undefined;
    const departmentId = typeof body.departmentId === 'string' ? body.departmentId : undefined;

    if (Number.isNaN(month) || month < 1 || month > 12 || Number.isNaN(year)) {
      return NextResponse.json({ error: 'Valid month and year required' }, { status: 400 });
    }

    const payrolls = await prisma.payroll.findMany({
      where: {
        month: month!,
        year: year!,
        ...(clientId || departmentId
          ? {
              employee: {
                ...(clientId ? { outsourcingClientId: clientId } : {}),
                ...(departmentId ? { departmentId } : {}),
              },
            }
          : {}),
      },
      include: {
        employee: { select: { client: { select: { leavePayMode: true, payrollFrequency: true } } } },
      },
    });

    let updated = 0;
    for (const p of payrolls) {
      const allowances = (p.allowances as { name: string; amount: number }[]) ?? [];
      const allowancesTotal = allowances.reduce((s, a) => s + (a?.amount ?? 0), 0);
      const otherDeductions = (p.deductions as { name: string; amount: number }[]) ?? [];
      const otherTotal = otherDeductions.reduce((s, d) => s + (d?.amount ?? 0), 0);
      const leavePay = Number(p.leavePay ?? 0);
      const mode = p.employee.client.leavePayMode ?? 'none';
      const p1 = p.period1Gross != null ? Number(p.period1Gross) : null;
      const p2 = p.period2Gross != null ? Number(p.period2Gross) : null;
      const biweekly =
        isBiweeklyClient(p.employee.client.payrollFrequency) && p1 != null && p2 != null;
      const employmentGross = biweekly ? p1! + p2! + allowancesTotal : Number(p.basicPay) + allowancesTotal;

      const calc = calculateStatutoryForPayroll(mode, employmentGross, leavePay, otherTotal);

      await prisma.payroll.update({
        where: { id: p.id },
        data: {
          grossPay: toDecimal(calc.grossPay),
          paye: toDecimal(calc.paye),
          nssf: toDecimal(calc.nssf),
          nhif: toDecimal(calc.nhif),
          ahl: toDecimal(calc.ahl),
          netPay: toDecimal(calc.netPay),
        },
      });
      updated++;
    }

    return NextResponse.json({
      updated,
      message: `Recalculated statutory for ${updated} record(s) (respects leave pay mode per client).`,
    });
  } catch (e) {
    console.error('[payroll recalculate-statutory]', e);
    return NextResponse.json({ error: 'Failed to recalculate' }, { status: 500 });
  }
}
