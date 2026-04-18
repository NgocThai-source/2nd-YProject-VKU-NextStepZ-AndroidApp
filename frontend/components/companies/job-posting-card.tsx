'use client';

import { motion } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  Eye,
  Users,
  TrendingUp,
  BookmarkPlus,
  Share2,
  Flag,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { JobPosting } from './job-posting.types';
import { useSaveCompany } from '@/lib/use-save-items';

// Helper function to get full image URL
const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  // If it's already a full URL (http/https) or a data URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  // For relative paths like /uploads/..., prepend backend URL
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
  return `${backendUrl}${imagePath}`;
};

interface JobPostingCardProps {
  posting: JobPosting;
  viewType?: 'grid' | 'list';
  onViewDetails?: (posting: JobPosting) => void;
  onReport?: (posting: JobPosting) => void;
}

export function JobPostingCard({
  posting,
  viewType = 'grid',
  onViewDetails,
  onReport
}: JobPostingCardProps) {
  const { toggleSaveCompany, isSavedCompany } = useSaveCompany();
  const [isSaved, setIsSaved] = useState(false);
  // Use actual view count from posting data
  const viewsCount = posting.viewCount || 0;

  // Check if saved on mount and when posting changes
  useEffect(() => {
    setIsSaved(isSavedCompany(posting.id));
  }, [posting.id, isSavedCompany]);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleSaveCompany(posting.id, posting.companyName);
    setIsSaved(!isSaved);
  };

  const handleViewDetails = () => {
    onViewDetails?.(posting);
  };

  if (viewType === 'list') {
    return (
      <motion.div
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        className="rounded-lg border border-cyan-400/20 backdrop-blur-sm bg-linear-to-br from-white/10 to-white/5 overflow-hidden hover:border-cyan-400/40 transition-all p-6 cursor-pointer"
        onClick={handleViewDetails}
      >
        <div className="flex gap-6 items-start">
          {/* Logo */}
          <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-700 flex items-center justify-center">
            {posting.companyLogo ? (
              <Image
                src={getImageUrl(posting.companyLogo)}
                alt={posting.companyName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <Briefcase className="w-10 h-10 text-cyan-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-xl font-bold text-white mb-2 line-clamp-1"
              style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
            >
              {posting.companyName}
            </h3>

            <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {posting.address?.split(',')[0] ?? 'N/A'}
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                {posting.jobPositions?.length ?? 0} vị trí
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {posting.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {posting.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-white">{viewsCount}</span>
                  <span className="text-xs text-gray-500">
                    lượt xem
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <BookmarkPlus
                    className={`w-5 h-5 ${isSaved
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-400'
                      }`}
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReport?.(posting);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Báo cáo"
                >
                  <Flag className="w-5 h-5 text-gray-400 hover:text-yellow-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view - giống CompanyCard
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="relative group h-full cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="absolute inset-0 bg-linear-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />

      <div className="relative rounded-lg border border-cyan-400/20 backdrop-blur-sm bg-linear-to-br from-white/10 to-white/5 overflow-hidden hover:border-cyan-400/40 transition-all h-full flex flex-col">
        {/* Cover Image */}
        <div className="relative w-full h-32 overflow-hidden bg-slate-700">
          {posting.galleryImages.length > 0 ? (
            <Image
              src={getImageUrl(posting.galleryImages[0])}
              alt={posting.companyName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-slate-700 to-slate-600 flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-cyan-400/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />

          {/* Logo overlay */}
          <div className="absolute bottom-2 left-2 w-12 h-12 rounded-lg overflow-hidden bg-slate-700 border-2 border-cyan-400/40 flex items-center justify-center">
            {posting.companyLogo ? (
              <Image
                src={getImageUrl(posting.companyLogo)}
                alt={posting.companyName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <Briefcase className="w-6 h-6 text-cyan-400" />
            )}
          </div>

          {/* Views Badge */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="absolute top-3 right-3 flex items-center gap-1 bg-blue-400/90 backdrop-blur-sm px-2 py-1 rounded-lg"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-blue-900 text-sm">
              {viewsCount}
            </span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3
            className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors"
            style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
          >
            {posting.companyName}
          </h3>

          <div className="flex flex-wrap gap-2 mb-3">
            {posting.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-gray-400 text-sm mb-3 line-clamp-2 flex-1">
            {posting.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b border-cyan-400/10">
            <div className="text-center">
              <Briefcase className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p
                className="text-xs text-gray-400"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                {posting.jobPositions?.length ?? 0}
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p
                className="text-xs text-gray-400"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                {viewsCount}
              </p>
            </div>
            <div className="text-center">
              <Users className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p
                className="text-xs text-gray-400"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                {posting.jobPositions?.length ?? 0} vị trí
              </p>
            </div>
          </div>

          {/* Location and Meta */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">{posting.address?.split(',')[0] ?? 'N/A'}</span>
          </div>

          {/* Salary Badge */}
          {(posting.jobPositions?.length ?? 0) > 0 && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mb-4 p-2 rounded-lg bg-linear-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20"
            >
              <p
                className="text-xs text-green-300"
                style={{ fontFamily: "'Poppins SemiBold', sans-serif" }}
              >
                Lương: {posting.jobPositions?.[0]?.minSalary ?? 0}M - {posting.jobPositions?.[0]?.maxSalary ?? 0}M
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-cyan-400/10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${isSaved
                ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                : 'bg-white/10 text-gray-300 border border-cyan-400/20 hover:border-cyan-400/40'
                }`}
            >
              <BookmarkPlus className="w-4 h-4 mx-auto" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onReport?.(posting);
              }}
              className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold bg-yellow-500/10 text-yellow-300 border border-yellow-400/20 hover:border-yellow-400/40 transition-all"
              title="Báo cáo"
            >
              <Flag className="w-4 h-4 mx-auto" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold bg-linear-to-r from-cyan-400/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/50 transition-all"
            >
              Chi tiết
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
