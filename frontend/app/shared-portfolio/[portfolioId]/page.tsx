'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Share2,
  Copy,
  Facebook,
  Mail,
  MessageCircle,
  Check,
} from 'lucide-react';
import { SavedPortfolio } from '@/lib/saved-portfolio-context';
import { TemplatePreview } from '@/components/portfolio/template-preview';
import { portfolioShareService } from '@/lib/services/portfolio-share-service';
import { useSharePortfolio } from '@/lib/hooks/useSharePortfolio';

export default function SharedPortfolioPage() {
  const params = useParams();
  const portfolioId = params?.portfolioId as string;
  
  const [portfolio, setPortfolio] = useState<SavedPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // Load portfolio data
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setIsLoading(true);
        const data = await portfolioShareService.getSharedPortfolio(portfolioId);
        
        if (data) {
          setPortfolio(data);
        }
      } catch (error) {
        console.error('Failed to load shared portfolio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (portfolioId) {
      loadPortfolio();
    }
  }, [portfolioId]);

  const { copyLink, shareToFacebook, shareToMessenger, shareViaEmail } = useSharePortfolio({
    portfolioId: portfolioId || '',
    portfolio: portfolio || undefined,
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  // Show not found state
  if (!portfolio) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link href="/saved-portfolios">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition mb-6"
            >
              <ArrowLeft size={24} className="text-cyan-400" />
            </motion.button>
          </Link>

          {/* Not Found Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border border-cyan-400/20 backdrop-blur-sm bg-linear-to-br from-white/10 to-white/5 p-12 text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}>
              Không tìm thấy hồ sơ
            </h1>
            <p className="text-slate-400 mb-8" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
              Hồ sơ này có thể đã bị xóa hoặc liên kết không hợp lệ.
            </p>
            <Link href="/saved-portfolios">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                <ArrowLeft size={18} />
                Quay lại hồ sơ của tôi
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/95 border-b border-slate-800 px-6 py-4 flex items-center justify-between backdrop-blur-sm z-40">
        <div className="flex items-center gap-4">
          <Link href="/saved-portfolios">
            <button
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h2 className="text-white font-semibold flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            {portfolio.name}
          </h2>
        </div>
        <button
          onClick={() => setShowShareModal(true)}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          title="Chia sẻ"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <TemplatePreview 
          key={`shared-${portfolioId}-${portfolio.selectedTemplate}`}
          templateId={portfolio.selectedTemplate} 
          data={{
            title: portfolio.title,
            headline: portfolio.headline,
            summary: portfolio.summary,
            photoUrl: portfolio.photoUrl || '',
            contactJson: portfolio.contactJson || {},
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            skills: portfolio.skills as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            experience: portfolio.experience as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            education: portfolio.education as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            projects: portfolio.projects as any,
            selectedTemplate: portfolio.selectedTemplate,
          }}
        />
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
            className="w-full max-w-md bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                  <Share2 className="w-5 h-5 text-blue-400" />
                  Chia sẻ hồ sơ
                </h2>
                <button
                  onClick={() => setShowShareModal(false)}
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
              <button
                onClick={() => {
                  copyLink();
                  setCopiedFeedback(true);
                  setTimeout(() => setCopiedFeedback(false), 2000);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all group"
              >
                {copiedFeedback ? (
                  <>
                    <Check className="w-5 h-5 text-green-400" />
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-white">Đã sao chép!</p>
                      <p className="text-xs text-slate-400">Link đã được sao chép vào clipboard</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-white">Sao chép liên kết</p>
                      <p className="text-xs text-slate-400">Sao chép link để chia sẻ</p>
                    </div>
                  </>
                )}
              </button>

              {/* Share to Facebook */}
              <button
                onClick={shareToFacebook}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-blue-900/30 hover:border-blue-700 transition-all group"
              >
                <Facebook className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-white">Chia sẻ lên Facebook</p>
                  <p className="text-xs text-slate-400">Chia sẻ trên tường của bạn</p>
                </div>
              </button>

              {/* Share to Messenger */}
              <button
                onClick={shareToMessenger}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-blue-900/30 hover:border-blue-700 transition-all group"
              >
                <MessageCircle className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-white">Gửi qua Messenger</p>
                  <p className="text-xs text-slate-400">Gửi cho bạn bè hoặc nhóm</p>
                </div>
              </button>

              {/* Share via Email */}
              <button
                onClick={shareViaEmail}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-purple-900/30 hover:border-purple-700 transition-all group"
              >
                <Mail className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-white">Gửi qua Email</p>
                  <p className="text-xs text-slate-400">Gửi liên kết qua email</p>
                </div>
              </button>
            </div>

            {/* Footer Info */}
            <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-800">
              <p className="text-xs text-slate-400 text-center">
                Mọi người nhận được link sẽ có thể xem hồ sơ này
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
