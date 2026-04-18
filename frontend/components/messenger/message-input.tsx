'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, X, FileText } from 'lucide-react';
import { useMessaging } from '@/lib/messaging-context';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/toast';
import { useSavedPortfolio, SavedPortfolio } from '@/lib/saved-portfolio-context';
import PortfolioSelectorModal from './portfolio-selector-modal';

export default function MessageInput() {
  const { selectedConversation, sendMessage, isLoading } = useMessaging();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { savedPortfolios } = useSavedPortfolio();
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isSendingPortfolio, setIsSendingPortfolio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Kích thước ảnh không vượt quá 5MB', 'error');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedConversation) return;

    if (previewUrl) {
      // Send image
      if (!content.trim() && selectedImage) {
        await sendMessage(selectedConversation.id, 'Gửi ảnh', 'image', previewUrl);
      } else {
        await sendMessage(selectedConversation.id, content || 'Gửi ảnh', 'image', previewUrl);
      }
      setSelectedImage(null);
      setPreviewUrl(null);
      setContent('');
    } else if (content.trim()) {
      // Send text
      await sendMessage(selectedConversation.id, content, 'text');
      setContent('');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendPortfolio = async (selectedPortfolio: SavedPortfolio) => {
    if (!selectedConversation) return;

    setIsSendingPortfolio(true);
    try {
      await sendMessage(
        selectedConversation.id,
        selectedPortfolio.name,
        'portfolio',
        undefined,
        selectedPortfolio.id,
        selectedPortfolio
      );
      addToast('Hồ sơ đã được gửi!', 'success');
      setIsPortfolioModalOpen(false);
    } catch {
      addToast('Gửi hồ sơ thất bại', 'error');
    } finally {
      setIsSendingPortfolio(false);
    }
  };

  if (!selectedConversation) {
    return null;
  }

  const canSend = (content.trim() || previewUrl) && !isLoading;

  return (
    <div className="p-3 md:p-4 border-t border-slate-700 bg-slate-900/50 backdrop-blur-xl message-input-area">
      {/* Image Preview */}
      {previewUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mb-3 relative inline-block"
        >
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 border-cyan-400/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Image preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => {
              setSelectedImage(null);
              setPreviewUrl(null);
            }}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Input Area - Mobile Optimized */}
      <div className="flex items-end gap-2 md:gap-3">
        {/* Text Input */}
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault();
                if (canSend) {
                  handleSendMessage();
                }
              }
            }}
            placeholder="Viết tin nhắn..."
            disabled={isLoading}
            rows={3}
            className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm md:text-base resize-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all disabled:opacity-50"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          />
        </div>

        {/* Action Buttons - Vertical Stack */}
        <div className="flex flex-col gap-1 md:gap-2 shrink-0">
          {/* Send Button */}
          <motion.button
            whileHover={canSend ? { scale: 1.05 } : {}}
            whileTap={canSend ? { scale: 0.95 } : {}}
            onClick={handleSendMessage}
            disabled={!canSend}
            className={`p-2 md:p-3 rounded-lg transition-all min-h-10 min-w-10 flex items-center justify-center ${canSend
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50 text-white'
                : 'bg-slate-700 text-gray-400 cursor-not-allowed'
              }`}
            title="Gửi (Enter)"
          >
            <Send className="w-4 md:w-5 h-4 md:h-5" />
          </motion.button>

          {/* Image Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-2 md:p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-cyan-400 transition-colors disabled:opacity-50 min-h-10 min-w-10 flex items-center justify-center"
            title="Gửi ảnh"
          >
            <ImageIcon className="w-4 md:w-5 h-4 md:h-5" />
          </motion.button>
        </div>
      </div>

      {/* Portfolio Button - Only for User (Student) role, hidden for Employers */}
      {user?.role !== 'employer' && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsPortfolioModalOpen(true)}
          disabled={isLoading}
          className="w-full mt-2 md:mt-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-cyan-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium text-sm md:text-base"
          style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          title="Gửi hồ sơ sáng tạo"
        >
          <FileText className="w-4 h-4" />
          Chia sẻ hồ sơ
        </motion.button>
      )}

      {/* Portfolio Selector Modal */}
      <PortfolioSelectorModal
        portfolios={savedPortfolios}
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        onSelect={handleSendPortfolio}
        isLoading={isSendingPortfolio}
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
    </div>
  );
}
