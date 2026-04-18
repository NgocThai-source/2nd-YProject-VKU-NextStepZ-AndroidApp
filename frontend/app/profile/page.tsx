
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useProfile, type CareerProfile } from '@/lib/profile-context';
import { useToast } from '@/components/ui/toast';
import { useNotifications } from '@/lib/notification-context';
import { API_URL } from '@/lib/api';
import type { Notification } from '@/lib/notifications';

// User Profile Components
import {
  UserInfoCard,
  PersonalInfoCard,
  ProfessionalProfileCard,
  UserActivity,
  type PersonalInfo,
} from '@/components/profile/user';

// Employer Profile Components
import {
  EmployerInfoCard,
  EmployerCompanyInfo,
  EmployerAbout,
  EmployerJobPostings,
  EmployerActivity,
} from '@/components/profile/employer';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, getToken, login } = useAuth();
  const [userInfoEdit, setUserInfoEdit] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const { userProfile, employerProfile, updateUserProfile } = useProfile();
  const { addToast } = useToast();
  const { subscribe } = useNotifications();

  // Fetch latest isVerified status from backend
  const fetchVerificationStatus = useCallback(async () => {
    const token = getToken?.();
    if (!token || user?.role !== 'employer') return;

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setIsVerified(data.isVerified || false);
        // Update the user in localStorage if verification status changed
        if (user && data.isVerified !== user.isVerified) {
          login({ ...user, isVerified: data.isVerified });
        }
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  }, [getToken, user, login]);

  // Initial fetch
  useEffect(() => {
    fetchVerificationStatus();
  }, [fetchVerificationStatus]);

  // Subscribe to real-time verification notifications
  useEffect(() => {
    const unsubscribe = subscribe((notification) => {
      // If it's a verification notification, refetch the status
      if (notification.type === 'employer_verified' || notification.type === 'employer_unverified') {
        // Update immediately based on notification type
        const newVerifiedStatus = notification.type === 'employer_verified';
        setIsVerified(newVerifiedStatus);
        if (user) {
          login({ ...user, isVerified: newVerifiedStatus });
        }
      }
    });

    return () => unsubscribe();
  }, [subscribe, user, login]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const handleUserInfoSave = (data: { avatar: string; name: string; email: string; bio: string }) => {
    updateUserProfile({
      avatar: data.avatar,
      name: data.name,
      email: data.email,
      bio: data.bio,
    });
  };

  const handleProfessionalProfileUpdate = async (data: CareerProfile) => {
    try {
      const token = getToken?.();
      if (!token) {
        addToast('Vui lòng đăng nhập để cập nhật thông tin', 'error');
        return;
      }

      const response = await fetch(`${API_URL}/profiles/me/professional-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          objective: data.objective || '',
          experiences: (data.experiences || []).map(exp => ({
            position: exp.position,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate || null,
            isCurrent: exp.isCurrent || false,
            description: exp.description || null,
          })),
          skills: (data.skills || []).map(skill => ({
            name: skill.name,
            level: skill.level || 'intermediate',
          })),
          education: (data.education || []).map(edu => ({
            school: edu.school,
            degree: edu.degree || null,
            field: edu.field || null,
            graduationYear: edu.graduationYear || null,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update professional profile');
      }

      const result = await response.json();

      // Update local context
      updateUserProfile({
        careerProfile: {
          id: result.careerProfile?.id,
          objective: result.careerProfile?.objective || data.objective,
          experiences: result.careerProfile?.experiences || data.experiences,
          skills: result.careerProfile?.skills || data.skills,
          education: result.careerProfile?.education || data.education,
        },
      });

      addToast('Cập nhật hồ sơ chuyên môn thành công!', 'success');
    } catch (error) {
      console.error('Error updating professional profile:', error);
      addToast('Lỗi khi cập nhật hồ sơ chuyên môn. Vui lòng thử lại.', 'error');
    }
  };

  const userPosts: CommunityPost[] = [];

  interface CommunityPost {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    postDate: string;
    engagement: {
      likes: number;
      comments: number;
      shares: number;
    };
  }

  // Loading state
  if (isAuthLoading || !userProfile) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Đang tải...</div>
      </div>
    );
  }

  // Check if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <p className="text-gray-400">Vui lòng đăng nhập để xem trang cá nhân</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/auth')}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
          >
            Đăng nhập
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const isEmployer = user && user.role === 'employer';

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.div>
            <span className="text-xs sm:text-sm font-medium">Quay lại</span>
          </Link>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent"
            style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}
          >
            {isEmployer ? 'Trang cá nhân' : 'Trang cá nhân'}
          </motion.h1>

          <div className="hidden sm:block w-12" />
        </motion.div>

        {/* Content Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6"
        >
          {/* Employer Profile */}
          {isEmployer ? (
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Employer Info Card */}
              <EmployerInfoCard
                companyLogo={userProfile?.avatar}
                companyName={userProfile?.name}
                email={userProfile?.email}
                phone={userProfile?.phone}
                isVerified={isVerified}
                onEditClick={() => setUserInfoEdit(!userInfoEdit)}
                onAvatarChange={async (file) => {
                  // Upload avatar to backend API
                  try {
                    const token = getToken?.();
                    if (!token) {
                      addToast('Vui lòng đăng nhập để cập nhật ảnh đại diện', 'error');
                      return;
                    }

                    // Upload the file
                    const formData = new FormData();
                    formData.append('file', file);

                    const uploadResponse = await fetch(`${API_URL}/profiles/me/avatar`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                      body: formData,
                    });

                    if (!uploadResponse.ok) {
                      throw new Error('Failed to upload avatar');
                    }

                    // Refetch profile to get the new avatar URL
                    const response = await fetch(`${API_URL}/profiles/me`, {
                      method: 'GET',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                    });

                    if (response.ok) {
                      const updatedProfile = await response.json();
                      updateUserProfile({
                        avatar: updatedProfile.avatar,
                      });
                      addToast('Cập nhật ảnh đại diện thành công!', 'success');
                    }
                  } catch (error) {
                    console.error('Error uploading avatar:', error);
                    addToast('Lỗi khi tải ảnh lên. Vui lòng thử lại.', 'error');
                  }
                }}
              />

              {/* Employer Company Info */}
              <EmployerCompanyInfo
                data={employerProfile ? {
                  companyName: employerProfile.companyName,
                  industry: employerProfile.industry,
                  companySize: employerProfile.companySize as '10-50' | '50-200' | '200-500' | '500+',
                  address: employerProfile.address,
                  website: employerProfile.website,
                  foundingYear: employerProfile.foundingYear,
                } : undefined}
                onEditClick={() => setUserInfoEdit(!userInfoEdit)}
              />

              {/* Employer About */}
              <EmployerAbout
                description={employerProfile?.about}
                onEditClick={() => setUserInfoEdit(!userInfoEdit)}
              />

              {/* Employer Job Postings */}
              <EmployerJobPostings
                postings={employerProfile?.jobPostings || []}
                totalPostings={employerProfile?.jobPostings.length || 0}
                onViewAllClick={() => router.push('/companies')}
              />

              {/* Employer Activity */}
              <EmployerActivity
                posts={[]}
                totalPosts={0}
                onViewAllClick={() => router.push('/community')}
              />
            </motion.div>
          ) : (
            /* User Profile */
            <motion.div variants={itemVariants} className="space-y-6">
              {/* User Info Card */}
              <UserInfoCard
                avatar={userProfile?.avatar}
                name={userProfile?.name}
                email={userProfile?.email}
                bio={userProfile?.bio}
                onEditClick={() => setUserInfoEdit(!userInfoEdit)}
                onAvatarChange={async (file) => {
                  // The avatar upload is handled within UserInfoCard
                  // After successful upload, refetch the profile to get the new avatar URL
                  try {
                    const token = getToken?.();
                    if (!token) return;

                    const response = await fetch(`${API_URL}/profiles/me`, {
                      method: 'GET',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                    });

                    if (response.ok) {
                      const updatedProfile = await response.json();
                      updateUserProfile({
                        avatar: updatedProfile.avatar,
                      });
                    }
                  } catch (error) {
                    console.error('Error refetching profile after avatar upload:', error);
                  }
                }}
                onSaveUserInfo={handleUserInfoSave}
              />

              {/* Personal Info Card */}
              <PersonalInfoCard
                data={{
                  firstName: userProfile?.firstName || '',
                  lastName: userProfile?.lastName || '',
                  phone: userProfile?.phone || '',
                  birthDate: userProfile?.birthDate || '',
                  city: userProfile?.city || '',
                  district: userProfile?.district || '',
                  socialLinks: Array.isArray(userProfile?.socialLinks) ? userProfile.socialLinks : [],
                }}
                onUpdate={(data) => {
                  updateUserProfile({
                    phone: data.phone,
                    birthDate: data.birthDate,
                    city: data.city,
                    district: data.district,
                    socialLinks: data.socialLinks,
                  });
                }}
              />

              {/* Professional Profile Card */}
              <ProfessionalProfileCard
                data={userProfile?.careerProfile ? {
                  objective: userProfile.careerProfile.objective || '',
                  experiences: (userProfile.careerProfile.experiences || []).map(exp => ({
                    ...exp,
                    endDate: exp.endDate || '',
                    description: exp.description || '',
                  })),
                  skills: userProfile.careerProfile.skills || [],
                  education: (userProfile.careerProfile.education || []).map(edu => ({
                    ...edu,
                    degree: edu.degree || '',
                    field: edu.field || '',
                    graduationYear: edu.graduationYear || '',
                  })),
                } : {
                  objective: '',
                  experiences: [],
                  skills: [],
                  education: [],
                }}
                onUpdate={handleProfessionalProfileUpdate}
              />

              {/* User Activity */}
              <UserActivity
                posts={userPosts}
                totalPosts={userPosts.length}
                onViewAllClick={() => router.push('/community')}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Scroll Indicator - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="hidden sm:block mt-12 text-center text-gray-500 text-sm"
        >
        </motion.div>
      </div>
    </div>
  );
}
