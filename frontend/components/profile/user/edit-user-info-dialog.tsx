'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/toast';
import { API_URL } from '@/lib/api';

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=User';

// Helper function to validate URL
const isValidUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to get safe avatar URL
const getSafeAvatarUrl = (url?: string): string => {
  if (url && isValidUrl(url)) return url;
  return DEFAULT_AVATAR;
};

interface EditUserInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    avatar: string;
    name: string;
    email: string;
    bio: string;
  };
  onSave?: (data: {
    avatar: string;
    name: string;
    email: string;
    bio: string;
  }) => void;
}

export default function EditUserInfoDialog({
  isOpen,
  onClose,
  data,
  onSave,
}: EditUserInfoDialogProps) {
  const { getToken } = useAuth();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState(data ? {
    avatar: getSafeAvatarUrl(data.avatar),
    firstName: data.name?.split(' ')[0] || 'Nguyễn',
    lastName: data.name?.split(' ').slice(1).join(' ') || 'Văn A',
    email: data.email || 'user@example.com',
    bio: data.bio || '',
  } : {
    avatar: DEFAULT_AVATAR,
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    email: 'user@example.com',
    bio: '',
  });
  
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (data && isOpen) {
      const nameParts = data.name?.split(' ') || ['Nguyễn', 'Văn A'];
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      setFormData({
        avatar: getSafeAvatarUrl(data.avatar),
        firstName,
        lastName,
        email: data.email || 'user@example.com',
        bio: data.bio || '',
      });
      setAvatarFile(null);
    }
  }, [data, isOpen]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const token = getToken?.();
    if (!token) throw new Error('No auth token');

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    const response = await fetch(`${API_URL}/profiles/me/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formDataUpload,
    });

    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }

    const result = await response.json();
    return result.avatar || formData.avatar;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = getToken?.();
      if (!token) {
        addToast('Vui lòng đăng nhập để cập nhật thông tin', 'error');
        return;
      }

      let avatarUrl = formData.avatar;

      // Upload avatar if file was selected
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      // Update user info
      const response = await fetch(`${API_URL}/profiles/me/user-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          bio: formData.bio,
          avatar: avatarUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      
      onSave?.({
        avatar: result.avatar || avatarUrl,
        name: `${result.firstName || formData.firstName} ${result.lastName || formData.lastName}`,
        email: result.email || formData.email,
        bio: result.bio || formData.bio,
      });

      addToast('Cập nhật thông tin thành công!', 'success');
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      addToast('Lỗi khi cập nhật thông tin. Vui lòng thử lại.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (data) {
      const nameParts = data.name?.split(' ') || ['Nguyễn', 'Văn A'];
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      setFormData({
        avatar: getSafeAvatarUrl(data.avatar),
        firstName,
        lastName,
        email: data.email || 'user@example.com',
        bio: data.bio || '',
      });
      setAvatarFile(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl bg-linear-to-br from-slate-900 to-slate-800 border-slate-700 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="bg-linear-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <DialogTitle
              className="text-xl md:text-2xl font-bold bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent"
              style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}
            >
              Chỉnh sửa thông tin tài khoản
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 py-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto"
        >
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center space-y-4"
          >
            <label className="block text-sm font-semibold text-white mb-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Ảnh đại diện
            </label>
            <div
              onMouseEnter={() => setIsHoveringAvatar(true)}
              onMouseLeave={() => setIsHoveringAvatar(false)}
              className="relative group"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-xl">
                <Image
                  src={getSafeAvatarUrl(formData.avatar)}
                  alt="Avatar"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHoveringAvatar ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center cursor-pointer"
              >
                <Camera className="w-8 h-8 text-white" />
              </motion.div>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload" className="absolute inset-0 rounded-2xl cursor-pointer" />
            </div>
            <p className="text-xs text-gray-400 text-center" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              Nhấp để chọn ảnh mới
            </p>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-linear-to-r from-slate-700 via-cyan-400/20 to-slate-700" />

          {/* Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* First Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                Tên
              </label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Tên"
                className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 text-sm md:text-base"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                Họ
              </label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Họ"
                className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400 text-sm md:text-base"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                Email
              </label>
              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  placeholder="Nhập email của bạn"
                  className="bg-slate-700/50 border-slate-600 text-gray-400 placeholder-gray-500 cursor-not-allowed text-sm md:text-base"
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                />
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>Không thể thay đổi email</p>
              </div>
            </div>

            {/* Bio Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                Tiểu sử
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Viết gì đó về bạn..."
                rows={4}
                className="w-full bg-slate-800/50 border border-slate-600 text-white placeholder-gray-500 rounded-lg p-3 focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none transition-colors text-sm md:text-base"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
              <p className="text-xs text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                {formData.bio.length}/200 ký tự
              </p>
            </div>
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
