export interface JobPostingUser {
  id: string;
  username: string;
  avatar: string | null;
  companyName: string | null;
}

export interface JobPosition {
  title: string;
  minSalary: number;
  maxSalary: number;
}

export interface CompanyHistory {
  year: string;
  milestone: string;
}

export interface JobPosting {
  id: string;
  companyName: string;
  companyLogo?: string | null;
  tags: string[];
  description?: string | null;
  mission?: string | null;
  vision?: string | null;
  companyHistory?: CompanyHistory[] | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  jobPositions?: JobPosition[] | null;
  workingHours?: string | null;
  offDays: number;
  vacationDays: number;
  insurances: string[];
  salaryBenefits: string[];
  allowances: string[];
  benefits: string[];
  galleryImages: string[];
  isActive?: boolean;
  viewCount?: number;
  createdAt: string;
  postedBy: string;
  user?: JobPostingUser;
}
