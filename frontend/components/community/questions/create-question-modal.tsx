'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Send, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { Question, mockUsers, mockQuestions } from '@/lib/community-mock-data';
import { Avatar } from '../shared/avatar';
import * as communityApi from '@/lib/community-api';
import { useProfile } from '@/lib/profile-context';

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (question: Question) => void;
}

// Collect all unique tags from existing questions
const getAllQuestionTags = (): string[] => {
  const tagsSet = new Set<string>();
  mockQuestions.forEach((q) => {
    q.tags.forEach((tag) => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
};

export function CreateQuestionModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateQuestionModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const postIdCounterRef = useRef(0);
  const availableTags = getAllQuestionTags();
  const { userProfile } = useProfile();

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag].slice(0, 10)
    );
  };

  const handleAddNewTag = () => {
    const trimmedTag = newTagInput.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag) && selectedTags.length < 10) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    const newErrors: string[] = [];

    if (!title.trim()) {
      newErrors.push('Vui lòng nhập tiêu đề câu hỏi');
    }
    if (title.trim().length < 10) {
      newErrors.push('Tiêu đề phải có ít nhất 10 ký tự');
    }
    if (title.trim().length > 200) {
      newErrors.push('Tiêu đề không được vượt quá 200 ký tự');
    }

    if (!description.trim()) {
      newErrors.push('Vui lòng nhập mô tả câu hỏi');
    }
    if (description.trim().length < 20) {
      newErrors.push('Mô tả phải có ít nhất 20 ký tự');
    }
    if (description.trim().length > 5000) {
      newErrors.push('Mô tả không được vượt quá 5000 ký tự');
    }

    if (selectedTags.length === 0) {
      newErrors.push('Vui lòng chọn ít nhất 1 tag');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Call API to create question
      await communityApi.createQuestion({
        title: title.trim(),
        content: description.trim(),
        tags: selectedTags,
      });

      // Create mock Question for callback (parent will refresh from API)
      const newQuestion: Question = {
        id: `question-${postIdCounterRef.current++}`,
        author: mockUsers[0],
        title: title.trim(),
        content: description.trim(),
        tags: selectedTags,
        timestamp: new Date().toISOString(),
        views: 0,
        votes: 0,
        answers: 0,
        isAnswered: false,
      };

      onSubmit?.(newQuestion);
      handleClose();
    } catch (err) {
      console.error('Error creating question:', err);
      setErrors(['Không thể tạo câu hỏi. Vui lòng thử lại.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setSelectedTags([]);
    setErrors([]);
    setIsSubmitting(false);
    onClose();
  };

  // Use profile data if available, fallback to mock
  const currentUser = userProfile ? {
    name: userProfile.name || mockUsers[0].name,
    avatar: userProfile.avatar || mockUsers[0].avatar,
    title: userProfile.bio || mockUsers[0].title,
    verified: true,
  } : mockUsers[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20"
          >
            <div className="bg-slate-800 border border-cyan-400/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden backdrop-blur-sm flex flex-col relative z-0">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyan-400/10 sticky top-0 bg-slate-800/95">
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                  Đặt Câu Hỏi
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Error Messages */}
                {errors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 space-y-2"
                  >
                    {errors.map((error, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-red-300">{error}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* User Info */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-cyan-400/10">
                  <Avatar src={currentUser.avatar} alt={currentUser.name} size="md" verified={currentUser.verified} />
                  <div>
                    <h3 className="font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                      {currentUser.name}
                    </h3>
                    <p className="text-sm text-gray-400">{currentUser.title}</p>
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                    Tiêu Đề Câu Hỏi
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrors([]);
                    }}
                    placeholder="Câu hỏi của bạn là gì?"
                    maxLength={200}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400 outline-none transition-all"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  />
                  <p className="text-xs text-gray-500 mt-1">{title.length}/200 ký tự</p>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                    Mô Tả Chi Tiết
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors([]);
                    }}
                    placeholder="Mô tả chi tiết câu hỏi của bạn để nhận được câu trả lời tốt hơn..."
                    maxLength={5000}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400 outline-none transition-all resize-none"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  />
                  <p className="text-xs text-gray-500 mt-1">{description.length}/5000 ký tự</p>
                </div>

                {/* Tags Selection */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                    Thêm Tags (Chọn 1-10)
                  </label>

                  {/* Suggested Tags */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">Gợi ý:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 rounded-lg bg-white/5 border border-cyan-400/10">
                      {availableTags.map((tag) => (
                        <motion.button
                          key={tag}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-2 rounded-lg text-sm transition-all font-medium ${selectedTags.includes(tag)
                            ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400'
                            : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                            }`}
                          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                        >
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Add Custom Tag */}
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNewTag()}
                      placeholder="Hoặc nhập tag mới..."
                      maxLength={30}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400 outline-none transition-all text-sm"
                      style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                      disabled={selectedTags.length >= 10}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddNewTag}
                      disabled={!newTagInput.trim() || selectedTags.length >= 10}
                      className="px-3 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                    >
                      Thêm
                    </motion.button>
                  </div>

                  {/* Selected Tags Display */}
                  {selectedTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <motion.div
                          key={tag}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 text-cyan-300 text-sm font-medium"
                        >
                          <span>{tag}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-cyan-400 hover:text-red-400 transition-colors"
                          >
                            ✕
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2">Đã chọn: {selectedTags.length}/10</p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Đang gửi...</>
                    ) : (
                      <><Send className="w-5 h-5" /> Đặt Câu Hỏi</>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="px-6 py-3 rounded-lg bg-white/10 text-gray-300 font-semibold hover:bg-white/20 transition-all"
                    style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                  >
                    Hủy
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
