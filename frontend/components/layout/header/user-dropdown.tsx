'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  User,
  Briefcase,
  Bookmark,
  Settings,
  LogOut,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from '@/lib/profile-context';

interface UserDropdownProps {
  scrolled: boolean;
}

export function UserDropdown({ scrolled }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { userProfile } = useProfile();
  const router = useRouter();

  // Get avatar from ProfileContext (real-time sync) or fallback
  const avatarUrl = userProfile?.avatar;

  // Dynamic menu items based on user role
  const MENU_ITEMS = user?.role === 'employer'
    ? [
      {
        label: 'Trang cá nhân',
        href: '/profile',
        icon: User,
      },
      {
        label: 'Quản lý bài tuyển dụng',
        href: '/manage-job-posts',
        icon: Briefcase,
      },
      {
        label: 'Quản lý bài viết',
        href: '/manage-posts',
        icon: MessageSquare,
      },
      {
        label: 'Mục đã lưu',
        href: '/saves',
        icon: Bookmark,
      },
      {
        label: 'Cài đặt tài khoản',
        href: '/settings',
        icon: Settings,
      },
    ]
    : [
      {
        label: 'Trang cá nhân',
        href: '/profile',
        icon: User,
      },
      {
        label: 'Hồ sơ sáng tạo của tôi',
        href: '/saved-portfolios',
        icon: Briefcase,
      },
      {
        label: 'Quản lý bài viết',
        href: '/manage-posts',
        icon: MessageSquare,
      },
      {
        label: 'Mục đã lưu',
        href: '/saves',
        icon: Bookmark,
      },
      {
        label: 'Cài đặt tài khoản',
        href: '/settings',
        icon: Settings,
      },
    ];

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

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-200 flex items-center justify-center text-white font-semibold text-sm ${scrolled
          ? 'border-cyan-400/40 hover:border-cyan-400/60 bg-linear-to-br from-cyan-500 to-blue-600'
          : 'border-cyan-400/30 hover:border-cyan-400/50 bg-linear-to-br from-cyan-500 to-blue-600'
          }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="User menu"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={user?.username || 'User'}
            width={40}
            height={40}
            className="w-full h-full object-cover"
            unoptimized={avatarUrl.includes('dicebear.com')}
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center bg-linear-to-br from-cyan-400 to-blue-500">
            {user?.username.charAt(0).toUpperCase() || 'A'}
          </span>
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
            className="absolute top-full right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-cyan-400/20 shadow-2xl shadow-black/40 z-50 max-h-[calc(100vh-100px)] overflow-y-auto overscroll-contain md:max-h-none md:overflow-y-visible"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* User Info Header */}
            <div className="px-4 py-4 border-b border-white/10 bg-linear-to-r from-slate-900 to-slate-800/50">
              <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                {user?.name || user?.username || 'Demo User'}
              </h3>
              <p className="text-sm text-gray-400 mt-1" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                {user?.email || 'demo@nextstepz.com'}
              </p>
              <p className="text-sm text-gray-400 mt-1" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                {(user as unknown as Record<string, string>)?.phone || '+84 123 456 789'}
              </p>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  Loại tài khoản
                </p>
                <p className={`text-sm font-medium ${user?.role === 'employer' ? 'text-amber-300' : 'text-cyan-300'}`} style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                  {user?.role === 'employer' ? 'Nhà tuyển dụng' : 'Sinh viên'}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {MENU_ITEMS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setIsOpen(false);
                      router.push(item.href);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-cyan-300 transition-colors duration-200 flex items-center justify-between group"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all" />
                  </motion.button>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="px-4 py-3 border-t border-white/10 bg-linear-to-r from-slate-900/50 to-slate-800/30">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: MENU_ITEMS.length * 0.05 }}
                onClick={handleLogout}
                className="w-full px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium group"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Đăng xuất
              </motion.button>
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
