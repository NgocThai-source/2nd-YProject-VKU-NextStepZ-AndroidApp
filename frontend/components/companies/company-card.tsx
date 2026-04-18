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
} from 'lucide-react';
import Image from 'next/image';
import { Company } from '@/lib/companies-mock-data';
import { useState, useEffect } from 'react';
import { useSaveCompany } from '@/lib/use-save-items';

interface CompanyCardProps {
  company: Company;
  viewType?: 'grid' | 'list';
}

export function CompanyCard({ company, viewType = 'grid' }: CompanyCardProps) {
  const { toggleSaveCompany, isSavedCompany } = useSaveCompany();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(isSavedCompany(company.id));
  }, [company.id, isSavedCompany]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveCompany(company);
    setIsSaved(!isSaved);
  };

  if (viewType === 'list') {
    return (
      <motion.div
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        className="rounded-lg border border-cyan-400/20 backdrop-blur-sm bg-linear-to-br from-white/10 to-white/5 overflow-hidden hover:border-cyan-400/40 transition-all p-6"
      >
        <div className="flex gap-6 items-start">
          {/* Logo */}
          <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-700">
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
            <h3
              className="text-xl font-bold text-white mb-2 line-clamp-1"
              style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
            >
              {company.name}
            </h3>

            <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {company.location}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-cyan-400" />
                {company.size}
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                {company.openPositions} vị trí
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {company.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {company.industry.slice(0, 2).map((ind) => (
                <span
                  key={ind}
                  className="px-2 py-1 text-xs rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                >
                  {ind}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-white">{(company.views / 1000).toFixed(1)}K</span>
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
                    className={`w-5 h-5 ${
                      isSaved
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-400'
                    }`}
                  />
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

  // Grid view
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="relative group h-full"
    >
      <div className="absolute inset-0 bg-linear-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />

      <div className="relative rounded-lg border border-cyan-400/20 backdrop-blur-sm bg-linear-to-br from-white/10 to-white/5 overflow-hidden hover:border-cyan-400/40 transition-all h-full flex flex-col">
        {/* Cover Image */}
        <div className="relative w-full h-32 overflow-hidden bg-slate-700">
          <Image
            src={company.coverImage}
            alt={company.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />

          {/* Logo overlay */}
          <div className="absolute bottom-2 left-2 w-12 h-12 rounded-lg overflow-hidden bg-slate-700 border-2 border-cyan-400/40">
            <Image
              src={company.logo}
              alt={company.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Views Badge */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="absolute top-3 right-3 flex items-center gap-1 bg-blue-400/90 backdrop-blur-sm px-2 py-1 rounded-lg"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-blue-900 text-sm">
              {(company.views / 1000).toFixed(1)}K
            </span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3
            className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors"
            style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
          >
            {company.name}
          </h3>

          <div className="flex flex-wrap gap-2 mb-3">
            {company.industry.slice(0, 2).map((ind) => (
              <span
                key={ind}
                className="px-2 py-1 text-xs rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
              >
                {ind}
              </span>
            ))}
          </div>

          <p className="text-gray-400 text-sm mb-3 line-clamp-2 flex-1">
            {company.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b border-cyan-400/10">
            <div className="text-center">
              <Users className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p
                className="text-xs text-gray-400"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                {(company.followersCount || 0).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p
                className="text-xs text-gray-400"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                {((company.views || 0) / 1000).toFixed(1)}K
              </p>
            </div>
            <div className="text-center">
              <Briefcase className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p
                className="text-xs text-gray-400"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                {company.openPositions} roles
              </p>
            </div>
          </div>

          {/* Location and Meta */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">{company.location}</span>
          </div>

          {/* Salary Badge */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mb-4 p-2 rounded-lg bg-linear-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20"
          >
            <p
              className="text-xs text-green-300"
              style={{ fontFamily: "'Poppins SemiBold', sans-serif" }}
            >
              Lương: {company.salaryRange[0]}M - {company.salaryRange[1]}M
            </p>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-cyan-400/10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isSaved
                  ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                  : 'bg-white/10 text-gray-300 border border-cyan-400/20 hover:border-cyan-400/40'
              }`}
            >
              <BookmarkPlus className="w-4 h-4 mx-auto" />
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
