'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Eye,
    Trash2,
    Edit2,
    Calendar,
    MessageSquare,
    FolderOpen,
    Plus,
    Heart,
    Share2,
    Loader2,
    ImageIcon,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getMyPosts, deletePost, type Post } from '@/lib/community-api';
import { useToast } from '@/components/ui/toast';
import { EditPostModal } from '@/components/community/feed';

// Helper function to get full image URL
const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
        return imagePath;
    }
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
    return `${backendUrl}${imagePath}`;
};

export default function ManagePostsPage() {
    const { user, isLoggedIn, isLoading: authLoading } = useAuth();
    const { addToast } = useToast();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    // Fetch user's posts
    useEffect(() => {
        if (isLoggedIn) {
            fetchPosts();
        }
    }, [isLoggedIn]);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getMyPosts(1, 100);
            setPosts(data.posts);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
            setError('Không thể tải danh sách bài viết. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setIsDeleting(true);
            await deletePost(id);
            setPosts((prev) => prev.filter((p) => p.id !== id));
            addToast('Đã xóa bài viết thành công!', 'success');
            setShowDeleteConfirm(null);
        } catch (err) {
            console.error('Failed to delete post:', err);
            addToast('Không thể xóa bài viết. Vui lòng thử lại.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        setIsEditModalOpen(true);
    };

    const handleEditSuccess = (updatedPost: Post) => {
        setPosts((prev) =>
            prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
        );
        setIsEditModalOpen(false);
        setEditingPost(null);
        addToast('Đã cập nhật bài viết thành công!', 'success');
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Truncate content
    const truncateContent = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength) + '...';
    };

    // Loading state
    if (authLoading) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    // Not logged in
    if (!isLoggedIn) {
        return (
            <div className="h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
                    className="w-full max-w-md space-y-8 text-center"
                >
                    <div className="flex justify-center">
                        <div className="w-20 h-20 flex items-center justify-center">
                            <Image
                                src="/images/logo-icon.png"
                                alt="NextStepZ Logo"
                                width={80}
                                height={80}
                                className="w-20 h-20"
                                priority={false}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}>
                            Quản Lý Bài Viết
                        </h1>
                        <p className="text-slate-400 text-lg" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                            Đăng nhập để quản lý các bài viết của bạn
                        </p>
                    </div>

                    <Link
                        href="/auth"
                        className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95 transform inline-flex items-center justify-center"
                        style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                    >
                        Đăng Nhập
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <main className="min-h-screen w-full overflow-x-hidden bg-slate-950">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
                    animate={{
                        x: [0, -50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 2,
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>

            {/* Header Section */}
            <div className="z-10 sticky top-0 backdrop-blur-md bg-slate-950/80 border-b border-cyan-400/10 py-6">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Back Link */}
                    <Link
                        href="/community"
                        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6 group"
                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Quay lại Cộng đồng
                    </Link>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-xl bg-linear-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-400/20">
                                <FolderOpen className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h1
                                    className="text-3xl md:text-4xl font-bold gradient-text-premium"
                                    style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
                                >
                                    Quản Lý Bài Viết
                                </h1>
                            </div>
                        </div>
                        <p className="text-gray-400 ml-14" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                            Xem và quản lý các bài viết đã đăng trên cộng đồng
                        </p>
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-wrap gap-4 ml-14"
                    >
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <MessageSquare className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm text-slate-300">
                                <span className="font-bold text-white">{posts.length}</span> bài viết
                            </span>
                        </div>
                        <Link
                            href="/community"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/50 transition-all group"
                        >
                            <Plus className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform" />
                            <span className="text-sm text-cyan-300 font-medium">Tạo bài viết mới</span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                        <p className="text-slate-400">Đang tải danh sách bài viết...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={fetchPosts}
                            className="px-6 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30 transition-all"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : posts.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center py-20"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="flex justify-center mb-6"
                        >
                            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
                                <MessageSquare className="w-12 h-12 text-cyan-400" />
                            </div>
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                            Chưa có bài viết nào
                        </h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                            Bạn chưa đăng bài viết nào. Hãy chia sẻ những suy nghĩ của bạn với cộng đồng!
                        </p>
                        <Link
                            href="/community"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105"
                            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                        >
                            <Plus className="w-5 h-5" />
                            Tạo Bài Viết Mới
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {/* Results Count */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-gray-400 mb-6"
                        >
                            Hiển thị <span className="text-cyan-300 font-bold">{posts.length}</span> bài viết
                        </motion.p>

                        {/* Posts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="group relative rounded-2xl overflow-hidden border border-cyan-400/20 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
                                >
                                    {/* Thumbnail Area */}
                                    <div className="relative h-40 sm:h-48 bg-linear-to-br from-cyan-500 to-blue-500 overflow-hidden">
                                        {/* Post Image or Placeholder */}
                                        {post.images && post.images.length > 0 ? (
                                            <Image
                                                src={getImageUrl(post.images[0])}
                                                alt="Post image"
                                                fill
                                                className="object-cover opacity-60"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <ImageIcon className="w-16 h-16 text-white/30" />
                                            </div>
                                        )}

                                        {/* Dark Overlay */}
                                        <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-all" />

                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30">
                                            <span className="text-xs text-cyan-300 font-medium">
                                                {post.category === 'question' ? 'Câu hỏi' : 'Bài viết'}
                                            </span>
                                        </div>

                                        {/* Stats Badge */}
                                        <div className="absolute top-3 right-3 flex items-center gap-2">
                                            <div className="px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm flex items-center gap-1">
                                                <Heart className="w-3 h-3 text-red-400" />
                                                <span className="text-xs text-white/80">{post.likesCount}</span>
                                            </div>
                                            <div className="px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm flex items-center gap-1">
                                                <MessageSquare className="w-3 h-3 text-cyan-400" />
                                                <span className="text-xs text-white/80">{post.commentsCount}</span>
                                            </div>
                                        </div>

                                        {/* Hover Overlay with View Button */}
                                        <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                            <Link
                                                href={`/shared-post/${post.id}`}
                                                className="px-6 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/40 transition-all transform hover:scale-105"
                                                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                                            >
                                                <Eye className="w-5 h-5" />
                                                Xem Chi Tiết
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-5">
                                        {/* Content Preview */}
                                        <p className="text-sm text-slate-300 mb-3 line-clamp-3" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                                            {truncateContent(post.content)}
                                        </p>

                                        {/* Hashtags */}
                                        {post.hashtags && post.hashtags.length > 0 && (
                                            <div className="flex gap-2 flex-wrap mb-4">
                                                {post.hashtags.slice(0, 3).map((tag, idx) => (
                                                    <span
                                                        key={`${post.id}-tag-${idx}`}
                                                        className="text-xs px-2.5 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                                {post.hashtags.length > 3 && (
                                                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700/50 text-gray-400">
                                                        +{post.hashtags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Metadata */}
                                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4 pt-3 border-t border-slate-700/50">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{formatDate(post.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                                                <span>{post.shareCount} chia sẻ</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleEdit(post)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all text-sm font-medium"
                                                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                                                title="Chỉnh sửa"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                <span>Sửa</span>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setShowDeleteConfirm(post.id)}
                                                className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all flex items-center gap-2 text-sm font-medium"
                                                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Xóa</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                            className="w-full max-w-sm bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 space-y-4">
                                <div className="flex justify-center">
                                    <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
                                        <Trash2 className="w-7 h-7 text-red-400" />
                                    </div>
                                </div>

                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                                        Xóa bài viết?
                                    </h2>
                                    <p className="text-sm text-slate-400" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                                        Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn.
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowDeleteConfirm(null)}
                                        disabled={isDeleting}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all font-medium disabled:opacity-50"
                                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={() => handleDelete(showDeleteConfirm)}
                                        disabled={isDeleting}
                                        className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Đang xóa...
                                            </>
                                        ) : (
                                            'Xóa'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Post Modal */}
            <EditPostModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingPost(null);
                }}
                post={editingPost}
                onSuccess={handleEditSuccess}
            />
        </main>
    );
}
