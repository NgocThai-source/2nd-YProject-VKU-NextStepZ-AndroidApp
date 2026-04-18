'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import Image from 'next/image';
import { SavedPortfolio } from '@/lib/saved-portfolio-context';

interface PortfolioSelectorModalProps {
  portfolios: SavedPortfolio[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (portfolio: SavedPortfolio) => void;
  isLoading?: boolean;
}

export default function PortfolioSelectorModal({
  portfolios,
  isOpen,
  onClose,
  onSelect,
  isLoading = false,
}: PortfolioSelectorModalProps) {
  const [selectedPortfolio, setSelectedPortfolio] = useState<SavedPortfolio | null>(null);

  const handleSend = () => {
    if (selectedPortfolio) {
      onSelect(selectedPortfolio);
      setSelectedPortfolio(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[65vh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700"
            style={{ maxWidth: '600px', position: 'relative', top: '-200px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900/50 backdrop-blur-xl">
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Chọn hồ sơ sáng tạo
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Portfolio List */}
            <div className="overflow-y-auto p-6 space-y-4 max-h-[calc(65vh-180px)]">
              {portfolios.length === 0 ? (
                <div className="text-center py-12">
                  <p
                    className="text-gray-400"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  >
                    Bạn chưa có hồ sơ sáng tạo nào
                  </p>
                </div>
              ) : (
                portfolios.map((portfolio) => (
                  <motion.button
                    key={portfolio.id}
                    onClick={() => setSelectedPortfolio(portfolio)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedPortfolio?.id === portfolio.id
                        ? 'bg-cyan-500/20 border-2 border-cyan-500'
                        : 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Portfolio Avatar */}
                      {portfolio.photoUrl && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-600">
                          <Image
                            src={portfolio.photoUrl}
                            alt={portfolio.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Portfolio Info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-white truncate"
                          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                        >
                          {portfolio.name}
                        </h3>
                        <p
                          className="text-sm text-gray-300 truncate"
                          style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                        >
                          {portfolio.title || portfolio.headline}
                        </p>
                        <p
                          className="text-xs text-gray-500 line-clamp-2 mt-1"
                          style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                        >
                          {portfolio.summary}
                        </p>
                      </div>

                      {/* Selection Indicator */}
                      {selectedPortfolio?.id === portfolio.id && (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-700 bg-slate-900/50 backdrop-blur-xl">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white transition-colors font-medium"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                Hủy
              </button>
              <motion.button
                onClick={handleSend}
                disabled={!selectedPortfolio || isLoading}
                whileHover={selectedPortfolio && !isLoading ? { scale: 1.05 } : {}}
                whileTap={selectedPortfolio && !isLoading ? { scale: 0.95 } : {}}
                className={`flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                  selectedPortfolio && !isLoading
                    ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                    : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                }`}
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                <Send className="w-4 h-4" />
                {isLoading ? 'Đang gửi...' : 'Gửi'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
