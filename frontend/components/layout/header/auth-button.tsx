'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { MessengerButton } from './messenger-button';
import { NotificationBell } from './notification-bell';
import { UserDropdown } from './user-dropdown';

interface AuthButtonProps {
  scrolled: boolean;
}

export function AuthButton({ scrolled }: AuthButtonProps) {
  const { isLoggedIn } = useAuth();

  // Show notification bell and user dropdown when logged in
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <MessengerButton scrolled={scrolled} />
        <NotificationBell scrolled={scrolled} />
        <UserDropdown scrolled={scrolled} />
      </div>
    );
  }

  // Show login button when not logged in
  return (
    <Link href="/auth">
      <button
        className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ease-out whitespace-nowrap ${
          scrolled
            ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105'
            : 'bg-linear-to-r from-cyan-400/90 to-blue-500/90 text-white hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-400/40 hover:scale-105'
        }`}
        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
      >
        Đăng nhập / Đăng ký
      </button>
    </Link>
  );
}
