'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Trash2, ExternalLink } from 'lucide-react';
import { SavedCompany } from '@/lib/saved-items-context';
import Image from 'next/image';
import { useToast } from '@/components/ui/toast';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface SavedCompanyCardProps {
  savedCompany: SavedCompany;
  onRemove: (id: string) => void;
}

export function SavedCompanyCard({ savedCompany, onRemove }: SavedCompanyCardProps) {
  const { company } = savedCompany;
  const { addToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = () => {
    onRemove(company.id);
    addToast(`Đã xóa công ty "${company.name}"`, 'success');
    setShowConfirm(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        className="rounded-lg border border-cyan-400/20 backdrop-blur-sm bg-linear-to-br from-white/10 to-white/5 overflow-hidden hover:border-cyan-400/40 transition-all p-4"
      >
        <div className="flex gap-4 items-start">
          {/* Logo */}
          <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-700">
            <Image
              src={company.logo}
              alt={company.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h3
                  className="text-lg font-bold text-white line-clamp-1 hover:text-cyan-300 transition-colors"
                  style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                >
                  {company.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Lưu từ {new Date(savedCompany.savedAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {company.location}
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {company.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {(company.tags || []).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-cyan-400/10">
              <Link
                href={`/companies?search=${encodeURIComponent(company.name)}`}
                className="flex-1"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-3 py-2 rounded-lg text-sm font-semibold bg-linear-to-r from-cyan-400/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/50 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Xem Chi Tiết
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
        </div>
      </motion.div>

      {/* Confirm Modal for single delete */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Xóa công ty"
        description={`Bạn chắc chắn muốn xóa công ty "${company.name}" khỏi danh sách lưu? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        isDangerous
        onConfirm={handleRemove}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
