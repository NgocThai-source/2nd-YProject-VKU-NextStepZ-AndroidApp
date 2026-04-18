'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Heart } from 'lucide-react';
import { useState } from 'react';
import { Question, mockUsers, mockComments } from '@/lib/community-mock-data';
import { Avatar } from '../shared/avatar';
import { formatTimeAgo } from '@/lib/community-utils';

interface QuestionCommentModalProps {
  isOpen: boolean;
  question: Question | null;
  onClose: () => void;
  onAddComment?: (text: string) => void;
  onLikeComment?: (commentId: string) => void;
}

export function QuestionCommentModal({
  isOpen,
  question,
  onClose,
  onAddComment,
  onLikeComment,
}: QuestionCommentModalProps) {
  const [commentText, setCommentText] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const currentUser = mockUsers[0];

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment?.(commentText);
      setCommentText('');
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

  if (!question) return null;

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
            <div className="bg-slate-800 border border-cyan-400/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden backdrop-blur-sm flex flex-col">
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
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Question Summary */}
                <div className="p-4 rounded-lg bg-white/5 border border-cyan-400/10">
                  <h3 className="font-semibold text-white mb-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                    {question.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{question.content}</p>
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-300" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                    {mockComments.length} Bình Luận
                  </h3>

                  {mockComments.slice(0, 5).map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar src={comment.author.avatar} alt={comment.author.name} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white text-sm" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                              {comment.author.name}
                            </p>
                            <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                        </div>
                      </div>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            likedComments.has(comment.id)
                              ? 'text-red-400'
                              : 'text-gray-400 hover:text-red-400'
                          }`}
                        >
                          <Heart className="w-4 h-4" fill={likedComments.has(comment.id) ? 'currentColor' : 'none'} />
                          <span>{comment.likes || 0}</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <div className="border-t border-cyan-400/10 p-6 bg-slate-800/95">
                <div className="flex items-start gap-3">
                  <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" />
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Viết bình luận của bạn..."
                        rows={3}
                        maxLength={1000}
                        className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400 outline-none transition-all resize-none"
                        style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-500">{commentText.length}/1000</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                      >
                        <Send className="w-4 h-4" />
                        Gửi
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
