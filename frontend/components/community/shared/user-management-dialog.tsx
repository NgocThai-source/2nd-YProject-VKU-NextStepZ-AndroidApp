'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Volume2, VolumeX, Ban } from 'lucide-react';
import { useState } from 'react';
import { CommunityUser } from '@/lib/community-mock-data';
import { Avatar } from './avatar';

interface UserManagementDialogProps {
  user: CommunityUser;
  isOpen: boolean;
  onClose: () => void;
  onBlock?: (userId: string) => void;
  onMute?: (userId: string) => void;
}

export function UserManagementDialog({
  user,
  isOpen,
  onClose,
  onBlock,
  onMute,
}: UserManagementDialogProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBlock = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsBlocked(!isBlocked);
    onBlock?.(user.id);
    setIsSubmitting(false);
  };

  const handleMute = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsMuted(!isMuted);
    onMute?.(user.id);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl bg-linear-to-b from-slate-800 to-slate-900 border border-cyan-400/20 p-6 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar src={user.avatar} alt={user.name} size="lg" />
          <div>
            <h2
              className="text-lg font-bold text-white"
              style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
            >
              {user.name}
            </h2>
            <p className="text-xs text-gray-400">{user.title || user.role}</p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* Block Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            onClick={handleBlock}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
              isBlocked
                ? 'bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30'
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Ban className="w-5 h-5" />
            <div className="text-left flex-1">
              <p
                className="text-sm font-semibold"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                {isBlocked ? 'Đã chặn' : 'Chặn người dùng'}
              </p>
              <p className="text-xs text-gray-400">
                {isBlocked
                  ? 'Bạn đã chặn người dùng này'
                  : 'Bạn sẽ không nhìn thấy bài viết của họ'}
              </p>
            </div>
          </motion.button>

          {/* Mute Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            onClick={handleMute}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
              isMuted
                ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30'
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
            <div className="text-left flex-1">
              <p
                className="text-sm font-semibold"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                {isMuted ? 'Đã tắt tiếng' : 'Tắt tiếng thông báo'}
              </p>
              <p className="text-xs text-gray-400">
                {isMuted
                  ? 'Bạn không sẽ nhận thông báo từ người dùng này'
                  : 'Không nhận thông báo từ họ'}
              </p>
            </div>
          </motion.button>

          {/* Report Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 p-3 rounded-lg border bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            <div className="text-left flex-1">
              <p
                className="text-sm font-semibold"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Báo cáo người dùng
              </p>
              <p className="text-xs text-gray-400">Báo cáo hành vi không phù hợp</p>
            </div>
          </motion.button>
        </div>


        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 rounded-lg bg-white/10 text-gray-300 font-semibold hover:bg-white/20 transition-colors"
          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
        >
          Đóng
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
