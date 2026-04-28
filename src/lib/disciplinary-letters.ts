import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import type { DisciplinaryActionType } from '@prisma/client';

const LOGO_PATH = resolve(process.cwd(), 'public/brand/3rd-park-logo.png');
const ADDRESS = '3rd Parklands Avenue, Park Medical Centre (PMC), 9th Floor, Parklands, Nairobi, Kenya';

type BaseLetterInput = {
  employeeName: string;
  employeeNumber?: string | null;
  department?: string | null;
  subject: string;
  incidentDescription: string;
  incidentDate: string;
  hrManagerName: string;
  hrManagerTitle: string;
  date: string;
};

export async function generateWarningLetterPdf(
  type: Extract<DisciplinaryActionType, 'VERBAL_WARNING' | 'WRITTEN_WARNING' | 'FINAL_WARNING'>,
  input: BaseLetterInput,
): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let y = 790;

  if (existsSync(LOGO_PATH)) {
    const png = await doc.embedPng(readFileSync(LOGO_PATH));
    page.drawImage(png, { x: 230, y: y - 40, width: 120, height: 40 });
    y -= 52;
  }
  page.drawText(ADDRESS, { x: 60, y, size: 9, font: helvetica, color: rgb(0.2, 0.2, 0.2) });
  y -= 32;
  page.drawText(input.date, { x: 60, y, size: 11, font: helvetica });
  y -= 26;
  page.drawText('PRIVATE AND CONFIDENTIAL', { x: 60, y, size: 11, font: bold });
  y -= 26;
  page.drawText(input.employeeName, { x: 60, y, size: 11, font: helvetica });
  y -= 16;
  page.drawText(input.employeeNumber || '-', { x: 60, y, size: 11, font: helvetica });
  y -= 16;
  page.drawText(input.department || '-', { x: 60, y, size: 11, font: helvetica });
  y -= 28;
  page.drawText(`RE: ${type.replaceAll('_', ' ')} - ${input.subject}`, { x: 60, y, size: 11, font: bold });
  y -= 24;
  page.drawText(`Dear ${input.employeeName.split(' ')[0]},`, { x: 60, y, size: 11, font: helvetica });
  y -= 20;
  const paragraph =
    `This letter serves as a ${type.replaceAll('_', ' ').toLowerCase()} regarding ${input.incidentDescription} ` +
    `which occurred on ${input.incidentDate}. Failure to improve may result in further disciplinary action up to and ` +
    `including termination of employment in accordance with the Employment Act, 2007.`;
  page.drawText(paragraph.slice(0, 180), { x: 60, y, size: 10, font: helvetica });
  y -= 16;
  page.drawText(paragraph.slice(180), { x: 60, y, size: 10, font: helvetica });
  y -= 36;
  page.drawText('Yours faithfully,', { x: 60, y, size: 11, font: helvetica });
  y -= 30;
  page.drawText('_____________________', { x: 60, y, size: 11, font: helvetica });
  y -= 16;
  page.drawText(input.hrManagerName, { x: 60, y, size: 11, font: bold });
  y -= 16;
  page.drawText(input.hrManagerTitle, { x: 60, y, size: 11, font: helvetica });
  y -= 24;
  page.drawText('ACKNOWLEDGMENT', { x: 60, y, size: 11, font: bold });
  y -= 16;
  page.drawText(`I, ${input.employeeName}, acknowledge receipt of this warning on ${input.date}.`, { x: 60, y, size: 10, font: helvetica });
  y -= 24;
  page.drawText('Signature: _____________________', { x: 60, y, size: 10, font: helvetica });
  y -= 16;
  page.drawText('Date: _____________________', { x: 60, y, size: 10, font: helvetica });

  return Buffer.from(await doc.save());
}

export async function generateShowCauseLetterPdf(
  input: BaseLetterInput & { responseDays?: number },
): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let y = 790;

  if (existsSync(LOGO_PATH)) {
    const png = await doc.embedPng(readFileSync(LOGO_PATH));
    page.drawImage(png, { x: 230, y: y - 40, width: 120, height: 40 });
    y -= 52;
  }
  page.drawText(ADDRESS, { x: 60, y, size: 9, font: helvetica });
  y -= 32;
  page.drawText(input.date, { x: 60, y, size: 11, font: helvetica });
  y -= 28;
  page.drawText(`RE: SHOW CAUSE - ${input.subject}`, { x: 60, y, size: 11, font: bold });
  y -= 24;
  page.drawText(
    `You are hereby required to show cause in writing within ${input.responseDays ?? 7} days from the date of this letter why disciplinary action should not be taken against you regarding ${input.incidentDescription}.`,
    { x: 60, y, size: 10, font: helvetica },
  );
  return Buffer.from(await doc.save());
}
