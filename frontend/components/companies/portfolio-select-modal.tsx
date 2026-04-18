'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { SavedPortfolio } from '@/lib/saved-portfolio-context';
import { getTemplateById } from '@/lib/templates';

interface PortfolioSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    portfolios: SavedPortfolio[];
    isLoading: boolean;
    onSelect: (portfolio: SavedPortfolio) => void;
}

export function PortfolioSelectModal({
    isOpen,
    onClose,
    portfolios,
    isLoading,
    onSelect,
}: PortfolioSelectModalProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = () => {
        const selected = portfolios.find(p => p.id === selectedId);
        if (selected) {
            setIsSubmitting(true);
            onSelect(selected);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-xl border border-cyan-400/20 bg-slate-900 shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 backdrop-blur-md bg-slate-900/90 border-b border-cyan-400/10 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                                <FileText className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <h2
                                    className="text-xl font-bold text-white"
                                    style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
                                >
                                    Chọn Hồ Sơ
                                </h2>
                                <p className="text-sm text-gray-400">
                                    Chọn hồ sơ để gửi cho nhà tuyển dụng
                                </p>
                            </div>
                        </div>
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
                    <div className="flex-1 overflow-y-auto p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
                            </div>
                        ) : portfolios.length === 0 ? (
                            /* Empty State */
                            <div className="text-center py-12">
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="flex justify-center mb-6"
                                >
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center">
                                        <FileText className="w-10 h-10 text-cyan-400" />
                                    </div>
                                </motion.div>
                                <h3
                                    className="text-xl font-bold text-white mb-2"
                                    style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                                >
                                    Chưa có hồ sơ
                                </h3>
                                <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                                    Bạn cần tạo hồ sơ cá nhân trước khi gửi CV cho nhà tuyển dụng
                                </p>
                                <Link
                                    href="/portfolio"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                                    style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Tạo Hồ Sơ Ngay
                                </Link>
                            </div>
                        ) : (
                            /* Portfolio Grid */
                            <div className="grid gap-4">
                                {portfolios.map((portfolio) => {
                                    const template = getTemplateById(portfolio.selectedTemplate);
                                    const isSelected = selectedId === portfolio.id;

                                    return (
                                        <motion.div
                                            key={portfolio.id}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => setSelectedId(portfolio.id)}
                                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                                ? 'border-cyan-400 bg-cyan-400/10'
                                                : 'border-cyan-400/20 bg-slate-800/50 hover:border-cyan-400/40'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Template Icon */}
                                                <div
                                                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${template?.color || 'from-cyan-500 to-blue-500'
                                                        } flex items-center justify-center shrink-0`}
                                                >
                                                    <span className="text-2xl">{template?.icon || '📄'}</span>
                                                </div>

                                                {/* Portfolio Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4
                                                        className="font-semibold text-white text-lg truncate"
                                                        style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                                                    >
                                                        {portfolio.name || 'Hồ sơ không có tiêu đề'}
                                                    </h4>
                                                    <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                                                        {portfolio.headline || 'Chưa có tiêu đề chuyên môn'}
                                                    </p>
                                                    {portfolio.skills?.selected && portfolio.skills.selected.length > 0 && (
                                                        <div className="flex gap-2 flex-wrap mt-2">
                                                            {portfolio.skills.selected.slice(0, 3).map((skill, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                                                                >
                                                                    {skill.name}
                                                                </span>
                                                            ))}
                                                            {portfolio.skills.selected.length > 3 && (
                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-gray-400">
                                                                    +{portfolio.skills.selected.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Selected Indicator */}
                                                {isSelected && (
                                                    <div className="p-2 rounded-full bg-cyan-400 text-slate-900">
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {portfolios.length > 0 && (
                        <div className="sticky bottom-0 bg-slate-900/90 backdrop-blur-md border-t border-cyan-400/10 p-6 flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="flex-1 px-6 py-3 rounded-lg bg-slate-800/50 text-gray-300 font-semibold border border-cyan-400/20 hover:border-cyan-400/40 transition-all"
                            >
                                Hủy
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: selectedId ? 1.02 : 1 }}
                                whileTap={{ scale: selectedId ? 0.98 : 1 }}
                                onClick={handleConfirm}
                                disabled={!selectedId || isSubmitting}
                                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${selectedId && !isSubmitting
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                                    : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Đang gửi...
                                    </>
                                ) : (
                                    'Gửi CV'
                                )}
                            </motion.button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
