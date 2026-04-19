'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, LayoutGrid, Briefcase, BookMarked, MessageCircle, Flame, HelpCircle, Zap } from 'lucide-react';
import { useState } from 'react';
import { mockTrendingHashtags, mockTopics } from '@/lib/community-mock-data';

export type FilterType = 'all' | 'job-search' | 'experience' | 'discussion' | 'question' | 'opportunity' | 'trending';

interface FeedFilterProps {
  onFilterChange?: (filter: FilterType, hashtags: string[], searchQuery: string, topics: string[]) => void;
}

const filterOptions = [
  { id: 'all' as FilterType, label: 'Tất cả bài viết', Icon: LayoutGrid, description: 'Hiển thị tất cả' },
  { id: 'job-search' as FilterType, label: 'Tìm Việc', Icon: Briefcase, description: 'Cơ hội việc làm' },
  { id: 'experience' as FilterType, label: 'Kinh Nghiệm', Icon: BookMarked, description: 'Chia sẻ kinh nghiệm' },
  { id: 'discussion' as FilterType, label: 'Thảo Luận', Icon: MessageCircle, description: 'Cuộc trò chuyện' },
  { id: 'question' as FilterType, label: 'Câu Hỏi', Icon: HelpCircle, description: 'Đặt câu hỏi' },
  { id: 'opportunity' as FilterType, label: 'Cơ Hội', Icon: Zap, description: 'Cơ hội mới' },
  { id: 'trending' as FilterType, label: 'Xu Hướng', Icon: Flame, description: 'Nóng hôm nay' },
];

export function FeedFilter({ onFilterChange }: FeedFilterProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    onFilterChange?.(newFilter, selectedHashtags, searchQuery, selectedTopics);
  };

  const handleHashtagChange = (tag: string) => {
    const isSelected = selectedHashtags.includes(tag);
    const updatedHashtags = isSelected
      ? selectedHashtags.filter(t => t !== tag)
      : [...selectedHashtags, tag];
    setSelectedHashtags(updatedHashtags);
    onFilterChange?.(filter, updatedHashtags, searchQuery, selectedTopics);
  };

  const handleTopicChange = (topicId: string) => {
    const isSelected = selectedTopics.includes(topicId);
    const updatedTopics = isSelected
      ? selectedTopics.filter(t => t !== topicId)
      : [...selectedTopics, topicId];
    setSelectedTopics(updatedTopics);
    onFilterChange?.(filter, selectedHashtags, searchQuery, updatedTopics);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onFilterChange?.(filter, selectedHashtags, query, selectedTopics);
  };

  const clearAllFilters = () => {
    setFilter('all');
    setSelectedHashtags([]);
    setSelectedTopics([]);
    setSearchQuery('');
    onFilterChange?.('all', [], '', []);
  };

  const activeFilterCount = [
    filter !== 'all' ? 1 : 0,
    selectedHashtags.length > 0 ? 1 : 0,
    selectedTopics.length > 0 ? 1 : 0,
    searchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4"
    >
      {/* Enhanced Search Bar */}
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center gap-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết, người dùng, kỹ năng..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-cyan-400/20 transition-all duration-300"
          />
          {searchQuery && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSearchChange('')}
              className="absolute right-4 text-gray-400 hover:text-cyan-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Filter Categories - Modern Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-2 overflow-x-auto">
        {filterOptions.map((option) => {
          const Icon = option.Icon;
          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFilterChange(option.id)}
              className={`relative group px-2 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                filter === option.id
                  ? 'bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50 border border-cyan-400'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-cyan-400/50'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon className="w-4 h-4" />
                <span className="text-xs sm:text-xs lg:text-xs font-semibold leading-tight text-center line-clamp-2">{option.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Bộ Lọc Nâng Cao</span>
          <span className="sm:hidden">Bộ Lọc</span>
          {activeFilterCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs"
            >
              {activeFilterCount}
            </motion.span>
          )}
        </motion.button>

        {(selectedHashtags.length > 0 || selectedTopics.length > 0 || searchQuery || filter !== 'all') && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllFilters}
            className="text-xs font-semibold text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Xóa bộ lọc
          </motion.button>
        )}
      </div>

      {/* Trending Hashtags & Topics - Show when Advanced Filters Expanded */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Trending Hashtags Section */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.1 }}
              className="space-y-3 pt-4 border-t border-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <Flame className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-white">Xu Hướng Hôm Nay</span>
                </div>
                <span className="text-xs text-gray-500 hidden sm:inline">Phổ biến nhất</span>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {mockTrendingHashtags.slice(0, 10).map((tag, idx) => (
                  <motion.button
                    key={tag.tag}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleHashtagChange(tag.tag)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`relative group px-2 sm:px-3 py-1.5 sm:py-2 rounded-full whitespace-nowrap text-xs sm:text-xs font-semibold transition-all duration-300 shrink-0 ${
                      selectedHashtags.includes(tag.tag)
                        ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 border border-cyan-400'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-cyan-400/50'
                    }`}
                  >
                    <span className="line-clamp-1">
                      {tag.tag} <span className="opacity-70 hidden sm:inline">({tag.posts})</span>
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-full transition-all" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Topics Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-violet-500/20">
                    <span className="text-base">📌</span>
                  </div>
                  <span className="text-sm sm:text-base font-bold text-white">Chủ Đề Phổ Biến</span>
                </div>
                <span className="text-xs text-gray-500 hidden sm:inline">{mockTopics.length} chủ đề</span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {mockTopics.slice(0, 8).map((topic, idx) => (
                  <motion.button
                    key={topic.id}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTopicChange(topic.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    className={`relative group px-2 sm:px-3 py-1.5 sm:py-2 rounded-full whitespace-nowrap text-xs sm:text-xs font-semibold transition-all duration-300 shrink-0 ${
                      selectedTopics.includes(topic.id)
                        ? 'bg-linear-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30 border border-violet-400'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-violet-400/50'
                    }`}
                  >
                    <span className="line-clamp-1">
                      {topic.name} <span className="opacity-70 hidden sm:inline">({topic.followersCount})</span>
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-violet-500/0 to-purple-500/0 group-hover:from-violet-500/10 group-hover:to-purple-500/10 rounded-full transition-all" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      <AnimatePresence>
        {(selectedHashtags.length > 0 || selectedTopics.length > 0 || searchQuery || filter !== 'all') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 pt-2"
          >
            {filter !== 'all' && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-xs sm:text-xs font-semibold text-cyan-300"
              >
                <span className="hidden sm:inline">📂</span>
                <span className="line-clamp-1">{filterOptions.find(f => f.id === filter)?.label}</span>
              </motion.span>
            )}
            {selectedHashtags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-orange-500/20 border border-orange-400/50 text-xs sm:text-xs font-semibold text-orange-300 group cursor-pointer hover:border-orange-400 transition-colors"
              >
                <Flame className="w-3 h-3 hidden sm:inline" />
                <span className="line-clamp-1">{tag}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHashtagChange(tag);
                  }}
                  className="ml-1 text-orange-300 hover:text-orange-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
            {selectedTopics.map((topicId) => {
              const topic = mockTopics.find(t => t.id === topicId);
              return topic ? (
                <motion.span
                  key={topicId}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-violet-500/20 border border-violet-400/50 text-xs sm:text-xs font-semibold text-violet-300 group cursor-pointer hover:border-violet-400 transition-colors"
                >
                  <span className="hidden sm:inline">{topic.icon}</span>
                  <span className="line-clamp-1">{topic.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTopicChange(topicId);
                    }}
                    className="ml-1 text-violet-300 hover:text-violet-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ) : null;
            })}
            {searchQuery && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-purple-500/20 border border-purple-400/50 text-xs sm:text-xs font-semibold text-purple-300"
              >
                <Search className="w-3 h-3 hidden sm:inline" />
                <span className="line-clamp-1">&quot;{searchQuery}&quot;</span>
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
