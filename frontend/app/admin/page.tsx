'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Building2,
    Briefcase,
    FileText,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface OverviewStats {
    users: { total: number; role: string };
    employers: { total: number; verified: number; pendingVerification: number };
    admins: { total: number };
    posts: { total: number };
    jobs: { total: number; pending: number; approved: number };
    moderation: { bannedUsers: number; pendingJobApprovals: number };
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<OverviewStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            const response = await fetch(`${API_BASE}/api/admin/stats/overview`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch stats');

            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError('Không thể tải thống kê');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-400">
                <AlertCircle className="w-6 h-6 mr-2" />
                {error}
            </div>
        );
    }

    const statCards = [
        {
            title: 'Tổng sinh viên',
            value: stats?.users.total || 0,
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            title: 'Nhà tuyển dụng',
            value: stats?.employers.total || 0,
            subtitle: `${stats?.employers.verified || 0} đã xác minh`,
            icon: Building2,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
        },
        {
            title: 'Tin tuyển dụng',
            value: stats?.jobs.total || 0,
            subtitle: `${stats?.jobs.approved || 0} đã duyệt`,
            icon: Briefcase,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
        },
        {
            title: 'Bài viết cộng đồng',
            value: stats?.posts.total || 0,
            icon: FileText,
            color: 'from-orange-500 to-yellow-500',
            bgColor: 'bg-orange-500/10',
        },
    ];

    const moderationCards = [
        {
            title: 'Chờ duyệt tin tuyển dụng',
            value: stats?.moderation.pendingJobApprovals || 0,
            icon: Clock,
            href: '/admin/jobs?status=pending',
            urgent: (stats?.moderation.pendingJobApprovals || 0) > 0,
        },
        {
            title: 'Nhà tuyển dụng chờ xác minh',
            value: stats?.employers.pendingVerification || 0,
            icon: Building2,
            href: '/admin/employers?status=pending',
            urgent: (stats?.employers.pendingVerification || 0) > 0,
        },
        {
            title: 'Tài khoản bị khóa',
            value: stats?.moderation.bannedUsers || 0,
            icon: AlertCircle,
            href: '/admin/users?status=banned',
        },
        {
            title: 'Quản trị viên',
            value: stats?.admins.total || 0,
            icon: CheckCircle,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Tổng quan hệ thống NextStepZ</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">{card.title}</p>
                                <p className="text-3xl font-bold text-white mt-2">{card.value.toLocaleString()}</p>
                                {card.subtitle && (
                                    <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
                                )}
                            </div>
                            <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                <card.icon className={`w-6 h-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} style={{ color: card.color.includes('blue') ? '#3b82f6' : card.color.includes('purple') ? '#a855f7' : card.color.includes('green') ? '#22c55e' : '#f97316' }} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Moderation Section */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Quản lý & Kiểm duyệt
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {moderationCards.map((card, index) => (
                        <motion.a
                            key={card.title}
                            href={card.href || '#'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className={`bg-gray-800 rounded-xl p-5 border transition-all hover:border-purple-500/50 ${card.urgent ? 'border-yellow-500/50' : 'border-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${card.urgent ? 'bg-yellow-500/20' : 'bg-gray-700'}`}>
                                    <card.icon className={`w-5 h-5 ${card.urgent ? 'text-yellow-400' : 'text-gray-400'}`} />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">{card.title}</p>
                                    <p className={`text-2xl font-bold ${card.urgent ? 'text-yellow-400' : 'text-white'}`}>
                                        {card.value}
                                    </p>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold text-white mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/admin/employers?status=pending"
                        className="flex items-center gap-3 p-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-colors"
                    >
                        <Building2 className="w-5 h-5 text-purple-400" />
                        <span className="text-white">Xác minh nhà tuyển dụng</span>
                    </a>
                    <a
                        href="/admin/jobs?status=pending"
                        className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-colors"
                    >
                        <Briefcase className="w-5 h-5 text-blue-400" />
                        <span className="text-white">Duyệt tin tuyển dụng</span>
                    </a>
                    <a
                        href="/admin/logs"
                        className="flex items-center gap-3 p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 border border-gray-600 transition-colors"
                    >
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-white">Xem nhật ký hoạt động</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
