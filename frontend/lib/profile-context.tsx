'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { API_URL } from './api';
import { useAuth } from './auth-context';

// Helper function to safely convert birthDate
const formatBirthDate = (birthDate: string | Date | null | undefined): string => {
  if (!birthDate) return '';
  try {
    // If already in YYYY-MM-DD format, return as-is
    if (typeof birthDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return birthDate;
    }

    let date: Date;
    if (typeof birthDate === 'string') {
      date = new Date(birthDate);
    } else {
      date = birthDate;
    }
    // Format as YYYY-MM-DD to avoid timezone issues
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.warn('Failed to format birthDate:', birthDate, error);
    return '';
  }
};

export interface WorkExperience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCurrent: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Education {
  id: string;
  school: string;
  degree?: string;
  field?: string;
  graduationYear?: string;
}

export interface CareerProfile {
  id?: string;
  objective?: string;
  experiences: WorkExperience[];
  education: Education[];
  skills: Skill[];
}

export interface UserProfile {
  id?: string;
  userId?: string;
  avatar: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  bio: string;
  phone: string;
  birthDate: string;
  city: string;
  district: string;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
  careerProfile?: CareerProfile;
  fullName?: string;
  address?: string;
  phoneNumber?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  location: string;
  level: string;
  postedAt: string;
  applications: number;
}

export interface EmployerProfileData {
  id?: string;
  userId?: string;
  companyName: string;
  industry: string;
  companySize: string;
  address: string;
  website: string;
  foundingYear: string;
  about: string;
  jobPostings: JobPosting[];
}

export interface PublicProfile {
  id: string;
  userId: string;
  shareToken: string;
  isActive: boolean;
  viewCount: number;
  profile: {
    id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    title?: string;
    skills?: string[];
    objective?: string;
    socialLinks?: Array<{
      id: string;
      platform: string;
      url: string;
    }>;
    user?: {
      id: string;
      username: string;
      role: string;
    };
  };
}

export interface ProfileContextType {
  userProfile: UserProfile | null;
  employerProfile: EmployerProfileData | null;
  publicProfile: PublicProfile | null;
  isLoading: boolean;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateEmployerProfile: (profile: Partial<EmployerProfileData>) => Promise<void>;
  loadProfileFromLocalStorage: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const DEFAULT_EMPLOYER_PROFILE: EmployerProfileData = {
  companyName: 'Tech Company Vietnam',
  industry: 'Công nghệ Thông tin',
  companySize: '50-200',
  address: '123 Đường Nguyễn Huệ, TP. Hồ Chí Minh',
  website: 'https://example.com',
  foundingYear: '2020',
  about: 'Công ty chúng tôi là một nhà cung cấp hàng đầu các giải pháp công nghệ thông tin.',
  jobPostings: [],
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, getToken } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [employerProfile, setEmployerProfile] = useState<EmployerProfileData | null>(null);
  const [publicProfile, setPublicProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to fetch and update profile from backend
  const fetchAndUpdateProfile = useCallback(async () => {
    if (!user) return;

    try {
      const token = getToken?.();
      if (!token) return;

      const userRes = await fetch(`${API_URL}/profiles/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userRes.ok) {
        const data = await userRes.json();
        console.log('Fetched profile data:', data);
        const formattedBirthDate = formatBirthDate(data.birthDate);
        setUserProfile({
          id: data.id,
          userId: data.userId,
          avatar: data.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
          name: data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : data.username || user.username,
          email: data.email,
          bio: data.bio || '',
          phone: data.phone || '',
          birthDate: formattedBirthDate || formatBirthDate(user.birthDate),
          city: data.province || '',
          district: data.district || '',
          phoneNumber: data.phone || '',
          socialLinks: data.socialLinks || [],
          careerProfile: data.careerProfile ? {
            id: data.careerProfile.id,
            objective: data.careerProfile.objective || '',
            experiences: data.careerProfile.experiences || [],
            education: data.careerProfile.education || [],
            skills: data.careerProfile.skills || [],
          } : undefined,
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }, [user, getToken]);

  // Fetch profiles from backend when user is logged in
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      setUserProfile(null);
      setEmployerProfile(null);
      setPublicProfile(null);
      return;
    }

    const loadProfiles = async () => {
      try {
        setIsLoading(true);
        const token = getToken?.();

        // Initialize user profile immediately from auth context data
        const initialUserProfile: UserProfile = {
          avatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
          name: user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.username,
          email: user.email,
          bio: '',
          phone: user.phone || '',
          birthDate: formatBirthDate(user.birthDate),
          city: user.province || '',
          district: user.district || '',
          phoneNumber: user.phone || '',
          socialLinks: [],
        };
        setUserProfile(initialUserProfile);

        // Initialize employer profile only if user role is 'employer'
        if (user.role === 'employer') {
          setEmployerProfile({
            companyName: user.companyName || user.firstName || user.name || '',
            industry: '',
            companySize: '',
            address: user.address || user.province || '',
            website: user.website || '',
            foundingYear: '',
            about: '',
            jobPostings: [],
          });
        }

        // Fetch detailed profiles from backend if token exists
        if (!token) {
          console.warn('No auth token, using local user data');
          setIsLoading(false);
          return;
        }

        // Fetch user profile from backend
        try {
          const userRes = await fetch(`${API_URL}/profiles/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (userRes.ok) {
            const data = await userRes.json();
            const formattedBirthDate = formatBirthDate(data.birthDate);
            setUserProfile({
              id: data.id,
              userId: data.userId,
              avatar: data.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
              name: data.firstName && data.lastName
                ? `${data.firstName} ${data.lastName}`
                : data.username || user.username,
              email: data.email,
              bio: data.bio || '',
              phone: data.phone || '',
              birthDate: formattedBirthDate || formatBirthDate(user.birthDate),
              city: data.province || '',
              district: data.district || '',
              phoneNumber: data.phone || '',
              socialLinks: data.socialLinks || [],
              careerProfile: data.careerProfile ? {
                id: data.careerProfile.id,
                objective: data.careerProfile.objective || '',
                experiences: data.careerProfile.experiences || [],
                education: data.careerProfile.education || [],
                skills: data.careerProfile.skills || [],
              } : undefined,
            });
          }
        } catch (err) {
          console.error('Failed to fetch user profile from backend:', err);
          // Keep the initial profile already set
        }

        // Fetch employer profile if user role is 'employer'
        if (user.role === 'employer') {
          try {
            // First ensure employer profile exists
            await fetch(`${API_URL}/employers/profile`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            // Then fetch the full employer profile
            const employerRes = await fetch(`${API_URL}/employers/profile`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (employerRes.ok) {
              const employerData = await employerRes.json();
              console.log('Fetched employer profile data:', employerData);

              // Map backend response to EmployerProfileData interface
              setEmployerProfile({
                id: employerData.id,
                userId: employerData.profileId,
                companyName: employerData.companyName || user.companyName || user.firstName || '',
                industry: employerData.industry || '',
                companySize: employerData.companySize || '',
                address: employerData.address || '',
                website: employerData.website || '',
                foundingYear: employerData.foundingYear?.toString() || '',
                about: employerData.about || '',
                jobPostings: (employerData.jobPostings || []).map((job: any) => ({
                  id: job.id,
                  title: job.title,
                  location: job.location || '',
                  level: job.salary || '',
                  postedAt: new Date(job.createdAt).toLocaleDateString('vi-VN'),
                  applications: 0,
                })),
              });
            } else {
              // Fallback to defaults if backend fetch fails
              setEmployerProfile({
                companyName: user.companyName || user.firstName || user.name || '',
                industry: '',
                companySize: '',
                address: user.address || user.province || '',
                website: user.website || '',
                foundingYear: '',
                about: '',
                jobPostings: [],
              });
            }
          } catch (err) {
            console.error('Failed to fetch employer profile from backend:', err);
            // Fallback to defaults
            setEmployerProfile({
              companyName: user.companyName || user.firstName || user.name || '',
              industry: '',
              companySize: '',
              address: user.address || user.province || '',
              website: user.website || '',
              foundingYear: '',
              about: '',
              jobPostings: [],
            });
          }
        }

        // Fetch public profile
        try {
          const publicRes = await fetch(`${API_URL}/profiles/public`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (publicRes.ok) {
            const publicData = await publicRes.json();
            setPublicProfile(publicData);
          }
        } catch (err) {
          console.error('Failed to fetch public profile from backend:', err);
          // Continue without public profile data
        }
      } catch (error) {
        console.error('Failed to load profiles:', error);
        setUserProfile({
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
          name: user.name || user.username,
          email: user.email,
          bio: '',
          phone: user.phone || '',
          birthDate: formatBirthDate(user.birthDate),
          city: user.province || '',
          district: user.district || '',
          socialLinks: [],
        });
        setEmployerProfile(DEFAULT_EMPLOYER_PROFILE);
        setPublicProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, [user, user?.id, getToken, fetchAndUpdateProfile]);

  // Listen for page visibility change and refetch when user returns
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user?.id) {
        console.log('Page became visible, refetching profile...');
        fetchAndUpdateProfile();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id, fetchAndUpdateProfile]);

  // Refetch profile when user ID changes (navigation, login, etc)
  useEffect(() => {
    if (!user?.id) return;

    console.log('User ID changed, refetching profile for user:', user.id);
    const timer = setTimeout(() => {
      fetchAndUpdateProfile();
    }, 100);

    return () => clearTimeout(timer);
  }, [user?.id, fetchAndUpdateProfile]);

  const loadProfileFromLocalStorage = useCallback(() => {
    // This function is kept for compatibility but now loads from backend
    if (user) {
      fetchAndUpdateProfile();
    }
  }, [user, fetchAndUpdateProfile]);

  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...profile } as UserProfile;
      return updated;
    });
  }, []);

  const updateEmployerProfile = useCallback(async (profile: Partial<EmployerProfileData>) => {
    // Update local state immediately for UI responsiveness
    setEmployerProfile((prev) => {
      const updated = { ...prev, ...profile } as EmployerProfileData;
      return updated;
    });

    // Persist to backend for real-time sync
    try {
      const token = getToken?.();
      if (!token) return;

      // Prepare backend-compatible data
      const backendData: Record<string, any> = {};
      if (profile.industry !== undefined) backendData.industry = profile.industry;
      if (profile.companySize !== undefined) backendData.companySize = profile.companySize;
      if (profile.address !== undefined) backendData.address = profile.address;
      if (profile.website !== undefined) backendData.website = profile.website;
      if (profile.about !== undefined) backendData.about = profile.about;
      if (profile.foundingYear !== undefined) {
        backendData.foundingYear = profile.foundingYear ? parseInt(profile.foundingYear) : null;
      }

      // Only call API if there's data to update
      if (Object.keys(backendData).length > 0) {
        const res = await fetch(`${API_URL}/employers/profile`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendData),
        });

        if (res.ok) {
          console.log('Employer profile updated successfully');

          // Refetch public profile to ensure real-time sync
          try {
            const publicRes = await fetch(`${API_URL}/profiles/public`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (publicRes.ok) {
              const publicData = await publicRes.json();
              setPublicProfile(publicData);
            }
          } catch (err) {
            console.error('Failed to refetch public profile:', err);
          }
        } else {
          console.error('Failed to update employer profile:', await res.text());
        }
      }
    } catch (err) {
      console.error('Error updating employer profile:', err);
    }
  }, [getToken]);

  return (
    <ProfileContext.Provider
      value={{
        userProfile,
        employerProfile,
        publicProfile,
        isLoading,
        updateUserProfile,
        updateEmployerProfile,
        loadProfileFromLocalStorage,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}
