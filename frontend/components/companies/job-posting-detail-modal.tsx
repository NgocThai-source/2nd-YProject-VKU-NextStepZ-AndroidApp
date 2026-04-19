'use client';

import { motion } from 'framer-motion';
import {
  X,
  MapPin,
  Globe,
  Users,
  Clock,
  Calendar,
  DollarSign,
  Shield,
  Gift,
  TrendingUp,
  BookmarkPlus,
  Mail,
  Phone,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/toast';
import type { JobPosting } from './job-posting.types';
import { incrementJobPostingViewCount } from '@/lib/job-posting-api';
import { useSaveCompany } from '@/lib/use-save-items';
import { useAuth } from '@/lib/auth-context';
import { useSavedPortfolio, SavedPortfolio } from '@/lib/saved-portfolio-context';
import { PortfolioSelectModal } from './portfolio-select-modal';

interface JobPostingDetailModalProps {
  posting: JobPosting;
  onClose: () => void;
  onViewCountUpdate?: (postingId: string, newViewCount: number) => void;
}

// Helper function to get full image URL
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  // If it's already a full URL (http/https) or a data URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  // For relative paths like /uploads/..., prepend backend URL
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
  return `${backendUrl}${imagePath}`;
};

export function JobPostingDetailModal({
  posting,
  onClose,
  onViewCountUpdate,
}: JobPostingDetailModalProps) {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { getSavedPortfolios, isLoading: portfolioLoading } = useSavedPortfolio();
  const { addToast } = useToast();
  const { toggleSaveCompany, isSavedCompany } = useSaveCompany();
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'jobs' | 'benefits' | 'gallery'
  >('overview');
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [viewsCount, setViewsCount] = useState(posting.viewCount || 0);
  const hasIncrementedView = useRef(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);

  // Get saved portfolios
  const savedPortfolios = getSavedPortfolios();

  // Handle Submit CV button click
  const handleSubmitCV = () => {
    // Check if logged in
    if (!isLoggedIn) {
      addToast('Vui lòng đăng nhập để gửi CV', 'error');
      return;
    }

    // Check if employer account
    if (user?.role === 'employer') {
      addToast('Chức năng này chỉ dành cho tài khoản Sinh Viên', 'error');
      return;
    }

    // Check if employer ID exists
    if (!posting.user?.id) {
      addToast('Không thể tìm thấy thông tin nhà tuyển dụng', 'error');
      return;
    }

    // Show portfolio selection modal
    setShowPortfolioModal(true);
  };

  // Handle portfolio selection
  const handlePortfolioSelect = (portfolio: SavedPortfolio) => {
    // Store data in sessionStorage for messages page to pick up
    const autoSendData = {
      employerId: posting.user?.id,
      employerName: posting.user?.companyName || posting.user?.username || posting.companyName,
      employerAvatar: posting.user?.avatar || '',
      portfolio: portfolio,
    };
    sessionStorage.setItem('nextstepz_auto_send_profile', JSON.stringify(autoSendData));

    // Navigate to messages
    router.push('/messages');
  };

  // Check if saved on mount and when posting changes
  useEffect(() => {
    setIsSaved(isSavedCompany(posting.id));
  }, [posting.id, isSavedCompany]);

  // Increment view count when modal opens (only once, with localStorage check)
  useEffect(() => {
    if (hasIncrementedView.current) return;
    hasIncrementedView.current = true;

    const incrementView = async () => {
      try {
        // Check localStorage for recent view (prevents unnecessary API calls)
        const viewedPostingsKey = 'nextstepz_viewed_postings';
        const viewedPostings = JSON.parse(localStorage.getItem(viewedPostingsKey) || '{}');
        const lastViewTime = viewedPostings[posting.id];
        const twentyFourHoursMs = 24 * 60 * 60 * 1000;

        // If viewed within 24 hours, skip API call (backend will also reject it)
        if (lastViewTime && (Date.now() - lastViewTime) < twentyFourHoursMs) {
          console.log('View already counted within 24 hours');
          return;
        }

        const result = await incrementJobPostingViewCount(posting.id);

        // Update localStorage only if it was a new view
        if (result.isNewView !== false) {
          viewedPostings[posting.id] = Date.now();
          // Clean up old entries (older than 24 hours)
          const now = Date.now();
          for (const [id, timestamp] of Object.entries(viewedPostings)) {
            if (now - (timestamp as number) > twentyFourHoursMs) {
              delete viewedPostings[id];
            }
          }
          localStorage.setItem(viewedPostingsKey, JSON.stringify(viewedPostings));
        }

        setViewsCount(result.viewCount);
        // Notify parent component about the updated view count
        onViewCountUpdate?.(posting.id, result.viewCount);
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
    };
    incrementView();
  }, [posting.id, onViewCountUpdate]);

  // Format address for display (Province/City, District, Detail Address)
  const formatAddress = (address: string) => {
    const parts = address.split(',').map(p => p.trim());
    // Address is stored as: Detail, District, City
    // We want to display as: City, District, Detail
    if (parts.length >= 3) {
      return `${parts[parts.length - 1]}, ${parts[parts.length - 2]}, ${parts.slice(0, parts.length - 2).join(', ')}`;
    }
    return address;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border border-cyan-400/20 bg-slate-900 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-slate-900/80 border-b border-cyan-400/10 px-6 py-4 flex items-center justify-between">
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
          >
            Chi tiết công ty
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Cover and Logo */}
          <div className="relative h-48 rounded-lg overflow-hidden bg-slate-800">
            {posting.galleryImages.filter((img: string) => img && img.trim()).length > 0 ? (
              <Image
                src={getImageUrl(posting.galleryImages.filter((img: string) => img && img.trim())[0])}
                alt={posting.companyName}
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  // Show fallback on error
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : null}
            {/* Fallback always visible behind image */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center -z-10">
              <Gift className="w-20 h-20 text-cyan-400/30" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

            {/* Logo, Name, and Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-700 border-4 border-cyan-400/30 flex items-center justify-center">
                  {posting.companyLogo ? (
                    <Image
                      src={posting.companyLogo}
                      alt={posting.companyName}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      unoptimized
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  {/* Fallback icon always visible behind image */}
                  <Gift className="w-12 h-12 text-cyan-400 absolute" />
                </div>

                <div>
                  <h1
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
                  >
                    {posting.companyName}
                  </h1>
                  <div className="flex gap-2 mt-2">
                    {posting.tags.slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  await toggleSaveCompany(posting.id, posting.companyName);
                  setIsSaved(!isSaved);
                }}
                className={`p-3 rounded-lg transition-all ${isSaved
                  ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                  : 'bg-white/10 text-gray-300 border border-cyan-400/20 hover:border-cyan-400/40'
                  }`}
              >
                <BookmarkPlus className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                icon: Users,
                label: 'Vị trí ứng tuyển',
                value: `${posting.jobPositions?.length ?? 0}`,
                color: 'text-cyan-400',
              },
              {
                icon: TrendingUp,
                label: 'Lượt xem',
                value: `${viewsCount}`,
                color: 'text-green-400',
              },
              {
                icon: MapPin,
                label: 'Địa điểm',
                value: posting.address?.split(',').pop()?.trim() || posting.address || 'N/A',
                color: 'text-red-400',
              },
              {
                icon: DollarSign,
                label: 'Lương',
                value: (posting.jobPositions?.length ?? 0) > 0
                  ? `${posting.jobPositions?.[0]?.minSalary ?? 0}-${posting.jobPositions?.[0]?.maxSalary ?? 0}M`
                  : 'N/A',
                color: 'text-emerald-400',
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  className="p-3 rounded-lg bg-slate-800/50 border border-cyan-400/20 text-center"
                >
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                  <p
                    className="text-xs text-gray-400 mb-1"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="font-bold text-white text-sm"
                    style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                  >
                    {stat.value}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-cyan-400/10 overflow-x-auto">
            {[
              { id: 'overview' as const, label: 'Tổng Quan' },
              { id: 'jobs' as const, label: 'Vị Trí Ứng Tuyển' },
              { id: 'benefits' as const, label: 'Phúc Lợi' },
              { id: 'gallery' as const, label: 'Hình Ảnh' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                  ? 'text-cyan-300 border-cyan-400'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
                  }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* About */}
                <div>
                  <h3
                    className="text-lg font-bold text-white mb-3"
                    style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                  >
                    Về Công Ty
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {posting.description}
                  </p>
                </div>

                {/* Mission and Vision */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-cyan-400/20">
                    <h4
                      className="font-bold text-cyan-300 mb-2"
                      style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                    >
                      Sứ Mệnh
                    </h4>
                    <p className="text-gray-300 text-sm">{posting.mission}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-cyan-400/20">
                    <h4
                      className="font-bold text-cyan-300 mb-2"
                      style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                    >
                      Tầm Nhìn
                    </h4>
                    <p className="text-gray-300 text-sm">{posting.vision}</p>
                  </div>
                </div>

                {/* Company History */}
                {(posting.companyHistory?.length ?? 0) > 0 && (
                  <div>
                    <h3
                      className="text-lg font-bold text-white mb-3"
                      style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                    >
                      Lịch Sử Công Ty
                    </h3>
                    <div className="space-y-4">
                      {posting.companyHistory?.map((item: { year: string; milestone: string }, index: number) => (
                        <motion.div
                          key={index}
                          whileHover={{ x: 4 }}
                          className="p-4 rounded-lg bg-slate-800/50 border border-cyan-400/20 hover:border-cyan-400/40 transition-all cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 font-bold text-sm shrink-0"
                              style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                            >
                              {item.year}
                            </div>
                            <p className="text-gray-300 text-sm pt-1">{item.milestone}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div>
                  <h3
                    className="text-lg font-bold text-white mb-3"
                    style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                  >
                    Thông Tin Liên Hệ
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: MapPin, label: 'Địa chỉ', value: formatAddress(posting.address || '') },
                      { icon: Phone, label: 'Điện thoại', value: posting.phone },
                      { icon: Mail, label: 'Email', value: posting.email },
                      { icon: Globe, label: 'Website', value: posting.website },
                    ].map((info, index) => {
                      const Icon = info.icon;
                      return (
                        <div key={index} className="flex gap-3 items-start">
                          <Icon className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                          <div>
                            <p
                              className="text-gray-500 text-sm"
                              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                            >
                              {info.label}
                            </p>
                            <p className="text-gray-300">{info.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h3
                  className="text-lg font-bold text-white mb-4"
                  style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                >
                  {posting.jobPositions?.length ?? 0} Vị Trí Đang Tuyển
                </h3>
                <div className="space-y-3">
                  {posting.jobPositions?.map((job: { title: string; minSalary: number; maxSalary: number }, index: number) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 4 }}
                      className="p-4 rounded-lg border border-cyan-400/20 bg-slate-800/50 hover:border-cyan-400/40 cursor-pointer transition-all"
                    >
                      <h4 className="font-semibold text-cyan-300 mb-2">
                        {job.title}
                      </h4>
                      <p className="text-sm text-gray-400">
                        Lương: từ {job.minSalary}M - {job.maxSalary}M
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Benefits Tab */}
            {activeTab === 'benefits' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {[
                  {
                    title: 'Thời Gian Làm Việc',
                    icon: Clock,
                    items: [posting.workingHours],
                  },
                  {
                    title: 'Ngày Nghỉ & Phép',
                    icon: Calendar,
                    items: [
                      `${posting.offDays} ngày/tuần`,
                      `${posting.vacationDays} ngày phép/năm`,
                    ],
                  },
                  {
                    title: 'Bảo Hiểm',
                    icon: Shield,
                    items: posting.insurances,
                  },
                  {
                    title: 'Phúc Lợi Lương',
                    icon: DollarSign,
                    items: posting.salaryBenefits,
                  },
                  {
                    title: 'Phụ Cấp',
                    icon: Gift,
                    items: posting.allowances,
                  },
                  {
                    title: 'Quyền Lợi Khác',
                    icon: Gift,
                    items: posting.benefits,
                  },
                ].map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <div key={index}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-5 h-5 text-cyan-400" />
                        <h4
                          className="font-bold text-white"
                          style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                        >
                          {section.title}
                        </h4>
                      </div>
                      <ul className="space-y-2 ml-7">
                        {section.items.filter((item): item is string => item != null).map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="text-gray-300 text-sm flex items-start gap-2"
                          >
                            <span className="text-cyan-400 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 gap-4"
              >
                {posting.galleryImages.filter((img: string) => img && img.trim()).length > 0 ? (
                  posting.galleryImages
                    .filter((img: string) => img && img.trim())
                    .map((image: string, index: number) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="relative h-48 rounded-lg overflow-hidden cursor-pointer group bg-slate-800"
                      >
                        <Image
                          src={getImageUrl(image)}
                          alt={`Gallery ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          unoptimized
                          onError={(e) => {
                            // Hide the container if image fails to load
                            const target = e.currentTarget as HTMLImageElement;
                            if (target.parentElement) {
                              target.parentElement.style.display = 'none';
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                      </motion.div>
                    ))
                ) : (
                  <p className="col-span-full text-center text-gray-400 py-8">
                    Không có hình ảnh
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-900/80 backdrop-blur-md border-t border-cyan-400/10 p-6 flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowJobDetails(true)}
            className="flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-cyan-400/20 to-blue-500/20 text-cyan-300 font-semibold border border-cyan-400/30 hover:border-cyan-400/50 transition-all"
          >
            Xem Vị Trí Tuyển Dụng
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg bg-slate-800/50 text-gray-300 font-semibold border border-cyan-400/20 hover:border-cyan-400/40 transition-all"
          >
            Đóng
          </motion.button>
        </div>

        {/* Job Details Modal */}
        {showJobDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowJobDetails(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-lg border border-cyan-400/20 bg-slate-900 shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 backdrop-blur-md bg-slate-900/80 border-b border-cyan-400/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {posting.companyLogo ? (
                    <Image
                      src={posting.companyLogo}
                      alt={posting.companyName}
                      width={40}
                      height={40}
                      className="rounded-lg"
                      unoptimized
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                      <Gift className="w-6 h-6 text-cyan-400" />
                    </div>
                  )}
                  <div>
                    <h2
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
                    >
                      {posting.companyName}
                    </h2>
                    <p className="text-sm text-gray-400">{posting.jobPositions?.length ?? 0} vị trí đang tuyển</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowJobDetails(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </motion.button>
              </div>

              {/* Jobs List */}
              <div className="p-6 space-y-4">
                <div className="mb-4">
                  <p
                    className="text-sm text-gray-400 mb-3"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  >
                    Danh sách các vị trí đang tuyển dụng:
                  </p>
                </div>

                {posting.jobPositions?.map((job: { title: string; minSalary: number; maxSalary: number }, index: number) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    className="p-4 rounded-lg border border-cyan-400/20 bg-slate-800/50 hover:border-cyan-400/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4
                          className="font-bold text-cyan-300 mb-2 group-hover:text-cyan-200 transition-colors"
                          style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                        >
                          {job.title}
                        </h4>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-emerald-400" />
                            <span>{job.minSalary}M - {job.maxSalary}M</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-red-400" />
                            <span>{posting.address?.split(',')[0] ?? 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span>{posting.workingHours}</span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmitCV}
                        className="px-4 py-2 rounded-lg bg-linear-to-r from-cyan-400/20 to-blue-500/20 text-cyan-300 font-semibold border border-cyan-400/30 hover:border-cyan-400/50 transition-all whitespace-nowrap"
                      >
                        Giao tiếp
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Contact Info Section */}
              {(posting.phone || posting.email || posting.address || posting.website) && (
                <div className="border-t border-cyan-400/10 p-6">
                  <h3
                    className="text-lg font-bold text-white mb-4"
                    style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                  >
                    Thông Tin Công Ty
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posting.phone && (
                      <div className="flex gap-3 items-start">
                        <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                        <div>
                          <p
                            className="text-gray-500 text-sm"
                            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                          >
                            Điện thoại
                          </p>
                          <p className="text-gray-300">{posting.phone}</p>
                        </div>
                      </div>
                    )}
                    {posting.email && (
                      <div className="flex gap-3 items-start">
                        <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                        <div>
                          <p
                            className="text-gray-500 text-sm"
                            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                          >
                            Email
                          </p>
                          <p className="text-gray-300">{posting.email}</p>
                        </div>
                      </div>
                    )}
                    {posting.address && (
                      <div className="flex gap-3 items-start">
                        <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                        <div>
                          <p
                            className="text-gray-500 text-sm"
                            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                          >
                            Địa chỉ
                          </p>
                          <p className="text-gray-300">{posting.address}</p>
                        </div>
                      </div>
                    )}
                    {posting.website && (
                      <div className="flex gap-3 items-start">
                        <Globe className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                        <div>
                          <p
                            className="text-gray-500 text-sm"
                            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                          >
                            Website
                          </p>
                          <p className="text-gray-300">{posting.website}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="sticky bottom-0 bg-slate-900/80 backdrop-blur-md border-t border-cyan-400/10 p-6 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitCV}
                  className="flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-orange-400/20 to-yellow-500/20 text-orange-300 font-semibold border border-orange-400/30 hover:border-orange-400/50 transition-all"
                >
                  Gửi CV
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowJobDetails(false)}
                  className="flex-1 px-6 py-3 rounded-lg bg-slate-800/50 text-gray-300 font-semibold border border-cyan-400/20 hover:border-cyan-400/40 transition-all"
                >
                  Đóng
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Portfolio Selection Modal */}
      <PortfolioSelectModal
        isOpen={showPortfolioModal}
        onClose={() => setShowPortfolioModal(false)}
        portfolios={savedPortfolios}
        isLoading={portfolioLoading}
        onSelect={handlePortfolioSelect}
      />
    </motion.div>
  );
}
