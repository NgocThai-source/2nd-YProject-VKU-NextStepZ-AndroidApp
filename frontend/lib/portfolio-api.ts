/**
 * Portfolio API Client
 * Type-safe API calls for portfolio management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Contact Information Type
export interface ContactInfo {
  email?: string;
  phone?: string;
  city?: string;
  district?: string;
  facebook?: string;
  github?: string;
}

// Types
export interface Portfolio {
  id: number;
  userId: number;
  title: string;
  headline: string;
  summary: string;
  photoUrl?: string;
  contactJson?: ContactInfo;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioSection {
  id: number;
  portfolioId: number;
  type: string;
  contentJson?: unknown;
  position: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// Portfolio CRUD Operations
export const portfolioApi = {
  /**
   * Create a new portfolio
   */
  create: async (data: Partial<Portfolio>): Promise<Portfolio> => {
    const response = await apiCall<PortfolioResponse<Portfolio>>('/portfolio', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  /**
   * Get portfolio by ID
   */
  getById: async (id: number): Promise<Portfolio> => {
    const response = await apiCall<PortfolioResponse<Portfolio>>(`/portfolio/${id}`, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * Get all portfolios for current user
   */
  getAll: async (): Promise<Portfolio[]> => {
    const response = await apiCall<PortfolioResponse<Portfolio[]>>('/portfolio', {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * Update portfolio
   */
  update: async (id: number, data: Partial<Portfolio>): Promise<Portfolio> => {
    const response = await apiCall<PortfolioResponse<Portfolio>>(`/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  /**
   * Delete portfolio
   */
  delete: async (id: number): Promise<void> => {
    await apiCall<PortfolioResponse<void>>(`/portfolio/${id}`, {
      method: 'DELETE',
    });
  },
};

// Portfolio Sections
export const portfolioSectionApi = {
  /**
   * Add section to portfolio
   */
  create: async (portfolioId: number, data: Partial<PortfolioSection>): Promise<PortfolioSection> => {
    const response = await apiCall<PortfolioResponse<PortfolioSection>>(
      `/portfolio/${portfolioId}/sections`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },

  /**
   * Get all sections for portfolio
   */
  getAll: async (portfolioId: number): Promise<PortfolioSection[]> => {
    const response = await apiCall<PortfolioResponse<PortfolioSection[]>>(
      `/portfolio/${portfolioId}/sections`,
      { method: 'GET' }
    );
    return response.data;
  },

  /**
   * Update section
   */
  update: async (
    portfolioId: number,
    sectionId: number,
    data: Partial<PortfolioSection>
  ): Promise<PortfolioSection> => {
    const response = await apiCall<PortfolioResponse<PortfolioSection>>(
      `/portfolio/${portfolioId}/sections/${sectionId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },

  /**
   * Delete section
   */
  delete: async (portfolioId: number, sectionId: number): Promise<void> => {
    await apiCall<PortfolioResponse<void>>(
      `/portfolio/${portfolioId}/sections/${sectionId}`,
      { method: 'DELETE' }
    );
  },
};

// AI Scoring
export interface PortfolioScore {
  id: number;
  portfolioId: number;
  scoreOverall: number;
  breakdownJson: unknown;
  reportJson: unknown;
  suggestionsJson: unknown;
  computedAt: string;
}

export const portfolioAiApi = {
  /**
   * Score portfolio
   */
  score: async (portfolioId: number): Promise<PortfolioScore> => {
    const response = await apiCall<PortfolioResponse<PortfolioScore>>(
      `/portfolio/${portfolioId}/score`,
      { method: 'POST' }
    );
    return response.data;
  },

  /**
   * Get suggestions for section
   */
  getSuggestions: async (
    portfolioId: number,
    sectionType: string
  ): Promise<unknown[]> => {
    const response = await apiCall<PortfolioResponse<unknown[]>>(
      `/portfolio/${portfolioId}/suggestions/${sectionType}`,
      { method: 'GET' }
    );
    return response.data;
  },
};

// Portfolio Sharing
export interface ShareLink {
  id: number;
  portfolioId: number;
  token: string;
  expiresAt?: string;
  isRevoked: boolean;
  permissions: string;
  viewCount: number;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const portfolioShareApi = {
  /**
   * Create share link
   */
  create: async (
    portfolioId: number,
    data: { expiresInDays?: number; permissions?: string }
  ): Promise<ShareLink> => {
    const response = await apiCall<PortfolioResponse<ShareLink>>(
      `/portfolio/${portfolioId}/share`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },

  /**
   * Get all share links for portfolio
   */
  getAll: async (portfolioId: number): Promise<ShareLink[]> => {
    const response = await apiCall<PortfolioResponse<ShareLink[]>>(
      `/portfolio/${portfolioId}/share`,
      { method: 'GET' }
    );
    return response.data;
  },

  /**
   * Revoke share link
   */
  revoke: async (portfolioId: number, linkId: number): Promise<void> => {
    await apiCall<PortfolioResponse<void>>(
      `/portfolio/${portfolioId}/share/${linkId}`,
      { method: 'DELETE' }
    );
  },

  /**
   * Get public portfolio by share token
   */
  getPublic: async (token: string): Promise<Portfolio> => {
    const response = await apiCall<PortfolioResponse<Portfolio>>(`/share/${token}`, {
      method: 'GET',
    });
    return response.data;
  },
};

// Portfolio Versions
export interface PortfolioVersion {
  id: number;
  portfolioId: number;
  dataJson: unknown;
  versionNumber: number;
  changeDescription?: string;
  createdAt: string;
}

export const portfolioVersionApi = {
  /**
   * Create version snapshot
   */
  create: async (
    portfolioId: number,
    description?: string
  ): Promise<PortfolioVersion> => {
    const response = await apiCall<PortfolioResponse<PortfolioVersion>>(
      `/portfolio/${portfolioId}/versions`,
      {
        method: 'POST',
        body: JSON.stringify({ changeDescription: description }),
      }
    );
    return response.data;
  },

  /**
   * Get all versions
   */
  getAll: async (portfolioId: number): Promise<PortfolioVersion[]> => {
    const response = await apiCall<PortfolioResponse<PortfolioVersion[]>>(
      `/portfolio/${portfolioId}/versions`,
      { method: 'GET' }
    );
    return response.data;
  },

  /**
   * Restore version
   */
  restore: async (portfolioId: number, versionId: number): Promise<Portfolio> => {
    const response = await apiCall<PortfolioResponse<Portfolio>>(
      `/portfolio/${portfolioId}/versions/${versionId}/restore`,
      { method: 'POST' }
    );
    return response.data;
  },
};

// Templates
export interface Template {
  id: number;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  metadataJson?: unknown;
  htmlTemplate?: string;
  cssTemplate?: string;
  isActive: boolean;
  version: number;
}

export const portfolioTemplateApi = {
  /**
   * Get all templates
   */
  getAll: async (): Promise<Template[]> => {
    const response = await apiCall<PortfolioResponse<Template[]>>('/templates', {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * Get template by ID
   */
  getById: async (id: number): Promise<Template> => {
    const response = await apiCall<PortfolioResponse<Template>>(`/templates/${id}`, {
      method: 'GET',
    });
    return response.data;
  },
};

// Export all APIs
const portfolioApis = {
  portfolio: portfolioApi,
  sections: portfolioSectionApi,
  ai: portfolioAiApi,
  share: portfolioShareApi,
  versions: portfolioVersionApi,
  templates: portfolioTemplateApi,
};

export default portfolioApis;
