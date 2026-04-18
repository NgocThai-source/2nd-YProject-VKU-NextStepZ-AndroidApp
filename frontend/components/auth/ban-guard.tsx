'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/lib/notification-context';
import { Ban, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Notification } from '@/lib/notifications';

interface BanInfo {
    isBanned: boolean;
    reason?: string;
}

export function BanGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isLoggedIn, logout, getToken } = useAuth();
    const { subscribe } = useNotifications();
    const [banInfo, setBanInfo] = useState<BanInfo | null>(null);

    // Check if we're on an admin route - admin panel is exempt from ban check
    const isAdminRoute = pathname?.startsWith('/admin');

    // Check ban status on mount - skip for admin routes
    useEffect(() => {
        // Skip ban check for admin routes
        if (isAdminRoute) return;

        const checkBanStatus = async () => {
            const token = getToken?.();
            if (!token || !isLoggedIn) return;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    // Token is invalid, might be banned
                    const data = await response.json();
                    if (data.message?.includes('khóa') || data.message?.includes('banned')) {
                        setBanInfo({ isBanned: true, reason: data.bannedReason || 'Vi phạm quy định' });
                    }
                } else if (response.ok) {
                    const data = await response.json();
                    if (data.isBanned) {
                        setBanInfo({ isBanned: true, reason: data.bannedReason || 'Vi phạm quy định' });
                    }
                }
            } catch (error) {
                console.error('Error checking ban status:', error);
            }
        };

        checkBanStatus();
    }, [isLoggedIn, getToken, isAdminRoute]);

    // Listen for ban notifications in real-time - skip for admin routes
    useEffect(() => {
        // Skip notification listening for admin routes
        if (isAdminRoute) return;

        const unsubscribe = subscribe((notification: Notification) => {
            if (notification.type === 'account_banned') {
                // Extract reason from notification description
                const reason = notification.description.includes('Lý do:')
                    ? notification.description.split('Lý do:')[1]?.trim()
                    : 'Vi phạm quy định';

                setBanInfo({ isBanned: true, reason });
            }
        });

        return () => unsubscribe();
    }, [subscribe, isAdminRoute]);

    const handleLogout = () => {
        logout();
        setBanInfo(null);
        window.location.href = '/';
    };

    return (
        <>
            {children}

            {/* Ban Modal Overlay - Skip on admin routes */}
            <AnimatePresence>
                {banInfo?.isBanned && !isAdminRoute && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="max-w-md w-full mx-4 bg-gradient-to-br from-slate-900 to-slate-800 border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center gap-3">
                                <Ban className="w-8 h-8 text-white" />
                                <h2 className="text-xl font-bold text-white">Tài khoản đã bị khóa</h2>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-center mb-2">
                                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                                        <Ban className="w-10 h-10 text-red-500" />
                                    </div>
                                </div>

                                <p className="text-gray-300 text-center">
                                    Tài khoản của bạn đã bị khóa bởi quản trị viên và không thể tiếp tục sử dụng.
                                </p>

                                {banInfo.reason && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                        <p className="text-sm text-gray-400 mb-1">Lý do:</p>
                                        <p className="text-red-400 font-medium">{banInfo.reason}</p>
                                    </div>
                                )}

                                <p className="text-sm text-gray-500 text-center">
                                    Nếu bạn cho rằng đây là một sai lầm, vui lòng liên hệ với chúng tôi qua email{' '}
                                    <a href="mailto:nguyenngocthai.nqu@gmail.com" className="text-cyan-400 hover:underline">
                                        nguyenngocthai.nqu@gmail.com
                                    </a>
                                </p>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Đăng xuất
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
