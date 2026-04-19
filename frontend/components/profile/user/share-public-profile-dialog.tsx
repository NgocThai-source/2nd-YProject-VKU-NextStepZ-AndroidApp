'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Mail,
  Facebook,
  Eye,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';

interface SharePublicProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: {
    id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    bio?: string;
  };
  shareUrl?: string;
  publicProfile?: {
    id?: string;
    shareToken?: string;
    isActive?: boolean;
    viewCount?: number;
  };
}

export default function SharePublicProfileDialog({
  isOpen,
  onClose,
  userProfile,
  publicProfile,
  shareUrl,
}: SharePublicProfileDialogProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  // Generate URL based on publicProfile.shareToken or use provided shareUrl
  const dynamicShareUrl = publicProfile?.shareToken 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/public-profile/${publicProfile.shareToken}`
    : shareUrl || (typeof window !== 'undefined' ? window.location.origin + '/public-profile' : '');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(dynamicShareUrl);
    setIsCopied(true);
    addToast('Đã sao chép liên kết hồ sơ công khai!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShareViaEmail = () => {
    const subject = `Hồ sơ công khai của ${userProfile?.name || 'tôi'}`;
    const body = `Xem hồ sơ công khai của tôi: ${dynamicShareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    onClose();
  };

  const handleShareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(dynamicShareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleViewPublicProfile = () => {
    if (publicProfile?.shareToken) {
      router.push(`/public-profile/${publicProfile.shareToken}`);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            Chia sẻ hồ sơ công khai
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Share URL Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <p className="text-sm text-gray-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              Chia sẻ liên kết hồ sơ công khai của bạn với những người khác
            </p>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800 border border-slate-700">
              <input
                type="text"
                value={dynamicShareUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-300 outline-none text-ellipsis"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className={`p-2 rounded-lg transition-all ${
                  isCopied
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isCopied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>

          {/* Share Methods */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-2"
          >
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShareViaEmail}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <Mail className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                Chia sẻ qua Email
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShareViaFacebook}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <Facebook className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                Chia sẻ qua Facebook
              </span>
            </motion.button>
          </motion.div>

          {/* View Public Profile Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleViewPublicProfile}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 hover:border-cyan-400 text-cyan-400 transition-all"
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              <Eye className="w-4 h-4" />
              <span>Xem hồ sơ công khai</span>
            </motion.button>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-400/20"
          >
            <p className="text-xs text-cyan-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              💡 Mẹo: Chia sẻ hồ sơ công khai của bạn để những người khác có thể tìm kiếm và xem thông tin chuyên môn của bạn.
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
