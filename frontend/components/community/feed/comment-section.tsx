'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Comment as MockComment, CommunityUser } from '@/lib/community-mock-data';
import { Avatar } from '../shared/avatar';
import { CommentCard } from './comment-card';
import * as communityApi from '@/lib/community-api';
import { useProfile } from '@/lib/profile-context';
import { useAuth } from '@/lib/auth-context';

interface CommentSectionProps {
  postId: string;
  comments?: MockComment[];
  totalComments: number;
  onAddComment?: (content: string) => void;
  onReplyComment?: (commentId: string, content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onCommentCountChange?: (count: number) => void;
  onUserClick?: (userId: string) => void;
  onStatsChange?: () => void;
}

// Transform API comment to mock format
function transformApiComment(apiComment: communityApi.Comment): MockComment {
  return {
    id: apiComment.id,
    author: {
      id: apiComment.author.id,
      name: apiComment.author.name,
      avatar: apiComment.author.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
      role: apiComment.author.role as 'user' | 'employer',
      followers: 0,
      following: 0,
    },
    content: apiComment.content,
    timestamp: apiComment.createdAt,
    likes: apiComment.likesCount,
    replies: apiComment.repliesCount,
    isLiked: apiComment.isLiked,
    replyList: apiComment.replies?.map(transformApiComment) || [],
  };
}

export function CommentSection({
  postId,
  comments: initialComments,
  totalComments: initialTotalComments,
  onAddComment,
  onReplyComment,
  onLikeComment,
  onCommentCountChange,
  onUserClick,
  onStatsChange,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<MockComment[]>(initialComments || []);
  const [totalComments, setTotalComments] = useState(initialTotalComments);
  const [isLoading, setIsLoading] = useState(!initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track parent IDs of comments that should be auto-expanded (after posting a reply)
  const [expandedParentIds, setExpandedParentIds] = useState<Set<string>>(new Set());

  // Get current user from ProfileContext (real-time sync)
  const { userProfile } = useProfile();
  const { user } = useAuth();
  const isAuthenticated = communityApi.isAuthenticated();

  // Derive currentUser from ProfileContext for real-time avatar sync
  const currentUser: CommunityUser | null = userProfile ? {
    id: userProfile.id || user?.id || 'current-user',
    name: userProfile.name || user?.username || 'User',
    avatar: userProfile.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=current-user',
    role: (user?.role || 'user') as 'user' | 'employer',
    followers: 0,
    following: 0,
  } : null;

  // Use ref to avoid infinite re-renders from inline callback prop
  const onCommentCountChangeRef = useRef(onCommentCountChange);
  useEffect(() => {
    onCommentCountChangeRef.current = onCommentCountChange;
  }, [onCommentCountChange]);

  // Load comments from API
  const loadComments = useCallback(async () => {
    if (!postId) return;

    try {
      setIsLoading(true);
      setError(null);
      const apiComments = await communityApi.getComments(postId);
      const transformedComments = apiComments.map(transformApiComment);
      setComments(transformedComments);

      // Calculate total with replies
      let total = 0;
      const countReplies = (cmts: MockComment[]) => {
        cmts.forEach(c => {
          total++;
          if (c.replyList && c.replyList.length > 0) {
            countReplies(c.replyList);
          }
        });
      };
      countReplies(transformedComments);
      setTotalComments(total);
      // Note: onCommentCountChange is called separately after loadComments completes
      // to avoid infinite re-renders from callback dependency changes
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('Không thể tải bình luận');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // Load comments on mount if not provided
  useEffect(() => {
    if (!initialComments && postId) {
      loadComments();
    }
  }, [initialComments, postId, loadComments]);

  // Notify parent of comment count changes (separate from loadComments to avoid infinite loops)
  useEffect(() => {
    onCommentCountChangeRef.current?.(totalComments);
  }, [totalComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    if (!isAuthenticated) {
      setError('Vui lòng đăng nhập để sử dụng chức năng này');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const apiComment = await communityApi.addComment(postId, newComment.trim());
      const transformedComment = transformApiComment(apiComment);

      // Add to comments list
      setComments(prev => [transformedComment, ...prev]);
      setTotalComments(prev => prev + 1);
      onCommentCountChange?.(totalComments + 1);

      // Call callback
      onAddComment?.(newComment);

      // Trigger leaderboard refresh
      onStatsChange?.();

      // Reset
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Không thể thêm bình luận. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyComment = async (parentId: string, content: string) => {
    if (!isAuthenticated) {
      setError('Vui lòng đăng nhập để sử dụng chức năng này');
      return;
    }

    try {
      // Create the reply via API
      await communityApi.addComment(postId, content, parentId);

      // Track this parent as one that should be expanded (to show the new reply)
      setExpandedParentIds(prev => new Set([...prev, parentId]));

      // Re-fetch all comments to ensure state is synced with backend
      // This ensures nested replies (reply-to-reply) are properly positioned in the tree
      await loadComments();

      onReplyComment?.(parentId, content);

      // Trigger leaderboard refresh
      onStatsChange?.();
    } catch (err) {
      console.error('Error adding reply:', err);
      setError('Không thể thêm phản hồi. Vui lòng thử lại.');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!isAuthenticated) {
      setError('Vui lòng đăng nhập để sử dụng chức năng này');
      return;
    }

    try {
      const result = await communityApi.toggleCommentLike(commentId);

      // Update comment in tree
      const updateLike = (cmts: MockComment[]): MockComment[] => {
        return cmts.map(c => {
          if (c.id === commentId) {
            return {
              ...c,
              isLiked: result.isLiked,
              likes: result.isLiked ? c.likes + 1 : c.likes - 1,
            };
          }
          if (c.replyList && c.replyList.length > 0) {
            return {
              ...c,
              replyList: updateLike(c.replyList),
            };
          }
          return c;
        });
      };

      setComments(prev => updateLike(prev));
      onLikeComment?.(commentId);

      // Trigger leaderboard refresh
      onStatsChange?.();
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-2 text-red-400 text-sm bg-red-500/10 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {/* Comment Input Box - Facebook Style */}
      <div className="flex items-start gap-2">
        <Avatar src={currentUser?.avatar || ''} alt={currentUser?.name || ''} size="sm" />
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isAuthenticated ? "Viết bình luận..." : "Đăng nhập để bình luận..."}
            disabled={!isAuthenticated || isSubmitting}
            className="w-full p-2.5 rounded-2xl bg-white/10 border border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400/60 outline-none transition-all resize-none text-sm disabled:opacity-50"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            rows={1}
          />
          <div className="flex items-center justify-end gap-2 mt-1.5">
            <span className="text-xs text-gray-500">{newComment.length}/500</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddComment}
              disabled={newComment.trim().length === 0 || !isAuthenticated || isSubmitting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 text-white text-xs font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
      )}

      {/* Comments List - Facebook Style */}
      {!isLoading && comments.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-2"
              >
                <CommentCard
                  comment={comment}
                  onLike={handleLikeComment}
                  onReply={() => { }}
                  onAddReply={handleReplyComment}
                  totalComments={totalComments}
                  onTotalCommentsChange={setTotalComments}
                  onUserClick={onUserClick}
                  expandedParentIds={expandedParentIds}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* No Comments */}
      {!isLoading && comments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6"
        >
          <MessageCircle className="w-8 h-8 text-gray-500 mx-auto mb-2 opacity-50" />
          <p className="text-sm text-gray-500">Chưa có bình luận nào</p>
        </motion.div>
      )}
    </motion.div>
  );
}
