'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Post, Comment } from '@/lib/community-mock-data';
import { Avatar } from '../shared/avatar';
import { CommentCard } from './comment-card';
import { mockUsers } from '@/lib/community-mock-data';
import { formatTimeAgo, calculateTotalComments } from '@/lib/community-utils';
import { PillTag } from '../shared/pill-tag';

interface PostCommentModalProps {
  isOpen: boolean;
  post: Post;
  comments: Comment[];
  onClose: () => void;
  onAddComment?: (content: string) => void;
  onReplyComment?: (commentId: string, content: string) => void;
  onLikeComment?: (commentId: string) => void;
}

const categoryLabels: Record<string, string> = {
  'job-search': '💼 Tìm Việc',
  experience: '📝 Kinh Nghiệm',
  discussion: '💬 Thảo Luận',
  question: '❓ Câu Hỏi',
  offer: '✨ Chia Sẻ',
  opportunity: '🎯 Cơ Hội',
};

export function PostCommentModal({
  isOpen,
  post,
  comments: initialComments,
  onClose,
  onAddComment,
  onReplyComment,
  onLikeComment,
}: PostCommentModalProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [totalComments, setTotalComments] = useState(calculateTotalComments(initialComments));

  const currentUser = mockUsers[0];

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Create new comment
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

      // Add to comments
      setComments([newCommentObj, ...comments]);
      // Update total with new comment count
      setTotalComments(calculateTotalComments([newCommentObj, ...comments]));

      // Call callback
      onAddComment?.(newComment);

      // Reset
      setNewComment('');
    }
  };

  const handleLikeComment = (commentId: string) => {
    onLikeComment?.(commentId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20"
          >
            <div className="bg-slate-800 border border-cyan-400/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden backdrop-blur-sm flex flex-col relative z-0">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyan-400/10 sticky top-0 bg-slate-800/95">
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                  Bình Luận
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto space-y-6 p-6">
                {/* Original Post Preview */}
                <div className="p-4 rounded-lg bg-white/5 border border-cyan-400/20">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar src={post.author.avatar} alt={post.author.name} size="md" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                        {post.author.name}
                      </h3>
                      <p className="text-sm text-gray-500">{formatTimeAgo(post.timestamp)}</p>
                    </div>
                  </div>

                  <PillTag label={categoryLabels[post.category] || post.category} variant="primary" />

                  <p className="text-gray-200 text-sm mt-3 leading-relaxed" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                    {post.content.slice(0, 150)}...
                  </p>
                </div>

                {/* Comment Input */}
                <div className="p-4 rounded-lg bg-white/5 border border-cyan-400/20">
                  <div className="flex items-start gap-3">
                    <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" />
                    <div className="flex-1 space-y-2">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Chia sẻ suy nghĩ của bạn..."
                        className="w-full p-3 rounded-lg bg-white/5 border border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400/60 outline-none transition-all resize-none text-sm"
                        style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                        rows={3}
                      />
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-gray-500">{newComment.length}/500</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddComment}
                          disabled={newComment.trim().length === 0}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-cyan-400 to-blue-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                        >
                          <Send className="w-4 h-4" />
                          Bình Luận
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                {comments.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                      Tất cả bình luận ({totalComments})
                    </h3>

                    {comments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
                      >
                        <CommentCard
                          comment={comment}
                          onLike={handleLikeComment}
                          onReply={() => {}}
                          onAddReply={(parentId, content) => {
                            onReplyComment?.(parentId, content);
                          }}
                          totalComments={totalComments}
                          onTotalCommentsChange={setTotalComments}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <MessageCircle className="w-8 h-8 text-gray-500 mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-gray-500">Chưa có bình luận nào</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
