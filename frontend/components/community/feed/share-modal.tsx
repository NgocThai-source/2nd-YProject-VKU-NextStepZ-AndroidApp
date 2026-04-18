'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Facebook, MessageCircle, Mail, Link as LinkIcon, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Post } from '@/lib/community-mock-data';
import * as communityApi from '@/lib/community-api';

interface ShareModalProps {
  isOpen: boolean;
  post: Post;
  onClose: () => void;
  onShareCountUpdate?: (newCount: number) => void;
}

export function ShareModal({ isOpen, post, onClose, onShareCountUpdate }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure we're client-side before creating portal
  useEffect(() => {
    setMounted(true);
  }, []);

  const postUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/shared-post/${post.id}`
    : `/shared-post/${post.id}`;

  const handleCopyLink = async () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Increment share count in backend
    try {
      const result = await communityApi.incrementShareCount(post.id);
      onShareCountUpdate?.(result.shareCount);
    } catch (err) {
      console.error('Error incrementing share count:', err);
    }
  };

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const shareToMessenger = () => {
    const messengerUrl = `https://www.facebook.com/dialog/send?app_id=YOUR_APP_ID&link=${encodeURIComponent(postUrl)}&redirect_uri=${encodeURIComponent(postUrl)}`;
    window.open(messengerUrl, '_blank', 'width=600,height=400');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Chia sẻ từ ${post.author.name}`);
    const body = encodeURIComponent(`\nHãy xem bài viết này từ ${post.author.name}:\n\n${post.content.slice(0, 100)}...\n\n${postUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareOptions = [
    {
      id: 'copy',
      label: 'Sao chép liên kết',
      icon: copied ? Check : Copy,
      color: 'text-cyan-400',
      bgColor: 'hover:bg-cyan-500/10',
      action: handleCopyLink,
    },
    {
      id: 'facebook',
      label: 'Chia sẻ trên Facebook',
      icon: Facebook,
      color: 'text-blue-500',
      bgColor: 'hover:bg-blue-500/10',
      action: shareToFacebook,
    },
    {
      id: 'messenger',
      label: 'Gửi qua Messenger',
      icon: MessageCircle,
      color: 'text-blue-400',
      bgColor: 'hover:bg-blue-400/10',
      action: shareToMessenger,
    },
    {
      id: 'email',
      label: 'Gửi qua Email',
      icon: Mail,
      color: 'text-red-400',
      bgColor: 'hover:bg-red-400/10',
      action: shareViaEmail,
    },
  ];

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="bg-slate-800 border border-cyan-400/20 rounded-2xl max-w-md w-full backdrop-blur-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyan-400/10">
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                  Chia Sẻ Bài Viết
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Post Preview */}
                <div className="p-4 rounded-lg bg-white/5 border border-cyan-400/20">
                  <h3 className="font-semibold text-white mb-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                    {post.author.name}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-3" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                    {post.content}
                  </p>
                </div>

                {/* Share Options */}
                <div className="space-y-2">
                  {shareOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={option.action}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-white/10 transition-all ${option.bgColor}`}
                      >
                        <Icon className={`w-5 h-5 ${option.color}`} />
                        <span className="text-white text-sm font-medium" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                          {option.label}
                        </span>
                        {copied && option.id === 'copy' && (
                          <span className="ml-auto text-xs text-cyan-300">Đã sao chép!</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Copy Link Section */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-400 font-medium" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                    Liên kết
                  </p>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/50 border border-cyan-400/20">
                    <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={postUrl}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-gray-300 outline-none truncate"
                      style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopyLink}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors shrink-0"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-cyan-300" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal at document body level (outside any clipping containers)
  if (!mounted) {
    return null;
  }

  return createPortal(modalContent, document.body);
}
