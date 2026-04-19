'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Eye,
  CheckCircle2,
  Maximize2,
  Minimize2,
  UserPlus,
  AlertCircle,
  Save,
} from 'lucide-react';
import TemplateGallery from '@/components/portfolio/template-gallery';
import PortfolioEditor from '@/components/portfolio/portfolio-editor';
import { TemplatePreview } from '@/components/portfolio/template-preview';
import { useAuth } from '@/lib/auth-context';
import { useSavedPortfolio } from '@/lib/saved-portfolio-context';

export default function PortfolioPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const { savePortfolio, canSave, error: saveError } = useSavedPortfolio();
  const [portfolioData, setPortfolioData] = useState({
    title: 'Frontend Developer',
    headline: 'Đam mê xây dựng trải nghiệm số mượt mà, trực quan và hiệu quả.',
    summary: 'Hãy chia sẻ điểm mạnh, kinh nghiệm nổi bật và định hướng của bạn.',
    photoUrl: '',
    contactJson: {
      email: 'email@example.com',
      phone: '123456789',
      city: '',
      district: '',
      facebook: '',
      github: '',
    },
    skills: {
      selected: [],
    },
    languages: {
      items: [],
    },
    experience: {
      items: [],
    },
    education: {
      items: [],
    },
    projects: {
      items: [],
    },
    selectedTemplate: 1,
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [showResponsiveWarning, setShowResponsiveWarning] = useState(false);
  const [isResponsiveDevice, setIsResponsiveDevice] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [saveNotificationType, setSaveNotificationType] = useState<'success' | 'employer' | 'notLoggedIn'>('success');

  // Handle portfolio update
  const handlePortfolioUpdate = (field: string, value: unknown) => {
    setPortfolioData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsSaving(true);
  };

  // Auto-save (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      // TODO: Call API to save portfolio
      setIsSaving(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [portfolioData]);

  const handleShare = () => {
    console.log('Sharing portfolio...');
  };

  const handleSave = async () => {
    // Check if user is not logged in
    if (!isLoggedIn) {
      setSaveNotificationType('notLoggedIn');
      setShowSaveNotification(true);
      setTimeout(() => {
        setShowSaveNotification(false);
      }, 3000);
      return;
    }

    // Check if user is employer (not student)
    if (!canSave) {
      setSaveNotificationType('employer');
      setShowSaveNotification(true);
      setTimeout(() => {
        setShowSaveNotification(false);
      }, 3000);
      return;
    }

    try {
      setIsSaving(true);
      const portfolioName = portfolioData.title || 'Hồ sơ chưa có tiêu đề';

      const result = await savePortfolio({
        name: portfolioName,
        title: portfolioData.title,
        headline: portfolioData.headline,
        summary: portfolioData.summary,
        photoUrl: portfolioData.photoUrl,
        contactJson: portfolioData.contactJson,
        skills: portfolioData.skills,
        experience: portfolioData.experience,
        education: portfolioData.education,
        projects: portfolioData.projects,
        selectedTemplate: portfolioData.selectedTemplate,
      });

      if (result) {
        setSaveNotificationType('success');
        setShowSaveNotification(true);
        setTimeout(() => {
          setShowSaveNotification(false);
        }, 3000);
      }

      setIsSaving(false);
    } catch (error) {
      console.error('Error saving portfolio:', error);
      setIsSaving(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenPreview) {
        setIsFullscreenPreview(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenPreview]);

  // Detect responsive device on mount and show warning
  useEffect(() => {
    const checkResponsive = () => {
      const isSmallDevice = window.innerWidth < 1024; // lg breakpoint
      setIsResponsiveDevice(isSmallDevice);
      if (isSmallDevice) {
        setShowResponsiveWarning(true);
      } else {
        setShowResponsiveWarning(false);
      }
    };

    checkResponsive();

    const handleResize = () => {
      checkResponsive();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Loading state only
  if (isLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  // Non-logged-in users can browse and try features (save shows notification)

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Top Header Bar - Like Canva */}
      <div className="bg-slate-900/80 border-b border-slate-800/50 px-6 py-3 flex items-center justify-between backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
        </div>

        <div className="flex items-center gap-3">
          {/* Save Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs">
            {isSaving ? (
              <>
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-slate-300">Đang cập nhật...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Đã cập nhật</span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => setShowTemplates(true)}
            className="lg:hidden px-3 py-1.5 rounded-lg border border-slate-700/50 text-slate-300 hover:bg-slate-800/50 transition-all items-center gap-2 text-sm flex"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Mẫu</span>
          </button>

          <button
            onClick={() => setShowTemplates(true)}
            className="hidden lg:flex px-3 py-1.5 rounded-lg border border-slate-700/50 text-slate-300 hover:bg-slate-800/50 transition-all items-center gap-2 text-sm"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
          >
            <Sparkles className="w-4 h-4" />
            Chọn phong cách CV của bạn
          </button>



          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2 text-sm"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5a1 1 0 011-1h4a1 1 0 011 1v1H9V5z" />
            </svg>
            <span className="hidden sm:inline">Lưu Hồ Sơ</span>
          </button>

        </div>
      </div>

      {/* Main Workspace - Two Column Layout */}
      <div className="flex-1 overflow-hidden flex gap-0">
        {/* Left Panel - Editor */}
        <motion.div
          className="hidden lg:flex flex-col w-full lg:w-[35%] bg-slate-900/30 border-r border-slate-800/50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >

          {/* Editor Content - Expanded Skills Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3">
              <PortfolioEditor data={portfolioData} onChange={handlePortfolioUpdate} />
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Preview */}
        <motion.div
          className="flex-1 lg:w-[65%] flex flex-col bg-slate-950 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Preview Header */}
          <div className="px-4 py-3 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>Xem Trước Bản Mẫu</h2>
            </div>
            <button
              onClick={() => setIsFullscreenPreview(true)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-all"
              title="Phóng to toàn màn hình"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Preview Content - No Padding, Full Size */}
          <div className="flex-1 overflow-hidden bg-linear-to-b from-slate-900/20 to-slate-950/50">
            <TemplatePreview
              key={`${portfolioData.selectedTemplate}-${JSON.stringify(portfolioData.education)}-${JSON.stringify(portfolioData.experience)}-${JSON.stringify(portfolioData.skills)}-${JSON.stringify(portfolioData.projects)}`}
              templateId={portfolioData.selectedTemplate}
              data={portfolioData}
            />
          </div>
        </motion.div>

        {/* Mobile Tab View */}
        <div className="lg:hidden flex flex-col w-full">
          {/* Tab Selector */}
          <div className="flex gap-2 px-4 py-2 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 py-2 rounded-lg font-medium text-xs transition-all ${activeTab === 'edit'
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white'
                : 'border border-slate-700/50 text-slate-300 hover:bg-slate-800/50'
                }`}
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              Chỉnh Sửa
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-2 rounded-lg font-medium text-xs transition-all ${activeTab === 'preview'
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white'
                : 'border border-slate-700/50 text-slate-300 hover:bg-slate-800/50'
                }`}
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              Xem Trước
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'edit' ? (
              <div className="p-4 overflow-y-auto h-full">
                <PortfolioEditor data={portfolioData} onChange={handlePortfolioUpdate} />
              </div>
            ) : (
              <div className="h-full overflow-hidden">
                <TemplatePreview
                  key={`mobile-${portfolioData.selectedTemplate}-${JSON.stringify(portfolioData.education)}-${JSON.stringify(portfolioData.experience)}-${JSON.stringify(portfolioData.skills)}-${JSON.stringify(portfolioData.projects)}`}
                  templateId={portfolioData.selectedTemplate}
                  data={portfolioData}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6 border border-slate-800"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <TemplateGallery
              onSelect={(templateId: number) => {
                handlePortfolioUpdate('selectedTemplate', templateId);
                setShowTemplates(false);
              }}
              onClose={() => setShowTemplates(false)}
            />
          </motion.div>
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {isFullscreenPreview && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-slate-900/95 border-b border-slate-800 px-6 py-4 flex items-center justify-between backdrop-blur-sm">
            <h2 className="text-white font-semibold flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              <Eye className="w-5 h-5 text-cyan-400" />
              Xem Trước Toàn Màn Hình
            </h2>
            <button
              onClick={() => setIsFullscreenPreview(false)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              title="Đóng (Esc)"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <TemplatePreview
              key={`fullscreen-${portfolioData.selectedTemplate}-${JSON.stringify(portfolioData.education)}-${JSON.stringify(portfolioData.experience)}-${JSON.stringify(portfolioData.skills)}-${JSON.stringify(portfolioData.projects)}`}
              templateId={portfolioData.selectedTemplate}
              data={portfolioData}
            />
          </div>
        </div>
      )}

      {/* Responsive Device Warning Modal */}
      {showResponsiveWarning && isResponsiveDevice && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-sm bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 overflow-hidden"
          >

            {/* Content */}
            <div className="p-8 sm:p-10 text-center space-y-6">
              {/* Icon */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex justify-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                  <Image
                    src="/images/logo-icon.png"
                    alt="NextStepZ Logo"
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-16 sm:h-16"
                    priority={false}
                  />
                </div>
              </motion.div>

              {/* Title */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}>
                  Trải Nghiệm Tối Ưu
                </h2>
                <div className="h-1 w-12 bg-linear-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <p className="text-lg sm:text-xl text-cyan-300 font-semibold" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                  Để đảm bảo trải nghiệm tối ưu và tốt nhất
                </p>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                  Vui lòng truy cập <span className="font-semibold text-cyan-300">NextStepZ</span> bằng <span className="font-semibold text-cyan-300">máy tính</span> để có trải nghiệm đầy đủ và hiệu quả nhất.
                </p>
              </div>

              {/* Features list */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 space-y-2 text-left">
                <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider mb-3">Lợi ích khi truy cập bằng máy tính:</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Chỉnh sửa toàn bộ thông tin dễ dàng</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Xem trước CV theo thời gian thực</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Giao diện đầy đủ và chuyên nghiệp</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="pt-2 space-y-3">
                <button
                  onClick={() => setShowResponsiveWarning(false)}
                  className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-bold text-base sm:text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95 transform"
                  style={{ fontFamily: "'Exo 2 Bold', sans-serif" }}
                >
                  Tôi hiểu, tiếp tục
                </button>
              </div>

            </div>


          </motion.div>
        </div>
      )}

      {/* Save Notification */}
      <AnimatePresence>
        {showSaveNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            {saveNotificationType === 'success' && (
              <div className="bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-lg p-4 shadow-lg shadow-emerald-500/20 border border-emerald-400/30 flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-sm" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                    Thành công!
                  </p>
                  <p className="text-xs opacity-90" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                    Hồ sơ cá nhân của bạn đã được lưu.
                  </p>
                </div>
              </div>
            )}
            {saveNotificationType === 'employer' && (
              <div className="bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-lg p-4 shadow-lg shadow-amber-500/20 border border-amber-400/30 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                    Không thể lưu
                  </p>
                  <p className="text-xs opacity-90" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                    Chức năng này chỉ dành cho tài khoản Sinh Viên.
                  </p>
                </div>
              </div>
            )}
            {saveNotificationType === 'notLoggedIn' && (
              <div className="bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg p-4 shadow-lg shadow-blue-500/20 border border-blue-400/30 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                    Vui lòng đăng nhập
                  </p>
                  <p className="text-xs opacity-90" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                    Vui lòng đăng nhập để sử dụng chức năng này.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
