/**
 * Seed 20 dummy candidates and applications for existing job openings.
 * Includes nationality, homeCounty, and formData (education, employment history, declarations).
 * Run: node prisma/seed-candidates.js
 * Requires: DATABASE_URL set and migrations applied.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STATUSES = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];

const CANDIDATES = [
  { firstName: 'Jane', lastName: 'Wanjiru', email: 'jane.wanjiru@example.com', phone: '+254 700 111 001', location: 'Nairobi', nationality: 'Kenyan', homeCounty: 'Nairobi', experience: 5, education: 'Bachelor of Commerce, University of Nairobi', skills: ['Accounting', 'Excel', 'Financial Reporting'] },
  { firstName: 'John', lastName: 'Kamau', email: 'john.kamau@example.com', phone: '+254 722 222 002', location: 'Mombasa', nationality: 'Kenyan', homeCounty: 'Mombasa', experience: 3, education: 'Bachelor of Business Administration, Moi University', skills: ['Sales', 'Marketing', 'CRM'] },
  { firstName: 'Grace', lastName: 'Wanjiku', email: 'grace.wanjiku@example.com', phone: '+254 711 333 003', location: 'Nairobi', nationality: 'Kenyan', homeCounty: 'Nairobi', experience: 8, education: 'MBA, Strathmore University', skills: ['Strategy', 'Leadership', 'Project Management'] },
  { firstName: 'Peter', lastName: 'Ochieng', email: 'peter.ochieng@example.com', phone: '+254 733 444 004', location: 'Kisumu', nationality: 'Kenyan', homeCounty: 'Kisumu', experience: 2, education: 'Bachelor of Science in Computer Science, JKUAT', skills: ['JavaScript', 'React', 'Node.js'] },
  { firstName: 'Mary', lastName: 'Akinyi', email: 'mary.akinyi@example.com', phone: '+254 700 555 005', location: 'Nairobi', nationality: 'Kenyan', homeCounty: 'Nairobi', experience: 6, education: 'Master of Science in Data Science, UoN', skills: ['Python', 'SQL', 'Machine Learning'] },
  { firstName: 'James', lastName: 'Mutua', email: 'james.mutua@example.com', phone: null, location: 'Nakuru', nationality: 'Kenyan', homeCounty: 'Nakuru', experience: 4, education: 'Bachelor of Law, University of Nairobi', skills: ['Legal Research', 'Contract Drafting', 'Compliance'] },
  { firstName: 'Lucy', lastName: 'Njeri', email: 'lucy.njeri@example.com', phone: '+254 722 777 007', location: 'Nairobi', nationality: 'Kenyan', homeCounty: 'Kiambu', experience: 7, education: 'Bachelor of Commerce, CPA K', skills: ['Audit', 'Tax', 'IFRS'] },
  { firstName: 'David', lastName: 'Kipchoge', email: 'david.kipchoge@example.com', phone: '+254 711 888 008', location: 'Eldoret', nationality: 'Kenyan', homeCounty: 'Uasin Gishu', experience: 1, education: 'Diploma in HR Management', skills: ['Recruitment', 'Onboarding', 'HRIS'] },
  { firstName: 'Sarah', lastName: 'Muthoni', email: 'sarah.muthoni@example.com', phone: '+254 700 999 009', location: 'Nairobi', nationality: 'Kenyan', homeCounty: 'Nyeri', experience: 10, education: 'PhD in Economics, UoN', skills: ['Research', 'Econometrics', 'Policy'] },
  { firstName: 'Michael', lastName: 'Odhiambo', email: 'michael.odhiambo@example.com', phone: '+254 733 101 010', location: 'Kisumu', nationality: 'Kenyan', homeCounty: 'Kisumu', experience: 3, education: 'Bachelor of Education, Kenyatta University', skills: ['Teaching', 'Curriculum', 'Assessment'] },
  { firstName: 'Elizabeth', lastName: 'Chebet', email: 'elizabeth.chebet@example.com', phone: '+254 722 202 020', location: 'Nairobi', nationality: 'Kenyan', homeCounty: 'Nairobi', experience: 5, education: 'MBA, University of Nairobi', skills: ['Operations', 'Supply Chain', 'Logistics'] },
  { firstName: 'Robert', lastName: 'Kariuki', email: 'robert.kariuki@example.com', phone: null, location: 'Thika', nationality: 'Kenyan', homeCounty: 'Kiambu', experience: 4, education: 'Bachelor of Engineering, UoN', skills: ['AutoCAD', 'Project Management', 'Quality'] },
  { firstName: 'Anne', lastName: 'Achieng', email: 'anne.achieng@example.com', phone: '+254 711 303 030', location: 'Nairobi', nationality: 'Kenyan', homeCounty: 'Kisumu', experience: 2, education: 'Bachelor of Arts in Communication', skills: ['Content', 'Social Media', 'PR'] },
  { firstName: 'Joseph', lastName: 'Mwangi', email: 'joseph.mwangi@example.com', phone: '+254 700 404 040', location: 'Nairobi', nationality: 'Kenyan', homeCounty: 'Murang\'a', experience: 6, education: 'Master of Public Health', skills: ['Health Programs', 'Data Analysis', 'Reporting'] },
  { firstName: 'Faith', lastName: 'Nyambura', email: 'faith.nyambura@example.com', phone: '+254 722 505 050', location: 'Nairobi', nationality: 'Kenyan', homeCounty: 'Nairobi', experience: 3, education: 'Bachelor of Science in Nursing', skills: ['Patient Care', 'Clinical', 'BLS'] },
  { firstName: 'Daniel', lastName: 'Koech', email: 'daniel.koech@example.com', phone: '+254 733 606 060', location: 'Eldoret', nationality: 'Kenyan', homeCounty: 'Uasin Gishu', experience: 5, education: 'Bachelor of Commerce, ACCA', skills: ['Finance', 'Budgeting', 'Treasury'] },
  { firstName: 'Ruth', lastName: 'Wambui', email: 'ruth.wambui@example.com', phone: '+254 711 707 070', location: 'Nairobi', nationality: 'Kenyan', homeCounty: 'Nairobi', experience: 4, education: 'LLB, Kenya School of Law', skills: ['Litigation', 'Corporate Law', 'ADR'] },
  { firstName: 'Kevin', lastName: 'Omondi', email: 'kevin.omondi@example.com', phone: null, location: 'Mombasa', nationality: 'Kenyan', homeCounty: 'Mombasa', experience: 2, education: 'Bachelor of Science in IT', skills: ['Networking', 'Cybersecurity', 'Support'] },
  { firstName: 'Catherine', lastName: 'Wairimu', email: 'catherine.wairimu@example.com', phone: '+254 700 808 080', location: 'Nairobi', nationality: 'Kenyan', homeCounty: 'Nairobi', experience: 9, education: 'MBA, Bachelor of Commerce', skills: ['Strategy', 'Business Development', 'Partnerships'] },
  { firstName: 'Brian', lastName: 'Kipruto', email: 'brian.kipruto@example.com', phone: '+254 722 909 090', location: 'Nairobi', nationality: 'Kenyan', homeCounty: 'Nakuru', experience: 4, education: 'Bachelor of Science in Actuarial Science', skills: ['Risk', 'Modelling', 'Insurance'] },
];

const COVER_LETTERS = [
  'I am very interested in this role and believe my experience aligns well with your requirements.',
  'Having followed your organization for some time, I would be excited to contribute to your team.',
  'My background in this field makes me a strong fit for the position. I look forward to discussing further.',
  'I am writing to apply for this position. I have relevant experience and am eager to bring value.',
  null,
  'I would welcome the opportunity to join your team and contribute to your goals.',
  null,
  'Please find my application attached. I am available for an interview at your convenience.',
  'I am confident that my skills and experience would be an asset to your organization.',
  null,
];

// Build formData for a candidate index (education + employment + declarations)
function buildFormData(index) {
  const educationLevels = [
    { level: 'high_school', institution: 'National High School', grade: 'B+' },
    { level: 'diploma', institution: 'Kenya Polytechnic', grade: 'Credit' },
    { level: 'undergraduate', institution: 'University of Nairobi', grade: 'Second Class Upper' },
    { level: 'masters', institution: 'Strathmore University', grade: 'Distinction' },
  ];
  // Vary how many education levels: 0–4
  const numEdu = (index % 5);
  const education = educationLevels.slice(0, numEdu).map(({ level, institution, grade }) => ({
    level,
    institution,
    grade,
  }));

  const employmentTemplates = [
    { jobTitle: 'Accountant', companyName: 'ABC Ltd', industry: 'Finance', employmentType: 'Full-time', startDate: '2019-01', endDate: '2022-06' },
    { jobTitle: 'Sales Representative', companyName: 'Tech Solutions', industry: 'Technology', employmentType: 'Full-time', startDate: '2020-03', endDate: '2024-01' },
    { jobTitle: 'Consultant', companyName: 'Freelance', industry: 'Consulting', employmentType: 'Freelance', startDate: '2021-01', endDate: '2023-12' },
    { jobTitle: 'Project Manager', companyName: 'BuildCo', industry: 'Construction', employmentType: 'Contract', startDate: '2018-06', endDate: '2020-12' },
    { jobTitle: 'HR Officer', companyName: 'HR Solutions Kenya', industry: 'HR', employmentType: 'Full-time', startDate: '2022-01', endDate: '2024-06' },
  ];
  const numEmp = 1 + (index % 3); // 1–3 employment entries
  const employmentHistory = [];
  for (let i = 0; i < numEmp; i++) {
    const t = employmentTemplates[(index + i) % employmentTemplates.length];
    employmentHistory.push({
      jobTitle: t.jobTitle,
      companyName: t.companyName,
      industry: t.industry,
      employmentType: t.employmentType,
      startDate: t.startDate,
      endDate: t.endDate,
    });
  }

  const professionalCertifications = index % 3 === 0 ? 'CPA K, ACCA Part II' : (index % 5 === 2 ? 'PMP, PRINCE2' : undefined);

  return {
    education,
    employmentHistory,
    professionalCertifications,
    declarations: {
      accurate: true,
      dataProcessing: true,
      backgroundChecks: true,
      talentPool: true,
    },
  };
}

function pickStatus(index) {
  const i = index % STATUSES.length;
  return STATUSES[i];
}

function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

async function main() {
  const jobs = await prisma.job.findMany({ take: 20, orderBy: { postedDate: 'desc' } });
  if (jobs.length === 0) {
    console.log('No job openings found. Create at least one job in Dashboard → Job openings, then run this seed again.');
    process.exit(1);
  }

  console.log(`Found ${jobs.length} job(s). Creating ${CANDIDATES.length} candidates and applications...`);

  const created = [];
  for (let i = 0; i < CANDIDATES.length; i++) {
    const c = CANDIDATES[i];
    const job = jobs[i % jobs.length];
    const appliedDate = daysAgo(1 + (i % 14));

    const candidate = await prisma.candidate.upsert({
      where: { email: c.email },
      create: {
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        location: c.location,
        nationality: c.nationality,
        homeCounty: c.homeCounty,
        experience: c.experience,
        education: c.education,
        skills: c.skills,
        resumePath: '/uploads/resumes/CV%20Justin%20Ombui.pdf',
      },
      update: {
        firstName: c.firstName,
        lastName: c.lastName,
        phone: c.phone,
        location: c.location,
        nationality: c.nationality,
        homeCounty: c.homeCounty,
        experience: c.experience,
        education: c.education,
        skills: c.skills,
        resumePath: '/uploads/resumes/CV%20Justin%20Ombui.pdf',
      },
    });

    const status = pickStatus(i);
    const formData = buildFormData(i);
    const existingApp = await prisma.application.findFirst({
      where: { candidateId: candidate.id, jobId: job.id },
    });
    if (!existingApp) {
      await prisma.application.create({
        data: {
          jobId: job.id,
          candidateId: candidate.id,
          status,
          appliedDate,
          coverLetter: COVER_LETTERS[i % COVER_LETTERS.length],
          resumePath: candidate.resumePath,
          notes: status === 'shortlisted' ? 'Strong fit. Schedule interview.' : null,
          formData,
        },
      });
    } else if (existingApp.formData == null) {
      await prisma.application.update({
        where: { id: existingApp.id },
        data: { formData },
      });
    }

    created.push({ candidate: `${c.firstName} ${c.lastName}`, job: job.title, status });
  }

  console.log('Done. Created/updated candidates and applications:');
  created.forEach((r, i) => console.log(`  ${i + 1}. ${r.candidate} → ${r.job} (${r.status})`));
  console.log('\nYou can now test the Applications and Candidates tabs in the dashboard.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
