'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CompanyInfoData {
  companyName: string;
  industry: string;
  companySize: '10-50' | '50-200' | '200-500' | '500+';
  address: string;
  website: string;
  foundingYear: string;
}

interface EditEmployerCompanyInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data?: CompanyInfoData;
  onSave?: (data: CompanyInfoData) => void;
}

const companySizes = ['10-50', '50-200', '200-500', '500+'] as const;
const industries = [
  'Công nghệ Thông tin',
  'Tài chính',
  'Bán lẻ',
  'Sản xuất',
  'Y tế',
  'Giáo dục',
  'Logistics',
  'Nông nghiệp',
  'Bất động sản',
  'Du lịch',
  'Khác',
];

export default function EditEmployerCompanyInfoDialog({
  isOpen,
  onClose,
  data = {
    companyName: 'Công ty TNHH ABC',
    industry: 'Công nghệ Thông tin',
    companySize: '50-200',
    address: '123 Đường Nguyễn Huệ, Tp. Hồ Chí Minh',
    website: 'https://example.com',
    foundingYear: '2020',
  },
  onSave,
}: EditEmployerCompanyInfoDialogProps) {
  const [formData, setFormData] = useState<CompanyInfoData>(data);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof CompanyInfoData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave?.(formData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(data);
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
            Chỉnh sửa thông tin công ty
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 py-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto"
        >
          {/* Company Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Tên công ty
            </label>
            <Input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Nhập tên công ty của bạn"
              className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 text-sm md:text-base"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            />
          </motion.div>

          {/* Industry */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Lĩnh vực hoạt động
            </label>
            <div className="relative">
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none transition-colors text-sm md:text-base appearance-none cursor-pointer"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                <option value="">Chọn lĩnh vực</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </motion.div>

          {/* Company Size */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Quy mô công ty
            </label>
            <div className="relative">
              <select
                value={formData.companySize}
                onChange={(e) => handleInputChange('companySize', e.target.value as '10-50' | '50-200' | '200-500' | '500+')}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none transition-colors text-sm md:text-base appearance-none cursor-pointer"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                {companySizes.map((size) => {
                  const sizeMap = {
                    '10-50': '10 - 50 nhân viên',
                    '50-200': '50 - 200 nhân viên',
                    '200-500': '200 - 500 nhân viên',
                    '500+': 'Trên 500 nhân viên',
                  };
                  return (
                    <option key={size} value={size}>
                      {sizeMap[size]}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Địa chỉ trụ sở
            </label>
            <Input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Nhập địa chỉ công ty"
              className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 text-sm md:text-base"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            />
          </motion.div>

          {/* Website */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Website công ty
            </label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
              className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 text-sm md:text-base"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            />
          </motion.div>

          {/* Founding Year */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Năm thành lập
            </label>
            <Input
              type="number"
              value={formData.foundingYear}
              onChange={(e) => handleInputChange('foundingYear', e.target.value)}
              placeholder="2020"
              min="1800"
              max={new Date().getFullYear()}
              className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 text-sm md:text-base"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            />
          </motion.div>
        </motion.div>

        {/* Footer */}
        <DialogFooter className="bg-slate-800/50 border-t border-slate-700 px-6 py-4 gap-2 sm:gap-3">
          <motion.div
            className="flex flex-col-reverse sm:flex-row gap-2 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
