'use client';

import { motion } from 'framer-motion';
import { LeaderboardUser } from '@/lib/community-mock-data';
import { Avatar } from '../shared/avatar';
import { Flame, Trophy, TrendingUp } from 'lucide-react';

interface LeaderboardItemProps {
  user: LeaderboardUser;
  index: number;
  onClick?: (userId: string) => void;
}

const rankMedals = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export function LeaderboardItem({
  user,
  index,
  onClick,
}: LeaderboardItemProps) {
  const isMedal = index <= 2;

  return (
    <motion.div
      whileHover={{ translateX: 4 }}
      onClick={() => onClick?.(user.user.id)}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isMedal
          ? 'bg-linear-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {/* Rank */}
      <div className="w-8 text-center font-bold">
        {isMedal ? (
          rankMedals[index as keyof typeof rankMedals]
        ) : (
          <span className="text-gray-600 dark:text-gray-400">#{index}</span>
        )}
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar
          src={user.user.avatar}
          alt={user.user.name}
          size="sm"
          verified={user.user.verified}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
            {user.user.name}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {user.user.title || user.user.company}
          </p>
        </div>
      </div>

      {/* Stats - Streak */}
      <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-lg">
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">
          {user.streak}d
        </span>
      </div>

      {/* Score */}
      <div className="flex-col items-end gap-1 hidden sm:flex">
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4 text-blue-500" />
          <span className="font-bold text-gray-900 dark:text-white">
            {user.score.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <TrendingUp className="w-3 h-3" />
          {user.followers} followers
        </div>
      </div>
    </motion.div>
  );
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  sortBy?: 'score' | 'followers' | 'streak';
  onUserClick?: (userId: string) => void;
}

export function Leaderboard({
  users,
  sortBy = 'score',
  onUserClick,
}: LeaderboardProps) {
  const sortedUsers = [...users].sort((a, b) => {
    switch (sortBy) {
      case 'followers':
        return b.followers - a.followers;
      case 'streak':
        return b.streak - a.streak;
      default:
        return b.score - a.score;
    }
  });

  return (
    <div className="space-y-1">
      {sortedUsers.map((user, idx) => (
        <LeaderboardItem
          key={user.user.id}
          user={user}
          index={idx + 1}
          onClick={onUserClick}
        />
      ))}
    </div>
  );
}
