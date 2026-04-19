'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MessageSquare,
  UserPlus,
  UserCheck,
  Award,
  Flag,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as communityApi from '@/lib/community-api';
import { followUser, unfollowUser } from '@/lib/services/follow-api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/toast';
import { ProfileReportModal } from '@/components/profile/profile-report-modal';

interface UserProfileModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onMessage?: (userId: string) => void;
}

export function UserProfileModal({
  userId,
  isOpen,
  onClose,
  onMessage,
}: UserProfileModalProps) {
  const router = useRouter();
  const { getToken, isLoggedIn } = useAuth();
  const { addToast } = useToast();

  const [profileData, setProfileData] = useState<communityApi.UserProfileModalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Fetch user profile data when modal opens
  const loadUserProfile = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await communityApi.getUserProfileModal(userId);
      setProfileData(data);
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError('Không thể tải thông tin người dùng');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Load profile when modal opens with new userId
  useEffect(() => {
    if (isOpen && userId) {
      loadUserProfile();
    }
  }, [isOpen, userId, loadUserProfile]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsReportOpen(false);
      setProfileData(null);
      setError(null);
    }
  }, [isOpen]);

  const handleFollow = async () => {
    if (!profileData || !userId) return;

    // Prevent self-following
    if (profileData.isSelf) {
      addToast('Không thể tự theo dõi chính mình', 'warning');
      return;
    }

    const token = getToken?.();
    if (!token) {
      addToast('Vui lòng đăng nhập để theo dõi', 'warning');
      return;
    }

    // Check if user is banned
    if (profileData.user.isBanned) {
      addToast('Không thể theo dõi tài khoản đã bị khóa', 'warning');
      return;
    }

    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId, token);
        setIsFollowing(false);
        // Update local stats
        setProfileData(prev => prev ? {
          ...prev,
          stats: {
            ...prev.stats,
            followers: Math.max(0, prev.stats.followers - 1),
          }
        } : null);
        addToast('Đã hủy theo dõi!', 'info');
      } else {
        await followUser(userId, token);
        setIsFollowing(true);
        // Update local stats
        setProfileData(prev => prev ? {
          ...prev,
          stats: {
            ...prev.stats,
            followers: prev.stats.followers + 1,
          }
        } : null);
        addToast('Đã theo dõi thành công!', 'success');
      }
    } catch (err: any) {
      addToast(err.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleViewFullProfile = () => {
    if (profileData?.shareToken) {
      onClose();
      router.push(`/public-profile/${profileData.shareToken}`);
    } else {
      addToast('Người dùng chưa có hồ sơ công khai', 'warning');
    }
  };

  const userRoleIcons: Record<string, string> = {
    user: '📚',
    employer: '🤝',
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] z-50 rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 border border-cyan-400/20 backdrop-blur-sm overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>

              {/* Header Background */}
              <div className="h-24 bg-linear-to-r from-cyan-500/20 to-blue-500/20 relative">
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
                    <p className="text-gray-400 text-sm">Đang tải thông tin...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-red-400 text-sm mb-4">{error}</p>
                    <button
                      onClick={loadUserProfile}
                      className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/30 transition-colors"
                    >
                      Thử lại
                    </button>
                  </div>
                ) : profileData ? (
                  <>
                    {/* Avatar */}
                    <motion.div
                      className="flex justify-center -mt-12 mb-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-slate-800 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={profileData.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.user.id}`}
                            alt={profileData.user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {profileData.user.verified && (
                          <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                            <span className="text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* User Info */}
                    <div className="text-center mb-4">
                      <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                        {profileData.user.name}
                      </h2>
                      <p className="text-sm text-gray-400 flex items-center justify-center gap-1 mb-2">
                        {userRoleIcons[profileData.user.role]} {profileData.user.role === 'user' ? 'Sinh viên' : 'Nhà tuyển dụng'}
                      </p>
                      {profileData.user.title && (
                        <p className="text-sm text-cyan-300 font-semibold" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                          {profileData.user.title}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="p-3 rounded-lg bg-white/5 border border-cyan-400/10 text-center"
                      >
                        <p className="text-lg font-bold text-cyan-300">
                          {profileData.stats.followers >= 1000
                            ? `${(profileData.stats.followers / 1000).toFixed(1)}K`
                            : profileData.stats.followers}
                        </p>
                        <p className="text-xs text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                          Follower
                        </p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="p-3 rounded-lg bg-white/5 border border-cyan-400/10 text-center"
                      >
                        <p className="text-lg font-bold text-cyan-300">
                          {profileData.stats.following}
                        </p>
                        <p className="text-xs text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                          Bài viết
                        </p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="p-3 rounded-lg bg-white/5 border border-cyan-400/10 text-center"
                      >
                        <p className="text-lg font-bold text-yellow-400">
                          {profileData.stats.score}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center justify-center gap-1" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                          <Award className="w-3 h-3" />
                          Điểm
                        </p>
                      </motion.div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {/* Show Follow button only if logged in, not self, and not banned */}
                      {isLoggedIn && !profileData.isSelf && !profileData.user.isBanned && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleFollow}
                          disabled={isFollowLoading}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${isFollowing
                            ? 'bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20'
                            : 'bg-linear-to-r from-cyan-400 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
                            } ${isFollowLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                        >
                          {isFollowLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isFollowing ? (
                            <>
                              <UserCheck className="w-4 h-4" />
                              <span>Đang Follow</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4" />
                              <span>Follow</span>
                            </>
                          )}
                        </motion.button>
                      )}

                      {/* Show Message button only when logged in, following, and not banned */}
                      {isLoggedIn && isFollowing && !profileData.user.isBanned && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onMessage?.(profileData.user.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-cyan-400/30 text-cyan-300 font-semibold hover:bg-cyan-400/10 transition-all"
                          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Tin Nhắn</span>
                        </motion.button>
                      )}

                      {/* Report button - always visible if not self (requires login) */}
                      {isLoggedIn && !profileData.isSelf && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsReportOpen(true)}
                          className="px-4 py-2 rounded-lg border border-yellow-400/30 text-yellow-400 font-semibold hover:bg-yellow-400/10 transition-all flex items-center justify-center gap-2"
                          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                        >
                          <Flag className="w-4 h-4" />
                          <span>Báo cáo</span>
                        </motion.button>
                      )}
                    </div>

                    {/* View Profile Link */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleViewFullProfile}
                      className="w-full mt-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                    >
                      <span>Xem Hồ Sơ Đầy Đủ</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Report Modal */}
      {profileData && (
        <ProfileReportModal
          isOpen={isReportOpen}
          profileName={profileData.user.name}
          profileId={profileData.user.id}
          profileType={profileData.user.role as 'user' | 'employer'}
          onClose={() => setIsReportOpen(false)}
          onSubmit={(reason, description) => {
            console.log('Report submitted:', { reason, description, userId: profileData.user.id });
          }}
        />
      )}
    </>
  );
}
