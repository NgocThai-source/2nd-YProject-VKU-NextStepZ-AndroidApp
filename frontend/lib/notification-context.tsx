'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from './auth-context';
import { connectSocket, disconnectSocket, isSocketConnected } from './services/socket-manager';
import { Notification, fetchUnreadCount, getNotificationIcon } from './notifications';

interface NotificationToast {
    id: string;
    notification: Notification;
    timeoutId?: NodeJS.Timeout;
}

interface NotificationContextType {
    unreadCount: number;
    refreshUnreadCount: () => void;
    subscribe: (callback: (notification: Notification) => void) => () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isLoggedIn, getToken } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [toasts, setToasts] = useState<NotificationToast[]>([]);
    const isConnectedRef = useRef(false);
    const subscribersRef = useRef<Set<(notification: Notification) => void>>(new Set());

    // Check if we're on admin route - admin panel should not show ban notifications
    const isAdminRoute = pathname?.startsWith('/admin');

    // Subscribe to new notifications
    const subscribe = useCallback((callback: (notification: Notification) => void) => {
        subscribersRef.current.add(callback);
        return () => {
            subscribersRef.current.delete(callback);
        };
    }, []);

    // Dismiss a toast
    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => {
            const toast = prev.find((t) => t.id === id);
            if (toast?.timeoutId) {
                clearTimeout(toast.timeoutId);
            }
            return prev.filter((t) => t.id !== id);
        });
    }, []);

    // Show a notification toast
    const showToast = useCallback((notification: Notification) => {
        // Prevent duplicate toasts for the same notification
        setToasts((prev) => {
            // Check if this notification is already shown
            if (prev.some(t => t.notification.id === notification.id)) {
                return prev; // Don't add duplicate
            }

            const id = `toast-${notification.id}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

            // Auto-dismiss after 5 seconds
            const timeoutId = setTimeout(() => dismissToast(id), 5000);

            return [...prev, { id, notification, timeoutId }];
        });
    }, [dismissToast]);

    // Handle new notification from WebSocket
    const handleNewNotification = useCallback((notification: Notification) => {
        // Skip ALL notifications on admin routes - admin panel is a separate management interface
        if (isAdminRoute) {
            return; // Don't show any notifications on admin panel
        }

        // Update unread count
        setUnreadCount((prev) => prev + 1);
        // Show toast
        showToast(notification);
        // Notify all subscribers
        subscribersRef.current.forEach((callback) => callback(notification));
    }, [showToast, isAdminRoute]);

    // Fetch unread count
    const refreshUnreadCount = useCallback(async () => {
        const token = getToken?.();
        if (!token || !isLoggedIn) return;
        try {
            const count = await fetchUnreadCount(token);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }, [getToken, isLoggedIn]);

    // Connect to WebSocket when logged in
    useEffect(() => {
        const token = getToken?.();
        if (!isLoggedIn || !token) {
            if (isConnectedRef.current) {
                disconnectSocket();
                isConnectedRef.current = false;
            }
            return;
        }

        // Only connect if not already connected
        if (!isConnectedRef.current && !isSocketConnected()) {
            connectSocket(token, {
                onNewNotification: handleNewNotification,
                onConnect: () => {
                    isConnectedRef.current = true;
                },
                onDisconnect: () => {
                    isConnectedRef.current = false;
                },
            });
        }

        // Fetch initial unread count
        refreshUnreadCount();

        return () => {
            // Don't disconnect on cleanup - let messaging context handle it
        };
    }, [isLoggedIn, getToken, handleNewNotification, refreshUnreadCount]);

    return (
        <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount, subscribe }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="pointer-events-auto"
                        >
                            <div className="w-80 bg-slate-900/95 backdrop-blur-xl border border-cyan-400/30 rounded-xl shadow-2xl shadow-cyan-500/10 overflow-hidden">
                                {/* Header */}
                                <div className="px-4 py-2 bg-linear-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bell className="w-4 h-4 text-cyan-400" />
                                        <span className="text-sm font-semibold text-cyan-300">Thông báo mới</span>
                                    </div>
                                    <button
                                        onClick={() => dismissToast(toast.id)}
                                        className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Content */}
                                <Link
                                    href={toast.notification.actionUrl || '#'}
                                    onClick={() => dismissToast(toast.id)}
                                >
                                    <div className="p-4 hover:bg-white/5 transition-colors">
                                        <div className="flex gap-3">
                                            {/* Actor Avatar */}
                                            <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-white/10">
                                                {toast.notification.actor?.avatar ? (
                                                    <Image
                                                        src={toast.notification.actor.avatar}
                                                        alt={toast.notification.actor.name}
                                                        width={40}
                                                        height={40}
                                                        className="w-full h-full object-cover"
                                                        unoptimized={toast.notification.actor.avatar.includes('dicebear.com')}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xl">
                                                        {getNotificationIcon(toast.notification.type)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Text Content */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-white line-clamp-1">
                                                    {toast.notification.title}
                                                </h4>
                                                <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                                                    {toast.notification.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
}
