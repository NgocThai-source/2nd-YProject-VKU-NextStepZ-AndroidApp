'use client';

import { motion } from 'framer-motion';
import {
  X,
  MapPin,
  Briefcase,
  DollarSign,
  Navigation2,
} from 'lucide-react';
import Image from 'next/image';
import { Company } from '@/lib/companies-mock-data';
import { calculateDistance } from '@/lib/services/geolocation-service';

interface JobMapDetailsProps {
  company: Company | null;
  onClose: () => void;
  userLocation?: { latitude: number; longitude: number } | null;
  isMobile?: boolean;
}

export function JobMapDetails({
  company,
  onClose,
  userLocation,
  isMobile = false,
}: JobMapDetailsProps) {
  if (!company) return null;

  const distance = userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        company.latitude,
        company.longitude
      )
    : null;

  // Tính số vị trí tuyển dụng thực tế từ jobCategories
  const actualOpenPositions = company.jobCategories?.length || company.openPositions || 0;

  const containerVariants = {
    hidden: { opacity: 0, x: 400 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
    exit: {
      opacity: 0,
      x: 400,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={isMobile ? "w-full space-y-3" : "absolute right-10 top-50 w-80 bg-slate-900 border-l border-cyan-400/20 rounded-l-lg shadow-2xl z-40 flex flex-col max-h-[65vh]"}
    >
      {/* Header - only show on desktop */}
      {!isMobile && (
        <div className="flex items-center justify-between p-3 border-b border-cyan-400/10 shrink-0">
          <h2
            className="text-sm font-bold text-white"
            style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
          >
            Thông tin công ty
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </motion.button>
        </div>
      )}

      {/* Content */}
      <div className={isMobile ? "space-y-3" : "p-4 space-y-3 flex-1 overflow-y-auto"}>
        {/* Logo và Tên công ty */}
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-800 border border-cyan-400/20 shrink-0">
            <Image
              src={company.logo}
              alt={company.name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-bold text-white truncate"
              style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
            >
              {company.name}
            </h3>
            <p className="text-xs text-cyan-300 truncate">{company.location}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-cyan-400/10" />

        {/* Địa chỉ */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-300">Địa chỉ</p>
            <p className="text-xs text-gray-400 line-clamp-2">{company.address}</p>
          </div>
        </div>

        {/* Số vị trí tuyển dụng */}
        <div className="flex items-start gap-2">
          <Briefcase className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-300">Đang tuyển dụng</p>
            <p className="text-sm font-semibold text-cyan-300">{actualOpenPositions} vị trí</p>
          </div>
        </div>

        {/* Mức lương */}
        <div className="flex items-start gap-2">
          <DollarSign className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-300">Mức lương</p>
            <p className="text-sm font-semibold text-yellow-400">
              {company.salaryRange[0]}M - {company.salaryRange[1]}M VNĐ
            </p>
          </div>
        </div>

        {/* Khoảng cách */}
        {distance !== null && (
          <div className="flex items-start gap-2">
            <Navigation2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-300">Khoảng cách</p>
              <p className="text-xs text-gray-400">{distance.toFixed(1)} km</p>
            </div>
          </div>
        )}
      </div>

      {/* Nút Xem công việc */}
      <div className={isMobile ? "pt-3 border-t border-cyan-400/10" : "p-4 border-t border-cyan-400/10 shrink-0"}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            window.open(`/companies?search=${encodeURIComponent(company.name)}`, '_blank');
          }}
          className="w-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Briefcase className="w-4 h-4" />
          Xem công việc
        </motion.button>
      </div>
    </motion.div>
  );
}
