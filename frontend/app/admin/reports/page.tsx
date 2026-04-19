'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import {
    Search,
    Filter,
    Eye,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    FileText,
    MessageSquare,
    Briefcase,
    User,
    EyeOff,
    Trash2,
    UserX,
    X,
    ExternalLink,
    CheckCircle,
    XCircle,
    Bell,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Report {
    id: string;
    reporterId: string;
    targetType: 'post' | 'question' | 'job_posting' | 'profile';
    targetId: string;
    reason: string;
    description?: string;
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
    actionTaken?: string;
    adminNotes?: string;
    createdAt: string;
    reporter?: {
        id: string;
        username: string;
        firstName?: string;
        lastName?: string;
        avatar?: string;
    };
    targetInfo?: any;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface ReportStats {
    byStatus: { pending: number; reviewed: number; resolved: number; dismissed: number };
    byType: { posts: number; questions: number; jobs: number; profiles: number };
    total: number;
}

const reasonLabels: Record<string, string> = {
    spam: 'Spam hoặc quảng cáo',
    fake: 'Thông tin giả mạo',
    inappropriate: 'Nội dung không phù hợp',
    hate: 'Gây căng thẳng hoặc kỳ thị',
    misinformation: 'Thông tin sai lệch',
    copyright: 'Vi phạm bản quyền',
    harassment: 'Quấy rối hoặc đe dọa',
    impersonation: 'Mạo danh người khác',
    scam: 'Lừa đảo hoặc gian lận',
    misleading: 'Thông tin sai lệch',
    discrimination: 'Phân biệt đối xử',
    other: 'Khác',
};

const targetTypeLabels: Record<string, string> = {
    post: 'Bài viết',
    question: 'Câu hỏi',
    job_posting: 'Tin tuyển dụng',
    profile: 'Hồ sơ',
};

const statusLabels: Record<string, string> = {
    pending: 'Chờ xử lý',
    reviewed: 'Đã xem',
    resolved: 'Đã xử lý',
    dismissed: 'Bỏ qua',
};

const targetTypeIcons: Record<string, React.ReactNode> = {
    post: <FileText className="w-4 h-4" />,
    question: <MessageSquare className="w-4 h-4" />,
    job_posting: <Briefcase className="w-4 h-4" />,
    profile: <User className="w-4 h-4" />,
};

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [stats, setStats] = useState<ReportStats | null>(null);
    const [search, setSearch] = useState('');
    const [targetType, setTargetType] = useState('');
    const [status, setStatus] = useState('pending');
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [newReportAlert, setNewReportAlert] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    // Fetch reports function
    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (search) params.append('search', search);
            if (targetType) params.append('targetType', targetType);
            if (status) params.append('status', status);

            const response = await fetch(`${API_BASE}/api/admin/reports?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            setReports(data.reports);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page, pagination.limit, search, targetType, status]);

    // Fetch stats function
    const fetchStats = useCallback(async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/api/admin/reports/stats/summary`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    }, []);

    useEffect(() => {
        fetchReports();
        fetchStats();
    }, [fetchReports, fetchStats]);

    // WebSocket connection for real-time updates
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        const socket = io(`${API_BASE}/messaging`, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });

        socket.on('connect', () => {
            console.log('Admin reports WebSocket connected');
        });

        socket.on('newReport', (report: Report) => {
            console.log('New report received:', report);
            // Show alert for new report
            setNewReportAlert(true);
            setTimeout(() => setNewReportAlert(false), 5000);

            // If viewing pending reports on page 1, prepend the new report
            if (status === 'pending' && pagination.page === 1) {
                setReports(prev => [report, ...prev.slice(0, pagination.limit - 1)]);
                setPagination(prev => ({ ...prev, total: prev.total + 1 }));
            }

            // Update stats
            fetchStats();
        });

        socket.on('reportUpdate', (data: { reportId: string; status: string }) => {
            console.log('Report updated:', data);
            // Refresh reports and stats when a report is updated
            fetchReports();
            fetchStats();
        });

        socket.on('disconnect', () => {
            console.log('Admin reports WebSocket disconnected');
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, [status, pagination.page, pagination.limit, fetchReports, fetchStats]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchReports();
    };

    const handleAction = async (reportId: string, action: 'hide' | 'delete' | 'ban') => {
        setActionLoading(reportId);
        try {
            const token = localStorage.getItem('adminToken');
            const reason = window.prompt('Ghi chú hành động (tùy chọn):');

            const response = await fetch(`${API_BASE}/api/admin/reports/${reportId}/action`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action, reason }),
            });

            if (!response.ok) throw new Error('Failed');

            fetchReports();
            fetchStats();
            setShowActionModal(false);
            setSelectedReport(null);
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDismiss = async (reportId: string) => {
        setActionLoading(reportId);
        try {
            const token = localStorage.getItem('adminToken');
            const reason = window.prompt('Lý do bỏ qua (tùy chọn):');

            const response = await fetch(`${API_BASE}/api/admin/reports/${reportId}/dismiss`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason }),
            });

            if (!response.ok) throw new Error('Failed');

            fetchReports();
            fetchStats();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleViewTarget = (report: Report) => {
        switch (report.targetType) {
            case 'post':
                window.open(`/shared-post/${report.targetId}`, '_blank');
                break;
            case 'question':
                window.open(`/community?tab=questions&questionId=${report.targetId}`, '_blank');
                break;
            case 'job_posting':
                window.open(`/companies?jobId=${report.targetId}`, '_blank');
                break;
            case 'profile':
                window.open(`/public-profile/${report.targetId}`, '_blank');
                break;
        }
    };

    const getReporterName = (report: Report) => {
        if (!report.reporter) return 'Ẩn danh';
        if (report.reporter.firstName && report.reporter.lastName) {
            return `${report.reporter.firstName} ${report.reporter.lastName}`;
        }
        return report.reporter.username || 'Ẩn danh';
    };

    const getTargetSummary = (report: Report) => {
        if (!report.targetInfo) return 'Nội dung không khả dụng';

        switch (report.targetType) {
            case 'post':
            case 'question':
                return report.targetInfo.title || report.targetInfo.content?.substring(0, 50) + '...' || 'Bài viết';
            case 'job_posting':
                return report.targetInfo.companyName || 'Tin tuyển dụng';
            case 'profile':
                if (report.targetInfo.firstName && report.targetInfo.lastName) {
                    return `${report.targetInfo.firstName} ${report.targetInfo.lastName}`;
                }
                return report.targetInfo.username || 'Người dùng';
            default:
                return 'Không xác định';
        }
    };

    const isTargetDeleted = (report: Report) => {
        return !report.targetInfo;
    };

    const isTargetHidden = (report: Report) => {
        if (report.targetType === 'post' || report.targetType === 'question') {
            return report.targetInfo?.isHidden === true;
        }
        if (report.targetType === 'job_posting') {
            return report.targetInfo?.isActive === false;
        }
        if (report.targetType === 'profile') {
            return report.targetInfo?.isBanned === true;
        }
        return false;
    };

    return (
        <div className="space-y-6">
            {/* New Report Alert */}
            <AnimatePresence>
                {newReportAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg shadow-lg"
                    >
                        <Bell className="w-5 h-5 animate-bounce" />
                        <span className="font-medium">Có báo cáo mới!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Quản lý Báo cáo</h1>
                    <p className="text-gray-400">Tổng cộng {pagination.total} báo cáo</p>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                        <div className="text-2xl font-bold text-yellow-400">{stats.byStatus.pending}</div>
                        <div className="text-sm text-gray-400">Chờ xử lý</div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <div className="text-2xl font-bold text-blue-400">{stats.byStatus.reviewed}</div>
                        <div className="text-sm text-gray-400">Đã xem</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-400">{stats.byStatus.resolved}</div>
                        <div className="text-sm text-gray-400">Đã xử lý</div>
                    </div>
                    <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4">
                        <div className="text-2xl font-bold text-gray-400">{stats.byStatus.dismissed}</div>
                        <div className="text-sm text-gray-400">Bỏ qua</div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo lý do..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </form>
                <div className="flex gap-2">
                    <select
                        value={targetType}
                        onChange={(e) => setTargetType(e.target.value)}
                        className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                        <option value="">Tất cả loại</option>
                        <option value="post">Bài viết</option>
                        <option value="question">Câu hỏi</option>
                        <option value="job_posting">Tin tuyển dụng</option>
                        <option value="profile">Hồ sơ</option>
                    </select>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="reviewed">Đã xem</option>
                        <option value="resolved">Đã xử lý</option>
                        <option value="dismissed">Bỏ qua</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                ) : reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <AlertCircle className="w-12 h-12 mb-4" />
                        <p>Không có báo cáo nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Loại</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Nội dung</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Lý do</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Người báo cáo</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Trạng thái</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Thời gian</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {reports.map((report, index) => (
                                    <motion.tr
                                        key={report.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-700/30"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">{targetTypeIcons[report.targetType]}</span>
                                                <span className="text-sm text-white">{targetTypeLabels[report.targetType]}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="max-w-xs">
                                                <p className={`text-sm truncate ${isTargetDeleted(report) ? 'text-red-400' : isTargetHidden(report) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                                    {isTargetDeleted(report) ? '(Đã xóa)' : isTargetHidden(report) ? '(Đã ẩn/khóa)' : ''} {getTargetSummary(report)}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-300">{reasonLabels[report.reason] || report.reason}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-300">{getReporterName(report)}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {report.status === 'pending' && (
                                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                                                    {statusLabels[report.status]}
                                                </span>
                                            )}
                                            {report.status === 'reviewed' && (
                                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                                    {statusLabels[report.status]}
                                                </span>
                                            )}
                                            {report.status === 'resolved' && (
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                    {statusLabels[report.status]}
                                                </span>
                                            )}
                                            {report.status === 'dismissed' && (
                                                <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                                                    {statusLabels[report.status]}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-400">
                                                {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {!isTargetDeleted(report) && (
                                                    <button
                                                        onClick={() => handleViewTarget(report)}
                                                        className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors"
                                                        title="Xem nội dung"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {report.status === 'pending' && !isTargetDeleted(report) && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedReport(report);
                                                                setShowActionModal(true);
                                                            }}
                                                            disabled={actionLoading === report.id}
                                                            className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Xử lý báo cáo"
                                                        >
                                                            {actionLoading === report.id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <CheckCircle className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDismiss(report.id)}
                                                            disabled={actionLoading === report.id}
                                                            className="p-2 text-gray-400 hover:bg-gray-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Bỏ qua"
                                                        >
                                                            {actionLoading === report.id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <XCircle className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </>
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

            {/* Action Modal */}
            <AnimatePresence>
                {showActionModal && selectedReport && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 z-50"
                            onClick={() => setShowActionModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
                                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white">Xử lý Báo cáo</h2>
                                    <button
                                        onClick={() => setShowActionModal(false)}
                                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Report Info */}
                                    <div className="bg-gray-900/50 rounded-lg p-4">
                                        <p className="text-sm text-gray-400 mb-1">Loại: {targetTypeLabels[selectedReport.targetType]}</p>
                                        <p className="text-sm text-gray-400 mb-1">Lý do: {reasonLabels[selectedReport.reason] || selectedReport.reason}</p>
                                        {selectedReport.description && (
                                            <p className="text-sm text-gray-300 mt-2">{selectedReport.description}</p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        {(selectedReport.targetType === 'post' || selectedReport.targetType === 'question') && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(selectedReport.id, 'hide')}
                                                    disabled={actionLoading === selectedReport.id}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 transition-colors disabled:opacity-50"
                                                >
                                                    <EyeOff className="w-4 h-4" />
                                                    Ẩn bài viết
                                                </button>
                                                <button
                                                    onClick={() => handleAction(selectedReport.id, 'delete')}
                                                    disabled={actionLoading === selectedReport.id}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Xóa bài viết
                                                </button>
                                            </>
                                        )}
                                        {selectedReport.targetType === 'job_posting' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(selectedReport.id, 'hide')}
                                                    disabled={actionLoading === selectedReport.id}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 transition-colors disabled:opacity-50"
                                                >
                                                    <EyeOff className="w-4 h-4" />
                                                    Ẩn tin tuyển dụng
                                                </button>
                                                <button
                                                    onClick={() => handleAction(selectedReport.id, 'delete')}
                                                    disabled={actionLoading === selectedReport.id}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Xóa tin tuyển dụng
                                                </button>
                                            </>
                                        )}
                                        {selectedReport.targetType === 'profile' && (
                                            <button
                                                onClick={() => handleAction(selectedReport.id, 'ban')}
                                                disabled={actionLoading === selectedReport.id}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 transition-colors disabled:opacity-50"
                                            >
                                                <UserX className="w-4 h-4" />
                                                Khóa tài khoản
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
