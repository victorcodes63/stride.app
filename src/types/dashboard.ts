// Dashboard & API contract – shared shapes so UI and backend stay in sync

export type ApplicationStatus =
  | 'pending'
  | 'reviewed'
  | 'shortlisted'
  | 'rejected'
  | 'hired';

export interface CandidateSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  location: string | null;
  nationality: string | null;
  homeCounty: string | null;
  experience: number;
  education: string | null;
  skills: string[];
  resumePath: string | null;
  createdAt: string;
}

export interface JobSummary {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  postedDate: string;
  isActive: boolean;
  clientId: string | null;
  clientName: string | null;
}

// Application form data (Stages 2–5) stored as JSON on Application
export type EducationLevel = 'high_school' | 'diploma' | 'undergraduate' | 'masters';

export interface EducationEntry {
  level: EducationLevel;
  institution: string;
  grade: string;
  certificatePath?: string;
}

export type EmploymentType = 'Full-time' | 'Contract' | 'Freelance';

export interface EmploymentEntry {
  jobTitle: string;
  companyName: string;
  industry: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string;
}

export interface ApplicationFormData {
  education: EducationEntry[];
  employmentHistory: EmploymentEntry[];
  professionalCertifications?: string;
  professionalCertificationsPath?: string;
  declarations: {
    accurate: boolean;
    dataProcessing: boolean;
    backgroundChecks: boolean;
    talentPool: boolean;
  };
}

export interface ApplicationWithDetails {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedDate: string;
  coverLetter: string | null;
  resumePath: string | null;
  notes: string | null;
  formData: ApplicationFormData | null;
  createdAt: string;
  updatedAt: string;
  candidate: CandidateSummary;
  job: JobSummary;
}

export interface ApplicationsListResponse {
  applications: ApplicationWithDetails[];
  total: number;
}

export interface ApplicationsQueryParams {
  jobId?: string;
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
  sortBy?: 'appliedDate' | 'status' | 'candidateName';
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateApplicationStatusBody {
  status: ApplicationStatus;
  emailMessage?: string; // optional custom note to include in status-update email
}

// Interview management
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled';
export type InterviewType = 'phone' | 'video' | 'onsite';

export interface InterviewWithDetails {
  id: string;
  applicationId: string;
  scheduledAt: string;
  type: InterviewType;
  locationOrLink: string | null;
  notes: string | null;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
  application: {
    id: string;
    status: ApplicationStatus;
    candidate: CandidateSummary;
    job: JobSummary;
  };
}

export interface CreateInterviewBody {
  applicationId: string;
  scheduledAt: string; // ISO datetime
  type: InterviewType;
  locationOrLink?: string;
  notes?: string;
}

// Staff / User management (no password in API responses)
export type UserRole = 'admin' | 'staff' | 'viewer';

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserBody {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserBody {
  name?: string;
  role?: UserRole;
  isActive?: boolean;
  password?: string; // optional new password
}
