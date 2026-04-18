'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Briefcase, DollarSign, Trash2, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/components/ui/toast';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/confirm-modal';

// Type definition (kept for reference)
interface SavedJob {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  location: string;
  salary?: [number, number];
  description: string;
  category?: string;
  savedAt: string;
}

interface SavedJobCardProps {
  savedJob: SavedJob;
  onRemove: (id: string) => void;
}

export function SavedJobCard({ savedJob, onRemove }: SavedJobCardProps) {
  const { addToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = () => {
    onRemove(savedJob.jobId);
    addToast(`Đã xóa việc làm "${savedJob.jobTitle}"`, 'success');
    setShowConfirm(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -4 }}
      className="relative group h-full"
    >
      <div className="absolute inset-0 bg-linear-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />

      <div className="relative rounded-lg border border-cyan-400/20 backdrop-blur-sm bg-linear-to-br from-white/10 to-white/5 overflow-hidden hover:border-cyan-400/40 transition-all h-full flex flex-col p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors"
              style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
            >
              {savedJob.jobTitle}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-1">
              {savedJob.companyName}
            </p>
          </div>
          {savedJob.companyLogo && (
            <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-700">
              <Image
                src={savedJob.companyLogo}
                alt={savedJob.companyName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 mb-3 py-3 border-y border-cyan-400/10 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">{savedJob.location}</span>
          </div>

          {savedJob.salary && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <DollarSign className="w-4 h-4 text-green-400 shrink-0" />
              <span>{savedJob.salary[0]}M - {savedJob.salary[1]}M/tháng</span>
            </div>
          )}

          {savedJob.category && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Briefcase className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate">{savedJob.category}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {savedJob.description && (
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {savedJob.description}
          </p>
        )}

        {/* Saved Date */}
        <p className="text-xs text-gray-500 mb-3">
          Lưu từ {new Date(savedJob.savedAt).toLocaleDateString('vi-VN')}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-cyan-400/10">
          <Link href={`/companies?search=${encodeURIComponent(savedJob.companyName)}`} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-3 py-2 rounded-lg text-sm font-semibold bg-linear-to-r from-cyan-400/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/50 transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Xem Công Ty
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowConfirm(true)}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-500/10 text-red-400 border border-red-400/30 hover:border-red-400/50 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>

    {/* Confirm Modal for single delete */}
    <ConfirmModal
      isOpen={showConfirm}
      title="Xóa việc làm"
      description={`Bạn chắc chắn muốn xóa việc làm "${savedJob.jobTitle}" khỏi danh sách lưu? Hành động này không thể hoàn tác.`}
      confirmText="Xóa"
      cancelText="Hủy"
      isDangerous
      onConfirm={handleRemove}
      onCancel={() => setShowConfirm(false)}
    />
    </>
  );
}
