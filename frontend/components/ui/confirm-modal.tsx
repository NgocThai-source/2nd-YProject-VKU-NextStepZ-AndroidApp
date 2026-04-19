'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state after render to avoid hydration issues
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-9999"
          >
            <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-slate-700/50">
                {/* Glow effect */}
                <div className={`absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${
                  isDangerous 
                    ? 'bg-red-500' 
                    : 'bg-cyan-500'
                } pointer-events-none`} />

                <div className="relative flex items-start gap-4">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className={`p-3 rounded-full shrink-0 ${
                      isDangerous
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-cyan-500/20 text-cyan-400'
                    }`}
                  >
                    {isDangerous ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : (
                      <CheckCircle className="w-6 h-6" />
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <motion.h3
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-lg font-bold text-white mb-1"
                      style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                    >
                      {title}
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-sm text-gray-300 leading-relaxed"
                    >
                      {description}
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 flex gap-3 bg-slate-900/50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 transition-all disabled:opacity-50"
                >
                  <div className="flex items-center justify-center gap-2">
                    <X className="w-4 h-4" />
                    {cancelText}
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${
                    isDangerous
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50 hover:border-red-500/70 hover:bg-red-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:border-cyan-500/70 hover:bg-cyan-500/30'
                  }`}
                >
                  <motion.div
                    animate={isLoading ? { opacity: 0.6 } : { opacity: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full" />
                        </motion.div>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {confirmText}
                      </>
                    )}
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
