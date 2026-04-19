'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';

interface TemplateGalleryProps {
  onSelect: (templateId: number) => void;
  onClose: () => void;
}

export default function TemplateGallery({ onSelect, onClose }: TemplateGalleryProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
        <div className="flex-1">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-0.5 sm:mb-1 md:mb-2" style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}>Chọn phong cách CV của bạn</h2>
          <p className="text-xs sm:text-sm text-slate-400" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>Chọn một thiết kế phù hợp với phong cách của bạn</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 sm:p-2 hover:bg-slate-800/50 rounded-lg transition-all shrink-0"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
        </button>
      </div>

      {/* Templates Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {TEMPLATES.map((template) => (
          <motion.div
            key={template.id}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="group cursor-pointer rounded-lg overflow-hidden bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/50 transition-all"
            onClick={() => onSelect(template.id)}
          >
            {/* Template Preview */}
            <div
              className={`bg-linear-to-br ${template.color} h-32 sm:h-40 md:h-48 flex items-center justify-center relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-all" />
              <span className="text-4xl sm:text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300">
                {template.icon}
              </span>
            </div>

            {/* Template Info */}
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-white mb-1 sm:mb-2 group-hover:text-cyan-300 transition-colors text-base sm:text-lg" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                {template.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 line-clamp-2" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>{template.description}</p>

              {/* Select Button */}
              <button
                onClick={() => onSelect(template.id)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-linear-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-linear-to-r hover:from-cyan-500/30 hover:to-blue-500/30 font-medium transition-all text-sm sm:text-base active:scale-95"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Chọn mẫu này
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Info Text */}
      <p className="text-xs sm:text-sm text-slate-400 text-center" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
        💡 Bạn có thể thay đổi mẫu bất cứ lúc nào từ menu Chọn phong cách CV
      </p>
    </div>
  );
}
