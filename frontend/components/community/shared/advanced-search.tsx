'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { mockTopics } from '@/lib/community-mock-data';
import { TopicCard } from './topic-card';

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: {
    query: string;
    author?: string;
    startDate?: string;
    endDate?: string;
    hasImages?: boolean;
    minLikes?: number;
    category?: string;
  }) => void;
}

export function AdvancedSearch({
  isOpen,
  onClose,
  onSearch,
}: AdvancedSearchProps) {
  const [query, setQuery] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [hasImages, setHasImages] = React.useState(false);
  const [minLikes, setMinLikes] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [isSearching, setIsSearching] = React.useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSearch({
      query,
      author: author || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      hasImages: hasImages || undefined,
      minLikes: minLikes ? parseInt(minLikes) : undefined,
      category: category !== 'all' ? category : undefined,
    });

    setIsSearching(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-xl bg-linear-to-b from-slate-800 to-slate-900 border border-cyan-400/20 p-6 shadow-xl my-8 max-h-[90vh] overflow-y-auto"
      >
        <h2
          className="text-2xl font-bold text-white mb-6"
          style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
        >
          🔍 Tìm Kiếm Nâng Cao
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Query */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Từ khóa
            </label>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-cyan-400/20 text-white placeholder-gray-500 outline-none focus:border-cyan-400/40"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Tác Giả
            </label>
            <input
              type="text"
              placeholder="Tên tác giả..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-cyan-400/20 text-white placeholder-gray-500 outline-none focus:border-cyan-400/40"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Từ ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-cyan-400/20 text-white outline-none focus:border-cyan-400/40"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Đến ngày
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-cyan-400/20 text-white outline-none focus:border-cyan-400/40"
            />
          </div>

          {/* Min Likes */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Lượt thích tối thiểu
            </label>
            <input
              type="number"
              placeholder="0"
              value={minLikes}
              onChange={(e) => setMinLikes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-cyan-400/20 text-white placeholder-gray-500 outline-none focus:border-cyan-400/40"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Danh Mục
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-cyan-400/20 text-white outline-none focus:border-cyan-400/40"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            >
              <option value="all">Tất Cả</option>
              <option value="job-search">Tìm Việc</option>
              <option value="experience">Kinh Nghiệm</option>
              <option value="discussion">Thảo Luận</option>
              <option value="question">Câu Hỏi</option>
            </select>
          </div>
        </div>

        {/* Checkbox */}
        <motion.label
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 mb-6 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={hasImages}
            onChange={(e) => setHasImages(e.target.checked)}
            className="w-4 h-4 accent-cyan-400"
          />
          <span className="text-sm text-gray-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
            Chỉ hiển thị bài viết có hình ảnh
          </span>
        </motion.label>

        {/* Topics Section */}
        <div className="mb-8">
          <h3
            className="text-lg font-semibold text-white mb-4"
            style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
          >
            📌 Khám Phá Chủ Đề
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-gray-300 font-semibold hover:bg-white/20 transition-colors"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
          >
            Hủy
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSearching}
            onClick={handleSearch}
            className="flex-1 px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 font-semibold hover:bg-cyan-400/30 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
          >
            {isSearching ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Đang tìm...
              </>
            ) : (
              'Tìm Kiếm'
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
