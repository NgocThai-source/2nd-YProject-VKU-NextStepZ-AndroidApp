'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMessaging } from '@/lib/messaging-context';

interface MessengerButtonProps {
  scrolled: boolean;
}

export function MessengerButton({ scrolled }: MessengerButtonProps) {
  const { conversations, markAllAsRead } = useMessaging();
  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleClick = () => {
    // Mark all messages as read when clicking the messenger icon
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <Link href="/messages">
      <motion.button
        onClick={handleClick}
        className={`relative p-2 rounded-lg transition-all duration-200 ${
          scrolled
            ? 'text-gray-300 hover:bg-white/5 hover:text-white'
            : 'text-gray-400 hover:bg-white/5 hover:text-cyan-300'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Messages"
      >
        <MessageCircle className="w-5 h-5" />

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
    </Link>
  );
}
