'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ProfileReportModalProps {
    isOpen: boolean;
    profileName: string;
    profileId: string;
    profileType: 'user' | 'employer';
    onClose: () => void;
    onSubmit?: (reason: string, description: string) => void;
}

const reportReasons = [
    { id: 'fake', label: 'Hồ sơ giả mạo' },
    { id: 'impersonation', label: 'Mạo danh người khác hoặc tổ chức' },
    { id: 'harassment', label: 'Quấy rối hoặc đe dọa' },
    { id: 'spam', label: 'Spam hoặc quảng cáo' },
    { id: 'inappropriate', label: 'Nội dung không phù hợp' },
    { id: 'scam', label: 'Lừa đảo hoặc gian lận' },
    { id: 'other', label: 'Khác' },
];

export function ProfileReportModal({
    isOpen,
    profileName,
    profileId,
    profileType,
    onClose,
    onSubmit,
}: ProfileReportModalProps) {
    const [selectedReason, setSelectedReason] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async () => {
        if (!selectedReason || !profileId) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            const response = await fetch(`${API_BASE}/api/reports`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    targetType: 'profile',
                    targetId: profileId,
                    reason: selectedReason,
                    description,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to submit report');
            }

            onSubmit?.(selectedReason, description);
            setSubmitted(true);

            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (error) {
            console.error('Error submitting report:', error);
            onSubmit?.(selectedReason, description);
            setSubmitted(true);
            setTimeout(() => {
                handleClose();
            }, 2000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedReason('');
        setDescription('');
        setSubmitted(false);
        onClose();
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4"
                    >
                        <div className="bg-slate-800 border border-cyan-400/20 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden backdrop-blur-sm flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-cyan-400/10 sticky top-0 bg-slate-800/95">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                                    Báo Cáo Hồ Sơ
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </motion.button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {submitted ? (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex flex-col items-center justify-center py-8 space-y-4"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                                            <motion.div
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 0.5, repeat: 1 }}
                                            >
                                                <span className="text-3xl">✓</span>
                                            </motion.div>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                                                Cảm ơn bạn!
                                            </h3>
                                            <p className="text-gray-400">
                                                Báo cáo của bạn đã được gửi. Chúng tôi sẽ kiểm tra trong thời gian sớm nhất.
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <>
                                        {/* Profile Summary */}
                                        <div className="p-4 rounded-lg bg-white/5 border border-cyan-400/10">
                                            <p className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                                                {profileName}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {profileType === 'employer' ? 'Nhà tuyển dụng' : 'Người dùng'}
                                            </p>
                                        </div>

                                        {/* Reason Selection */}
                                        <div>
                                            <label className="block text-sm font-semibold text-white mb-3" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                                                Chọn lý do báo cáo *
                                            </label>
                                            <div className="space-y-2">
                                                {reportReasons.map((reason) => (
                                                    <motion.button
                                                        key={reason.id}
                                                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                                                        onClick={() => setSelectedReason(reason.id)}
                                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all border ${selectedReason === reason.id
                                                            ? 'bg-cyan-500/20 border-cyan-400/50'
                                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="reason"
                                                            value={reason.id}
                                                            checked={selectedReason === reason.id}
                                                            onChange={() => setSelectedReason(reason.id)}
                                                            className="w-4 h-4 cursor-pointer"
                                                        />
                                                        <span className="text-sm text-gray-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                                                            {reason.label}
                                                        </span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-semibold text-white mb-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                                                Mô tả thêm (tuỳ chọn)
                                            </label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Hãy cho chúng tôi biết thêm về lý do báo cáo này..."
                                                maxLength={500}
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400 outline-none transition-all resize-none"
                                                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">{description.length}/500</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            {!submitted && (
                                <div className="border-t border-cyan-400/10 p-6 bg-slate-800/95 flex items-center justify-end gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                        className="px-6 py-2 rounded-lg bg-white/5 text-gray-300 font-semibold hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                                    >
                                        Hủy
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSubmit}
                                        disabled={!selectedReason || isSubmitting}
                                        className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                                    >
                                        {isSubmitting ? 'Đang gửi...' : 'Gửi Báo Cáo'}
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
