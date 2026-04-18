'use client';

import { Bell, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import {
  Notification,
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsAsRead,
  clearAllNotifications,
  getTimeAgo,
  getNotificationIcon,
} from '@/lib/notifications';

interface NotificationBellProps {
  scrolled: boolean;
}

export function NotificationBell({ scrolled }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getToken, isLoggedIn } = useAuth();

  // Fetch unread count on mount and periodically
  const fetchUnread = useCallback(async () => {
    const token = getToken?.();
    if (!token || !isLoggedIn) return;
    try {
      const count = await fetchUnreadCount(token);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [getToken, isLoggedIn]);

  // Fetch notifications when dropdown opens
  const loadNotifications = useCallback(async () => {
    const token = getToken?.();
    if (!token || !isLoggedIn) return;
    setLoading(true);
    try {
      const response = await fetchNotifications(token, 1, 10);
      setNotifications(response.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoggedIn]);

  // Fetch unread count on mount
  useEffect(() => {
    fetchUnread();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  const handleBellClick = async () => {
    if (!isOpen) {
      // Opening the dropdown
      await loadNotifications();
      // Mark all as read when opening
      const token = getToken?.();
      if (unreadCount > 0 && token) {
        await markAllNotificationsAsRead(token);
        setUnreadCount(0);
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        );
      }
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <motion.button
        onClick={handleBellClick}
        className={`relative p-2 rounded-lg transition-all duration-200 ${scrolled
          ? 'text-gray-300 hover:bg-white/5 hover:text-white'
          : 'text-gray-400 hover:bg-white/5 hover:text-cyan-300'
          }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
            className="absolute top-full right-0 mt-2 w-96 rounded-xl bg-slate-900 border border-cyan-400/20 shadow-2xl shadow-black/40 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 bg-linear-to-r from-slate-900 to-slate-800/50">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  Thông báo
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {unreadCount} chưa đọc
                  </span>
                  {notifications.length > 0 && (
                    <button
                      onClick={async () => {
                        const token = getToken?.();
                        if (!token) return;
                        setIsClearing(true);
                        try {
                          await clearAllNotifications(token);
                          setNotifications([]);
                          setUnreadCount(0);
                        } catch (error) {
                          console.error('Error clearing notifications:', error);
                        } finally {
                          setIsClearing(false);
                        }
                      }}
                      disabled={isClearing}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                      title="Xóa tất cả thông báo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {isClearing ? 'Đang xóa...' : 'Xóa tất cả'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto scroll-smooth">
              {loading ? (
                <div className="px-4 py-8 text-center">
                  <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />
                  <p className="text-gray-400 text-sm mt-2">Đang tải...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Không có thông báo nào</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors duration-200 cursor-pointer group ${!notification.read ? 'bg-cyan-500/5' : ''
                      }`}
                  >
                    <Link
                      href={notification.actionUrl || '#'}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex gap-3">
                        {/* Actor Avatar */}
                        <div className="shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-white/5">
                          {notification.actor?.avatar ? (
                            <Image
                              src={notification.actor.avatar}
                              alt={notification.actor.name}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                              unoptimized={notification.actor.avatar.includes('dicebear.com')}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">
                              {getNotificationIcon(notification.type)}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="shrink-0 w-2 h-2 mt-1.5 rounded-full bg-cyan-400" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">
                            {notification.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {getTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
