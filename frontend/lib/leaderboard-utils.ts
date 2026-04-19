/**
 * Leaderboard Utilities
 * Common functions for leaderboard components
 */

import { LeaderboardUser } from './community-mock-data';

/**
 * Format large numbers to readable format (1000 -> 1k, 1000000 -> 1m)
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}m`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

/**
 * Get rank badge styling based on position
 */
export const getRankBadgeStyle = (rank: number): string => {
  if (rank === 1) {
    return 'bg-linear-to-br from-yellow-400/20 to-yellow-300/10 border-yellow-300/30';
  }
  if (rank === 2) {
    return 'bg-linear-to-br from-gray-300/20 to-gray-200/10 border-gray-300/30';
  }
  if (rank === 3) {
    return 'bg-linear-to-br from-amber-500/20 to-amber-400/10 border-amber-400/30';
  }
  return 'bg-linear-to-br from-blue-400/10 to-blue-300/5 border-blue-300/20';
};

/**
 * Get medal emoji based on rank
 */
export const getRankMedal = (rank: number): string => {
  const medals: { [key: number]: string } = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  };
  return medals[rank] || `#${rank}`;
};

/**
 * Get medal color gradient based on rank
 */
export const getMedalColor = (rank: number): string => {
  switch (rank) {
    case 1:
      return 'from-yellow-400 to-yellow-200';
    case 2:
      return 'from-gray-300 to-gray-100';
    case 3:
      return 'from-amber-600 to-amber-400';
    default:
      return 'from-blue-400 to-blue-200';
  }
};

/**
 * Calculate percentage change for trending indicator
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * Check if rank is in top 3
 */
export const isTopRank = (rank: number): boolean => {
  return rank <= 3;
};

/**
 * Sort comparators for different leaderboard types
 */
export const sortComparators = {
  score: (a: LeaderboardUser, b: LeaderboardUser) => b.score - a.score,
  followers: (a: LeaderboardUser, b: LeaderboardUser) => b.followers - a.followers,
  streak: (a: LeaderboardUser, b: LeaderboardUser) => b.streak - a.streak,
  posts: (a: LeaderboardUser, b: LeaderboardUser) => b.posts - a.posts,
  likes: (a: LeaderboardUser, b: LeaderboardUser) => b.likes - a.likes,
};

/**
 * Filter users by search query (searches name, title, company)
 */
export const filterUsersBySearch = (users: LeaderboardUser[], query: string): LeaderboardUser[] => {
  if (!query) return users;

  const lowercaseQuery = query.toLowerCase();
  return users.filter(
    (user) =>
      user.user.name.toLowerCase().includes(lowercaseQuery) ||
      user.user.title?.toLowerCase().includes(lowercaseQuery) ||
      user.user.company?.toLowerCase().includes(lowercaseQuery)
  );
};

/**
 * Get stat badge styling based on stat type
 */
export const getStatBadgeStyle = (
  statType: 'posts' | 'likes' | 'score' | 'followers' | 'streak'
): { color: string; iconColor: string } => {
  const styles = {
    posts: {
      color: 'from-green-500/20 to-emerald-500/10 border-green-400/30',
      iconColor: 'text-green-400',
    },
    likes: {
      color: 'from-red-500/20 to-pink-500/10 border-red-400/30',
      iconColor: 'text-red-400',
    },
    score: {
      color: 'from-yellow-500/20 to-amber-500/10 border-yellow-400/30',
      iconColor: 'text-yellow-400',
    },
    followers: {
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-400/30',
      iconColor: 'text-cyan-400',
    },
    streak: {
      color: 'from-orange-500/20 to-red-500/10 border-orange-400/30',
      iconColor: 'text-orange-400',
    },
  };

  return styles[statType];
};

/**
 * Generate ranking tier based on score/metrics
 */
export const getRankingTier = (
  score: number,
  totalUsers: number
): 'Legend' | 'Master' | 'Expert' | 'Intermediate' | 'Beginner' => {
  const percentile = (score / (totalUsers * 1000)) * 100;

  if (percentile >= 90) return 'Legend';
  if (percentile >= 70) return 'Master';
  if (percentile >= 50) return 'Expert';
  if (percentile >= 25) return 'Intermediate';
  return 'Beginner';
};

/**
 * Get tier color based on ranking
 */
export const getTierColor = (
  tier: 'Legend' | 'Master' | 'Expert' | 'Intermediate' | 'Beginner'
): string => {
  const colors = {
    Legend: 'from-purple-400 to-pink-400',
    Master: 'from-red-400 to-orange-400',
    Expert: 'from-yellow-400 to-amber-400',
    Intermediate: 'from-blue-400 to-cyan-400',
    Beginner: 'from-green-400 to-emerald-400',
  };

  return colors[tier];
};

/**
 * Format streak days with text
 */
export const formatStreak = (days: number): string => {
  if (days === 1) return '1 ngày';
  if (days === 7) return '1 tuần';
  if (days === 30) return '1 tháng';
  return `${days} ngày`;
};

/**
 * Check if user has milestone achievement
 */
export const hasMilestone = (value: number): boolean => {
  const milestones = [100, 500, 1000, 5000, 10000];
  return milestones.includes(value);
};

/**
 * Get milestone achievement text
 */
export const getMilestoneText = (value: number): string | null => {
  const milestones: { [key: number]: string } = {
    100: '🎉 100 điểm!',
    500: '⭐ 500 điểm!',
    1000: '👑 1,000 điểm!',
    5000: '🚀 5,000 điểm!',
    10000: '🌟 10,000 điểm!',
  };

  return milestones[value] || null;
};
