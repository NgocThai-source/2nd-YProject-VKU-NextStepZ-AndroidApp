'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EditEmployerAboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data?: string;
  onSave?: (data: string) => void;
}

export default function EditEmployerAboutDialog({
  isOpen,
  onClose,
  data = `Công ty chúng tôi là một nhà cung cấp hàng đầu các giải pháp công nghệ thông tin. Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao cho khách hàng.`,
  onSave,
}: EditEmployerAboutDialogProps) {
  const [description, setDescription] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const maxLength = 1000;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave?.(description);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setDescription(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl bg-linear-to-br from-slate-900 to-slate-800 border-slate-700 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="bg-linear-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700">
          <DialogTitle
            className="text-xl md:text-2xl font-bold bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent"
            style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}
          >
            Chỉnh sửa giới thiệu công ty
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 py-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto"
        >
          {/* Description Textarea */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <label className="block text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Mô tả công ty
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, maxLength))}
              placeholder="Hãy viết gì đó về công ty của bạn..."
              rows={8}
              className="w-full bg-slate-800/50 border border-slate-600 text-white placeholder-gray-500 rounded-lg p-4 focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none transition-colors text-sm md:text-base resize-none"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                Mô tả chi tiết về công ty, lĩnh vực hoạt động, thành tích...
              </p>
              <p className="text-xs text-gray-400 font-medium">
                {description.length}/{maxLength}
              </p>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/30"
          >
            <p className="text-sm text-blue-200" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              💡 Gợi ý: Viết một mô tả hấp dẫn về công ty của bạn để thu hút ứng viên giỏi. Hãy nêu rõ sứ mệnh, tầm nhìn và những giá trị cốt lõi của công ty.
            </p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <DialogFooter className="bg-slate-800/50 border-t border-slate-700 px-6 py-4 gap-2 sm:gap-3">
          <motion.div
            className="flex flex-col-reverse sm:flex-row gap-2 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm md:text-base py-2 md:py-3 transition-colors"
              disabled={isSaving}
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base py-2 md:py-3 transition-colors"
              disabled={isSaving}
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              Đặt lại
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white text-sm md:text-base py-2 md:py-3 disabled:opacity-50 transition-colors"
              disabled={isSaving}
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
