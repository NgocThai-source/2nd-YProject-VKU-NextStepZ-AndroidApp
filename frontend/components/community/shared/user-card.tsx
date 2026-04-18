'use client';

import { motion } from 'framer-motion';
import { Users, MessageCircle } from 'lucide-react';
import { CommunityUser } from '@/lib/community-mock-data';
import { Avatar } from './avatar';
import { useState } from 'react';

interface UserCardProps {
  user: CommunityUser;
  showStats?: boolean;
  onFollow?: (userId: string) => void;
  onMessage?: (userId: string) => void;
}

export function UserCard({
  user,
  showStats = true,
  onFollow,
  onMessage,
}: UserCardProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow?.(user.id);
  };

  const roleLabels = {
    user: '📚 Sinh viên',
    employer: '🤝 Nhà tuyển dụng',
  };

  return (
    <motion.div
      whileHover={{ translateY: -2 }}
      className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4 text-center hover:shadow-md transition-shadow"
    >
      {/* Avatar */}
      <div className="flex justify-center">
        <Avatar
          src={user.avatar}
          alt={user.name}
          size="lg"
          verified={user.verified}
        />
      </div>

      {/* Info */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
          {user.name}
        </h3>
        {user.title && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{user.title}</p>
        )}
        {user.company && (
          <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">
            {user.company}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {roleLabels[user.role]}
        </p>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="flex justify-around text-sm py-3 border-t border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center">
            <span className="font-semibold text-gray-900 dark:text-white">
              {user.followers}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Người theo dõi
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-gray-900 dark:text-white">
              {user.following}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Đang theo
            </span>
          </div>
          {user.reputation && (
            <div className="flex flex-col items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                {user.reputation}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Danh tiếng
              </span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFollow}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 ${
            isFollowing
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              : 'bg-linear-to-r from-cyan-400 to-blue-500 text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          {isFollowing ? 'Đang theo' : 'Theo dõi'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onMessage?.(user.id)}
          className="flex-1 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
        >
          <MessageCircle className="w-4 h-4" />
          Nhắn tin
        </motion.button>
      </div>
    </motion.div>
  );
}
