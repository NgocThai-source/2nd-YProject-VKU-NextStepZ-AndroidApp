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
  Flag,
  AlertCircle,
  Send,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Company } from '@/lib/companies-mock-data';

interface CompanyDetailModalProps {
  company: Company;
  onClose: () => void;
}

export function CompanyDetailModal({
  company,
  onClose,
}: CompanyDetailModalProps) {
  const [isFollowing, setIsFollowing] = useState(company.isFollowing || false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'jobs' | 'benefits' | 'gallery'
  >('overview');
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

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
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReportModal(true)}
              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Báo cáo vấn đề"
            >
              <Flag className="w-5 h-5 text-red-400 hover:text-red-300 transition-colors" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Cover and Logo */}
          <div className="relative h-48 rounded-lg overflow-hidden bg-slate-800">
            <Image
              src={company.coverImage}
              alt={company.name}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />

            {/* Logo, Name, and Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-700 border-4 border-cyan-400/30">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>

                <div>
                  <h1
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
                  >
                    {company.name}
                  </h1>
                  <div className="flex gap-2 mt-2">
                    {company.industry.slice(0, 2).map((ind) => (
                      <span
                        key={ind}
                        className="px-2 py-1 text-xs rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-3 rounded-lg transition-all ${isSaved
                      ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                      : 'bg-white/10 text-gray-300 border border-cyan-400/20 hover:border-cyan-400/40'
                    }`}
                >
                  <BookmarkPlus className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${isFollowing
                      ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                      : 'bg-linear-to-r from-cyan-400/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/50'
                    }`}
                >
                  {isFollowing ? 'Đang theo' : 'Theo dõi'}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                icon: Users,
                label: 'Followers',
                value: `${((company.followersCount || 0) / 1000).toFixed(1)}K`,
                color: 'text-cyan-400',
              },
              {
                icon: TrendingUp,
                label: 'Lượt xem',
                value: `${(company.views / 1000).toFixed(1)}K`,
                color: 'text-green-400',
              },
              {
                icon: MapPin,
                label: 'Địa điểm',
                value: company.location,
                color: 'text-red-400',
              },
              {
                icon: DollarSign,
                label: 'Lương',
                value: `${company.salaryRange[0]}-${company.salaryRange[1]}M`,
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
              { id: 'jobs' as const, label: 'Vị Trí' },
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
                    {company.aboutCompany}
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
                    <p className="text-gray-300 text-sm">{company.mission}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-cyan-400/20">
                    <h4
                      className="font-bold text-cyan-300 mb-2"
                      style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                    >
                      Tầm Nhìn
                    </h4>
                    <p className="text-gray-300 text-sm">{company.vision}</p>
                  </div>
                </div>

                {/* Company History */}
                <div>
                  <h3
                    className="text-lg font-bold text-white mb-3"
                    style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                  >
                    Lịch Sử Công Ty
                  </h3>
                  <div className="space-y-4">
                    {company.companyHistory.map((item, index) => (
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
                      { icon: MapPin, label: 'Địa chỉ', value: company.address },
                      { icon: Phone, label: 'Điện thoại', value: company.phone },
                      { icon: Mail, label: 'Email', value: company.email },
                      {
                        icon: Globe,
                        label: 'Website',
                        value: company.website,
                      },
                    ].map((info, index) => {
                      const Icon = info.icon;
                      return (
                        <div key={index} className="flex gap-3 items-start">
                          <Icon className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                          <div>
                            <p
                              className="text-gray-500 text-sm"
                              style={{
                                fontFamily: "'Poppins Regular', sans-serif",
                              }}
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
                  {company.openPositions} Vị Trí Đang Tuyển
                </h3>
                <div className="space-y-3">
                  {company.jobCategories.map((job, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 4 }}
                      className="p-4 rounded-lg border border-cyan-400/20 bg-slate-800/50 hover:border-cyan-400/40 cursor-pointer transition-all"
                    >
                      <h4 className="font-semibold text-cyan-300 mb-2">
                        {job}
                      </h4>
                      {company.salaryByRole && (
                        <p className="text-sm text-gray-400">
                          Lương: từ{' '}
                          {company.salaryByRole[index % company.salaryByRole.length]
                            .min ||
                            company.salaryRange[0]}
                          M -{' '}
                          {company.salaryByRole[index % company.salaryByRole.length]
                            .max ||
                            company.salaryRange[1]}
                          M
                        </p>
                      )}
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
                    items: [company.workingHours],
                  },
                  {
                    title: 'Ngày Nghỉ & Phép',
                    icon: Calendar,
                    items: [
                      `${company.offDays} ngày/tuần`,
                      `${company.vacationDays} ngày phép/năm`,
                      company.overTimePolicy,
                    ],
                  },
                  {
                    title: 'Bảo Hiểm',
                    icon: Shield,
                    items: company.insurances,
                  },
                  {
                    title: 'Phúc Lợi Lương',
                    icon: DollarSign,
                    items: company.salaryBenefits,
                  },
                  {
                    title: 'Phụ Cấp',
                    icon: Gift,
                    items: company.allowances,
                  },
                  {
                    title: 'Quyền Lợi Khác',
                    icon: Gift,
                    items: company.benefits,
                  },
                ].map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <div key={index}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-5 h-5 text-cyan-400" />
                        <h4
                          className="font-bold text-white"
                          style={{
                            fontFamily: "'Exo 2 SemiBold', sans-serif",
                          }}
                        >
                          {section.title}
                        </h4>
                      </div>
                      <ul className="space-y-2 ml-7">
                        {section.items.map((item, itemIndex) => (
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
                {company.galleryImages.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="relative h-48 rounded-lg overflow-hidden cursor-pointer group"
                  >
                    <Image
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                  </motion.div>
                ))}
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
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={40}
                    height={40}
                    className="rounded-lg"
                    unoptimized
                  />
                  <div>
                    <h2
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
                    >
                      {company.name}
                    </h2>
                    <p className="text-sm text-gray-400">{company.openPositions} vị trí đang tuyển</p>
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

                {company.jobCategories.map((job, index) => {
                  const salary = company.salaryByRole && company.salaryByRole[index % company.salaryByRole.length];
                  const minSalary = salary?.min || company.salaryRange[0];
                  const maxSalary = salary?.max || company.salaryRange[1];

                  return (
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
                            {job}
                          </h4>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">
                                {minSalary}M - {maxSalary}M
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-red-400" />
                              <span>{company.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span>{company.workingHours}</span>
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 font-semibold border border-cyan-400/30 hover:border-cyan-400/50 transition-all whitespace-nowrap"
                        >
                          Giao tiếp
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Company Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 p-4 rounded-lg bg-linear-to-r from-cyan-400/10 to-blue-500/10 border border-cyan-400/20"
                >
                  <h4
                    className="font-bold text-white mb-3"
                    style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                  >
                    Thông Tin Công Ty
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                      <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-400">Điện thoại</p>
                        <p className="text-gray-300 text-sm">{company.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-gray-300 text-sm">{company.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-400">Địa chỉ</p>
                        <p className="text-gray-300 text-sm">{company.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Globe className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-400">Website</p>
                        <p className="text-gray-300 text-sm">{company.website}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-slate-900/80 backdrop-blur-md border-t border-cyan-400/10 p-4 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 rounded-lg bg-linear-to-r from-yellow-400/20 to-orange-500/20 text-yellow-300 font-semibold border border-yellow-400/30 hover:border-yellow-400/50 transition-all"
                >
                  Gửi CV
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowJobDetails(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 text-gray-300 font-semibold border border-cyan-400/20 hover:border-cyan-400/40 transition-all"
                >
                  Đóng
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Report Modal */}
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-lg border border-red-400/20 bg-slate-900 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-red-500/10 to-orange-500/10 border-b border-red-400/20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <h3
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                  >
                    Báo Cáo Vấn Đề
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReportModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-300 mb-3">
                    Công ty: <span className="font-semibold text-white">{company.name}</span>
                  </p>
                </div>

                {/* Reason Selection */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Loại vấn đề
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-red-400/20 text-white focus:border-red-400 focus:outline-none transition-all"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  >
                    <option value="">Chọn loại vấn đề...</option>
                    <option value="fraud">Gian lận / Lừa đảo</option>
                    <option value="inappropriate">Nội dung không phù hợp</option>
                    <option value="fake">Thông tin giả mạo</option>
                    <option value="spam">Spam / Quảng cáo</option>
                    <option value="discrimination">Phân biệt đối xử</option>
                    <option value="illegal">Hoạt động bất hợp pháp</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Chi tiết vấn đề
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-red-400/20 text-white placeholder-gray-500 focus:border-red-400 focus:outline-none transition-all resize-none h-24"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  />
                </div>

                <p className="text-xs text-gray-400">
                  Báo cáo của bạn sẽ được gửi tới đội quản lý để xem xét. Chúng tôi cảm ơn sự giúp đỡ của bạn trong việc duy trì cộng đồng an toàn.
                </p>
              </div>

              {/* Footer */}
              <div className="border-t border-red-400/10 px-6 py-4 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 text-gray-300 font-semibold border border-cyan-400/20 hover:border-cyan-400/40 transition-all"
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (reportReason && reportDescription) {
                      // Handle report submission
                      console.log('Report submitted:', {
                        company: company.name,
                        reason: reportReason,
                        description: reportDescription,
                      });
                      setShowReportModal(false);
                      setReportReason('');
                      setReportDescription('');
                    }
                  }}
                  disabled={!reportReason || !reportDescription}
                  className="flex-1 px-4 py-2 rounded-lg bg-linear-to-r from-red-500/30 to-orange-500/30 text-red-300 font-semibold border border-red-400/30 hover:border-red-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Gửi Báo Cáo
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
