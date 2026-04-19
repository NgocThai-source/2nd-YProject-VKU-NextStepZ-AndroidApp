'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Zap, Eye, Loader2, Check } from 'lucide-react';
import { Avatar } from './avatar';
import * as communityApi from '@/lib/community-api';
import { followUser } from '@/lib/services/follow-api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/toast';

interface RecommendedUserProps {
  user: communityApi.UserSuggestion;
  reason: string;
  isFollowing?: boolean;
  isFollowLoading?: boolean;
  onFollow?: (userId: string) => void;
  onDismiss?: (userId: string) => void;
  onUserClick?: (userId: string) => void;
}

interface RecommendationsProps {
  onFollow?: (userId: string) => void;
  onDismiss?: (userId: string) => void;
  onUserClick?: (userId: string) => void;
  onStatsChange?: () => void;
}

export function RecommendedUser({
  user,
  reason,
  isFollowing = false,
  isFollowLoading = false,
  onFollow,
  onDismiss,
  onUserClick,
}: RecommendedUserProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      layout
      className="p-4 rounded-lg bg-linear-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 hover:border-cyan-400/40 transition-all"
    >
      <div
        className="flex items-start gap-3 mb-3 cursor-pointer"
        onClick={() => onUserClick?.(user.id)}
      >
        <Avatar src={user.avatar || ''} alt={user.name} size="md" verified={false} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm truncate hover:text-cyan-300 transition-colors" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
            {user.name}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {user.role === 'employer' ? 'Nhà tuyển dụng' : 'Sinh viên'}
          </p>
          <p className="text-xs text-cyan-300 mt-1 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            {reason}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: isFollowing || isFollowLoading ? 1 : 1.05 }}
          whileTap={{ scale: isFollowing || isFollowLoading ? 1 : 0.95 }}
          onClick={() => !isFollowing && !isFollowLoading && onFollow?.(user.id)}
          disabled={isFollowing || isFollowLoading}
          className={`flex-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${isFollowing
            ? 'bg-green-500/20 text-green-300 cursor-default'
            : isFollowLoading
              ? 'bg-cyan-400/10 text-cyan-300/50 cursor-wait'
              : 'bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30'
            }`}
          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
        >
          {isFollowLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : isFollowing ? (
            <>
              <Check className="w-3 h-3" />
              Đã theo dõi
            </>
          ) : (
            'Theo Dõi'
          )}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDismiss?.(user.id)}
          className="flex-1 px-3 py-1 rounded-lg bg-white/10 text-gray-300 text-xs hover:bg-white/20 transition-colors"
        >
          Bỏ qua
        </motion.button>
      </div>
    </motion.div>
  );
}

export function Recommendations({
  onFollow,
  onDismiss,
  onUserClick,
  onStatsChange,
}: RecommendationsProps) {
  const { getToken, isLoggedIn } = useAuth();
  const { addToast } = useToast();

  const [allUsers, setAllUsers] = useState<communityApi.UserSuggestion[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [followLoading, setFollowLoading] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load more suggestions from backend
  const loadMoreSuggestions = useCallback(async () => {
    try {
      const suggestions = await communityApi.getUserSuggestions();
      setAllUsers(prev => {
        // Add new users that aren't already in the list
        const existingIds = new Set(prev.map(u => u.id));
        const newUsers = suggestions.filter(u => !existingIds.has(u.id));
        return [...prev, ...newUsers];
      });
    } catch (err) {
      console.error('Error loading more suggestions:', err);
    }
  }, []);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const suggestions = await communityApi.getUserSuggestions();
        setAllUsers(suggestions);
      } catch (err) {
        console.error('Error loading suggestions:', err);
        setError('Không thể tải gợi ý');
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, []);

  // Get visible users (not dismissed and not already followed)
  const visibleUsers = allUsers
    .filter((u) => !dismissed.has(u.id) && !followed.has(u.id))
    .slice(0, 3);

  // Load more if running low on visible users
  useEffect(() => {
    const availableUsers = allUsers.filter(u => !dismissed.has(u.id) && !followed.has(u.id));
    if (availableUsers.length < 3 && !isLoading) {
      loadMoreSuggestions();
    }
  }, [allUsers, dismissed, followed, isLoading, loadMoreSuggestions]);

  const handleFollow = async (userId: string) => {
    const token = getToken?.();
    if (!token) {
      addToast('Vui lòng đăng nhập để theo dõi', 'warning');
      return;
    }

    // Set loading state
    setFollowLoading(prev => new Set([...prev, userId]));

    try {
      await followUser(userId, token);

      // Mark as followed
      setFollowed(prev => new Set([...prev, userId]));
      addToast('Đã theo dõi thành công!', 'success');

      // Notify parent about stats change (triggers leaderboard refresh)
      onStatsChange?.();

      // After a short delay, remove from list to show animation
      setTimeout(() => {
        setDismissed(prev => new Set([...prev, userId]));
      }, 1000);

      onFollow?.(userId);
    } catch (err: any) {
      addToast(err.message || 'Lỗi khi theo dõi người dùng', 'error');
    } finally {
      setFollowLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleDismiss = (userId: string) => {
    setDismissed((prev) => new Set([...prev, userId]));
    onDismiss?.(userId);
  };

  // Don't show recommendations for non-logged-in users
  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg bg-linear-to-br from-white/10 to-white/5 border border-cyan-400/20 p-6 text-center"
      >
        <Loader2 className="w-6 h-6 text-cyan-400 mx-auto mb-2 animate-spin" />
        <p className="text-sm text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
          Đang tải gợi ý...
        </p>
      </motion.div>
    );
  }

  if (error || visibleUsers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg bg-linear-to-br from-white/10 to-white/5 border border-cyan-400/20 p-6 text-center"
      >
        <Eye className="w-8 h-8 text-gray-600 mx-auto mb-2 opacity-50" />
        <p className="text-sm text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
          {error || 'Bạn đã xem tất cả đề xuất'}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-400" />
        <h3
          className="text-lg font-bold text-white"
          style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
        >
          Gợi Ý Theo Dõi
        </h3>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {visibleUsers.map((user) => (
            <RecommendedUser
              key={user.id}
              user={user}
              reason={`${user.followers} người theo dõi`}
              isFollowing={followed.has(user.id)}
              isFollowLoading={followLoading.has(user.id)}
              onFollow={handleFollow}
              onDismiss={handleDismiss}
              onUserClick={onUserClick}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
