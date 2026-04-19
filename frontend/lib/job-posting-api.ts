const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Types matching the backend response
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
    companyLogo: string | null;
    tags: string[];
    description: string | null;
    mission: string | null;
    vision: string | null;
    companyHistory: CompanyHistory[] | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    jobPositions: JobPosition[] | null;
    workingHours: string | null;
    offDays: number;
    vacationDays: number;
    insurances: string[];
    salaryBenefits: string[];
    allowances: string[];
    benefits: string[];
    galleryImages: string[];
    isActive: boolean;
    viewCount: number;
    createdAt: string;
    postedBy: string;
    user: JobPostingUser;
}

export interface JobPostingsResponse {
    data: JobPosting[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CreateJobPostingData {
    companyName: string;
    companyLogo?: string;
    tags?: string[];
    description?: string;
    mission?: string;
    vision?: string;
    companyHistory?: CompanyHistory[];
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    jobPositions?: JobPosition[];
    workingHours?: string;
    offDays?: number;
    vacationDays?: number;
    insurances?: string[];
    salaryBenefits?: string[];
    allowances?: string[];
    benefits?: string[];
    galleryImages?: string[];
}

export interface UpdateJobPostingData extends Partial<CreateJobPostingData> {
    isActive?: boolean;
}

/**
 * Get all job postings with optional filters
 */
export async function getJobPostings(options?: {
    page?: number;
    limit?: number;
    tags?: string[];
    address?: string;
}): Promise<JobPostingsResponse> {
    const params = new URLSearchParams();

    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.tags && options.tags.length > 0) {
        params.append('tags', options.tags.join(','));
    }
    if (options?.address) params.append('address', options.address);

    const url = `${API_BASE_URL}/job-postings${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch job postings' }));
        throw new Error(error.message || 'Failed to fetch job postings');
    }

    return response.json();
}

/**
 * Get a single job posting by ID
 */
export async function getJobPosting(id: string): Promise<JobPosting> {
    const response = await fetch(`${API_BASE_URL}/job-postings/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Job posting not found' }));
        throw new Error(error.message || 'Job posting not found');
    }

    return response.json();
}

/**
 * Create a new job posting (requires employer role)
 */
export async function createJobPosting(data: CreateJobPostingData): Promise<JobPosting> {
    const response = await fetch(`${API_BASE_URL}/job-postings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to create job posting' }));
        throw new Error(error.message || 'Failed to create job posting');
    }

    return response.json();
}

/**
 * Update a job posting (requires owner)
 */
export async function updateJobPosting(id: string, data: UpdateJobPostingData): Promise<JobPosting> {
    const response = await fetch(`${API_BASE_URL}/job-postings/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to update job posting' }));
        throw new Error(error.message || 'Failed to update job posting');
    }

    return response.json();
}

/**
 * Delete a job posting (requires owner)
 */
export async function deleteJobPosting(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/job-postings/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to delete job posting' }));
        throw new Error(error.message || 'Failed to delete job posting');
    }

    return response.json();
}

/**
 * Get current user's job postings
 */
export async function getMyJobPostings(): Promise<JobPosting[]> {
    const response = await fetch(`${API_BASE_URL}/job-postings/my-postings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch job postings' }));
        throw new Error(error.message || 'Failed to fetch job postings');
    }

    return response.json();
}

/**
 * Increment view count for a job posting (with anti-view-boosting protection)
 */
export async function incrementJobPostingViewCount(id: string): Promise<{ viewCount: number; isNewView?: boolean }> {
    const response = await fetch(`${API_BASE_URL}/job-postings/${id}/view`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(), // Include auth token if available for user tracking
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to record view' }));
        throw new Error(error.message || 'Failed to record view');
    }

    return response.json();
}

/**
 * Upload images and get URLs (helper for the create form)
 */
export async function uploadImages(base64Files: string[], folder: string = 'job-postings'): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/upload/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ base64Files, folder }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to upload images' }));
        throw new Error(error.message || 'Failed to upload images');
    }

    const result = await response.json();
    return result.urls;
}
