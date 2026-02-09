import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getInMemoryApplications } from '@/lib/applications-store';
import type { ApplicationWithDetails } from '@/types/dashboard';
import ExcelJS from 'exceljs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId') || undefined;
  const clientId = searchParams.get('clientId') || undefined;
  const status = searchParams.get('status') || undefined;
  const nationality = searchParams.get('nationality') || undefined;
  const homeCounty = searchParams.get('homeCounty') || undefined;
  const educationLevel = searchParams.get('educationLevel') || undefined;
  const employmentType = searchParams.get('employmentType') || undefined;

  let applications: ApplicationWithDetails[] = [];

  try {
    if (process.env.DATABASE_URL) {
      const rows = await prisma.application.findMany({
        where: {
          ...(jobId ? { jobId } : {}),
          ...(clientId ? { job: { clientId } } : {}),
          ...(status ? { status: status as 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired' } : {}),
          ...(nationality?.trim() || homeCounty?.trim()
            ? {
                candidate: {
                  ...(nationality?.trim()
                    ? { nationality: { contains: nationality.trim(), mode: 'insensitive' as const } }
                    : {}),
                  ...(homeCounty?.trim()
                    ? { homeCounty: { contains: homeCounty.trim(), mode: 'insensitive' as const } }
                    : {}),
                },
              }
            : {}),
        },
        include: { candidate: true, job: { include: { client: true } } },
        orderBy: { appliedDate: 'desc' },
      });
      let filtered = rows;
      if (educationLevel?.trim()) {
        const level = educationLevel.trim();
        filtered = filtered.filter((a) => {
          const fd = a.formData as { education?: { level: string }[] } | null;
          return fd?.education?.some((e) => e.level === level) ?? false;
        });
      }
      if (employmentType?.trim()) {
        const type = employmentType.trim();
        filtered = filtered.filter((a) => {
          const fd = a.formData as { employmentHistory?: { employmentType: string }[] } | null;
          return fd?.employmentHistory?.some((e) => e.employmentType === type) ?? false;
        });
      }
      applications = filtered.map((a) => ({
        id: a.id,
        jobId: a.jobId,
        candidateId: a.candidateId,
        status: a.status,
        appliedDate: a.appliedDate.toISOString(),
        coverLetter: a.coverLetter,
        resumePath: a.resumePath,
        notes: a.notes,
        formData: (a.formData as ApplicationWithDetails['formData']) ?? null,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
        candidate: {
          id: a.candidate.id,
          firstName: a.candidate.firstName,
          lastName: a.candidate.lastName,
          email: a.candidate.email,
          phone: a.candidate.phone,
          location: a.candidate.location,
          nationality: a.candidate.nationality ?? null,
          homeCounty: a.candidate.homeCounty ?? null,
          experience: a.candidate.experience,
          education: a.candidate.education,
          skills: (Array.isArray(a.candidate.skills) ? a.candidate.skills : []) as string[],
          resumePath: a.candidate.resumePath,
          createdAt: a.candidate.createdAt.toISOString(),
        },
        job: {
          id: a.job.id,
          title: a.job.title,
          company: a.job.company,
          location: a.job.location,
          type: a.job.type,
          category: a.job.category,
          postedDate: a.job.postedDate.toISOString(),
          isActive: a.job.isActive,
          clientId: a.job.clientId ?? null,
          clientName: a.job.client?.name ?? null,
        },
      }));
    } else {
      applications = getInMemoryApplications({
        jobId,
        clientId: clientId || undefined,
        status: status as 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired' | undefined,
        nationality: nationality?.trim() || undefined,
        homeCounty: homeCounty?.trim() || undefined,
        educationLevel: educationLevel?.trim() || undefined,
        employmentType: employmentType?.trim() || undefined,
      });
    }
  } catch (e) {
    console.error('Export applications error:', e);
    return NextResponse.json({ error: 'Failed to load applications.' }, { status: 500 });
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Eagle HR ATS';
  workbook.created = new Date();

  const dateStr = new Date().toISOString().slice(0, 10);
  const jobTitle = applications.length > 0 ? applications[0].job.title : '';
  const singleJob = applications.every((a) => a.job.title === jobTitle);
  const sheetName = singleJob && jobTitle
    ? `${jobTitle.replace(/[\/*?:\[\]\\]/g, ' ').trim()} ${dateStr}`
    : `Applications ${dateStr}`;
  const safeSheetName = sheetName.slice(0, 31);

  const sheet = workbook.addWorksheet(safeSheetName, {
    views: [{ state: 'frozen', ySplit: 1 }],
    properties: { tabColor: { argb: 'FF1e40af' } },
  });

  const headerRow = [
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Nationality',
    'Home County',
    'Location',
    'Experience (years)',
    'Education (legacy)',
    'Skills',
    'Education (form)',
    'Employment history',
    'Professional certifications',
    'Declarations (accurate)',
    'Declarations (data)',
    'Declarations (background)',
    'Declarations (talent pool)',
    'Applied Date',
    'Client',
  ];
  sheet.addRow(headerRow);
  const header = sheet.getRow(1);
  header.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  header.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF043d4a' },
  };
  header.alignment = { wrapText: true, vertical: 'middle' };
  header.height = 22;

  for (const app of applications) {
    const c = app.candidate;
    const appliedDate = new Date(app.appliedDate);
    const skillsStr = Array.isArray(c.skills) ? c.skills.join(', ') : '';
    const fd = app.formData;
    const educationStr = fd?.education
      ?.filter((e) => e.institution || e.grade)
      .map((e) => `${e.level}: ${e.institution} ${e.grade}`)
      .join('; ') ?? '';
    const employmentStr = fd?.employmentHistory
      ?.filter((e) => e.jobTitle || e.companyName)
      .map((e) => `${e.jobTitle} at ${e.companyName} (${e.employmentType})`)
      .join('; ') ?? '';
    sheet.addRow([
      c.firstName ?? '',
      c.lastName ?? '',
      c.email ?? '',
      c.phone ?? '',
      c.nationality ?? '',
      c.homeCounty ?? '',
      c.location ?? '',
      c.experience ?? 0,
      c.education ?? '',
      skillsStr,
      educationStr,
      employmentStr,
      fd?.professionalCertifications ?? '',
      fd?.declarations?.accurate ? 'Yes' : 'No',
      fd?.declarations?.dataProcessing ? 'Yes' : 'No',
      fd?.declarations?.backgroundChecks ? 'Yes' : 'No',
      fd?.declarations?.talentPool ? 'Yes' : 'No',
      appliedDate.toLocaleDateString(undefined, { dateStyle: 'medium' }),
      app.job.clientName ?? '',
    ]);
  }

  sheet.columns = [
    { width: 14 },
    { width: 14 },
    { width: 28 },
    { width: 16 },
    { width: 14 },
    { width: 14 },
    { width: 18 },
    { width: 10 },
    { width: 24 },
    { width: 28 },
    { width: 36 },
    { width: 40 },
    { width: 24 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 14 },
    { width: 14 },
    { width: 18 },
  ];

  const borderStyle: Partial<ExcelJS.Borders> = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
  for (let i = 1; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    row.eachCell((cell) => {
      cell.border = borderStyle;
      cell.alignment = { wrapText: true, vertical: 'top' };
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `applications-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(buffer.byteLength),
    },
  });
}
