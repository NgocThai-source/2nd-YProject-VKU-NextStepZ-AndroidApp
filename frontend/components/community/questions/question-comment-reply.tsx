'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronDown, Send, Reply } from 'lucide-react';
import { Comment, mockUsers } from '@/lib/community-mock-data';
import { Avatar } from '../shared/avatar';
import { useState } from 'react';
import { formatTimeAgo } from '@/lib/community-utils';
import { calculateTotalComments } from '@/lib/community-utils';

interface QuestionCommentReplyProps {
  reply: Comment;
  level?: number;
  onLike?: (replyId: string) => void;
  onAddReply?: (parentId: string, content: string) => void;
  onExpandReplies?: (replyId: string) => void;
  expandedReplies?: Set<string>;
}

export function QuestionCommentReply({
  reply,
  level = 1,
  onLike,
  onAddReply,
  onExpandReplies,
  expandedReplies = new Set(),
}: QuestionCommentReplyProps) {
  const [isLiked, setIsLiked] = useState(reply.isLiked || false);
  const [likeCount, setLikeCount] = useState(reply.likes);
  const [isReplyingLocally, setIsReplyingLocally] = useState(false);
  const [localReplyContent, setLocalReplyContent] = useState('');
  const [replies, setReplies] = useState<Comment[]>(reply.replyList || []);

  const currentUser = mockUsers[0];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike?.(reply.id);
  };

  const handleReplySubmit = () => {
    if (localReplyContent.trim()) {
      const newReply: Comment = {
        id: `${reply.id}-reply-${Date.now()}`,
        author: currentUser,
        content: localReplyContent,
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: 0,
        isLiked: false,
        replyList: [],
      };

      const updatedReplies = [...replies, newReply];
      setReplies(updatedReplies);
      onAddReply?.(reply.id, localReplyContent);
      setLocalReplyContent('');
      setIsReplyingLocally(false);
      
      // Auto expand replies
      onExpandReplies?.(reply.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-2 group"
    >
      <Avatar src={reply.author.avatar} alt={reply.author.name} size="sm" />

      <div className="flex-1 min-w-0 space-y-1">
        {/* Comment Bubble */}
        <motion.div
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          className="rounded-2xl bg-white/5 px-2 sm:px-3 py-1.5 sm:py-2 border border-white/10 hover:border-cyan-400/20 transition-all max-w-xs sm:max-w-sm"
        >
          <p className="font-semibold text-xs text-slate-100" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            {reply.author.name}
          </p>
          <p className="text-slate-100 text-xs leading-relaxed mt-0.5" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
            {reply.content}
          </p>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-2 sm:gap-3 text-xs text-slate-400 px-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-wrap">
          <span className="text-xs text-slate-500 hidden sm:inline">{formatTimeAgo(reply.timestamp)}</span>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`transition-all ${isLiked ? 'text-red-400' : 'hover:text-cyan-400'}`}
          >
            <Heart className="w-3 h-3 inline mr-1" fill={isLiked ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">{likeCount}</span>
          </motion.button>

          {!isReplyingLocally && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsReplyingLocally(true)}
              className="hover:text-cyan-400 transition-all"
            >
              <span className="sm:hidden">Trả lời</span>
              <span className="hidden sm:flex sm:items-center sm:gap-0.5">
                <Reply className="w-3 h-3" />
                Trả lời
              </span>
            </motion.button>
          )}

          {/* Show nested replies */}
          {replies && replies.length > 0 && !isReplyingLocally && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onExpandReplies?.(reply.id)}
              className="text-cyan-400 transition-all flex items-center gap-0.5"
            >
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  expandedReplies.has(reply.id) ? 'rotate-180' : ''
                }`}
              />
              <span>{calculateTotalComments(replies)}</span>
            </motion.button>
          )}
        </div>

        {/* Reply Input */}
        <AnimatePresence>
          {isReplyingLocally && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-1 sm:gap-2 items-start flex-wrap sm:flex-nowrap"
            >
              <input
                type="text"
                value={localReplyContent}
                onChange={(e) => setLocalReplyContent(e.target.value)}
                placeholder="Trả lời..."
                autoFocus
                className="flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-white/10 border border-cyan-400/20 text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-xs transition-all"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReplySubmit}
                disabled={!localReplyContent.trim()}
                className="px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                <Send className="w-2.5 h-2.5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsReplyingLocally(false);
                  setLocalReplyContent('');
                }}
                className="px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-full hover:bg-slate-700 text-slate-400 text-xs transition-all shrink-0"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Hủy
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nested Replies */}
        <AnimatePresence>
          {expandedReplies.has(reply.id) && replies && replies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-2 ml-2"
            >
              {replies.map((nestedReply) => (
                <QuestionCommentReply
                  key={nestedReply.id}
                  reply={nestedReply}
                  level={level + 1}
                  onLike={onLike}
                  onAddReply={onAddReply}
                  onExpandReplies={onExpandReplies}
                  expandedReplies={expandedReplies}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
