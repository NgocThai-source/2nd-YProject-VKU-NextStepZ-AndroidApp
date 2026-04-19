'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './auth-context';
import { API_URL } from './api';

export interface SavedPortfolio {
  id: string;
  name: string;
  title: string;
  headline: string;
  summary: string;
  photoUrl?: string;
  contactJson?: {
    email?: string;
    phone?: string;
    city?: string;
    district?: string;
    facebook?: string;
    github?: string;
  };
  skills?: {
    selected: Array<{
      id: string;
      name: string;
      level: string;
    }>;
  };
  experience?: {
    items: Array<{
      id: string;
      title: string;
      company: string;
      startDate: string;
      endDate?: string;
      description: string;
      isCurrent: boolean;
    }>;
  };
  education?: {
    items: Array<{
      id: string;
      school: string;
      degree: string;
      field: string;
      graduationYear: string;
    }>;
  };
  projects?: {
    items: Array<{
      id: string;
      title: string;
      description: string;
      url?: string;
      imageUrl?: string;
    }>;
  };
  selectedTemplate: number;
  savedAt: string;
  updatedAt: string;
}

export interface SavedPortfolioContextType {
  savedPortfolios: SavedPortfolio[];
  isLoading: boolean;
  error: string | null;
  canSave: boolean; // Only true for 'user' (Student) role
  savePortfolio: (portfolio: Omit<SavedPortfolio, 'id' | 'savedAt' | 'updatedAt'> & { id?: string }) => Promise<SavedPortfolio | null>;
  getSavedPortfolios: () => SavedPortfolio[];
  getSavedPortfolioById: (id: string) => SavedPortfolio | null;
  deletePortfolio: (id: string) => Promise<boolean>;
  updatePortfolio: (id: string, portfolio: Partial<SavedPortfolio>) => Promise<boolean>;
  refreshPortfolios: () => Promise<void>;
}

const SavedPortfolioContext = createContext<SavedPortfolioContextType | undefined>(undefined);

// Demo portfolio for preview (employers and non-logged-in users)
const DEMO_PORTFOLIO: SavedPortfolio = {
  id: 'demo-portfolio',
  name: 'Demo Portfolio',
  title: 'Senior Frontend Developer',
  headline: 'Chuyên gia React & Next.js với 5+ năm kinh nghiệm xây dựng ứng dụng web hiệu suất cao.',
  summary: 'Đây là hồ sơ mẫu để xem trước. Đăng nhập với tài khoản Sinh viên để lưu hồ sơ của riêng bạn.',
  photoUrl: '',
  contactJson: {
    email: 'demo@example.com',
    phone: '+84 912 345 678',
    city: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
  },
  skills: {
    selected: [
      { id: 'skill-1', name: 'React', level: 'advanced' },
      { id: 'skill-2', name: 'TypeScript', level: 'advanced' },
      { id: 'skill-3', name: 'Next.js', level: 'advanced' },
    ],
  },
  experience: { items: [] },
  education: { items: [] },
  projects: { items: [] },
  selectedTemplate: 1,
  savedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function SavedPortfolioProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, getToken } = useAuth();
  const [savedPortfolios, setSavedPortfolios] = useState<SavedPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only students (role: 'user') can save
  const canSave = isLoggedIn && user?.role === 'user';

  // Helper to make authenticated API calls
  const fetchWithAuth = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken?.();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  }, [getToken]);

  // Load portfolios from API or show demo for non-students
  const loadPortfolios = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (canSave) {
        // Fetch from API for students
        const result = await fetchWithAuth('/saved-portfolios');
        if (result.success && result.data) {
          setSavedPortfolios(result.data);
        } else {
          setSavedPortfolios([]);
        }
      } else {
        // For employers or non-logged-in: show demo data (read-only)
        setSavedPortfolios([DEMO_PORTFOLIO]);
      }
    } catch (err) {
      console.error('Failed to load portfolios:', err);
      setError(err instanceof Error ? err.message : 'Failed to load portfolios');
      // Fallback to demo for any error
      setSavedPortfolios([DEMO_PORTFOLIO]);
    } finally {
      setIsLoading(false);
    }
  }, [canSave, fetchWithAuth]);

  // Load on mount and when auth changes
  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  // Save portfolio (only for students)
  const savePortfolio = useCallback(
    async (
      portfolio: Omit<SavedPortfolio, 'id' | 'savedAt' | 'updatedAt'> & { id?: string }
    ): Promise<SavedPortfolio | null> => {
      if (!canSave) {
        setError('Chỉ tài khoản Sinh viên mới có thể lưu hồ sơ');
        return null;
      }

      try {
        setError(null);

        if (portfolio.id) {
          // Update existing
          const result = await fetchWithAuth(`/saved-portfolios/${portfolio.id}`, {
            method: 'PUT',
            body: JSON.stringify(portfolio),
          });

          if (result.success && result.data) {
            setSavedPortfolios(prev =>
              prev.map(p => p.id === portfolio.id ? result.data : p)
            );
            return result.data;
          }
        } else {
          // Create new
          const result = await fetchWithAuth('/saved-portfolios', {
            method: 'POST',
            body: JSON.stringify(portfolio),
          });

          if (result.success && result.data) {
            setSavedPortfolios(prev => [...prev, result.data]);
            return result.data;
          }
        }

        return null;
      } catch (err) {
        console.error('Failed to save portfolio:', err);
        setError(err instanceof Error ? err.message : 'Failed to save portfolio');
        return null;
      }
    },
    [canSave, fetchWithAuth]
  );

  // Get all portfolios
  const getSavedPortfolios = useCallback(() => {
    return savedPortfolios;
  }, [savedPortfolios]);

  // Get portfolio by ID
  const getSavedPortfolioById = useCallback(
    (id: string) => {
      return savedPortfolios.find(p => p.id === id) || null;
    },
    [savedPortfolios]
  );

  // Delete portfolio (only for students)
  const deletePortfolio = useCallback(async (id: string): Promise<boolean> => {
    if (!canSave) {
      setError('Chỉ tài khoản Sinh viên mới có thể xóa hồ sơ');
      return false;
    }

    try {
      setError(null);
      await fetchWithAuth(`/saved-portfolios/${id}`, {
        method: 'DELETE',
      });

      setSavedPortfolios(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      console.error('Failed to delete portfolio:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete portfolio');
      return false;
    }
  }, [canSave, fetchWithAuth]);

  // Update portfolio (only for students)
  const updatePortfolio = useCallback(
    async (id: string, portfolio: Partial<SavedPortfolio>): Promise<boolean> => {
      if (!canSave) {
        setError('Chỉ tài khoản Sinh viên mới có thể cập nhật hồ sơ');
        return false;
      }

      try {
        setError(null);
        const result = await fetchWithAuth(`/saved-portfolios/${id}`, {
          method: 'PUT',
          body: JSON.stringify(portfolio),
        });

        if (result.success && result.data) {
          setSavedPortfolios(prev =>
            prev.map(p => p.id === id ? result.data : p)
          );
          return true;
        }

        return false;
      } catch (err) {
        console.error('Failed to update portfolio:', err);
        setError(err instanceof Error ? err.message : 'Failed to update portfolio');
        return false;
      }
    },
    [canSave, fetchWithAuth]
  );

  // Refresh portfolios
  const refreshPortfolios = useCallback(async () => {
    await loadPortfolios();
  }, [loadPortfolios]);

  return (
    <SavedPortfolioContext.Provider
      value={{
        savedPortfolios,
        isLoading,
        error,
        canSave,
        savePortfolio,
        getSavedPortfolios,
        getSavedPortfolioById,
        deletePortfolio,
        updatePortfolio,
        refreshPortfolios,
      }}
    >
      {children}
    </SavedPortfolioContext.Provider>
  );
}

export function useSavedPortfolio() {
  const context = useContext(SavedPortfolioContext);
  if (context === undefined) {
    throw new Error('useSavedPortfolio must be used within SavedPortfolioProvider');
  }
  return context;
}
