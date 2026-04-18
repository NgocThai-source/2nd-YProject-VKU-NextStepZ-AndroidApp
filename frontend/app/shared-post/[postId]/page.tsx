'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, ChevronLeft, MoreHorizontal, Flag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { mockTopics } from '@/lib/community-mock-data';
import { CommentSection } from '@/components/community/feed/comment-section';
import { Avatar } from '@/components/community/shared/avatar';
import { PillTag } from '@/components/community/shared/pill-tag';
import { formatTimeAgo } from '@/lib/community-utils';
import * as communityApi from '@/lib/community-api';

// Helper function to get full image URL
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http') || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
  return `${backendUrl}${imagePath}`;
};

const categoryLabels: Record<string, string> = {
  'job-search': '💼 Tìm Việc',
  experience: '📝 Kinh Nghiệm',
  discussion: '💬 Thảo Luận',
  question: '❓ Câu Hỏi',
  offer: '✨ Chia Sẻ',
  opportunity: '⚡ Cơ Hội',
};

interface TransformedPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    title?: string;
    verified?: boolean;
  };
  content: string;
  category: string;
  topics?: string[];
  images: string[];
  hashtags: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
}

export default function SharedPostPage() {
  const params = useParams();
  const postId = params?.postId as string;
  const [showComments, setShowComments] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [post, setPost] = useState<TransformedPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load post from API
  const loadPost = useCallback(async () => {
    if (!postId) return;

    setIsLoading(true);
    setError(null);

    const apiPost = await communityApi.getSharedPost(postId);

    // Handle null (post not found, hidden, or deleted)
    if (!apiPost) {
      setError('Bài viết này đã bị ẩn hoặc xóa.');
      setIsLoading(false);
      return;
    }

    const transformed: TransformedPost = {
      id: apiPost.id,
      author: {
        id: apiPost.user.id,
        name: `${apiPost.user.firstName || ''} ${apiPost.user.lastName || ''}`.trim() || apiPost.user.username,
        avatar: apiPost.user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
        title: apiPost.user.role === 'employer' ? apiPost.user.companyName || undefined : undefined,
        verified: false,
      },
      content: apiPost.content,
      category: apiPost.category,
      topics: apiPost.topics,
      images: apiPost.images,
      hashtags: apiPost.hashtags,
      timestamp: apiPost.createdAt,
      likes: apiPost.likesCount,
      comments: apiPost.commentsCount,
      shares: apiPost.shareCount,
      isLiked: apiPost.isLiked || false,
      isSaved: false,
    };

    setPost(transformed);
    setLikeCount(apiPost.likesCount);
    setIsLiked(apiPost.isLiked || false);
    setIsLoading(false);
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  // Poll for real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadPost();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadPost]);

  const handleLike = async () => {
    if (!communityApi.isAuthenticated()) {
      alert('Vui lòng đăng nhập để sử dụng chức năng này');
      return;
    }

    try {
      const result = await communityApi.toggleLike(postId);
      setIsLiked(result.isLiked);
      setLikeCount(prev => result.isLiked ? prev + 1 : prev - 1);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleSave = () => {
    if (!communityApi.isAuthenticated()) {
      alert('Vui lòng đăng nhập để sử dụng chức năng này');
      return;
    }
    setIsSaved(!isSaved);
  };





  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Đang tải bài viết...</p>
        </motion.div>
      </div>
    );
  }

  // Error or not found state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-4">Không tìm thấy bài viết</h1>
          <p className="text-slate-400 mb-8">{error || 'Bài viết này có thể đã bị xóa hoặc không tồn tại.'}</p>
          <Link href="/community">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition"
            >
              <ChevronLeft size={18} />
              Quay lại cộng đồng
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link href="/community">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition mb-6"
          >
            <ChevronLeft size={24} className="text-cyan-400" />
          </motion.button>
        </Link>

        {/* Post Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border border-cyan-400/20 backdrop-blur-sm bg-linear-to-br from-white/10 to-white/5 overflow-hidden hover:border-cyan-400/40 transition-all"
        >
          {/* Header */}
          <div className="p-4 border-b border-cyan-400/10">
            <div className="flex items-start justify-between gap-3">
              <motion.div
                className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer"
                whileHover={{ x: 2 }}
              >
                <Avatar
                  src={post.author.avatar}
                  alt={post.author.name}
                  size="md"
                  verified={post.author.verified}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className="font-semibold text-white truncate hover:text-cyan-300 transition-colors"
                      style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                    >
                      {post.author.name}
                    </h3>
                    {post.author.title && (
                      <span
                        className="text-sm text-gray-400 truncate"
                        style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                      >
                        {post.author.title}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm text-gray-500"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  >
                    {formatTimeAgo(post.timestamp)}
                  </p>
                </div>
              </motion.div>

              {/* More Options Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </motion.button>

                <AnimatePresence>
                  {showMoreMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-cyan-400/20 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden z-10"
                    >
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                        onClick={() => {
                          setShowMoreMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-yellow-400 transition-colors"
                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                      >
                        <Flag className="w-4 h-4" />
                        Báo Cáo
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Category Badge */}
            <div className="mt-3">
              <PillTag
                label={categoryLabels[post.category] || post.category}
                variant="primary"
              />
            </div>

            {/* Topic Tags */}
            {post.topics && post.topics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.topics.map((topicId) => {
                  const topic = mockTopics.find((t) => t.id === topicId);
                  return topic ? (
                    <motion.div
                      key={topicId}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-violet-500/20 to-purple-500/20 border border-violet-400/40 text-violet-300 text-sm font-medium hover:border-violet-400/60 transition-all cursor-pointer"
                      style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                    >
                      <span>{topic.icon}</span>
                      <span>{topic.name}</span>
                    </motion.div>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <p
              className="text-gray-200 leading-relaxed whitespace-pre-wrap"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            >
              {post.content}
            </p>

            {/* Hashtags */}
            {post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.hashtags.map((tag) => (
                  <PillTag key={tag} label={tag} variant="secondary" className="text-xs px-2 py-0.5" />
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          {post.images.length > 0 && (
            <div className="px-4 pb-4">
              <div
                className={`grid gap-2 ${post.images.length === 1
                  ? 'grid-cols-1'
                  : post.images.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-2'
                  }`}
              >
                {post.images.map((image, idx) => (
                  <div
                    key={idx}
                    className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-700"
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`Post image ${idx + 1}`}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div
            className="px-4 py-3 border-t border-cyan-400/10 flex items-center justify-between text-sm text-gray-400"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            <span className="hover:text-cyan-300 cursor-pointer">{likeCount} lượt thích</span>
            <span className="hover:text-cyan-300 cursor-pointer">{post.comments} bình luận</span>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 border-t border-cyan-400/10 flex items-center justify-around flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isLiked ? 'text-red-400 bg-red-500/10' : 'text-gray-400 hover:bg-white/5'
                }`}
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
              <span className="text-sm hidden sm:inline">Thích</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm hidden sm:inline">Bình Luận</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isSaved ? 'text-cyan-300 bg-cyan-400/10' : 'text-gray-400 hover:bg-white/5'
                }`}
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              <Bookmark className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
              <span className="text-sm hidden sm:inline">Lưu</span>
            </motion.button>
          </div>

          {/* Comment Section */}
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-cyan-400/10 px-4 py-4"
            >
              <CommentSection
                postId={postId}
                totalComments={post.comments}
                onCommentCountChange={(count) => {
                  setPost(prev => prev ? { ...prev, comments: count } : null);
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
