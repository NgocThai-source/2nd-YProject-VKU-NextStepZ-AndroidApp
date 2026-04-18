'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Eye,
  Trash2,
  FileText,
  Calendar,
  Share2,
  Copy,
  Facebook,
  Mail,
  MessageCircle,
  Check,
  Sparkles,
  Briefcase,
  FolderOpen,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useSavedPortfolio, SavedPortfolio } from '@/lib/saved-portfolio-context';
import { TemplatePreview } from '@/components/portfolio/template-preview';
import { getTemplateById } from '@/lib/templates';
import { useSharePortfolio } from '@/lib/hooks/useSharePortfolio';

export default function SavedPortfoliosPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const {
    getSavedPortfolios,
    deletePortfolio: deletePortfolioFromContext,
    canSave,
    isLoading: portfolioLoading,
    error: portfolioError,
  } = useSavedPortfolio();
  const [selectedPortfolio, setSelectedPortfolio] = useState<SavedPortfolio | null>(null);
  const [isFullscreenView, setIsFullscreenView] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [sharePortfolioData, setSharePortfolioData] = useState<SavedPortfolio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { copyLink, shareToFacebook, shareToMessenger, shareViaEmail, copiedFeedback } = useSharePortfolio({
    portfolioId: showShareModal || '',
    portfolio: sharePortfolioData || undefined,
  });

  const savedPortfolios = getSavedPortfolios();

  const handleDelete = async (id: string) => {
    if (!canSave) {
      setShowDeleteConfirm(null);
      return;
    }
    setIsDeleting(true);
    await deletePortfolioFromContext(id);
    setIsDeleting(false);
    setShowDeleteConfirm(null);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenView) {
        setIsFullscreenView(false);
      }
    };

    if (isFullscreenView) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenView]);

  if (authLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
          className="w-full max-w-md space-y-8 text-center"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 flex items-center justify-center">
              <Image
                src="/images/logo-icon.png"
                alt="NextStepZ Logo"
                width={80}
                height={80}
                className="w-20 h-20"
                priority={false}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}>
              Hồ Sơ Sáng Tạo Của Tôi
            </h1>
            <p className="text-slate-400 text-lg" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
              Đăng nhập để xem các hồ sơ đã lưu
            </p>
          </div>

          <Link
            href="/auth"
            className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95 transform inline-flex items-center justify-center"
            style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
          >
            Đăng Nhập
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isFullscreenView && selectedPortfolio) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-950">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 border-b border-slate-800 px-6 py-4 flex items-center justify-between backdrop-blur-sm z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFullscreenView(false)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-white font-semibold flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              <Eye className="w-5 h-5 text-cyan-400" />
              {selectedPortfolio.name}
            </h2>
          </div>
          <button
            onClick={() => setIsFullscreenView(false)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            title="Đóng (Esc)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <TemplatePreview
            key={`fullscreen-${selectedPortfolio.id}-${selectedPortfolio.selectedTemplate}`}
            templateId={selectedPortfolio.selectedTemplate}
            data={{
              title: selectedPortfolio.title,
              headline: selectedPortfolio.headline,
              summary: selectedPortfolio.summary,
              photoUrl: selectedPortfolio.photoUrl || '',
              contactJson: selectedPortfolio.contactJson || {},
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              skills: selectedPortfolio.skills as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              experience: selectedPortfolio.experience as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              education: selectedPortfolio.education as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              projects: selectedPortfolio.projects as any,
              selectedTemplate: selectedPortfolio.selectedTemplate,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Header Section */}
      <div className="z-10 sticky top-0 backdrop-blur-md bg-slate-950/80 border-b border-cyan-400/10 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Back Link */}
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6 group"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại Tạo Hồ Sơ
          </Link>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-linear-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-400/20">
                <FolderOpen className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1
                  className="text-3xl md:text-4xl font-bold gradient-text-premium"
                  style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
                >
                  Hồ Sơ Sáng Tạo Của Tôi
                </h1>
              </div>
            </div>
            <p className="text-gray-400 ml-14" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
              Xem và quản lý các hồ sơ cá nhân chuyên nghiệp của bạn
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-4 ml-14"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">
                <span className="font-bold text-white">{savedPortfolios.length}</span> hồ sơ đã lưu
              </span>
            </div>
            <Link
              href="/portfolio"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/50 transition-all group"
            >
              <Plus className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform" />
              <span className="text-sm text-cyan-300 font-medium">Tạo hồ sơ mới</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Portfolios Grid or Empty State */}
        {savedPortfolios.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex justify-center mb-6"
            >
              <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center">
                <FileText className="w-12 h-12 text-cyan-400" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
              Chưa có hồ sơ nào
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
              Bạn chưa lưu hồ sơ nào. Hãy tạo hồ sơ chuyên nghiệp đầu tiên của bạn và bắt đầu hành trình sự nghiệp!
            </p>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105"
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              <Sparkles className="w-5 h-5" />
              Tạo Hồ Sơ Mới
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Results Count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-400 mb-6"
            >
              Hiển thị <span className="text-cyan-300 font-bold">{savedPortfolios.length}</span> hồ sơ đã lưu
            </motion.p>

            {/* Portfolio Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPortfolios.map((portfolio, index) => (
                <motion.div
                  key={portfolio.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative rounded-2xl overflow-hidden border border-cyan-400/20 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
                >
                  {/* Thumbnail Area - Template Demo Style */}
                  {(() => {
                    const template = getTemplateById(portfolio.selectedTemplate);
                    const templateColor = template?.color || 'from-cyan-500 to-blue-500';
                    const templateIcon = template?.icon || '📄';
                    const templateName = template?.name || `Mẫu ${portfolio.selectedTemplate}`;
                    return (
                      <div className={`relative h-40 sm:h-48 bg-linear-to-br ${templateColor} overflow-hidden`}>
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-all" />

                        {/* Template Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="text-center"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-300 block mb-3">
                              {templateIcon}
                            </span>
                            <span className="text-xs text-white/90 font-semibold px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                              {templateName}
                            </span>
                          </motion.div>
                        </div>

                        {/* Hover Overlay with View Button */}
                        <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                          <button
                            onClick={() => {
                              setSelectedPortfolio(portfolio);
                              setIsFullscreenView(true);
                            }}
                            className="px-6 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/40 transition-all transform hover:scale-105"
                            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                          >
                            <Eye className="w-5 h-5" />
                            Xem Chi Tiết
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Content Area */}
                  <div className="p-5">
                    {/* Title */}
                    <h3 className="font-semibold text-white text-lg mb-2 line-clamp-1 group-hover:text-cyan-300 transition-colors" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                      {portfolio.name || 'Hồ sơ không có tiêu đề'}
                    </h3>

                    {/* Headline */}
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                      {portfolio.headline || 'Chưa có tiêu đề chuyên môn'}
                    </p>

                    {/* Skills Preview */}
                    {portfolio.skills?.selected && portfolio.skills.selected.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-4">
                        {portfolio.skills.selected.slice(0, 3).map((skill, skillIndex) => (
                          <span
                            key={`${portfolio.id}-skill-${skill.id || skill.name || skillIndex}`}
                            className="text-xs px-2.5 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                          >
                            {skill.name}
                          </span>
                        ))}
                        {portfolio.skills.selected.length > 3 && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700/50 text-gray-400">
                            +{portfolio.skills.selected.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pt-3 border-t border-slate-700/50">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(portfolio.updatedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    {/* Actions - Share and Delete only */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setShowShareModal(portfolio.id);
                          setSharePortfolioData(portfolio);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all text-sm font-medium"
                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                        title="Chia sẻ"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Chia sẻ</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowDeleteConfirm(portfolio.id)}
                        className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all flex items-center gap-2 text-sm font-medium"
                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Xóa</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Navigation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
            Khám Phá Thêm
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Create Portfolio Link */}
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => (window.location.href = '/portfolio')}
              className="p-6 rounded-xl border border-cyan-400/20 bg-linear-to-br from-white/10 to-white/5 hover:border-cyan-400/40 transition-all text-left backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-linear-to-br from-cyan-500/30 to-blue-500/30">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <h4
                className="font-semibold text-white mb-2"
                style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
              >
                Tạo Hồ Sơ Mới
              </h4>
              <p className="text-sm text-gray-400">
                Xây dựng hồ sơ chuyên nghiệp với các mẫu đẹp mắt và công cụ biên tập hiện đại.
              </p>
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mt-3">
                Bắt Đầu Ngay <Plus className="w-4 h-4" />
              </div>
            </motion.button>

            {/* Companies Link */}
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => (window.location.href = '/find')}
              className="p-6 rounded-xl border border-cyan-400/20 bg-linear-to-br from-white/10 to-white/5 hover:border-cyan-400/40 transition-all text-left backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-linear-to-br from-purple-500/30 to-pink-500/30">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h4
                className="font-semibold text-white mb-2"
                style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
              >
                Xem Gợi Ý Công Việc
              </h4>
              <p className="text-sm text-gray-400">
                Khám phá những công việc phù hợp nhất dựa trên kỹ năng và kinh nghiệm trong hồ sơ của bạn.
              </p>
              <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold mt-3">
                Xem Đề Xuất <Briefcase className="w-4 h-4" />
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
              className="w-full max-w-sm bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
                    <Trash2 className="w-7 h-7 text-red-400" />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                    Xóa hồ sơ?
                  </h2>
                  <p className="text-sm text-slate-400" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                    Hành động này không thể hoàn tác. Hồ sơ sẽ bị xóa vĩnh viễn.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all font-medium"
                    style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all font-medium"
                    style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Portfolio Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
              className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                    <Share2 className="w-5 h-5 text-blue-400" />
                    Chia sẻ hồ sơ
                  </h2>
                  <button
                    onClick={() => {
                      setShowShareModal(null);
                      setSharePortfolioData(null);
                    }}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Share Options */}
              <div className="p-6 space-y-3">
                {/* Copy Link */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={copyLink}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-cyan-400/30 transition-all group"
                >
                  {copiedFeedback ? (
                    <>
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium text-white">Đã sao chép!</p>
                        <p className="text-xs text-slate-400">Link đã được sao chép vào clipboard</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-2 rounded-lg bg-slate-700/50 group-hover:bg-cyan-500/20 transition-colors">
                        <Copy className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium text-white">Sao chép liên kết</p>
                        <p className="text-xs text-slate-400">Sao chép link để chia sẻ</p>
                      </div>
                    </>
                  )}
                </motion.button>

                {/* Share to Facebook */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={shareToFacebook}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-blue-900/30 hover:border-blue-400/30 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Facebook className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-white">Chia sẻ lên Facebook</p>
                    <p className="text-xs text-slate-400">Chia sẻ trên tường của bạn</p>
                  </div>
                </motion.button>

                {/* Share to Messenger */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={shareToMessenger}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-cyan-900/30 hover:border-cyan-400/30 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <MessageCircle className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-white">Gửi qua Messenger</p>
                    <p className="text-xs text-slate-400">Gửi cho bạn bè hoặc nhóm</p>
                  </div>
                </motion.button>

                {/* Share via Email */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={shareViaEmail}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-purple-900/30 hover:border-purple-400/30 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-white">Gửi qua Email</p>
                    <p className="text-xs text-slate-400">Gửi liên kết qua email</p>
                  </div>
                </motion.button>
              </div>

              {/* Footer Info */}
              <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-800">
                <p className="text-xs text-slate-400 text-center">
                  Mọi người nhận được link sẽ có thể xem hồ sơ của bạn với giao diện đầy đủ
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
