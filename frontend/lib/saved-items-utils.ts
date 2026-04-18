// Utility for saving jobs easily from anywhere in the app
import { SavedJob } from './saved-items-context';

export function createSavedJob(
  jobId: string,
  jobTitle: string,
  companyName: string,
  companyLogo: string,
  location: string,
  description: string,
  salary?: [number, number],
  category?: string
): SavedJob {
  return {
    id: `saved-job-${jobId}`,
    jobId,
    jobTitle,
    companyName,
    companyLogo,
    location,
    salary,
    description,
    category,
    savedAt: new Date().toISOString(),
  };
}
