'use client';

import { motion } from 'framer-motion';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { PostCard } from './post-card';
import { PostReportModal } from './post-report-modal';
import { PostSkeleton } from '../shared/skeleton-loader';
import type { FilterType } from './feed-filter';
import * as communityApi from '@/lib/community-api';
import { Post as MockPost, mockTopics } from '@/lib/community-mock-data';

// Transform API post to match existing component interface
interface TransformedPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: 'user' | 'employer';
    title?: string;
    company?: string;
    followers: number;
    following: number;
    isFollowing?: boolean;
    verified?: boolean;
  };
  content: string;
  category: 'job-search' | 'experience' | 'discussion' | 'question' | 'offer' | 'opportunity';
  topics?: string[];
  images: string[];
  hashtags: string[];
  timestamp: string;
  updatedAt?: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

function transformApiPostToFrontend(post: communityApi.Post): TransformedPost {
  return {
    id: post.id,
    author: {
      id: post.user.id,
      name: `${post.user.firstName || ''} ${post.user.lastName || ''}`.trim() || post.user.username,
      avatar: post.user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
      role: post.user.role as 'user' | 'employer',
      title: post.user.role === 'employer' ? post.user.companyName || undefined : undefined,
      company: post.user.companyName || undefined,
      followers: 0,
      following: 0,
      verified: false,
    },
    content: post.content,
    category: post.category as TransformedPost['category'],
    topics: post.topics,
    images: post.images,
    hashtags: post.hashtags,
    timestamp: post.createdAt,
    updatedAt: post.updatedAt,
    likes: post.likesCount,
    comments: post.commentsCount,
    shares: post.shareCount,
    saves: 0,
    isLiked: post.isLiked,
    isSaved: false,
  };
}

interface FeedProps {
  onCreatePostClick?: () => void;
  onPostInteraction?: (postId: string, type: 'like' | 'comment' | 'save' | 'share') => void;
  onUserClick?: (userId: string) => void;
  onStatsChange?: () => void;
  filter?: FilterType;
  selectedHashtags?: string[];
  selectedTopics?: string[];
  searchQuery?: string;
  newPost?: MockPost | null;
}

export function Feed({
  onCreatePostClick,
  onPostInteraction,
  onUserClick,
  onStatsChange,
  filter = 'all',
  selectedHashtags = [],
  selectedTopics = [],
  searchQuery = '',
  newPost = null,
}: FeedProps) {
  const [posts, setPosts] = useState<TransformedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportingPost, setReportingPost] = useState<TransformedPost | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load posts from API
  const loadPosts = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await communityApi.getPosts(pageNum, 10);
      const transformedPosts = response.posts.map(transformApiPostToFrontend);

      if (append) {
        setPosts(prev => [...prev, ...transformedPosts]);
      } else {
        setPosts(transformedPosts);
      }

      setHasMore(pageNum < response.pagination.totalPages);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  // Add new post when created
  useEffect(() => {
    if (newPost) {
      // Transform the mock post format to match our transformed format
      const transformedNewPost: TransformedPost = {
        id: newPost.id,
        author: newPost.author,
        content: newPost.content,
        category: newPost.category,
        topics: newPost.topics,
        images: newPost.images,
        hashtags: newPost.hashtags,
        timestamp: newPost.timestamp,
        likes: newPost.likes,
        comments: newPost.comments,
        shares: newPost.shares,
        saves: newPost.saves,
        isLiked: newPost.isLiked,
        isSaved: newPost.isSaved,
      };
      setPosts((prevPosts) => [transformedNewPost, ...prevPosts]);
    }
  }, [newPost]);

  // Filter posts based on selection
  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by category
    if (filter !== 'all' && filter !== 'trending') {
      result = result.filter((post) => post.category === filter);
    }

    // Filter by hashtags (match any of the selected hashtags)
    if (selectedHashtags.length > 0) {
      result = result.filter((post) =>
        post.hashtags.some((tag) =>
          selectedHashtags.some((selected) =>
            tag.toLowerCase().includes(selected.toLowerCase())
          )
        )
      );
    }

    // Filter by topics (match any of the selected topics)
    if (selectedTopics.length > 0) {
      result = result.filter((post) =>
        post.topics?.some((topicId) =>
          selectedTopics.includes(topicId)
        )
      );
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (post) =>
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by trending (most likes + comments)
    if (filter === 'trending') {
      result = [...result].sort((a, b) => {
        const scoreA = a.likes + a.comments * 2;
        const scoreB = b.likes + b.comments * 2;
        return scoreB - scoreA;
      });
    }

    return result;
  }, [posts, filter, selectedHashtags, selectedTopics, searchQuery]);

  const handleLoadMore = async () => {
    if (!hasMore || isLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await loadPosts(nextPage, true);
  };

  const handleLike = async (postId: string) => {
    if (!communityApi.isAuthenticated()) {
      alert('Vui lòng đăng nhập để sử dụng chức năng này');
      return;
    }

    try {
      const result = await communityApi.toggleLike(postId);
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: result.isLiked,
            likes: result.isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      }));
      onPostInteraction?.(postId, 'like');
      onStatsChange?.();
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Cast to any for PostCard compatibility since it expects MockPost type
  const castPost = (post: TransformedPost): any => post;

  return (
    <div className="space-y-4">
      {/* Post Report Modal */}
      <PostReportModal
        isOpen={!!reportingPost}
        post={reportingPost as any}
        onClose={() => setReportingPost(null)}
        onSubmit={(reason, description) => {
          console.log('Post reported:', {
            postId: reportingPost?.id,
            reason,
            description,
          });
        }}
      />

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6 text-red-400"
        >
          <p>{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loadPosts(1)}
            className="mt-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
          >
            Thử lại
          </motion.button>
        </motion.div>
      )}

      {/* Loading Initial */}
      {isLoading && posts.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPosts.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Không có bài viết nào khớp với tiêu chí tìm kiếm
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreatePostClick}
            className="px-6 py-2 rounded-lg bg-linear-to-r from-cyan-400 to-blue-500 text-white font-medium"
          >
            Tạo bài viết đầu tiên
          </motion.button>
        </motion.div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={castPost(post)}
            onLike={() => handleLike(post.id)}
            onComment={() => onPostInteraction?.(post.id, 'comment')}
            onSave={() => onPostInteraction?.(post.id, 'save')}
            onShare={() => onPostInteraction?.(post.id, 'share')}
            onUserClick={(userId) => onUserClick?.(userId)}
            onReport={() => setReportingPost(post)}
            onStatsChange={onStatsChange}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && filteredPosts.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLoadMore}
          disabled={isLoading}
          className="w-full py-3 rounded-lg border-2 border-cyan-400 text-cyan-600 dark:text-cyan-400 font-semibold hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Đang tải...' : 'Tải thêm bài viết'}
        </motion.button>
      )}

      {/* Loading More Skeleton */}
      {isLoading && posts.length > 0 && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
