'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    User,
    Building2,
    Briefcase,
    FileText,
    CheckCircle,
    XCircle,
    Ban,
    Shield,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AdminLog {
    id: string;
    action: string;
    targetType: string;
    targetId: string;
    details: any;
    ipAddress?: string;
    createdAt: string;
    admin: {
        id: string;
        name: string;
        email: string;
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const ACTION_LABELS: Record<string, { label: string; icon: any; color: string }> = {
    'employer_verified': { label: 'Xác minh nhà tuyển dụng', icon: CheckCircle, color: 'text-green-400' },
    'employer_verification_revoked': { label: 'Thu hồi xác minh', icon: XCircle, color: 'text-yellow-400' },
    'employer_banned': { label: 'Khóa nhà tuyển dụng', icon: Ban, color: 'text-red-400' },
    'employer_unbanned': { label: 'Mở khóa nhà tuyển dụng', icon: CheckCircle, color: 'text-green-400' },
    'user_banned': { label: 'Khóa tài khoản', icon: Ban, color: 'text-red-400' },
    'user_unbanned': { label: 'Mở khóa tài khoản', icon: CheckCircle, color: 'text-green-400' },
    'user_activated': { label: 'Kích hoạt tài khoản', icon: CheckCircle, color: 'text-green-400' },
    'user_deactivated': { label: 'Vô hiệu hóa tài khoản', icon: XCircle, color: 'text-yellow-400' },
    'job_approved': { label: 'Duyệt tin tuyển dụng', icon: CheckCircle, color: 'text-green-400' },
    'job_rejected': { label: 'Từ chối tin tuyển dụng', icon: XCircle, color: 'text-red-400' },
    'job_deleted': { label: 'Xóa tin tuyển dụng', icon: XCircle, color: 'text-red-400' },
};

const TARGET_ICONS: Record<string, any> = {
    'user': User,
    'employer': Building2,
    'job_posting': Briefcase,
    'post': FileText,
};

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [pagination.page]);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });

            const response = await fetch(`${API_BASE}/api/admin/logs?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            setLogs(data.logs);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getActionInfo = (action: string) => {
        return ACTION_LABELS[action] || { label: action, icon: FileText, color: 'text-gray-400' };
    };

    const getTargetIcon = (targetType: string) => {
        return TARGET_ICONS[targetType] || FileText;
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Nhật ký hoạt động</h1>
                <p className="text-gray-400">Lịch sử các thao tác quản trị</p>
            </div>

            {/* Logs List */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <AlertCircle className="w-12 h-12 mb-4" />
                        <p>Chưa có hoạt động nào</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {logs.map((log, index) => {
                            const actionInfo = getActionInfo(log.action);
                            const ActionIcon = actionInfo.icon;
                            const TargetIcon = getTargetIcon(log.targetType);

                            return (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="p-4 hover:bg-gray-700/30"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-lg bg-gray-700 ${actionInfo.color}`}>
                                            <ActionIcon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                <div>
                                                    <p className="text-white font-medium">{actionInfo.label}</p>
                                                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                                        <Shield className="w-3 h-3" />
                                                        <span>{log.admin.name}</span>
                                                        <span>•</span>
                                                        <TargetIcon className="w-3 h-3" />
                                                        <span className="truncate max-w-[200px]">{log.targetId}</span>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {formatTime(log.createdAt)}
                                                </div>
                                            </div>
                                            {log.details && (
                                                <div className="mt-2 p-2 bg-gray-900/50 rounded-lg text-sm">
                                                    {log.details.companyName && (
                                                        <p className="text-gray-300">
                                                            Công ty: <span className="text-white">{log.details.companyName}</span>
                                                        </p>
                                                    )}
                                                    {log.details.userName && (
                                                        <p className="text-gray-300">
                                                            Người dùng: <span className="text-white">{log.details.userName}</span>
                                                        </p>
                                                    )}
                                                    {log.details.reason && (
                                                        <p className="text-gray-300">
                                                            Lý do: <span className="text-yellow-400">{log.details.reason}</span>
                                                        </p>
                                                    )}
                                                    {log.details.rejectionReason && (
                                                        <p className="text-gray-300">
                                                            Lý do từ chối: <span className="text-red-400">{log.details.rejectionReason}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
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
