import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaffUser } from '@/lib/staff-api-auth';
import { getAccountsAccess } from '@/lib/accounts-access';
import { computeInvoiceVatFromLines } from '@/lib/accounts-invoice-totals';
import { sumCreditTotalForInvoice } from '@/lib/accounts-credit-note-totals';
import { reportApiError } from '@/lib/monitoring';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireStaffUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const access = await getAccountsAccess(user.id, user.role);
  if (!access.hasAccountsAccess) {
    return NextResponse.json({ error: 'No access to Accounts.' }, { status: 403 });
  }

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    const inv = await prisma.accountsInvoice.findUnique({
      where: { id },
      include: {
        accountsClient: { select: { id: true, name: true, currency: true } },
        contract: {
          select: {
            id: true,
            title: true,
            reference: true,
            startDate: true,
            endDate: true,
          },
        },
        lines: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!inv) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

    const { subtotalExVat, vatAmount, totalIncVat } = computeInvoiceVatFromLines(
      inv.lines,
      inv.vatRateBps,
    );

    const creditNoteRows = await prisma.accountsCreditNote.findMany({
      where: { originalInvoiceId: id },
      select: {
        id: true,
        creditNoteNumber: true,
        issueDate: true,
        totalIncVat: true,
      },
      orderBy: { issueDate: 'desc' },
    });
    const creditTotalApplied = await sumCreditTotalForInvoice(prisma, id);
    const remainingCreditable = Math.round((totalIncVat - creditTotalApplied) * 100) / 100;

    const canSetInvoiceStatus = access.canManageInvoices || access.canManagePayments;
    const canIssueCreditNote =
      access.canManageInvoices && remainingCreditable > 0.005;

    return NextResponse.json({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      clientId: inv.clientId,
      clientName: inv.accountsClient.name,
      contractId: inv.contractId,
      contract: inv.contract
        ? {
            id: inv.contract.id,
            title: inv.contract.title,
            reference: inv.contract.reference,
            startDate: inv.contract.startDate
              ? inv.contract.startDate.toISOString().slice(0, 10)
              : null,
            endDate: inv.contract.endDate.toISOString().slice(0, 10),
          }
        : null,
      issueDate: inv.issueDate.toISOString().slice(0, 10),
      dueDate: inv.dueDate ? inv.dueDate.toISOString().slice(0, 10) : null,
      taxDate: inv.taxDate ? inv.taxDate.toISOString().slice(0, 10) : null,
      currency: inv.currency,
      vatRateBps: inv.vatRateBps,
      status: inv.status,
      paymentBank: inv.paymentBank,
      notes: inv.notes,
      createdAt: inv.createdAt.toISOString(),
      updatedAt: inv.updatedAt.toISOString(),
      subtotalExVat,
      vatAmount,
      totalIncVat,
      lines: inv.lines.map((l, i) => ({
        id: l.id,
        item: l.item,
        description: l.description,
        amountExVat: String(l.amountExVat),
        sortOrder: l.sortOrder,
        lineNo: i + 1,
      })),
      canSetInvoiceStatus,
      canIssueCreditNote,
      creditTotalApplied,
      remainingCreditable,
      creditNotes: creditNoteRows.map((c) => ({
        id: c.id,
        creditNoteNumber: c.creditNoteNumber,
        issueDate: c.issueDate.toISOString().slice(0, 10),
        totalIncVat: Number(c.totalIncVat),
      })),
    });
  } catch (error) {
    await reportApiError({
      route: 'GET /api/accounts/invoices/[id]',
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Failed to load invoice.' }, { status: 500 });
  }
}

const PAYMENT_BANK_VALUES = new Set(['payroll_only', 'consultancy_fees']);
const INVOICE_STATUS_VALUES = new Set(['unpaid', 'partial', 'paid']);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireStaffUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const access = await getAccountsAccess(user.id, user.role);
  if (!access.hasAccountsAccess) {
    return NextResponse.json({ error: 'No access to Accounts.' }, { status: 403 });
  }

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const paymentBank =
    body && typeof body === 'object' && 'paymentBank' in body
      ? (body as { paymentBank: unknown }).paymentBank
      : undefined;

  const statusRaw =
    body && typeof body === 'object' && 'status' in body
      ? (body as { status: unknown }).status
      : undefined;

  const hasPaymentBank = typeof paymentBank === 'string' && PAYMENT_BANK_VALUES.has(paymentBank);
  const hasStatus = typeof statusRaw === 'string' && INVOICE_STATUS_VALUES.has(statusRaw);

  if (!hasPaymentBank && !hasStatus) {
    return NextResponse.json(
      {
        error:
          'Send paymentBank (payroll_only | consultancy_fees) and/or status (unpaid | partial | paid).',
      },
      { status: 400 },
    );
  }

  if (hasStatus && !access.canManageInvoices && !access.canManagePayments) {
    return NextResponse.json(
      { error: 'You do not have permission to change invoice payment status.' },
      { status: 403 },
    );
  }

  const data: {
    paymentBank?: 'payroll_only' | 'consultancy_fees';
    status?: 'unpaid' | 'partial' | 'paid';
  } = {};
  if (hasPaymentBank) {
    data.paymentBank = paymentBank as 'payroll_only' | 'consultancy_fees';
  }
  if (hasStatus) {
    data.status = statusRaw as 'unpaid' | 'partial' | 'paid';
  }

  try {
    await prisma.accountsInvoice.update({
      where: { id },
      data,
    });
  } catch {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    ...(hasPaymentBank ? { paymentBank } : {}),
    ...(hasStatus ? { status: statusRaw } : {}),
  });
}
