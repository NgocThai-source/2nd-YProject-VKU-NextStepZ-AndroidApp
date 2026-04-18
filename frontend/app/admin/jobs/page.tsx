'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    CheckCircle,
    XCircle,
    Trash2,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Building2,
    MapPin,
    Eye,
    EyeOff,
    BadgeCheck,
    Clock,
    X,
} from 'lucide-react';
import { JobPostingDetailModal } from '@/components/companies';
import { getJobPosting } from '@/lib/job-posting-api';
import type { JobPosting as FullJobPosting } from '@/components/companies/job-posting.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface JobPosting {
    id: string;
    companyName: string;
    companyLogo?: string;
    description?: string;
    address?: string;
    status: string;
    isActive: boolean;
    viewCount: number;
    positions: any;
    createdAt: string;
    employer: {
        id: string;
        email: string;
        companyName?: string;
        isVerified: boolean;
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedJob, setSelectedJob] = useState<FullJobPosting | null>(null);
    const [detailLoading, setDetailLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchJobs();
    }, [pagination.page, status]);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (search) params.append('search', search);
            if (status) params.append('status', status);

            const response = await fetch(`${API_BASE}/api/admin/jobs?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            setJobs(data.jobs);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (jobId: string, approved: boolean, rejectionReason?: string) => {
        setActionLoading(jobId);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/api/admin/jobs/${jobId}/approve`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ approved, rejectionReason }),
            });

            if (!response.ok) throw new Error('Failed');

            fetchJobs();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (jobId: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa tin tuyển dụng này?')) return;

        setActionLoading(jobId);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/api/admin/jobs/${jobId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed');

            fetchJobs();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleVisibility = async (jobId: string, isActive: boolean) => {
        setActionLoading(jobId);
        try {
            const token = localStorage.getItem('adminToken');
            const reason = !isActive ? window.prompt('Lý do ẩn tin tuyển dụng:') : undefined;
            if (!isActive && reason === null) {
                setActionLoading(null);
                return;
            }

            const response = await fetch(`${API_BASE}/api/admin/jobs/${jobId}/toggle-visibility`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive, reason }),
            });

            if (!response.ok) throw new Error('Failed');

            // Update local state
            setJobs(prev => prev.map(j => j.id === jobId ? { ...j, isActive } : j));
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchJobs();
    };

    const handleViewDetails = async (jobId: string) => {
        setDetailLoading(jobId);
        try {
            const fullJob = await getJobPosting(jobId);
            setSelectedJob(fullJob);
        } catch (err) {
            console.error('Failed to load job details:', err);
        } finally {
            setDetailLoading(null);
        }
    };

    const getStatusBadge = (jobStatus: string) => {
        switch (jobStatus) {
            case 'approved':
                return (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Đã duyệt
                    </span>
                );
            case 'rejected':
                return (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full inline-flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Đã từ chối
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Chờ duyệt
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Quản lý Tin tuyển dụng</h1>
                    <p className="text-gray-400">Tổng cộng {pagination.total} tin tuyển dụng</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên công ty..."
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
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Đã từ chối</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <AlertCircle className="w-12 h-12 mb-4" />
                        <p>Không tìm thấy tin tuyển dụng nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Công ty</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Nhà tuyển dụng</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Địa chỉ</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Lượt xem</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Trạng thái</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {jobs.map((job, index) => (
                                    <motion.tr
                                        key={job.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-700/30"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {job.companyLogo ? (
                                                    <img
                                                        src={job.companyLogo}
                                                        alt={job.companyName}
                                                        className="w-10 h-10 rounded-lg object-cover bg-gray-700"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                                                        <Building2 className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-white font-medium">{job.companyName}</p>
                                                    <p className="text-gray-400 text-sm">
                                                        {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-300">{job.employer.email}</span>
                                                {job.employer.isVerified && (
                                                    <BadgeCheck className="w-4 h-4 text-blue-400" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-gray-300 text-sm">
                                                <MapPin className="w-4 h-4" />
                                                {job.address || '-'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-gray-300">
                                                <Eye className="w-4 h-4" />
                                                {job.viewCount}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(job.status)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(job.id)}
                                                    disabled={detailLoading === job.id}
                                                    className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Xem chi tiết"
                                                >
                                                    {detailLoading === job.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                                {job.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(job.id, true)}
                                                            disabled={actionLoading === job.id}
                                                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Duyệt"
                                                        >
                                                            {actionLoading === job.id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <CheckCircle className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const reason = window.prompt('Lý do từ chối:');
                                                                if (reason !== null) handleApprove(job.id, false, reason);
                                                            }}
                                                            disabled={actionLoading === job.id}
                                                            className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Từ chối"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {/* Hide/Show button for approved jobs */}
                                                {job.status === 'approved' && (
                                                    <button
                                                        onClick={() => handleToggleVisibility(job.id, !job.isActive)}
                                                        disabled={actionLoading === job.id}
                                                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${job.isActive ? 'text-yellow-400 hover:bg-yellow-500/20' : 'text-green-400 hover:bg-green-500/20'}`}
                                                        title={job.isActive ? 'Ẩn tin' : 'Hiện tin'}
                                                    >
                                                        {actionLoading === job.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : job.isActive ? (
                                                            <EyeOff className="w-4 h-4" />
                                                        ) : (
                                                            <Eye className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(job.id)}
                                                    disabled={actionLoading === job.id}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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

            {/* Job Posting Detail Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <JobPostingDetailModal
                        posting={selectedJob}
                        onClose={() => setSelectedJob(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
