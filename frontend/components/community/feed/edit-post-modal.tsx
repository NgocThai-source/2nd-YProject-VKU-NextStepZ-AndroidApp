'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { updatePost, type Post } from '@/lib/community-api';

interface EditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
    onSuccess: (updatedPost: Post) => void;
}

export function EditPostModal({
    isOpen,
    onClose,
    post,
    onSuccess,
}: EditPostModalProps) {
    const [content, setContent] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [hashtagInput, setHashtagInput] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with post data when modal opens
    useEffect(() => {
        if (isOpen && post) {
            setContent(post.content || '');
            setHashtags(post.hashtags || []);
            setErrors([]);
        }
    }, [isOpen, post]);

    const handleAddHashtag = (tag: string) => {
        const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
        if (!hashtags.includes(cleanTag) && hashtags.length < 10) {
            setHashtags([...hashtags, cleanTag]);
            setHashtagInput('');
        }
    };

    const handleRemoveHashtag = (tag: string) => {
        setHashtags(hashtags.filter((t) => t !== tag));
    };

    const handleHashtagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && hashtagInput.trim()) {
            e.preventDefault();
            handleAddHashtag(hashtagInput.trim());
        }
    };

    const handleSubmit = async () => {
        if (!post) return;

        const newErrors: string[] = [];

        if (!content.trim()) {
            newErrors.push('Vui lòng nhập nội dung bài viết');
        }
        if (content.trim().length < 10) {
            newErrors.push('Bài viết phải có ít nhất 10 ký tự');
        }
        if (content.trim().length > 5000) {
            newErrors.push('Bài viết không được vượt quá 5000 ký tự');
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            const updatedPost = await updatePost(post.id, {
                content: content.trim(),
                hashtags,
            });
            onSuccess(updatedPost);
            handleClose();
        } catch (error) {
            console.error('Error updating post:', error);
            setErrors(['Đã xảy ra lỗi khi cập nhật bài viết. Vui lòng thử lại.']);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setContent('');
        setHashtags([]);
        setHashtagInput('');
        setErrors([]);
        onClose();
    };

    const charCount = content.length;
    const charLimit = 5000;

    return (
        <AnimatePresence>
            {isOpen && post && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
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
                                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                                    Chỉnh Sửa Bài Viết
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </motion.button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Error Messages */}
                                {errors.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 space-y-2"
                                    >
                                        {errors.map((error, idx) => (
                                            <div key={idx} className="flex items-start gap-2">
                                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                                <span className="text-sm text-red-300">{error}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Text Editor */}
                                <div>
                                    <label className="block text-sm font-semibold text-white mb-3" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                                        Nội Dung
                                    </label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => {
                                            setContent(e.target.value);
                                            if (errors.length > 0) setErrors([]);
                                        }}
                                        placeholder="Chia sẻ suy nghĩ, kinh nghiệm, câu hỏi của bạn..."
                                        className="w-full h-40 p-4 rounded-lg bg-white/5 border border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400/60 outline-none transition-all resize-none"
                                        style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                                    />
                                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                                        <span>{charCount} / {charLimit} ký tự</span>
                                        <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${charCount > charLimit * 0.9 ? 'bg-red-500' : 'bg-cyan-400'
                                                    }`}
                                                style={{ width: `${Math.min((charCount / charLimit) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Hashtags Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-white mb-3" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                                        Hashtags ({hashtags.length}/10)
                                    </label>
                                    <input
                                        type="text"
                                        value={hashtagInput}
                                        onChange={(e) => setHashtagInput(e.target.value)}
                                        onKeyPress={handleHashtagKeyPress}
                                        placeholder="Gõ hashtag và nhấn Enter..."
                                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400/60 outline-none transition-all"
                                        style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                                    />

                                    {/* Active Hashtags */}
                                    {hashtags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {hashtags.map((tag) => (
                                                <motion.div
                                                    key={tag}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 text-sm"
                                                >
                                                    <span>{tag}</span>
                                                    <button
                                                        onClick={() => handleRemoveHashtag(tag)}
                                                        className="hover:text-cyan-400 transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-cyan-400/10 flex gap-3 sticky bottom-0 bg-slate-800/95">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-300 font-semibold hover:bg-white/5 transition-all disabled:opacity-50"
                                    style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                                >
                                    Hủy
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    disabled={charCount === 0 || isSubmitting}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-cyan-400 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Lưu Thay Đổi
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
