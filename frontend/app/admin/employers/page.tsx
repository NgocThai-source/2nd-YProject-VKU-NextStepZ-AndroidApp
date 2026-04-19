'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    CheckCircle,
    XCircle,
    UserX,
    UserCheck,
    Eye,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    Building2,
    Globe,
    Briefcase,
    BadgeCheck,
    MapPin,
    FileText,
    Calendar,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Employer {
    id: string;
    email: string;
    username: string;
    companyName: string;
    phone?: string;
    avatar?: string;
    website?: string;
    address?: string;
    taxId?: string;
    isActive: boolean;
    isVerified: boolean;
    verifiedAt?: string;
    isBanned: boolean;
    bannedReason?: string;
    jobPostingsCount: number;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function AdminEmployersPage() {
    const [employers, setEmployers] = useState<Employer[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchEmployers();
    }, [pagination.page, status]);

    const fetchEmployers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (search) params.append('search', search);
            if (status) params.append('status', status);

            const response = await fetch(`${API_BASE}/api/admin/employers?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            setEmployers(data.employers);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (employerId: string, verified: boolean) => {
        setActionLoading(employerId);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/api/admin/employers/${employerId}/verify`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ verified }),
            });

            if (!response.ok) throw new Error('Failed');

            fetchEmployers();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleBan = async (employerId: string, ban: boolean, reason?: string) => {
        setActionLoading(employerId);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/api/admin/employers/${employerId}/ban`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ banned: ban, reason }),
            });

            if (!response.ok) throw new Error('Failed');

            fetchEmployers();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchEmployers();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Quản lý Nhà tuyển dụng</h1>
                    <p className="text-gray-400">Tổng cộng {pagination.total} nhà tuyển dụng</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên công ty, email..."
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
                        <option value="verified">Đã xác minh</option>
                        <option value="pending">Chờ xác minh</option>
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
                ) : employers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <AlertCircle className="w-12 h-12 mb-4" />
                        <p>Không tìm thấy nhà tuyển dụng nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Công ty</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Liên hệ</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Tin tuyển dụng</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Trạng thái</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {employers.map((employer, index) => (
                                    <motion.tr
                                        key={employer.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-700/30"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={employer.avatar}
                                                    alt={employer.companyName}
                                                    className="w-10 h-10 rounded-lg object-cover bg-gray-700"
                                                />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-white font-medium">{employer.companyName}</p>
                                                        {employer.isVerified && (
                                                            <BadgeCheck className="w-4 h-4 text-blue-400" />
                                                        )}
                                                    </div>
                                                    {employer.website && (
                                                        <a
                                                            href={employer.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-400 text-sm flex items-center gap-1 hover:text-purple-400"
                                                        >
                                                            <Globe className="w-3 h-3" /> {employer.website}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm">
                                                <p className="text-gray-300 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {employer.email}
                                                </p>
                                                {employer.phone && (
                                                    <p className="text-gray-400 flex items-center gap-1">
                                                        <Phone className="w-3 h-3" /> {employer.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Briefcase className="w-4 h-4" />
                                                <span>{employer.jobPostingsCount} tin</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                {employer.isBanned ? (
                                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full inline-flex items-center gap-1 w-fit">
                                                        <XCircle className="w-3 h-3" /> Đã khóa
                                                    </span>
                                                ) : employer.isVerified ? (
                                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full inline-flex items-center gap-1 w-fit">
                                                        <CheckCircle className="w-3 h-3" /> Đã xác minh
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full inline-flex items-center gap-1 w-fit">
                                                        <AlertCircle className="w-3 h-3" /> Chờ xác minh
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedEmployer(employer);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {!employer.isVerified && !employer.isBanned && (
                                                    <button
                                                        onClick={() => handleVerify(employer.id, true)}
                                                        disabled={actionLoading === employer.id}
                                                        className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Xác minh"
                                                    >
                                                        {actionLoading === employer.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                )}
                                                {employer.isVerified && !employer.isBanned && (
                                                    <button
                                                        onClick={() => handleVerify(employer.id, false)}
                                                        disabled={actionLoading === employer.id}
                                                        className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Thu hồi xác minh"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {employer.isBanned ? (
                                                    <button
                                                        onClick={() => handleBan(employer.id, false)}
                                                        disabled={actionLoading === employer.id}
                                                        className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Mở khóa"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            const reason = window.prompt('Lý do khóa tài khoản:');
                                                            if (reason !== null) handleBan(employer.id, true, reason);
                                                        }}
                                                        disabled={actionLoading === employer.id}
                                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Khóa tài khoản"
                                                    >
                                                        <UserX className="w-4 h-4" />
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

            {/* Employer Details Modal */}
            {showDetailsModal && selectedEmployer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Chi tiết Nhà tuyển dụng</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Avatar & Company Name */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedEmployer.avatar}
                                    alt={selectedEmployer.companyName}
                                    className="w-16 h-16 rounded-lg object-cover bg-gray-700"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-white">{selectedEmployer.companyName}</h3>
                                        {selectedEmployer.isVerified && (
                                            <BadgeCheck className="w-5 h-5 text-blue-400" />
                                        )}
                                    </div>
                                    <p className="text-gray-400">@{selectedEmployer.username}</p>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-900/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> Email
                                    </p>
                                    <p className="text-gray-300 text-sm break-all">{selectedEmployer.email}</p>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                        <Phone className="w-3 h-3" /> Số điện thoại
                                    </p>
                                    <p className="text-gray-300 text-sm">{selectedEmployer.phone || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> Website
                                    </p>
                                    {selectedEmployer.website ? (
                                        <a
                                            href={selectedEmployer.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-cyan-400 text-sm hover:underline break-all"
                                        >
                                            {selectedEmployer.website}
                                        </a>
                                    ) : (
                                        <p className="text-gray-300 text-sm">Chưa cập nhật</p>
                                    )}
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                        <FileText className="w-3 h-3" /> Mã số thuế
                                    </p>
                                    <p className="text-gray-300 text-sm">{selectedEmployer.taxId || 'Chưa cập nhật'}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="bg-gray-900/50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> Địa chỉ
                                </p>
                                <p className="text-gray-300 text-sm">{selectedEmployer.address || 'Chưa cập nhật'}</p>
                            </div>

                            {/* Statistics */}
                            <div className="bg-gray-900/50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-300 mb-3">Thống kê</p>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-purple-400">{selectedEmployer.jobPostingsCount}</p>
                                        <p className="text-xs text-gray-500">Tin tuyển dụng</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(selectedEmployer.createdAt).toLocaleDateString('vi-VN')}
                                        </p>
                                        <p className="text-xs text-gray-500">Ngày đăng ký</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-400">Trạng thái:</span>
                                {selectedEmployer.isBanned ? (
                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full inline-flex items-center gap-1">
                                        <XCircle className="w-3 h-3" /> Đã khóa
                                    </span>
                                ) : selectedEmployer.isVerified ? (
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full inline-flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Đã xác minh
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full inline-flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Chờ xác minh
                                    </span>
                                )}
                            </div>

                            {selectedEmployer.isVerified && selectedEmployer.verifiedAt && (
                                <div className="text-sm text-gray-500">
                                    Xác minh ngày: {new Date(selectedEmployer.verifiedAt).toLocaleDateString('vi-VN')}
                                </div>
                            )}

                            {selectedEmployer.isBanned && selectedEmployer.bannedReason && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    <p className="text-xs text-red-400 mb-1">Lý do khóa tài khoản:</p>
                                    <p className="text-red-300 text-sm">{selectedEmployer.bannedReason}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
