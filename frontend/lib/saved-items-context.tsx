'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { getSocket } from './services/socket-manager';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Types for saved items (matching backend response)
export interface SavedPostAuthor {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface SavedPostData {
  id: string;
  content: string;
  category: string;
  images: string[];
  hashtags: string[];
  title?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  author: SavedPostAuthor;
}

export interface SavedPost {
  id: string;
  savedAt: string;
  post: SavedPostData;
}

export interface SavedCompanyOwner {
  id: string;
  username: string;
  companyName?: string;
  avatar?: string;
}

export interface SavedCompanyData {
  id: string;
  name: string;
  logo: string;
  location: string;
  description: string;
  tags: string[];
  jobPositions: any[];
  workingHours?: string;
  benefits: string[];
  insurances: string[];
  vacationDays: number;
  website?: string;
  email?: string;
  phone?: string;
  mission?: string;
  vision?: string;
  galleryImages: string[];
  createdAt: string;
  owner: SavedCompanyOwner;
}

export interface SavedCompany {
  id: string;
  savedAt: string;
  company: SavedCompanyData;
}

interface SavedItemsContextType {
  // State
  savedCompanies: SavedCompany[];
  savedPosts: SavedPost[];
  isLoading: boolean;

  // Company/Job Posting functions
  addSavedCompany: (companyId: string) => Promise<void>;
  removeSavedCompany: (companyId: string) => Promise<void>;
  isSavedCompany: (companyId: string) => boolean;
  removeAllCompanies: () => Promise<void>;

  // Post functions
  addSavedPost: (postId: string) => Promise<void>;
  removeSavedPost: (postId: string) => Promise<void>;
  isSavedPost: (postId: string) => boolean;
  removeAllPosts: () => Promise<void>;

  // Refresh data
  refreshSavedItems: () => Promise<void>;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

export function SavedItemsProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const isLoggedIn = auth.isLoggedIn;
  const isAuthLoading = auth.isLoading;
  const getToken = auth.getToken || (() => null);
  const [savedCompanies, setSavedCompanies] = useState<SavedCompany[]>([]);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetch all saved items from the backend
   */
  const fetchSavedItems = useCallback(async () => {
    console.log('[SavedItems] fetchSavedItems called, isLoggedIn:', isLoggedIn, 'isAuthLoading:', isAuthLoading);

    // Wait for auth to finish loading
    if (isAuthLoading) {
      console.log('[SavedItems] Auth still loading, skipping fetch');
      return;
    }

    if (!isLoggedIn) {
      console.log('[SavedItems] User not logged in, clearing saved items');
      setSavedCompanies([]);
      setSavedPosts([]);
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/saved-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSavedCompanies(data.jobPostings || []);
        setSavedPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching saved items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, isAuthLoading, getToken]);

  // Fetch saved items on login (wait for auth to finish loading)
  useEffect(() => {
    console.log('[SavedItems] useEffect triggered - isLoggedIn:', isLoggedIn, 'isAuthLoading:', isAuthLoading);

    // Wait for auth to finish loading
    if (isAuthLoading) {
      console.log('[SavedItems] Still loading auth, waiting...');
      return;
    }

    if (isLoggedIn) {
      console.log('[SavedItems] User is logged in, fetching saved items...');
      fetchSavedItems();
    } else {
      console.log('[SavedItems] User not logged in, clearing saved items');
      setSavedCompanies([]);
      setSavedPosts([]);
    }
  }, [isLoggedIn, isAuthLoading, fetchSavedItems]);

  // Listen for real-time saved item updates
  useEffect(() => {
    if (!isLoggedIn) return;

    const socket = getSocket();
    if (!socket) return;

    const handleSavedItemUpdate = (data: any) => {
      if (data.type === 'saved') {
        if (data.itemType === 'post') {
          setSavedPosts((prev) => {
            const exists = prev.some((p) => p.post.id === data.item.post.id);
            if (exists) return prev;
            return [data.item, ...prev];
          });
        } else if (data.itemType === 'jobPosting') {
          setSavedCompanies((prev) => {
            const exists = prev.some((c) => c.company.id === data.item.company.id);
            if (exists) return prev;
            return [data.item, ...prev];
          });
        }
      } else if (data.type === 'unsaved') {
        if (data.itemType === 'post') {
          setSavedPosts((prev) => prev.filter((p) => p.post.id !== data.itemId));
        } else if (data.itemType === 'jobPosting') {
          setSavedCompanies((prev) => prev.filter((c) => c.company.id !== data.itemId));
        }
      } else if (data.type === 'cleared') {
        if (data.itemType === 'post') {
          setSavedPosts([]);
        } else if (data.itemType === 'jobPosting') {
          setSavedCompanies([]);
        }
      }
    };

    socket.on('savedItemUpdate', handleSavedItemUpdate);

    return () => {
      socket.off('savedItemUpdate', handleSavedItemUpdate);
    };
  }, [isLoggedIn]);

  /**
   * Save a job posting (company)
   */
  const addSavedCompany = useCallback(async (companyId: string) => {
    if (!isLoggedIn) return;

    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/saved-items/job-postings/${companyId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSavedCompanies((prev) => {
            const exists = prev.some((c) => c.company.id === companyId);
            if (exists) return prev;
            return [result.data, ...prev];
          });
        }
      }
    } catch (error) {
      console.error('Error saving company:', error);
    }
  }, [isLoggedIn, getToken]);

  /**
   * Remove a saved job posting (company)
   */
  const removeSavedCompany = useCallback(async (companyId: string) => {
    if (!isLoggedIn) return;

    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/saved-items/job-postings/${companyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSavedCompanies((prev) => prev.filter((c) => c.company.id !== companyId));
      }
    } catch (error) {
      console.error('Error removing company:', error);
    }
  }, [isLoggedIn, getToken]);

  /**
   * Check if a company is saved
   */
  const isSavedCompany = useCallback((companyId: string) => {
    return savedCompanies.some((c) => c.company.id === companyId);
  }, [savedCompanies]);

  /**
   * Remove all saved companies
   */
  const removeAllCompanies = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/saved-items/job-postings`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSavedCompanies([]);
      }
    } catch (error) {
      console.error('Error removing all companies:', error);
    }
  }, [isLoggedIn, getToken]);

  /**
   * Save a post
   */
  const addSavedPost = useCallback(async (postId: string) => {
    console.log('[SavedItems] addSavedPost called, postId:', postId, 'isLoggedIn:', isLoggedIn);

    if (!isLoggedIn) {
      console.log('[SavedItems] User not logged in, cannot save post');
      return;
    }

    try {
      const token = getToken();
      console.log('[SavedItems] Got token:', token ? 'exists' : 'null');
      if (!token) return;

      const response = await fetch(`${API_URL}/saved-items/posts/${postId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSavedPosts((prev) => {
            const exists = prev.some((p) => p.post.id === postId);
            if (exists) return prev;
            return [result.data, ...prev];
          });
        }
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  }, [isLoggedIn, getToken]);

  /**
   * Remove a saved post
   */
  const removeSavedPost = useCallback(async (postId: string) => {
    if (!isLoggedIn) return;

    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/saved-items/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSavedPosts((prev) => prev.filter((p) => p.post.id !== postId));
      }
    } catch (error) {
      console.error('Error removing post:', error);
    }
  }, [isLoggedIn, getToken]);

  /**
   * Check if a post is saved
   */
  const isSavedPost = useCallback((postId: string) => {
    return savedPosts.some((p) => p.post.id === postId);
  }, [savedPosts]);

  /**
   * Remove all saved posts
   */
  const removeAllPosts = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/saved-items/posts`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSavedPosts([]);
      }
    } catch (error) {
      console.error('Error removing all posts:', error);
    }
  }, [isLoggedIn, getToken]);

  const value: SavedItemsContextType = {
    savedCompanies,
    savedPosts,
    isLoading,
    addSavedCompany,
    removeSavedCompany,
    isSavedCompany,
    removeAllCompanies,
    addSavedPost,
    removeSavedPost,
    isSavedPost,
    removeAllPosts,
    refreshSavedItems: fetchSavedItems,
  };

  return (
    <SavedItemsContext.Provider value={value}>
      {children}
    </SavedItemsContext.Provider>
  );
}

export function useSavedItems() {
  const context = useContext(SavedItemsContext);
  if (context === undefined) {
    throw new Error('useSavedItems must be used within SavedItemsProvider');
  }
  return context;
}
