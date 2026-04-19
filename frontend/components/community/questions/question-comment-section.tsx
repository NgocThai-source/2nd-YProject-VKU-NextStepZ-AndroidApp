'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Heart, ChevronDown, Reply } from 'lucide-react';
import { useState } from 'react';
import { Comment, mockUsers } from '@/lib/community-mock-data';
import { Avatar } from '../shared/avatar';
import { formatTimeAgo } from '@/lib/community-utils';
import { calculateTotalComments } from '@/lib/community-utils';
import { QuestionCommentReply } from './question-comment-reply';

interface QuestionCommentSectionProps {
  comments?: Comment[];
  onAddComment?: (content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyComment?: (commentId: string, content: string) => void;
}

export function QuestionCommentSection({
  comments: initialComments = [],
  onAddComment,
  onLikeComment,
  onReplyComment,
}: QuestionCommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const currentUser = mockUsers[0];

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: `comment-${Date.now()}`,
        author: currentUser,
        content: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: 0,
        isLiked: false,
        replyList: [],
      };

      setComments([newCommentObj, ...comments]);
      onAddComment?.(newComment);
      setNewComment('');
    }
  };

  const handleLikeComment = (commentId: string) => {
    const newLiked = new Set(likedComments);
    if (newLiked.has(commentId)) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
    }
    setLikedComments(newLiked);
    onLikeComment?.(commentId);
  };

  const handleAddReply = (parentCommentId: string) => {
    if (replyContent.trim()) {
      const newReply: Comment = {
        id: `${parentCommentId}-reply-${Date.now()}`,
        author: currentUser,
        content: replyContent,
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: 0,
        isLiked: false,
        replyList: [],
      };

      const updatedComments = comments.map((comment) => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replyList: [...(comment.replyList || []), newReply],
            replies: (comment.replies || 0) + 1,
          };
        }
        return comment;
      });

      setComments(updatedComments);
      onReplyComment?.(parentCommentId, replyContent);
      setReplyContent('');
      setReplyingToId(null);

      const newExpanded = new Set(expandedReplies);
      newExpanded.add(parentCommentId);
      setExpandedReplies(newExpanded);
    }
  };

  const handleAddNestedReply = (parentCommentId: string, nestedContent: string) => {
    const newReply: Comment = {
      id: `${parentCommentId}-reply-${Date.now()}`,
      author: currentUser,
      content: nestedContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: 0,
      isLiked: false,
      replyList: [],
    };

    const updateCommentsRecursively = (cmts: Comment[]): Comment[] => {
      return cmts.map((comment) => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replyList: [...(comment.replyList || []), newReply],
            replies: (comment.replies || 0) + 1,
          };
        }
        if (comment.replyList && comment.replyList.length > 0) {
          return {
            ...comment,
            replyList: updateCommentsRecursively(comment.replyList),
          };
        }
        return comment;
      });
    };

    const updatedComments = updateCommentsRecursively(comments);
    setComments(updatedComments);
    onReplyComment?.(parentCommentId, nestedContent);

    const newExpanded = new Set(expandedReplies);
    newExpanded.add(parentCommentId);
    setExpandedReplies(newExpanded);
  };

  const toggleExpandReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Comment Input Box */}
      <div className="flex items-start gap-2">
        <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" />
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận..."
            maxLength={500}
            className="w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-2xl bg-white/10 border border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400/60 outline-none transition-all resize-none text-xs sm:text-sm"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            rows={2}
          />
          <div className="flex items-center justify-end gap-1 sm:gap-2 mt-1.5">
            <span className="text-xs text-gray-500">{newComment.length}/500</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddComment}
              disabled={newComment.trim().length === 0}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-1.5 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 text-white text-xs font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              <Send className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 group"
            >
              <Avatar src={comment.author.avatar} alt={comment.author.name} size="sm" />
              <div className="flex-1 min-w-0 space-y-1">
                {/* Comment Bubble */}
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                  className="rounded-2xl bg-white/5 px-2 sm:px-4 py-1.5 sm:py-2 border border-white/10 hover:border-cyan-400/20 transition-all"
                >
                  <p className="font-semibold text-xs sm:text-sm text-slate-100" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                    {comment.author.name}
                  </p>
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mt-0.5 sm:mt-1" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                    {comment.content}
                  </p>
                </motion.div>

                {/* Comment Actions */}
                <div className="flex gap-2 sm:gap-4 text-xs text-slate-400 px-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-wrap">
                  <span className="text-xs text-slate-500 hidden sm:inline">{formatTimeAgo(comment.timestamp)}</span>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLikeComment(comment.id)}
                    className={`transition-all ${
                      likedComments.has(comment.id) ? 'text-red-400' : 'hover:text-cyan-400'
                    }`}
                  >
                    <Heart
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1"
                      fill={likedComments.has(comment.id) ? 'currentColor' : 'none'}
                    />
                    <span className="hidden sm:inline">{comment.likes}</span>
                  </motion.button>

                  {replyingToId !== comment.id && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setReplyingToId(comment.id)}
                      className="hover:text-cyan-400 transition-all"
                    >
                      <span className="sm:hidden">Trả lời</span>
                      <span className="hidden sm:flex sm:items-center sm:gap-0.5">
                        <Reply className="w-3 h-3" />
                        Trả lời
                      </span>
                    </motion.button>
                  )}

                  {(comment.replyList?.length || 0) > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleExpandReplies(comment.id)}
                      className="text-cyan-400 transition-all flex items-center gap-0.5 sm:gap-1"
                    >
                      <ChevronDown
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform ${
                          expandedReplies.has(comment.id) ? 'rotate-180' : ''
                        }`}
                      />
                      <span>{calculateTotalComments(comment.replyList || [])}</span>
                    </motion.button>
                  )}
                </div>

                {/* Reply Input */}
                <AnimatePresence>
                  {replyingToId === comment.id && (
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
                        onClick={() => handleAddReply(comment.id)}
                        disabled={!replyContent.trim()}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                      >
                        <Send className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setReplyingToId(null);
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
                  {expandedReplies.has(comment.id) && (comment.replyList?.length || 0) > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-y-2 ml-2"
                    >
                      {comment.replyList?.map((reply) => (
                        <QuestionCommentReply
                          key={reply.id}
                          reply={reply}
                          level={1}
                          onLike={handleLikeComment}
                          onAddReply={handleAddNestedReply}
                          onExpandReplies={toggleExpandReplies}
                          expandedReplies={expandedReplies}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Comments */}
      {comments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4"
        >
          <MessageCircle className="w-8 h-8 text-gray-500 mx-auto mb-2 opacity-50" />
          <p className="text-sm text-gray-500">Chưa có bình luận nào</p>
        </motion.div>
      )}
    </motion.div>
  );
}
