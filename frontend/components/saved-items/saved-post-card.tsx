'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, Heart, Trash2, ExternalLink } from 'lucide-react';
import { SavedPost } from '@/lib/saved-items-context';
import { Avatar } from '@/components/community/shared/avatar';
import { formatTimeAgo } from '@/lib/community-utils';
import { useToast } from '@/components/ui/toast';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface SavedPostCardProps {
  savedPost: SavedPost;
  onRemove: (id: string) => void;
}

export function SavedPostCard({ savedPost, onRemove }: SavedPostCardProps) {
  const { post } = savedPost;
  const { addToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const categoryLabels: Record<string, string> = {
    'job-search': '💼 Tìm Việc',
    experience: '📝 Kinh Nghiệm',
    discussion: '💬 Thảo Luận',
    question: '❓ Câu Hỏi',
    offer: '✨ Chia Sẻ',
    opportunity: '🎯 Cơ Hội',
  };

  const handleRemove = () => {
    onRemove(post.id);
    addToast('Đã xóa bài viết', 'success');
    setShowConfirm(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="rounded-lg border border-cyan-400/20 backdrop-blur-sm bg-linear-to-br from-white/10 to-white/5 overflow-hidden hover:border-cyan-400/40 transition-all p-4"
      >
        {/* Header with Author Info */}
        <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-cyan-400/10">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <Avatar
              src={post.author.avatar}
              alt={post.author.name}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <h4
                className="font-semibold text-white truncate hover:text-cyan-300 transition-colors"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                {post.author.name}
              </h4>
              <p className="text-xs text-gray-500">
                {formatTimeAgo(post.createdAt)} • Lưu từ {new Date(savedPost.savedAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
          <span className="px-2 py-1 text-xs rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 whitespace-nowrap">
            {categoryLabels[post.category] || post.category}
          </span>
        </div>

        {/* Content */}
        <p className="text-gray-300 text-sm mb-3 line-clamp-3 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Tags */}
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.hashtags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3 pb-3 border-b border-cyan-400/10">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{post.likesCount || 0} likes</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentsCount || 0} bình luận</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/shared-post/${post.id}`}
            className="flex-1"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-3 py-2 rounded-lg text-sm font-semibold bg-linear-to-r from-cyan-400/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/50 transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Xem Bài Viết
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowConfirm(true)}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-500/10 text-red-400 border border-red-400/30 hover:border-red-400/50 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Confirm Modal for single delete */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Xóa bài viết"
        description="Bạn chắc chắn muốn xóa bài viết này khỏi danh sách lưu? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        isDangerous
        onConfirm={handleRemove}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
