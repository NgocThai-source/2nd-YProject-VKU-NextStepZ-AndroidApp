'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    Eye,
    EyeOff,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    FileText,
    MessageSquare,
    Trash2,
    ExternalLink,
    Calendar,
    ThumbsUp,
    MessageCircle,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Post {
    id: string;
    content: string;
    title?: string;
    category: string;
    isHidden: boolean;
    isQuestion: boolean;
    commentsCount: number;
    likesCount: number;
    viewCount: number;
    user: {
        id: string;
        username: string;
        name: string;
        avatar?: string;
    };
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState(''); // 'post' | 'question' | ''
    const [hiddenFilter, setHiddenFilter] = useState(''); // 'true' | 'false' | ''
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, [pagination.page, typeFilter, hiddenFilter]);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (search) params.append('search', search);
            if (typeFilter) params.append('type', typeFilter);
            if (hiddenFilter) params.append('hidden', hiddenFilter);

            const response = await fetch(`${API_BASE}/api/admin/posts?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            setPosts(data.posts);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchPosts();
    };

    const handleViewPost = (post: Post) => {
        if (post.isQuestion) {
            window.open(`/community?tab=questions&questionId=${post.id}`, '_blank');
        } else {
            window.open(`/shared-post/${post.id}`, '_blank');
        }
    };

    const handleHidePost = async (postId: string, hide: boolean) => {
        setActionLoading(postId);
        try {
            const token = localStorage.getItem('adminToken');
            const reason = hide ? window.prompt('Lý do ẩn bài viết:') : undefined;
            if (hide && reason === null) {
                setActionLoading(null);
                return;
            }

            const response = await fetch(`${API_BASE}/api/admin/posts/${postId}/hide`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hidden: hide, reason }),
            });

            if (response.ok) {
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, isHidden: hide } : p));
            }
        } catch (err) {
            console.error('Error hiding post:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.')) {
            return;
        }

        setActionLoading(postId);
        try {
            const token = localStorage.getItem('adminToken');
            const reason = window.prompt('Lý do xóa bài viết:');

            const response = await fetch(`${API_BASE}/api/admin/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason }),
            });

            if (response.ok) {
                setPosts(prev => prev.filter(p => p.id !== postId));
            }
        } catch (err) {
            console.error('Error deleting post:', err);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-7 h-7 text-purple-400" />
                        Quản lý Bài viết và Câu hỏi
                    </h1>
                    <p className="text-gray-400">Tổng cộng {pagination.total} bài viết và câu hỏi</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo nội dung, tiêu đề..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </form>
                <div className="flex gap-2">
                    <select
                        value={typeFilter}
                        onChange={(e) => {
                            setTypeFilter(e.target.value);
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                        <option value="">Tất cả loại</option>
                        <option value="post">Bài viết</option>
                        <option value="question">Câu hỏi</option>
                    </select>
                    <select
                        value={hiddenFilter}
                        onChange={(e) => {
                            setHiddenFilter(e.target.value);
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="false">Đang hiển thị</option>
                        <option value="true">Đã ẩn</option>
                    </select>
                </div>
            </div>

            {/* Posts List */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <AlertCircle className="w-12 h-12 mb-4" />
                        <p>Không tìm thấy bài viết nào</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className={`p-4 hover:bg-gray-700/30 ${post.isHidden ? 'bg-red-500/10' : ''}`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Author Avatar */}
                                    <img
                                        src={post.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.id}`}
                                        alt={post.user.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-white">{post.user.name}</span>
                                            <span className="text-gray-500">@{post.user.username}</span>
                                            {post.isQuestion ? (
                                                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full flex items-center gap-1">
                                                    <MessageSquare className="w-3 h-3" />
                                                    Câu hỏi
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full flex items-center gap-1">
                                                    <FileText className="w-3 h-3" />
                                                    Bài viết
                                                </span>
                                            )}
                                            {post.isHidden && (
                                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                                                    Đã ẩn
                                                </span>
                                            )}
                                        </div>

                                        {post.title && (
                                            <h3 className="text-white font-medium mb-1">{post.title}</h3>
                                        )}

                                        <p className="text-gray-300 text-sm line-clamp-2 mb-2">{post.content}</p>

                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <ThumbsUp className="w-3 h-3" />
                                                {post.likesCount}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageCircle className="w-3 h-3" />
                                                {post.commentsCount}
                                            </span>
                                            {post.isQuestion && (
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {post.viewCount}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleViewPost(post)}
                                            className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors"
                                            title="Xem bài viết"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleHidePost(post.id, !post.isHidden)}
                                            disabled={actionLoading === post.id}
                                            className={`p-2 rounded-lg transition-colors ${post.isHidden ? 'text-green-400 hover:bg-green-500/20' : 'text-yellow-400 hover:bg-yellow-500/20'}`}
                                            title={post.isHidden ? 'Hiện bài viết' : 'Ẩn bài viết'}
                                        >
                                            {actionLoading === post.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : post.isHidden ? (
                                                <Eye className="w-4 h-4" />
                                            ) : (
                                                <EyeOff className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            disabled={actionLoading === post.id}
                                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                            title="Xóa bài viết"
                                        >
                                            {actionLoading === post.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
                        <p className="text-sm text-gray-400">
                            Trang {pagination.page} / {pagination.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === pagination.totalPages}
                                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
