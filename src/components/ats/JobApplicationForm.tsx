'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  X,
  GraduationCap,
  Briefcase,
  Paperclip,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react';
import { JobListing } from '@/types/ats';
import { useATS } from '@/lib/ats-api';
import type {
  ApplicationFormData,
  EducationEntry,
  EducationLevel,
  EmploymentEntry,
  EmploymentType,
} from '@/types/dashboard';

const EDUCATION_LEVELS: { value: EducationLevel; label: string }[] = [
  { value: 'high_school', label: 'High School' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'masters', label: 'Masters' },
];

const EMPLOYMENT_TYPES: EmploymentType[] = ['Full-time', 'Contract', 'Freelance'];

const NATIONALITIES = [
  'Kenyan',
  'Ugandan',
  'Tanzanian',
  'Rwandan',
  'Ethiopian',
  'Somali',
  'South Sudanese',
  'Burundian',
  'Congolese',
  'Egyptian',
  'Nigerian',
  'Ghanaian',
  'South African',
  'Zimbabwean',
  'Malawian',
  'Zambian',
  'Botswanan',
  'Namibian',
  'British',
  'American',
  'Canadian',
  'Indian',
  'Pakistani',
  'Chinese',
  'Australian',
  'Other',
];

const EMPTY_EDUCATION: EducationEntry = {
  level: 'high_school',
  institution: '',
  grade: '',
  certificatePath: undefined,
};

const EMPTY_EMPLOYMENT: EmploymentEntry = {
  jobTitle: '',
  companyName: '',
  industry: '',
  employmentType: 'Full-time',
  startDate: '',
  endDate: '',
};

interface JobApplicationFormProps {
  job: JobListing;
  onSuccess?: (applicationId: string) => void;
  onClose?: () => void;
}

export default function JobApplicationForm({ job, onSuccess, onClose }: JobApplicationFormProps) {
  const { submitApplicationFull, uploadResume, uploadDocument } = useATS();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Stage 1: Candidate profile
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    homeCounty: '',
  });

  // Stage 2: Education (one block per level)
  const [education, setEducation] = useState<EducationEntry[]>(
    EDUCATION_LEVELS.map((l) => ({ ...EMPTY_EDUCATION, level: l.value }))
  );
  const [educationFiles, setEducationFiles] = useState<Record<EducationLevel, File | null>>({
    high_school: null,
    diploma: null,
    undergraduate: null,
    masters: null,
  });

  // Stage 3: Employment (up to 5)
  const [employment, setEmployment] = useState<EmploymentEntry[]>([
    { ...EMPTY_EMPLOYMENT },
  ]);
  const employmentMax = 5;

  // Stage 4: Attachments
  const [professionalCertifications, setProfessionalCertifications] = useState('');
  const [professionalCertFile, setProfessionalCertFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvPath, setCvPath] = useState('');

  // Stage 5: Declarations
  const [declarations, setDeclarations] = useState({
    accurate: false,
    dataProcessing: false,
    backgroundChecks: false,
    talentPool: false,
  });

  const inputClass = (key: string) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
      errors[key] ? 'border-red-300' : 'border-neutral-300'
    }`;
  const showError = (key: string) =>
    errors[key] && (
      <p className="text-red-500 text-sm mt-1 flex items-center">
        <AlertCircle className="w-4 h-4 mr-1 shrink-0" />
        {errors[key]}
      </p>
    );

  const validateStage1 = () => {
    const e: Record<string, string> = {};
    if (!profile.firstName.trim()) e.firstName = 'First name is required';
    if (!profile.lastName.trim()) e.lastName = 'Last name is required';
    if (!profile.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(profile.email)) e.email = 'Email is invalid';
    if (!profile.phone.trim()) e.phone = 'Phone number is required';
    if (!profile.nationality.trim()) e.nationality = 'Nationality is required';
    if (!profile.homeCounty.trim()) e.homeCounty = 'Home county is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStage4 = () => {
    const e: Record<string, string> = {};
    if (!cvFile && !cvPath) e.cv = 'CV is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStage5 = () => {
    const e: Record<string, string> = {};
    if (!declarations.accurate) e.accurate = 'Please confirm the information is accurate';
    if (!declarations.dataProcessing) e.dataProcessing = 'Please consent to data processing';
    if (!declarations.backgroundChecks) e.backgroundChecks = 'Please consent to background checks';
    if (!declarations.talentPool) e.talentPool = 'Please agree to be added to the talent pool';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    setErrors({});
    if (step === 1 && !validateStage1()) return;
    if (step === 4 && !validateStage4()) return;
    if (step === 5 && !validateStage5()) return;
    if (step < 6) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateStage1() || !validateStage4() || !validateStage5()) {
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      let resumePath = cvPath;
      if (cvFile && !resumePath) {
        resumePath = (await uploadResume(cvFile)) ?? '';
        if (!resumePath) {
          setErrors({ cv: 'Failed to upload CV. Please try again.' });
          setStep(4);
          setLoading(false);
          return;
        }
      }

      const certPaths: Partial<Record<EducationLevel, string>> = {};
      for (const level of EDUCATION_LEVELS) {
        const file = educationFiles[level.value];
        if (file) {
          const path = await uploadDocument(file);
          if (path) certPaths[level.value] = path;
        }
      }

      let professionalCertPath: string | undefined;
      if (professionalCertFile) {
        professionalCertPath = (await uploadDocument(professionalCertFile)) ?? undefined;
      }

      const educationPayload = education.map((entry) => ({
        level: entry.level,
        institution: entry.institution.trim(),
        grade: entry.grade.trim(),
        certificatePath: certPaths[entry.level] ?? entry.certificatePath,
      }));

      const employmentPayload = employment
        .filter(
          (e) =>
            e.jobTitle.trim() ||
            e.companyName.trim() ||
            e.industry.trim() ||
            e.startDate ||
            e.endDate
        )
        .map((e) => ({
          jobTitle: e.jobTitle.trim(),
          companyName: e.companyName.trim(),
          industry: e.industry.trim(),
          employmentType: e.employmentType,
          startDate: e.startDate,
          endDate: e.endDate,
        }));

      const formData: ApplicationFormData = {
        education: educationPayload,
        employmentHistory: employmentPayload,
        professionalCertifications: professionalCertifications.trim() || undefined,
        professionalCertificationsPath: professionalCertPath,
        declarations,
      };

      const application = await submitApplicationFull({
        jobId: job.id,
        candidate: {
          firstName: profile.firstName.trim(),
          lastName: profile.lastName.trim(),
          email: profile.email.trim(),
          phone: profile.phone.trim(),
          nationality: profile.nationality.trim(),
          homeCounty: profile.homeCounty.trim(),
        },
        resumePath: resumePath || undefined,
        formData,
      });

      if (application?.id) {
        onSuccess?.(application.id);
        setStep(7);
      } else {
        setErrors({ general: 'Failed to submit application. Please try again.' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const setEducationEntry = (index: number, field: keyof EducationEntry, value: string) => {
    setEducation((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const setEmploymentEntry = (index: number, field: keyof EmploymentEntry, value: string | EmploymentType) => {
    setEmployment((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addEmployment = () => {
    if (employment.length < employmentMax) {
      setEmployment((prev) => [...prev, { ...EMPTY_EMPLOYMENT }]);
    }
  };

  const removeEmployment = (index: number) => {
    if (employment.length > 1) {
      setEmployment((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
  const maxFileSize = 5 * 1024 * 1024;

  const handleFile = (
    file: File | null,
    setter: (f: File | null) => void,
    errorKey: string
  ) => {
    if (!file) {
      setter(null);
      setErrors((e) => ({ ...e, [errorKey]: '' }));
      return;
    }
    if (!allowedFileTypes.includes(file.type)) {
      setErrors((e) => ({ ...e, [errorKey]: 'Use PDF, Word, or image (JPEG/PNG).' }));
      return;
    }
    if (file.size > maxFileSize) {
      setErrors((e) => ({ ...e, [errorKey]: 'File must be under 5MB.' }));
      return;
    }
    setter(file);
    setErrors((e) => ({ ...e, [errorKey]: '' }));
  };

  const steps = [
    { num: 1, title: 'Candidate profile' },
    { num: 2, title: 'Education' },
    { num: 3, title: 'Employment history' },
    { num: 4, title: 'Attachments' },
    { num: 5, title: 'Declarations' },
    { num: 6, title: 'Review & submit' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-2xl w-full my-8 shadow-xl"
      >
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 rounded-t-xl z-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-primary-900">Apply for {job.title}</h2>
              <p className="text-sm text-neutral-500">at {job.company}</p>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex gap-1 mt-3">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`h-1 flex-1 rounded-full ${
                  step >= s.num ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
                title={s.title}
              />
            ))}
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Candidate profile
                </h3>
                <p className="text-sm text-neutral-600">
                  This email will be used for application confirmation, interview invites, and outcomes.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">First name *</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                      className={inputClass('firstName')}
                      placeholder="First name"
                    />
                    {showError('firstName')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Last name *</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                      className={inputClass('lastName')}
                      placeholder="Last name"
                    />
                    {showError('lastName')}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    className={inputClass('email')}
                    placeholder="email@example.com"
                  />
                  {showError('email')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Phone number *</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className={inputClass('phone')}
                    placeholder="+254..."
                  />
                  {showError('phone')}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Nationality *</label>
                    <select
                      value={profile.nationality}
                      onChange={(e) => setProfile((p) => ({ ...p, nationality: e.target.value }))}
                      className={inputClass('nationality')}
                      aria-label="Nationality"
                    >
                      <option value="">Select nationality</option>
                      {NATIONALITIES.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    {showError('nationality')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Home county *</label>
                    <input
                      type="text"
                      value={profile.homeCounty}
                      onChange={(e) => setProfile((p) => ({ ...p, homeCounty: e.target.value }))}
                      className={inputClass('homeCounty')}
                      placeholder="e.g. Nairobi"
                    />
                    {showError('homeCounty')}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </h3>
                <p className="text-sm text-neutral-600">Add institution and grade. If filled, attach certificate.</p>
                {EDUCATION_LEVELS.map(({ value, label }, idx) => (
                  <div key={value} className="border border-neutral-200 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-medium text-neutral-800">{label}</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Institution</label>
                        <input
                          type="text"
                          value={education[idx]?.institution ?? ''}
                          onChange={(e) => setEducationEntry(idx, 'institution', e.target.value)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                          placeholder="Institution name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Grade</label>
                        <input
                          type="text"
                          value={education[idx]?.grade ?? ''}
                          onChange={(e) => setEducationEntry(idx, 'grade', e.target.value)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                          placeholder="Grade / class"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Certificate (if filled)</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/jpeg,image/png"
                        onChange={(e) =>
                          handleFile(
                            e.target.files?.[0] ?? null,
                            (f) => setEducationFiles((prev) => ({ ...prev, [value]: f })),
                            `edu_${value}`
                          )
                        }
                        className="w-full text-sm"
                      />
                      {educationFiles[value] && (
                        <p className="text-xs text-neutral-500 mt-1">{educationFiles[value]?.name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Employment history
                </h3>
                <p className="text-sm text-neutral-600">Up to 5 entries. Add job title, company, industry, type, and dates.</p>
                {employment.map((entry, idx) => (
                  <div key={idx} className="border border-neutral-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-neutral-700">Entry {idx + 1}</span>
                      {employment.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmployment(idx)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Job title</label>
                        <input
                          type="text"
                          value={entry.jobTitle}
                          onChange={(e) => setEmploymentEntry(idx, 'jobTitle', e.target.value)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                          placeholder="Job title"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Company name</label>
                        <input
                          type="text"
                          value={entry.companyName}
                          onChange={(e) => setEmploymentEntry(idx, 'companyName', e.target.value)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                          placeholder="Company"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Industry</label>
                        <input
                          type="text"
                          value={entry.industry}
                          onChange={(e) => setEmploymentEntry(idx, 'industry', e.target.value)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                          placeholder="Industry"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Employment type</label>
                        <select
                          value={entry.employmentType}
                          onChange={(e) =>
                            setEmploymentEntry(idx, 'employmentType', e.target.value as EmploymentType)
                          }
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                        >
                          {EMPLOYMENT_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">Start date</label>
                        <input
                          type="month"
                          value={entry.startDate}
                          onChange={(e) => setEmploymentEntry(idx, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-600 mb-1">End date</label>
                        <input
                          type="month"
                          value={entry.endDate}
                          onChange={(e) => setEmploymentEntry(idx, 'endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {employment.length < employmentMax && (
                  <button
                    type="button"
                    onClick={addEmployment}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    + Add another employment
                  </button>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="s4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                  <Paperclip className="w-5 h-5" />
                  Attachments
                </h3>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">CV *</label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        handleFile(f, setCvFile, 'cv');
                        if (f) setCvPath('');
                      }}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label htmlFor="cv-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-sm text-neutral-600">
                        {cvFile ? cvFile.name : cvPath ? 'CV uploaded' : 'Click to upload CV'}
                      </p>
                      <p className="text-xs text-neutral-500">PDF or Word, max 5MB</p>
                    </label>
                  </div>
                  {showError('cv')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Professional certifications (optional)
                  </label>
                  <input
                    type="text"
                    value={professionalCertifications}
                    onChange={(e) => setProfessionalCertifications(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm"
                    placeholder="List certifications"
                  />
                  <div className="mt-2">
                    <label className="block text-xs text-neutral-600 mb-1">Attach proof (optional)</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/jpeg,image/png"
                      onChange={(e) =>
                        handleFile(
                          e.target.files?.[0] ?? null,
                          setProfessionalCertFile,
                          'professionalCert'
                        )
                      }
                      className="w-full text-sm"
                    />
                    {professionalCertFile && (
                      <p className="text-xs text-neutral-500 mt-1">{professionalCertFile.name}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="s5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Declarations and consent
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      key: 'accurate' as const,
                      label: 'I confirm the information provided is accurate',
                    },
                    {
                      key: 'dataProcessing' as const,
                      label: 'I consent to data processing for recruitment purposes',
                    },
                    {
                      key: 'backgroundChecks' as const,
                      label: 'I consent to background and reference checks',
                    },
                    {
                      key: 'talentPool' as const,
                      label: 'I agree to be added to the talent pool for future roles',
                    },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={declarations[key]}
                        onChange={(e) =>
                          setDeclarations((d) => ({ ...d, [key]: e.target.checked }))
                        }
                        className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-700">{label}</span>
                    </label>
                  ))}
                </div>
                {showError('accurate')}
                {showError('dataProcessing')}
                {showError('backgroundChecks')}
                {showError('talentPool')}
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="s6"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Final review
                </h3>
                <div className="bg-neutral-50 rounded-lg p-4 space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-neutral-800">Profile</p>
                    <p className="text-neutral-600">
                      {profile.firstName} {profile.lastName} · {profile.email} · {profile.phone}
                    </p>
                    <p className="text-neutral-600">
                      {profile.nationality} · {profile.homeCounty}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Education</p>
                    {education.map(
                      (e, i) =>
                        (e.institution || e.grade) && (
                          <p key={i} className="text-neutral-600">
                            {EDUCATION_LEVELS[i]?.label}: {e.institution} {e.grade}
                          </p>
                        )
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Employment</p>
                    {employment
                      .filter(
                        (e) =>
                          e.jobTitle || e.companyName || e.industry || e.startDate || e.endDate
                      )
                      .map((e, i) => (
                        <p key={i} className="text-neutral-600">
                          {e.jobTitle} at {e.companyName} ({e.employmentType}) · {e.startDate} – {e.endDate}
                        </p>
                      ))}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Attachments</p>
                    <p className="text-neutral-600">
                      CV: {cvFile?.name ?? (cvPath ? 'Uploaded' : '—')}
                      {professionalCertifications && ` · Certifications: ${professionalCertifications}`}
                    </p>
                  </div>
                </div>
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errors.general}
                  </div>
                )}
                <p className="text-xs text-neutral-500">
                  Use &quot;Previous&quot; to edit any section, then &quot;Submit application&quot; to send.
                </p>
              </motion.div>
            )}

            {step === 7 && (
              <motion.div
                key="s7"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">Application submitted</h3>
                <p className="text-neutral-600 mb-6">
                  Thank you for applying to {job.title} at {job.company}. We&apos;ll review and be in touch.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 bg-primary-900 text-white rounded-lg font-medium hover:bg-primary-800"
                    >
                      Close
                    </button>
                  )}
                  <a
                    href="/careers"
                    className="px-5 py-2.5 border border-primary-900 text-primary-900 rounded-lg font-medium hover:bg-primary-50"
                  >
                    Browse more jobs
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step >= 1 && step <= 6 && (
          <div className="sticky bottom-0 border-t border-neutral-200 px-6 py-4 bg-white rounded-b-xl flex justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Previous
            </button>
            {step < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2.5 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800"
              >
                Next
                <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2.5 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Submit application
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
