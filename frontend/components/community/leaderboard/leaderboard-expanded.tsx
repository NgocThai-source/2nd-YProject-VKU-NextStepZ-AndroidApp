'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useCallback } from 'react';
import { LeaderboardUser } from '@/lib/community-mock-data';
import { Avatar } from '../shared/avatar';
import {
  Trophy,
  Flame,
  Users,
  MessageSquare,
  Heart,
  Sparkles,
  Star,
  Filter,
  Search,
  ChevronDown,
} from 'lucide-react';

interface LeaderboardExpandedProps {
  users: LeaderboardUser[];
  onUserClick?: (userId: string) => void;
}

type SortType = 'score' | 'followers' | 'streak' | 'posts' | 'likes';

const rankMedals = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

const getMedalColor = (rank: number): string => {
  if (rank === 1) return 'from-yellow-400 to-yellow-200';
  if (rank === 2) return 'from-gray-300 to-gray-100';
  if (rank === 3) return 'from-amber-600 to-amber-400';
  return 'from-blue-400 to-blue-200';
};

const getRankBadgeStyle = (rank: number): string => {
  if (rank === 1) return 'bg-linear-to-br from-yellow-400/20 to-yellow-300/10 border-yellow-300/30';
  if (rank === 2) return 'bg-linear-to-br from-gray-300/20 to-gray-200/10 border-gray-300/30';
  if (rank === 3) return 'bg-linear-to-br from-amber-500/20 to-amber-400/10 border-amber-400/30';
  return 'bg-linear-to-br from-blue-400/10 to-blue-300/5 border-blue-300/20';
};

// Optimized animation variants
const itemVariants = {
  initial: { opacity: 0, y: 8 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(index * 0.03, 0.3),
      duration: 0.3,
    },
  }),
};

const expandedStatsVariants = {
  initial: { opacity: 0, height: 0 },
  animate: { 
    opacity: 1, 
    height: 'auto',
    transition: { 
      duration: 0.15,
    },
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { 
      duration: 0.1,
    },
  },
};

const statItemVariants = {
  initial: { opacity: 0, scale: 0.95, y: -3 },
  animate: (index: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: index * 0.01,
      duration: 0.15,
    }
  }),
};

export function LeaderboardItem({
  user,
  index,
  onClick,
}: {
  user: LeaderboardUser;
  index: number;
  onClick?: (userId: string) => void;
}) {
  const isMedal = index <= 3;
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = useCallback(() => {
    onClick?.(user.user.id);
  }, [user.user.id, onClick]);

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.01, y: -1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={`group relative rounded-xl cursor-pointer overflow-hidden transform will-change-transform ${
        isMedal ? getRankBadgeStyle(index) : 'bg-linear-to-br from-white/5 to-white/2 border border-white/10 hover:border-white/20'
      } border transition-colors duration-200`}
    >
      {/* Background gradient effect - simplified */}
      {isMedal && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-50 bg-linear-to-r from-transparent via-white/10 to-transparent transition-opacity duration-200 pointer-events-none" />
      )}

      <div className="relative p-4 md:p-6">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Rank Badge */}
          <div className="relative shrink-0">
            <motion.div
              animate={isHovered && isMedal ? { scale: 1.08 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full font-bold text-lg md:text-2xl will-change-transform ${
                isMedal
                  ? `bg-linear-to-br ${getMedalColor(index)} shadow-lg`
                  : 'bg-linear-to-br from-slate-200 to-slate-100 text-slate-700 shadow'
              }`}
            >
              {isMedal ? rankMedals[index as keyof typeof rankMedals] : `#${index}`}
            </motion.div>
            {isMedal && (
              <motion.div 
                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="absolute -top-2 -right-2 bg-linear-to-br from-yellow-300 to-orange-400 rounded-full p-1 shadow-md will-change-transform"
              >
                <Star className="w-3 h-3 md:w-4 md:h-4 text-white fill-white" />
              </motion.div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Avatar
                src={user.user.avatar}
                alt={user.user.name}
                size="md"
                verified={user.user.verified}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm md:text-base text-white truncate hover:text-cyan-300 transition-colors" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  {user.user.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 truncate" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                  {user.user.title || user.user.company}
                </p>
              </div>
            </div>
          </div>

          {/* Stats - Compact on mobile */}
          <div className="hidden sm:flex items-center gap-2 md:gap-3">
            {/* Streak */}
            <div className="flex items-center gap-1 bg-linear-to-br from-orange-500/20 to-red-500/10 px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-orange-400/30 hover:border-orange-400/50 transition-colors duration-200">
              <Flame className="w-4 h-4 md:w-5 md:h-5 text-orange-400 shrink-0" />
              <span className="text-xs md:text-sm font-bold text-orange-300" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                {user.streak}d
              </span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-1 bg-linear-to-br from-blue-500/20 to-cyan-500/10 px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-blue-400/30 hover:border-blue-400/50 transition-colors duration-200">
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-blue-400 shrink-0" />
              <span className="text-xs md:text-sm font-bold text-blue-300" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                {user.score.toLocaleString()}
              </span>
            </div>

            {/* Followers */}
            <div className="hidden md:flex items-center gap-1 bg-linear-to-br from-purple-500/20 to-pink-500/10 px-3 py-2 rounded-lg border border-purple-400/30 hover:border-purple-400/50 transition-colors duration-200">
              <Users className="w-5 h-5 text-purple-400 shrink-0" />
              <span className="text-sm font-bold text-purple-300" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                {user.followers.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Expanded Stats Row (visible on hover or below) */}
        <AnimatePresence mode="wait">
          {isHovered && (
            <motion.div
              variants={expandedStatsVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-4 pt-4 border-t border-white/10 will-change-contents"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {[
                  {
                    icon: MessageSquare,
                    label: 'Bài viết',
                    value: user.posts,
                    color: 'from-green-500/20 to-emerald-500/10 border-green-400/30',
                    iconColor: 'text-green-400',
                  },
                  {
                    icon: Heart,
                    label: 'Lượt thích',
                    value: user.likes,
                    color: 'from-rose-500/20 to-pink-500/10 border-rose-400/30',
                    iconColor: 'text-rose-400',
                  },
                  {
                    icon: Sparkles,
                    label: 'Điểm số',
                    value: user.score,
                    color: 'from-amber-500/20 to-yellow-500/10 border-amber-400/30',
                    iconColor: 'text-amber-400',
                  },
                  {
                    icon: Users,
                    label: 'Người theo dõi',
                    value: user.followers,
                    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-400/30',
                    iconColor: 'text-cyan-400',
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    custom={idx}
                    variants={statItemVariants}
                    initial="initial"
                    animate="animate"
                    className={`flex items-center gap-2 bg-linear-to-br ${stat.color} border px-3 py-2.5 rounded-lg will-change-transform hover:scale-105 transition-transform duration-200`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.iconColor} shrink-0`} />
                    <div>
                      <p className="text-xs text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>{stat.label}</p>
                      <p className="text-xs md:text-sm font-bold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                        {typeof stat.value === 'number' && stat.value > 999
                          ? `${(stat.value / 1000).toFixed(1)}k`
                          : stat.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function LeaderboardExpanded({
  users,
  onUserClick,
}: LeaderboardExpandedProps) {
  const [sortBy, setSortBy] = useState<SortType>('score');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Filter by search query
    if (searchQuery) {
      result = result.filter((user) =>
        user.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.user.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.user.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by selected criteria
    result.sort((a, b) => {
      switch (sortBy) {
        case 'followers':
          return b.followers - a.followers;
        case 'streak':
          return b.streak - a.streak;
        case 'posts':
          return b.posts - a.posts;
        case 'likes':
          return b.likes - a.likes;
        default:
          return b.score - a.score;
      }
    });

    return result;
  }, [users, sortBy, searchQuery]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const sortOptions: { value: SortType; label: string; icon: React.ReactNode }[] = [
    { value: 'score', label: 'Điểm số', icon: <Sparkles className="w-4 h-4" /> },
    { value: 'streak', label: 'Chuỗi', icon: <Flame className="w-4 h-4" /> },
    { value: 'followers', label: 'Người theo dõi', icon: <Users className="w-4 h-4" /> },
    { value: 'posts', label: 'Bài viết', icon: <MessageSquare className="w-4 h-4" /> },
    { value: 'likes', label: 'Lượt thích', icon: <Heart className="w-4 h-4" /> },
  ];

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label.toLowerCase() || 'điểm số';

  return (
    <div className="w-full">
      {/* Header with Controls */}
      <div className="mb-8 space-y-4">
        {/* Title Section */}
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 rounded-xl opacity-20 blur-lg" />
              <div className="relative bg-linear-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-400/30 rounded-xl p-3 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Exo 2 Bold', sans-serif" }}>
                Bảng Xếp Hạng
              </h2>
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </div>
            <p className="text-sm text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              {filteredAndSortedUsers.length} thành viên hoạt động • Sắp xếp theo <span className="text-cyan-300 font-semibold">{currentSortLabel}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 flex items-center gap-2 flex-wrap md:flex-nowrap">
          {/* Search */}
          <AnimatePresence mode="wait">
            {showSearch && (
              <motion.input
                key="search-input"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                type="text"
                placeholder="Tìm kiếm thành viên..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-white/5 border border-cyan-400/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20 transition-all will-change-transform"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSearch(!showSearch)}
            className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-200"
            title="Tìm kiếm"
          >
            <Search className="w-5 h-5" />
          </motion.button>

          {/* Sort Dropdown */}
          <motion.div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-lg px-3 py-2.5 hover:border-cyan-400/60 hover:bg-cyan-500/15 transition-all duration-200 group"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            >
              <Filter className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="text-sm font-medium text-white">
                {sortOptions.find(o => o.value === sortBy)?.label}
              </span>
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence mode="wait">
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 left-0 w-56 bg-slate-800/95 backdrop-blur-md border border-cyan-400/30 rounded-xl shadow-2xl shadow-cyan-500/20 overflow-hidden z-50"
                >
                  {/* Dropdown Header */}
                  <div className="px-4 py-3 border-b border-cyan-400/20 bg-linear-to-r from-cyan-500/10 to-transparent">
                    <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">Sắp xếp theo</p>
                  </div>

                  {/* Options */}
                  <div className="py-2 space-y-1">
                    {sortOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 flex items-center gap-3 transition-all duration-150 group ${ sortBy === option.value
                          ? 'bg-cyan-500/20 border-l-2 border-cyan-400'
                          : 'hover:bg-white/5 border-l-2 border-transparent'
                        }`}
                        style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                          {option.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-white">{option.label}</p>
                        </div>
                        {sortBy === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-cyan-400"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="px-4 py-2 border-t border-cyan-400/20 bg-linear-to-r from-cyan-500/5 to-transparent">
                    <p className="text-xs text-gray-400">Chọn tiêu chí sắp xếp bảng xếp hạng</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {filteredAndSortedUsers.length > 0 ? (
            filteredAndSortedUsers.map((user, idx) => (
              <LeaderboardItem
                key={user.user.id}
                user={user}
                index={idx + 1}
                onClick={onUserClick}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="text-center py-12"
            >
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Không tìm thấy thành viên nào</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
