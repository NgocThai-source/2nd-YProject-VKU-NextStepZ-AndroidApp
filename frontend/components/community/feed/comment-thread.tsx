'use client';

import { motion } from 'framer-motion';
import { Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Comment } from '@/lib/community-mock-data';
import { Avatar } from '../shared/avatar';
import { formatTimeAgo } from '@/lib/community-utils';

interface CommentThreadProps {
  comments: Comment[];
  onReply?: (commentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
}

export function CommentThread({
  comments,
  onReply,
  onLike,
}: CommentThreadProps) {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const toggleExpand = (commentId: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const handleReplySubmit = (commentId: string) => {
    if (replyContent.trim()) {
      onReply?.(commentId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const handleLike = (commentId: string) => {
    setLikedComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
    onLike?.(commentId);
  };

  return (
    <div className="space-y-1">
      {comments.map((comment) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="group"
        >
          {/* Comment */}
          <div className="flex items-start gap-2 p-2">
            <Avatar src={comment.author.avatar} alt={comment.author.name} size="sm" />

            <div className="flex-1 min-w-0 space-y-1">
              {/* Comment Bubble */}
              <motion.div
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                className="rounded-2xl bg-white/10 px-4 py-2 border border-cyan-400/20 hover:border-cyan-400/40 transition-all"
              >
                <p className="font-semibold text-white text-sm" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  {comment.author.name}
                </p>

                <p className="text-sm text-gray-300 mt-1" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                  {comment.content}
                </p>
              </motion.div>

              {/* Comment Actions */}
              <div className="flex items-center gap-3 text-xs px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-gray-500">{formatTimeAgo(comment.timestamp)}</span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLike(comment.id)}
                  className={`transition-colors ${
                    likedComments.has(comment.id)
                      ? 'text-red-400'
                      : 'text-gray-400 hover:text-red-400'
                  }`}
                >
                  <Heart
                    className="w-3.5 h-3.5 inline mr-1"
                    fill={likedComments.has(comment.id) ? 'currentColor' : 'none'}
                  />
                  {comment.likes}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setReplyingTo(comment.id)}
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Trả lời
                </motion.button>

                {comment.replies > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => toggleExpand(comment.id)}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {expandedComments.has(comment.id) ? 'Ẩn' : `Xem ${comment.replies}`}
                  </motion.button>
                )}
              </div>

              {/* Reply Input */}
              {replyingTo === comment.id && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 items-start mt-2"
                >
                  <input
                    type="text"
                    placeholder="Trả lời..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-full bg-white/10 border border-cyan-400/20 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-400/40"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReplySubmit(comment.id)}
                    className="px-3 py-2 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 text-white text-xs font-semibold hover:shadow-lg transition-all"
                    style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                  >
                    Gửi
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-2 rounded-full bg-white/10 text-gray-300 text-xs hover:bg-white/20 transition-colors"
                  >
                    Hủy
                  </motion.button>
                </motion.div>
              )}

              {/* Expanded Replies */}
              {expandedComments.has(comment.id) && comment.replies > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-1 ml-2"
                >
                  {[...Array(Math.min(comment.replies, 2))].map((_, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-1">
                      <div className="w-6 h-6 rounded-full bg-gray-600" />
                      <div className="flex-1">
                        <div className="rounded-2xl bg-white/5 px-3 py-1 border border-cyan-400/10">
                          <p className="text-xs text-gray-400">Trả lời {idx + 1}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
