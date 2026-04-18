'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, UserPlus, MessageSquare, Flag, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { SharePublicProfileDialog } from '@/components/profile/user';
import { ShareEmployerPublicProfileDialog, EmployerJobPostings, EmployerActivity } from '@/components/profile/employer';
import { PublicPersonalInfoCard, PublicProfessionalInfoCard, PublicForumPostsCard } from '@/components/profile/public';
import { useProfileUpdates } from '@/lib/hooks/use-profile-updates';
import { useAuth } from '@/lib/auth-context';
import { API_URL } from '@/lib/api';
import { followUser, unfollowUser, checkFollowStatus } from '@/lib/services/follow-api';
import { ProfileReportModal } from '@/components/profile/profile-report-modal';

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

const getValidImageUrl = (url: string | null | undefined) => {
  if (!url) return DEFAULT_AVATAR;
  try {
    new URL(url);
    return url;
  } catch {
    return DEFAULT_AVATAR;
  }
};

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

interface Education {
  id: string;
  school: string;
  degree?: string;
  field?: string;
  graduationYear?: string;
}

interface CareerProfile {
  id: string;
  objective?: string;
  experiences?: Experience[];
  education?: Education[];
  skills?: Skill[];
}

interface JobPosting {
  id: string;
  title: string;
  description?: string;
  location?: string;
  salary?: string;
  level?: string;
  postedAt?: string;
  applications?: number;
}

interface EmployerProfile {
  id: string;
  industry?: string;
  companySize?: string;
  foundingYear?: number;
  about?: string;
  website?: string;
  address?: string;
  jobPostings?: JobPosting[];
}

// Map company size codes to Vietnamese display labels
const companySizeMap: Record<string, string> = {
  '10-50': '10 - 50 nhân viên',
  '50-200': '50 - 200 nhân viên',
  '200-500': '200 - 500 nhân viên',
  '500+': 'Trên 500 nhân viên',
};

interface ForumPost {
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

interface PublicProfileData {
  id: string;
  shareToken: string;
  isActive: boolean;
  viewCount: number;
  followerCount?: number; // Add follower count
  profile: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    avatar: string | null;
    bio: string | null;
    title: string | null;
    birthDate?: string | null;
    city?: string | null;
    district?: string | null;
    province?: string | null;
    objective?: string;
    experience?: string;
    education?: string;
    skills?: Skill[];
    userPosts?: ForumPost[];
    socialLinks?: Array<{
      id: string;
      platform: string;
      url: string;
    }>;
    user?: {
      id: string;
      username: string;
      role: string;
      isVerified?: boolean;
    };
    careerProfile?: CareerProfile;
    employerProfile?: EmployerProfile;
  };
}

export default function PublicProfileTokenPage() {
  const params = useParams();
  const router = useRouter();
  const shareToken = params?.token as string;
  const { addToast } = useToast();

  const [publicProfile, setPublicProfile] = useState<PublicProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { getToken, isLoggedIn } = useAuth();

  // Load initial profile
  useEffect(() => {
    const loadPublicProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if this profile has already been viewed in this session
        const viewedProfilesKey = 'nextStepZ_viewedProfiles';
        const viewedProfiles = JSON.parse(sessionStorage.getItem(viewedProfilesKey) || '[]') as string[];
        const hasAlreadyViewed = viewedProfiles.includes(shareToken);

        // Pass auth token so backend can check if viewer is the profile owner
        const authToken = getToken?.();
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        // If already viewed in this session, add skipView to prevent duplicate counting
        const url = hasAlreadyViewed
          ? `${API_URL}/profiles/public/share/${shareToken}?skipView=true`
          : `${API_URL}/profiles/public/share/${shareToken}`;

        const response = await fetch(url, {
          headers,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          if (response.status === 404) {
            setError('Hồ sơ không tồn tại');
          } else if (response.status === 400) {
            // Check if it's a banned account message from backend
            if (errorData?.message === 'Tài khoản này đã bị khóa') {
              setError('Tài khoản này đã bị khóa');
            } else {
              setError('Hồ sơ không còn khả dụng');
            }
          } else {
            setError('Không thể tải hồ sơ');
          }
          return;
        }

        // Mark this profile as viewed in this session (if not already)
        if (!hasAlreadyViewed) {
          viewedProfiles.push(shareToken);
          sessionStorage.setItem(viewedProfilesKey, JSON.stringify(viewedProfiles));
        }

        const data = await response.json();
        setPublicProfile(data);
      } catch (err) {
        setError('Lỗi kết nối. Vui lòng thử lại.');
        console.error('Error loading public profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (shareToken) {
      loadPublicProfile();
    }
  }, [shareToken, getToken]);

  // Setup real-time updates listener
  useProfileUpdates(
    shareToken,
    (updatedData: unknown) => {
      if (!updatedData || typeof updatedData !== 'object') return;

      const data = updatedData as PublicProfileData;
      // Deep merge để cập nhật chỉ những phần thay đổi
      setPublicProfile((prevProfile) => {
        if (!prevProfile) return data;

        // Merge updated profile data
        return {
          ...prevProfile,
          ...data,
          profile: {
            ...prevProfile.profile,
            ...data.profile,
            // Merge nested fields
            careerProfile: data.profile?.careerProfile || prevProfile.profile?.careerProfile,
            employerProfile: data.profile?.employerProfile || prevProfile.profile?.employerProfile,
            socialLinks: data.profile?.socialLinks || prevProfile.profile?.socialLinks,
            userPosts: data.profile?.userPosts || prevProfile.profile?.userPosts,
          },
        };
      });
    },
    (error) => {
      // Silently handle polling errors - don't show to user
      console.warn('Profile update polling error:', error);
    }
  );

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  // Check follow status on mount
  useEffect(() => {
    const checkFollow = async () => {
      if (!publicProfile?.profile?.user?.id) return;
      const token = getToken?.();
      if (!token) return;

      try {
        const status = await checkFollowStatus(publicProfile.profile.user.id, token);
        setIsFollowing(status.isFollowing);
      } catch (err) {
        console.warn('Error checking follow status:', err);
      }
    };
    checkFollow();
  }, [publicProfile?.profile?.user?.id, getToken]);

  const handleFollow = async () => {
    const token = getToken?.();
    const targetUserId = publicProfile?.profile?.user?.id;

    if (!token) {
      addToast('Vui lòng đăng nhập để sử dụng chức năng', 'warning');
      return;
    }

    if (!targetUserId) {
      addToast('Không thể theo dõi người dùng này', 'error');
      return;
    }

    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId, token);
        setIsFollowing(false);
        // Update local follower count
        setPublicProfile(prev => prev ? {
          ...prev,
          followerCount: Math.max(0, (prev.followerCount || 0) - 1)
        } : null);
        addToast('Đã hủy theo dõi!', 'info');
      } else {
        await followUser(targetUserId, token);
        setIsFollowing(true);
        // Update local follower count
        setPublicProfile(prev => prev ? {
          ...prev,
          followerCount: (prev.followerCount || 0) + 1
        } : null);
        addToast('Đã theo dõi thành công!', 'success');
      }
    } catch (err: any) {
      addToast(err.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleMessage = () => {
    const targetUserId = publicProfile?.profile?.user?.id;
    if (targetUserId) {
      router.push(`/messages?userId=${targetUserId}`);
    }
  };

  const handleReport = () => {
    setIsReportModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-gray-400">Đang tải hồ sơ...</div>
      </div>
    );
  }

  if (error || !publicProfile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {error || 'Không tìm thấy hồ sơ'}
          </h2>
          <p className="text-gray-400 mb-6">
            {error ? error : 'Hồ sơ bạn tìm kiếm không tồn tại hoặc đã bị xóa'}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const profile = publicProfile.profile;
  const user = profile.user;
  const isEmployer = user?.role === 'employer';
  const careerProfile = profile.careerProfile;
  const employerProfile = profile.employerProfile;
  const fullName = profile.firstName && profile.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : user?.username || 'Người dùng ẩn danh';

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>Quay lại</span>
          </Link>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-cyan-400"
              title="Chia sẻ hồ sơ"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Share Dialog */}
      {isEmployer ? (
        <ShareEmployerPublicProfileDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          employerProfile={{
            companyName: fullName,
            email: profile.email || '',
          }}
        />
      ) : (
        <SharePublicProfileDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          userProfile={
            profile ? {
              id: profile.id,
              firstName: profile.firstName || '',
              lastName: profile.lastName || '',
              email: profile.email || '',
              phone: profile.phone || '',
              avatar: profile.avatar || '',
              bio: profile.bio || '',
              name: fullName,
            } : undefined
          }
          publicProfile={{
            id: publicProfile.id,
            shareToken: publicProfile.shareToken,
            isActive: publicProfile.isActive,
            viewCount: publicProfile.viewCount,
          }}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isEmployer && employerProfile ? (
          // ========== EMPLOYER PUBLIC PROFILE ==========
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Left Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-6">
                {/* Logo & Company Name */}
                <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-xl">
                        <Image
                          src={getValidImageUrl(profile.avatar)}
                          alt={fullName}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                          {fullName}
                        </h1>
                        <p className="text-gray-400 text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                          Nhà tuyển dụng
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons - Only show if logged in */}
                {isLoggedIn && (
                  <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
                    <CardContent className="p-6 space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleFollow}
                        disabled={isFollowLoading}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all border ${isFollowing
                          ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/50 hover:border-cyan-400 text-cyan-400'
                          : 'bg-green-500/20 hover:bg-green-500/30 border-green-400/50 hover:border-green-400 text-green-400'
                          } ${isFollowLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                      >
                        {isFollowing ? (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Hủy theo dõi
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Theo dõi
                          </>
                        )}
                      </motion.button>
                      {isFollowing && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleMessage}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 hover:border-blue-400 text-blue-400 transition-all"
                          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                        >
                          <MessageSquare className="w-4 h-4" />
                          Nhắn tin
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReport}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 hover:border-red-400 text-red-400 transition-all"
                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                      >
                        <Flag className="w-4 h-4" />
                        Báo cáo
                      </motion.button>
                    </CardContent>
                  </Card>
                )}

                {/* Contact Info */}
                <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
                  <CardContent className="p-6 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                        Email
                      </p>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-sm text-amber-400 hover:text-amber-300 break-all"
                        style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                      >
                        {profile.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                        Số điện thoại
                      </p>
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-sm text-amber-400 hover:text-amber-300"
                        style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                      >
                        {profile.phone}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                        Địa chỉ trụ sở
                      </p>
                      <p className="text-sm text-gray-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                        {employerProfile.address || 'Chưa cập nhật'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* About Section */}
              {employerProfile.about && (
                <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                      Giới thiệu công ty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 leading-relaxed" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                      {employerProfile.about}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Company Info */}
              <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                    Thông tin công ty
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                        Lĩnh vực hoạt động
                      </p>
                      <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                        {employerProfile.industry || 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                        Quy mô công ty
                      </p>
                      <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                        {employerProfile.companySize ? (companySizeMap[employerProfile.companySize] || employerProfile.companySize) : 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                        Năm thành lập
                      </p>
                      <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                        {employerProfile.foundingYear || 'Chưa cập nhật'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                        Website công ty
                      </p>
                      <a
                        href={employerProfile.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-amber-400 hover:text-amber-300"
                        style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                      >
                        {employerProfile.website || 'Chưa cập nhật'}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Postings */}
              <EmployerJobPostings
                postings={employerProfile.jobPostings || []}
                totalPostings={employerProfile.jobPostings?.length || 0}
                onViewAllClick={() => { }}
              />

              {/* Employer Activity */}
              <EmployerActivity
                posts={profile.userPosts || []}
                totalPosts={profile.userPosts?.length || 0}
                onViewAllClick={() => { }}
              />
            </motion.div>

            {/* Right Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-6">
                {/* Interest Level */}
                <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-sm" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                      Mức độ quan tâm
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Lượt xem trang</span>
                      <span className="text-amber-400 font-bold">{publicProfile.viewCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Người theo dõi</span>
                      <span className="text-green-400 font-bold">{publicProfile.followerCount || 0}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Verification Status */}
                <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-sm" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                      Trạng thái xác thực
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {user?.isVerified ? (
                        <>
                          <Users className="w-4 h-4 text-green-400" />
                          <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                            Đã xác thực
                          </div>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-amber-400" />
                          <div className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Chưa xác thực
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // ========== USER PUBLIC PROFILE ==========
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Left Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-6">
                {/* Avatar & Name */}
                <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-cyan-400/50 shadow-xl">
                        <Image
                          src={getValidImageUrl(profile.avatar)}
                          alt={fullName}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                          {fullName}
                        </h1>
                        <p className="text-gray-400 text-sm line-clamp-2" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                          {profile.bio}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons - Only show if logged in */}
                {isLoggedIn && (
                  <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
                    <CardContent className="p-6 space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleFollow}
                        disabled={isFollowLoading}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all border ${isFollowing
                          ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/50 hover:border-cyan-400 text-cyan-400'
                          : 'bg-green-500/20 hover:bg-green-500/30 border-green-400/50 hover:border-green-400 text-green-400'
                          } ${isFollowLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                      >
                        {isFollowing ? (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Hủy theo dõi
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Theo dõi
                          </>
                        )}
                      </motion.button>
                      {isFollowing && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleMessage}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 hover:border-blue-400 text-blue-400 transition-all"
                          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                        >
                          <MessageSquare className="w-4 h-4" />
                          Nhắn tin
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReport}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 hover:border-red-400 text-red-400 transition-all"
                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                      >
                        <Flag className="w-4 h-4" />
                        Báo cáo
                      </motion.button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Personal Info Card */}
              <PublicPersonalInfoCard
                data={{
                  phone: profile.phone,
                  birthDate: profile.birthDate,
                  city: profile.city || profile.province,
                  district: profile.district,
                  email: profile.email,
                }}
              />

              {/* Professional Info Cards */}
              <PublicProfessionalInfoCard
                data={careerProfile}
              />

              {/* Forum Posts Card */}
              <PublicForumPostsCard
                posts={profile.userPosts || []}
                isLoading={false}
              />
            </motion.div>

            {/* Right Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-6">
                {/* Social Links */}
                <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-sm" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                      Liên kết xã hội
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.socialLinks && profile.socialLinks.length > 0 ? (
                      profile.socialLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                        >
                          <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                            {link.platform}
                          </p>
                          <p className="text-sm text-cyan-400 truncate" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                            {link.url}
                          </p>
                        </a>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-4" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                        Chưa có liên kết xã hội
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Profile Stats */}
                <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-sm" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                      Mức độ quan tâm
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Lượt xem trang</span>
                      <span className="text-cyan-400 font-bold">{publicProfile.viewCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Người theo dõi</span>
                      <span className="text-green-400 font-bold">{publicProfile.followerCount || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>

      {/* Profile Report Modal */}
      <ProfileReportModal
        isOpen={isReportModalOpen}
        profileName={fullName}
        profileId={publicProfile.profile?.user?.id || publicProfile.id}
        profileType={isEmployer ? 'employer' : 'user'}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={(reason, description) => {
          console.log('Profile report submitted:', { profileId: publicProfile?.id, reason, description });
        }}
      />
    </div>
  );
}
