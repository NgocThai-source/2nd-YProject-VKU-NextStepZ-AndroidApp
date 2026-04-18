'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Reply, ChevronDown, Send } from 'lucide-react';
import { Comment } from '@/lib/community-mock-data';
import { Avatar } from '../shared/avatar';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CommentReplyProps {
    reply: Comment;
    level: number;
    onLike?: (commentId: string) => void;
    onReply?: (commentId: string) => void;
    onAddReply?: (parentId: string, content: string) => Promise<void>;
    onUserClick?: (userId: string) => void;
    expandedParentIds?: Set<string>;
}

export function CommentReply({
    reply,
    level,
    onLike,
    onReply,
    onAddReply,
    onUserClick,
    expandedParentIds,
}: CommentReplyProps) {
    const [isLiked, setIsLiked] = useState(reply.isLiked || false);
    const [likeCount, setLikeCount] = useState(reply.likes);
    const [isReplyingTo, setIsReplyingTo] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    // Expand if this reply is in the expandedParentIds set (for newly replied comments)
    const [showReplies, setShowReplies] = useState(expandedParentIds?.has(reply.id) || false);
    const [replies, setReplies] = useState<Comment[]>(reply.replyList || []);

    // Sync replies with prop changes
    useEffect(() => {
        setReplies(reply.replyList || []);
    }, [reply.replyList]);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        onLike?.(reply.id);
    };

    const handleReplySubmit = async () => {
        if (replyContent.trim() && onAddReply) {
            await onAddReply(reply.id, replyContent.trim());
            setReplyContent('');
            setIsReplyingTo(false);
            setShowReplies(true);
        }
    };

    // Limit visual indentation to 4 levels, but allow unlimited logical nesting
    const maxVisualLevel = 4;
    const visualLevel = Math.min(level, maxVisualLevel);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex gap-2 ${visualLevel > 0 ? 'ml-4' : ''}`}
        >
            <Avatar
                src={reply.author.avatar}
                alt={reply.author.name}
                size="sm"
                verified={reply.author.verified}
                onClick={() => onUserClick?.(reply.author.id)}
            />

            <div className="flex-1 min-w-0 space-y-1">
                {/* Reply Bubble */}
                <motion.div
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                    className="rounded-2xl bg-white/10 px-3 py-1.5 border border-cyan-400/20 hover:border-cyan-400/40 transition-all"
                >
                    <p
                        className="font-semibold text-sm text-slate-100 cursor-pointer hover:text-cyan-300 transition-colors inline-block"
                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                        onClick={() => onUserClick?.(reply.author.id)}
                    >
                        {reply.author.name}
                        {reply.author.verified && (
                            <span className="ml-1 text-cyan-400 text-xs">✓</span>
                        )}
                    </p>
                    <p className="text-slate-200 text-sm leading-relaxed mt-1" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                        {reply.content}
                    </p>
                </motion.div>

                {/* Actions */}
                <div className="flex gap-3 text-xs text-slate-400 px-2">
                    <span className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(reply.timestamp), {
                            locale: vi,
                            addSuffix: true,
                        })}
                    </span>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLike}
                        className={`transition-all ${isLiked ? 'text-red-400' : 'hover:text-cyan-400'}`}
                    >
                        <Heart
                            className="w-3.5 h-3.5 inline mr-1"
                            fill={isLiked ? 'currentColor' : 'none'}
                        />
                        <span>{likeCount}</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsReplyingTo(!isReplyingTo)}
                        className="hover:text-cyan-400 transition-all"
                    >
                        <Reply className="w-3.5 h-3.5 inline mr-1" />
                        Trả lời
                    </motion.button>

                    {replies.length > 0 && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowReplies(!showReplies)}
                            className="text-cyan-400 transition-all flex items-center gap-1"
                        >
                            <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform ${showReplies ? 'rotate-180' : ''}`}
                            />
                            <span>{replies.length}</span>
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
                            className="flex gap-2 items-start mt-2"
                        >
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Trả lời..."
                                autoFocus
                                className="flex-1 px-3 py-1.5 rounded-full bg-white/10 border border-cyan-400/20 text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-xs transition-all"
                                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleReplySubmit();
                                    }
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleReplySubmit}
                                disabled={!replyContent.trim()}
                                className="px-3 py-1.5 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 text-white text-xs font-semibold disabled:opacity-50 transition-all"
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
                                className="px-3 py-1.5 rounded-full hover:bg-slate-700 text-slate-400 text-xs transition-all"
                            >
                                Hủy
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Nested Replies (Recursive) */}
                <AnimatePresence>
                    {showReplies && replies.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 space-y-2"
                        >
                            {replies.map((nestedReply) => (
                                <CommentReply
                                    key={nestedReply.id}
                                    reply={nestedReply}
                                    level={level + 1}
                                    onLike={onLike}
                                    onReply={onReply}
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
