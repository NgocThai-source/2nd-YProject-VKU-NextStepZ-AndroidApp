'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    UserX,
    UserCheck,
    Eye,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    GraduationCap,
    FileText,
    MessageSquare,
    EyeOff,
    Trash2,
    ExternalLink,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface User {
    id: string;
    email: string;
    username: string;
    name: string;
    phone?: string;
    avatar?: string;
    school?: string;
    major?: string;
    isActive: boolean;
    isBanned: boolean;
    bannedReason?: string;
    postsCount: number;
    commentsCount: number;
    likesCount: number;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface UserPost {
    id: string;
    content: string;
    title?: string;
    category: string;
    isHidden: boolean;
    isQuestion: boolean;
    commentsCount: number;
    likesCount: number;
    viewCount: number;
    shareToken?: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [userPosts, setUserPosts] = useState<UserPost[]>([]);
    const [userQuestions, setUserQuestions] = useState<UserPost[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postActionLoading, setPostActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, status]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (search) params.append('search', search);
            if (status) params.append('status', status);

            const response = await fetch(`${API_BASE}/api/admin/users?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            setUsers(data.users);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBan = async (userId: string, ban: boolean, reason?: string) => {
        setActionLoading(userId);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/api/admin/users/${userId}/ban`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ banned: ban, reason }),
            });

            if (!response.ok) throw new Error('Failed');

            fetchUsers();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchUsers();
    };

    const fetchUserPosts = async (userId: string) => {
        setPostsLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const [postsRes, questionsRes] = await Promise.all([
                fetch(`${API_BASE}/api/admin/posts/user/${userId}?type=post`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch(`${API_BASE}/api/admin/posts/user/${userId}?type=question`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
            ]);

            if (postsRes.ok) {
                const posts = await postsRes.json();
                setUserPosts(posts);
            }
            if (questionsRes.ok) {
                const questions = await questionsRes.json();
                setUserQuestions(questions);
            }
        } catch (err) {
            console.error('Error fetching user posts:', err);
        } finally {
            setPostsLoading(false);
        }
    };

    const handleViewPost = (post: UserPost) => {
        if (post.isQuestion) {
            window.open(`/community?tab=questions&questionId=${post.id}`, '_blank');
        } else {
            window.open(`/shared-post/${post.id}`, '_blank');
        }
    };

    const handleHidePost = async (postId: string, hide: boolean) => {
        setPostActionLoading(postId);
        try {
            const token = localStorage.getItem('adminToken');
            const reason = hide ? window.prompt('Lý do ẩn bài viết:') : undefined;
            if (hide && reason === null) {
                setPostActionLoading(null);
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
                // Update local state
                setUserPosts(prev => prev.map(p => p.id === postId ? { ...p, isHidden: hide } : p));
                setUserQuestions(prev => prev.map(p => p.id === postId ? { ...p, isHidden: hide } : p));
            }
        } catch (err) {
            console.error('Error hiding post:', err);
        } finally {
            setPostActionLoading(null);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.')) {
            return;
        }

        setPostActionLoading(postId);
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
                // Remove from local state
                setUserPosts(prev => prev.filter(p => p.id !== postId));
                setUserQuestions(prev => prev.filter(p => p.id !== postId));
            }
        } catch (err) {
            console.error('Error deleting post:', err);
        } finally {
            setPostActionLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Quản lý Sinh viên</h1>
                    <p className="text-gray-400">Tổng cộng {pagination.total} sinh viên</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email, trường..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </form>
                <div className="flex gap-2">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                        <option value="banned">Đã khóa</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <AlertCircle className="w-12 h-12 mb-4" />
                        <p>Không tìm thấy sinh viên nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Người dùng</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Liên hệ</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Trường</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Hoạt động</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Trạng thái</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-700/30"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="text-white font-medium">{user.name}</p>
                                                    <p className="text-gray-400 text-sm">@{user.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm">
                                                <p className="text-gray-300 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {user.email}
                                                </p>
                                                {user.phone && (
                                                    <p className="text-gray-400 flex items-center gap-1">
                                                        <Phone className="w-3 h-3" /> {user.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm">
                                                <p className="text-gray-300 flex items-center gap-1">
                                                    <GraduationCap className="w-3 h-3" /> {user.school || '-'}
                                                </p>
                                                <p className="text-gray-400">{user.major || '-'}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm text-gray-400">
                                                <p>{user.postsCount} bài viết</p>
                                                <p>{user.commentsCount} bình luận</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.isBanned ? (
                                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                                                    Đã khóa
                                                </span>
                                            ) : user.isActive ? (
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                    Hoạt động
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                                                    Không hoạt động
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDetailsModal(true);
                                                        fetchUserPosts(user.id);
                                                    }}
                                                    className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {user.isBanned ? (
                                                    <button
                                                        onClick={() => handleBan(user.id, false)}
                                                        disabled={actionLoading === user.id}
                                                        className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Mở khóa"
                                                    >
                                                        {actionLoading === user.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <UserCheck className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            const reason = window.prompt('Lý do khóa tài khoản:');
                                                            if (reason !== null) handleBan(user.id, true, reason);
                                                        }}
                                                        disabled={actionLoading === user.id}
                                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Khóa tài khoản"
                                                    >
                                                        {actionLoading === user.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <UserX className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
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

            {/* User Details Modal */}
            {showDetailsModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Chi tiết Sinh viên</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Avatar & Name */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedUser.avatar}
                                    alt={selectedUser.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{selectedUser.name}</h3>
                                    <p className="text-gray-400">@{selectedUser.username}</p>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-900/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                    <p className="text-gray-300 text-sm">{selectedUser.email}</p>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                                    <p className="text-gray-300 text-sm">{selectedUser.phone || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Trường học</p>
                                    <p className="text-gray-300 text-sm">{selectedUser.school || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Chuyên ngành</p>
                                    <p className="text-gray-300 text-sm">{selectedUser.major || 'Chưa cập nhật'}</p>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="bg-gray-900/50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-300 mb-3">Thống kê hoạt động</p>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-purple-400">{selectedUser.postsCount}</p>
                                        <p className="text-xs text-gray-500">Bài viết</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-cyan-400">{selectedUser.commentsCount}</p>
                                        <p className="text-xs text-gray-500">Bình luận</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-pink-400">{selectedUser.likesCount}</p>
                                        <p className="text-xs text-gray-500">Lượt thích</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-400">Trạng thái:</span>
                                {selectedUser.isBanned ? (
                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                                        Đã khóa
                                    </span>
                                ) : selectedUser.isActive ? (
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                        Hoạt động
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                                        Không hoạt động
                                    </span>
                                )}
                            </div>

                            {selectedUser.isBanned && selectedUser.bannedReason && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    <p className="text-xs text-red-400 mb-1">Lý do khóa tài khoản:</p>
                                    <p className="text-red-300 text-sm">{selectedUser.bannedReason}</p>
                                </div>
                            )}

                            {/* Registration Date */}
                            <div className="text-sm text-gray-500 mb-4">
                                Ngày đăng ký: {new Date(selectedUser.createdAt).toLocaleDateString('vi-VN')}
                            </div>

                            {/* User Posts Section */}
                            <div className="border-t border-gray-700 pt-4">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-400" />
                                    Bài viết ({userPosts.length})
                                </h3>
                                {postsLoading ? (
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                                    </div>
                                ) : userPosts.length === 0 ? (
                                    <p className="text-gray-500 text-sm">Chưa có bài viết nào</p>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {userPosts.map(post => (
                                            <div key={post.id} className={`p-3 rounded-lg border ${post.isHidden ? 'bg-red-500/10 border-red-500/20' : 'bg-gray-900/50 border-gray-700'}`}>
                                                <p className="text-sm text-gray-300 line-clamp-2 mb-2">{post.content}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                        <span>{post.likesCount} lượt thích</span>
                                                        <span>{post.commentsCount} bình luận</span>
                                                        {post.isHidden && <span className="text-red-400">Đã ẩn</span>}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleViewPost(post)}
                                                            className="p-1.5 text-cyan-400 hover:bg-cyan-500/20 rounded transition-colors"
                                                            title="Xem bài viết"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleHidePost(post.id, !post.isHidden)}
                                                            disabled={postActionLoading === post.id}
                                                            className={`p-1.5 rounded transition-colors ${post.isHidden ? 'text-green-400 hover:bg-green-500/20' : 'text-yellow-400 hover:bg-yellow-500/20'}`}
                                                            title={post.isHidden ? 'Hiện bài viết' : 'Ẩn bài viết'}
                                                        >
                                                            {postActionLoading === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (post.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />)}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePost(post.id)}
                                                            disabled={postActionLoading === post.id}
                                                            className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                                            title="Xóa bài viết"
                                                        >
                                                            {postActionLoading === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* User Questions Section */}
                            <div className="border-t border-gray-700 pt-4">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                                    Câu hỏi ({userQuestions.length})
                                </h3>
                                {postsLoading ? (
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                                    </div>
                                ) : userQuestions.length === 0 ? (
                                    <p className="text-gray-500 text-sm">Chưa có câu hỏi nào</p>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {userQuestions.map(question => (
                                            <div key={question.id} className={`p-3 rounded-lg border ${question.isHidden ? 'bg-red-500/10 border-red-500/20' : 'bg-gray-900/50 border-gray-700'}`}>
                                                <p className="text-sm font-medium text-white mb-1">{question.title || 'Câu hỏi'}</p>
                                                <p className="text-xs text-gray-400 line-clamp-1 mb-2">{question.content}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                        <span>{question.viewCount} lượt xem</span>
                                                        <span>{question.commentsCount} câu trả lời</span>
                                                        {question.isHidden && <span className="text-red-400">Đã ẩn</span>}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleViewPost(question)}
                                                            className="p-1.5 text-cyan-400 hover:bg-cyan-500/20 rounded transition-colors"
                                                            title="Xem câu hỏi"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleHidePost(question.id, !question.isHidden)}
                                                            disabled={postActionLoading === question.id}
                                                            className={`p-1.5 rounded transition-colors ${question.isHidden ? 'text-green-400 hover:bg-green-500/20' : 'text-yellow-400 hover:bg-yellow-500/20'}`}
                                                            title={question.isHidden ? 'Hiện câu hỏi' : 'Ẩn câu hỏi'}
                                                        >
                                                            {postActionLoading === question.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (question.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />)}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePost(question.id)}
                                                            disabled={postActionLoading === question.id}
                                                            className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                                            title="Xóa câu hỏi"
                                                        >
                                                            {postActionLoading === question.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
