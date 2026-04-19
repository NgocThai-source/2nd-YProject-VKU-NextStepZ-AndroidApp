'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Reply, ChevronDown, Send } from 'lucide-react';
import { Comment } from '@/lib/community-mock-data';
import { Avatar } from '../shared/avatar';
import { CommentReply } from './comment-reply';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { calculateTotalComments } from '@/lib/community-utils';

interface CommentCardProps {
  comment: Comment;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  onAddReply?: (parentId: string, content: string) => Promise<void>;
  onUserClick?: (userId: string) => void;
  totalComments?: number;
  onTotalCommentsChange?: (count: number) => void;
  expandedParentIds?: Set<string>;
}

export function CommentCard({
  comment,
  onLike,
  onReply,
  onAddReply,
  onUserClick,
  totalComments = 0,
  onTotalCommentsChange,
  expandedParentIds,
}: CommentCardProps) {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [isReplyingTo, setIsReplyingTo] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  // Expand if this comment is in the expandedParentIds set (for newly replied comments)
  const [showReplies, setShowReplies] = useState(expandedParentIds?.has(comment.id) || false);
  const [replies, setReplies] = useState<Comment[]>(comment.replyList || []);
  const [replyCount, setReplyCount] = useState(comment.replies);

  // Sync replies with prop changes (when parent updates after API call)
  useEffect(() => {
    setReplies(comment.replyList || []);
    setReplyCount(comment.replies);
  }, [comment.replyList, comment.replies]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike?.(comment.id);
  };

  const handleReplySubmit = async () => {
    if (replyContent.trim()) {
      // Call parent to handle API call
      await onAddReply?.(comment.id, replyContent.trim());

      // Reset input and show replies
      setReplyContent('');
      setIsReplyingTo(false);
      setShowReplies(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex gap-2 group"
    >
      <Avatar
        src={comment.author.avatar}
        alt={comment.author.name}
        size="sm"
        verified={comment.author.verified}
        onClick={() => onUserClick?.(comment.author.id)}
      />

      <div className="flex-1 min-w-0 space-y-1">
        {/* Comment Bubble */}
        <motion.div
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          className="rounded-2xl bg-white/10 px-2 sm:px-4 py-1.5 sm:py-2 border border-cyan-400/20 hover:border-cyan-400/40 transition-all"
        >
          <p
            className="font-semibold text-sm sm:text-sm text-slate-100 cursor-pointer hover:text-cyan-300 transition-colors inline-block"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            onClick={() => onUserClick?.(comment.author.id)}
          >
            {comment.author.name}
            {comment.author.verified && (
              <span className="ml-1 text-cyan-400 text-xs">✓</span>
            )}
          </p>
          <p className="text-slate-200 text-sm sm:text-sm leading-relaxed mt-1" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
            {comment.content}
          </p>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-2 sm:gap-4 text-xs text-slate-400 px-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-wrap">
          <span className="text-xs text-slate-500 hidden sm:inline">
            {formatDistanceToNow(new Date(comment.timestamp), {
              locale: vi,
              addSuffix: true,
            })}
          </span>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`transition-all ${isLiked
              ? 'text-red-400'
              : 'hover:text-cyan-400'
              }`}
          >
            <Heart
              className="w-3.5 h-3.5 inline mr-1"
              fill={isLiked ? 'currentColor' : 'none'}
            />
            <span className="hidden sm:inline">{likeCount}</span>
          </motion.button>

          {!isReplyingTo && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsReplyingTo(true)}
              className="hover:text-cyan-400 transition-all"
            >
              <span className="sm:hidden">Trả lời</span>
              <span className="hidden sm:flex sm:items-center sm:gap-1">
                <Reply className="w-3.5 h-3.5" />
                Trả lời
              </span>
            </motion.button>
          )}

          {replyCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReplies(!showReplies)}
              className="text-cyan-400 transition-all flex items-center gap-1"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showReplies ? 'rotate-180' : ''
                  }`}
              />
              <span>{calculateTotalComments(replies)}</span>
            </motion.button>
          )}
        </div>

        {/* Reply Input */}
        <AnimatePresence>
          {isReplyingTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-1 sm:gap-2 items-start flex-wrap sm:flex-nowrap"
            >
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Trả lời..."
                autoFocus
                className="flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-white/10 border border-cyan-400/20 text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-xs sm:text-sm transition-all"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReplySubmit}
                disabled={!replyContent.trim()}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                <Send className="w-3 h-3" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsReplyingTo(false);
                  setReplyContent('');
                }}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-slate-700 text-slate-400 text-xs transition-all shrink-0"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Hủy
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nested Replies */}
        <AnimatePresence>
          {showReplies && replies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-1 ml-2"
            >
              {replies.map((reply) => (
                <CommentReply
                  key={reply.id}
                  reply={reply}
                  level={1}
                  onLike={onLike}
                  onReply={() => { }}
                  onAddReply={onAddReply}
                  onUserClick={onUserClick}
                  expandedParentIds={expandedParentIds}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
