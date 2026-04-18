'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MapPin, Link as LinkIcon, ChevronDown, Edit2, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VIETNAM_CITIES, getCityDistricts } from '@/lib/vietnam-cities';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/toast';
import { API_URL } from '@/lib/api';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface PersonalInfoData {
  firstName?: string;
  lastName?: string;
  phone: string;
  birthDate: string;
  city: string;
  district: string;
  socialLinks: SocialLink[];
}

interface EditPersonalInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data?: PersonalInfoData;
  onSave?: (data: PersonalInfoData) => void;
}

const SOCIAL_PLATFORMS = ['LinkedIn', 'GitHub', 'Facebook', 'Twitter', 'Instagram', 'Portfolio', 'Other'];

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export default function EditPersonalInfoDialog({
  isOpen,
  onClose,
  data = {
    phone: '+84 912 345 678',
    birthDate: '1999-01-15',
    city: 'Hà Nội',
    district: '',
    socialLinks: [],
  },
  onSave,
}: EditPersonalInfoDialogProps) {
  const { getToken } = useAuth();
  const { addToast } = useToast();
  
  // Ensure socialLinks is always an array
  const normalizedData = {
    ...data,
    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
  };

  const [formData, setFormData] = useState<PersonalInfoData>(normalizedData);
  const [selectedCity, setSelectedCity] = useState(data.city || '');
  const [isSaving, setIsSaving] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [showSocialForm, setShowSocialForm] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [editingSocialUrl, setEditingSocialUrl] = useState('');

  // Update formData whenever data prop changes
  useEffect(() => {
    const normalized = {
      ...data,
      socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
    };
    setFormData(normalized);
    setSelectedCity(data.city || '');
  }, [data]);

  // Sync form data when dialog opens or data changes
  useEffect(() => {
    if (isOpen) {
      const normalized = {
        ...data,
        socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
      };
      setFormData(normalized);
      setSelectedCity(data.city || '');
    }
  }, [isOpen, data]);

  const districts = getCityDistricts(selectedCity);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setFormData({
      ...formData,
      city,
      district: '', // Reset district when city changes
    });
  };

  const handleAddSocialLink = () => {
    if (!newSocialPlatform || !newSocialUrl) return;

    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: newSocialPlatform,
      url: newSocialUrl,
    };

    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, newLink],
    });

    setNewSocialPlatform('');
    setNewSocialUrl('');
    setShowSocialForm(false);
  };

  const handleRemoveSocialLink = (id: string) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter((link) => link.id !== id),
    });
  };

  const handleEditSocialLink = (id: string, url: string) => {
    setEditingSocialId(id);
    setEditingSocialUrl(url);
  };

  const handleSaveSocialLink = (id: string) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.map((link) =>
        link.id === id ? { ...link, url: editingSocialUrl } : link
      ),
    });
    setEditingSocialId(null);
    setEditingSocialUrl('');
  };

  const handleCancelEditSocialLink = () => {
    setEditingSocialId(null);
    setEditingSocialUrl('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = getToken?.();
      if (!token) {
        addToast('Vui lòng đăng nhập để cập nhật thông tin', 'error');
        return;
      }

      // Prepare social links in correct format
      const socialLinksData = formData.socialLinks.map((link) => ({
        platform: link.platform,
        url: link.url,
      }));

      const response = await fetch(`${API_URL}/profiles/me/personal-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: formData.phone,
          birthDate: formData.birthDate,
          city: selectedCity,
          district: formData.district,
          socialLinks: socialLinksData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      onSave?.(formData);
      addToast('Cập nhật thông tin cá nhân thành công!', 'success');
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      addToast('Lỗi khi cập nhật thông tin. Vui lòng thử lại.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(data);
    setSelectedCity(data.city || '');
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
            Chỉnh sửa thông tin cá nhân
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 py-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto"
        >
          {/* Số Điện Thoại */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Số điện thoại
            </label>
            <div className="relative">
              <Input
                type="tel"
                value={formData.phone}
                disabled
                placeholder="+84 912 345 678"
                className="bg-slate-700/50 border-slate-600 text-gray-400 placeholder-gray-500 cursor-not-allowed text-sm md:text-base"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
              <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>Không thể thay đổi số điện thoại</p>
            </div>
          </motion.div>

          {/* Ngày Sinh */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Ngày sinh
            </label>
            <div className="relative">
              <Input
                type="text"
                value={formData.birthDate ? formatDate(formData.birthDate) : ''}
                disabled
                placeholder="dd/mm/yyyy"
                className="bg-slate-700/50 border-slate-600 text-gray-400 placeholder-gray-500 cursor-not-allowed text-sm md:text-base"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
              <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>Không thể thay đổi ngày sinh</p>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-linear-to-r from-slate-700 via-cyan-400/20 to-slate-700" />

          {/* Địa chỉ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              <MapPin className="w-4 h-4 text-cyan-400" />
              Địa chỉ
            </h3>

            {/* Tỉnh Thành */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none transition-colors text-sm md:text-base appearance-none cursor-pointer"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                <option value="">Chọn Thành Phố/Tỉnh</option>
                {VIETNAM_CITIES.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Quận Huyện */}
            {selectedCity && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <div className="relative">
                  <select
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none transition-colors text-sm md:text-base appearance-none cursor-pointer"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map((district, index) => (
                      <option key={index} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-linear-to-r from-slate-700 via-cyan-400/20 to-slate-700" />

          {/* Liên Kết Xã Hội */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              <LinkIcon className="w-4 h-4 text-cyan-400" />
              Liên kết xã hội
            </h3>

            {/* Social Links List */}
            <div className="space-y-2">
              <AnimatePresence>
                {formData.socialLinks.map((link, idx) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors group"
                  >
                    {editingSocialId === link.id ? (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 mb-2" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                            {link.platform}
                          </p>
                          <Input
                            type="url"
                            value={editingSocialUrl}
                            onChange={(e) => setEditingSocialUrl(e.target.value)}
                            placeholder="https://..."
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 text-sm"
                            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSaveSocialLink(link.id)}
                          className="p-2 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-all"
                          title="Lưu"
                        >
                          <Check className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancelEditSocialLink}
                          className="p-2 rounded hover:bg-slate-700 text-slate-400 transition-all"
                          title="Hủy"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                            {link.platform}
                          </p>
                          <p className="text-sm text-cyan-300 truncate" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                            {link.url}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditSocialLink(link.id, link.url)}
                          className="p-2 rounded hover:bg-cyan-500/20 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveSocialLink(link.id)}
                          className="p-2 rounded hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add Social Link Form */}
            <AnimatePresence>
              {showSocialForm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-3"
                >
                  <div className="relative">
                    <select
                      value={newSocialPlatform}
                      onChange={(e) => setNewSocialPlatform(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none text-sm appearance-none cursor-pointer"
                      style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                    >
                      <option value="">Chọn nền tảng</option>
                      {SOCIAL_PLATFORMS.map((platform) => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>

                  <Input
                    type="url"
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 text-sm"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleAddSocialLink}
                      disabled={!newSocialPlatform || !newSocialUrl}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-50 text-sm"
                      style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Thêm
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowSocialForm(false)}
                      variant="outline"
                      className="flex-1 bg-slate-700 hover:bg-slate-600 border-slate-600 text-white text-sm"
                      style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                    >
                      Hủy
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add Social Link Button */}
            {!showSocialForm && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSocialForm(true)}
                className="w-full py-2 rounded-lg border border-dashed border-slate-600 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all flex items-center justify-center gap-2 text-sm"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                <Plus className="w-4 h-4" />
                Thêm liên kết
              </motion.button>
            )}
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
