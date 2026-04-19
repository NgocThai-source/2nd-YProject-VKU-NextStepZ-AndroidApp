'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none space-y-3 max-w-sm w-full px-4">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  const getConfig = (type: ToastType) => {
    const configs = {
      success: {
        bgGradient: 'from-emerald-900 to-emerald-800',
        borderColor: 'border-emerald-700',
        textColor: 'text-emerald-100',
        iconColor: 'text-emerald-400',
        icon: CheckCircle,
        accentGradient: 'from-emerald-500/30 to-emerald-600/30',
      },
      error: {
        bgGradient: 'from-red-900 to-red-800',
        borderColor: 'border-red-700',
        textColor: 'text-red-100',
        iconColor: 'text-red-400',
        icon: AlertCircle,
        accentGradient: 'from-red-500/30 to-red-600/30',
      },
      warning: {
        bgGradient: 'from-amber-900 to-amber-800',
        borderColor: 'border-amber-700',
        textColor: 'text-amber-100',
        iconColor: 'text-amber-400',
        icon: AlertTriangle,
        accentGradient: 'from-amber-500/30 to-amber-600/30',
      },
      info: {
        bgGradient: 'from-cyan-900 to-cyan-800',
        borderColor: 'border-cyan-700',
        textColor: 'text-cyan-100',
        iconColor: 'text-cyan-400',
        icon: Info,
        accentGradient: 'from-cyan-500/30 to-cyan-600/30',
      },
    };
    return configs[type];
  };

  const config = getConfig(toast.type);
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="pointer-events-auto"
    >
      <div
        className={`relative overflow-hidden rounded-xl border ${config.borderColor} bg-linear-to-br ${config.bgGradient} backdrop-blur-xl shadow-2xl`}
      >
        {/* Background accent gradient */}
        <div className={`absolute inset-0 bg-linear-to-br ${config.accentGradient} opacity-50 pointer-events-none`} />

        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none" />

        {/* Content */}
        <div className="relative p-4 flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30, delay: 0.1 }}
            >
              <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
            </motion.div>
          </div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className={`flex-1 ${config.textColor} text-sm leading-relaxed`}
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            {toast.message}
          </motion.div>

          {/* Close button */}
          <button
            onClick={onClose}
            className={`shrink-0 ml-auto ${config.iconColor} hover:opacity-75 transition-opacity`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.div>
          </button>
        </div>

        {/* Progress bar */}
        {toast.duration && toast.duration > 0 && (
          <motion.div
            className={`absolute bottom-0 left-0 h-1 bg-linear-to-r ${config.bgGradient}`}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: (toast.duration || 4000) / 1000, ease: 'linear' }}
          />
        )}
      </div>
    </motion.div>
  );
};
