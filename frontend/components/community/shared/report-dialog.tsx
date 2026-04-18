'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, description: string) => void;
  contentType: 'post' | 'comment' | 'user';
}

const reportReasons = {
  post: [
    { id: 'spam', label: '🚫 Spam hoặc quảng cáo' },
    { id: 'hate', label: '😠 Nội dung gây hận thù' },
    { id: 'violence', label: '⚠️ Bạo lực hoặc gây hại' },
    { id: 'adult', label: '🔞 Nội dung trưởng thành' },
    { id: 'copyright', label: '©️ Vi phạm bản quyền' },
    { id: 'misleading', label: '🤥 Thông tin sai lệch' },
  ],
  comment: [
    { id: 'spam', label: '🚫 Spam' },
    { id: 'hate', label: '😠 Nội dung gây hận thù' },
    { id: 'harassment', label: '😤 Qu騷rào' },
    { id: 'inappropriate', label: '⚠️ Không phù hợp' },
  ],
  user: [
    { id: 'spam', label: '🚫 Tài khoản spam' },
    { id: 'harassment', label: '😤 Quấy rối' },
    { id: 'impersonation', label: '🎭 Giả mạo' },
    { id: 'inappropriate', label: '⚠️ Hành vi không phù hợp' },
  ],
};

export function ReportDialog({
  isOpen,
  onClose,
  onSubmit,
  contentType,
}: ReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    onSubmit(selectedReason, description);
    setSelectedReason('');
    setDescription('');
    setIsSubmitting(false);
    onClose();
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
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold text-white"
            style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
          >
            Báo Cáo Nội Dung
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </motion.button>
        </div>

        <p className="text-sm text-gray-400 mb-4" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
          Vui lòng cho chúng tôi biết lý do bạn muốn báo cáo nội dung này
        </p>

        {/* Reasons */}
        <div className="space-y-2 mb-4">
          {reportReasons[contentType].map((reason) => (
            <motion.button
              key={reason.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedReason(reason.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                selectedReason === reason.id
                  ? 'bg-cyan-400/20 border-cyan-400/40'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  selectedReason === reason.id
                    ? 'bg-cyan-400 border-cyan-400'
                    : 'border-gray-400'
                }`}
              >
                {selectedReason === reason.id && (
                  <Check className="w-3 h-3 text-slate-900" />
                )}
              </div>
              <span className="text-sm text-gray-300">{reason.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Description */}
        <textarea
          placeholder="Mô tả chi tiết (tùy chọn)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          className="w-full h-24 px-3 py-2 rounded-lg bg-white/10 border border-cyan-400/20 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-400/40 resize-none mb-3"
          style={{ fontFamily: "'Poppins Regular', sans-serif" }}
        />
        <p className="text-xs text-gray-500 mb-4">
          {description.length}/500
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-gray-300 font-semibold hover:bg-white/20 transition-colors"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
          >
            Hủy
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!selectedReason || isSubmitting}
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 font-semibold hover:bg-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
