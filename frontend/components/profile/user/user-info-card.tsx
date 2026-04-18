'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Camera, Globe, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditUserInfoDialog from './edit-user-info-dialog';
import SharePublicProfileDialog from './share-public-profile-dialog';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/toast';
import { API_URL } from '@/lib/api';

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=User';

// Helper function to validate URL
const isValidUrl = (url: string): boolean => {
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

interface UserInfoCardProps {
  avatar?: string;
  name?: string;
  email?: string;
  bio?: string;
  onEditClick?: () => void;
  onAvatarChange?: (file: File) => void;
  onSaveUserInfo?: (data: { avatar: string; name: string; email: string; bio: string }) => void;
}

export default function UserInfoCard({
  avatar,
  name = 'Nguyễn Văn A',
  email = 'user@example.com',
  bio = '',
  onEditClick,
  onAvatarChange,
  onSaveUserInfo,
}: UserInfoCardProps) {
  const { getToken } = useAuth();
  const { addToast } = useToast();
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [publicProfile, setPublicProfile] = useState<{ id?: string; shareToken?: string; isActive?: boolean; viewCount?: number } | null>(null);

  // Compute current data from props using useMemo
  const currentData = useMemo(() => ({
    avatar: getSafeAvatarUrl(avatar),
    name: name || 'Nguyễn Văn A',
    email: email || 'user@example.com',
    bio: bio || ''
  }), [avatar, name, email, bio]);

  // Fetch public profile data
  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
        if (!token) {
          console.warn('No auth token found');
          return;
        }

        const url = '/api/profiles/public';
        console.log('Fetching from URL:', url);
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({}),
        });
        console.log('Public profile response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Public profile SUCCESS data:', JSON.stringify(data, null, 2));
          console.log('ShareToken from response:', data?.shareToken);
          setPublicProfile(data);
        } else {
          const errorText = await response.text();
          console.error('❌ Failed to fetch public profile:', response.status, errorText);
        }
      } catch (error) {
        console.error('❌ Fetch error:', error);
      }
    };
    fetchPublicProfile();
  }, []);

  const handleEditClick = () => {
    setIsDialogOpen(true);
    onEditClick?.();
  };

  const handleSaveUserInfo = (data: { avatar: string; name: string; email: string; bio: string }) => {
    onSaveUserInfo?.(data);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      addToast('Chỉ chấp nhận file ảnh (jpg, png, webp)', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast('Kích thước file tối đa là 5MB', 'error');
      return;
    }

    setIsUploadingAvatar(true);

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const token = getToken?.();
      if (!token) {
        addToast('Vui lòng đăng nhập để tải ảnh lên', 'error');
        setLocalAvatar(null);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/profiles/me/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      // Update local state with the new avatar URL
      if (result.avatar) {
        setLocalAvatar(result.avatar);
      }

      onAvatarChange?.(file);
      addToast('Cập nhật ảnh đại diện thành công!', 'success');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setLocalAvatar(null);
      addToast('Lỗi khi tải ảnh lên. Vui lòng thử lại.', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <>
      <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>Thông tin tài khoản</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Account Type Badge */}
          <div className="mb-4 pb-4 border-b border-slate-700">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Loại tài khoản
            </p>
            <p className="text-lg font-medium text-cyan-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              Sinh viên
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 items-start">
            {/* Avatar Section */}
            <div className="w-full flex justify-center sm:justify-start">
              <div className="relative group">
                <motion.div
                  onHoverStart={() => setIsHoveringAvatar(true)}
                  onHoverEnd={() => setIsHoveringAvatar(false)}
                  className="relative"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-cyan-400/30 shadow-lg relative mx-auto sm:mx-0">
                    <Image
                      src={localAvatar || getSafeAvatarUrl(currentData.avatar)}
                      alt={currentData.name || 'Avatar'}
                      fill
                      className="object-cover"
                      priority={false}
                      sizes="(max-width: 640px) 80px, 96px"
                    />
                  </div>

                  {/* Avatar Overlay - Show loading or hover state */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isUploadingAvatar || isHoveringAvatar ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center cursor-pointer"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </motion.div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                    disabled={isUploadingAvatar}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`absolute inset-0 rounded-2xl ${isUploadingAvatar ? 'cursor-wait' : 'cursor-pointer'}`}
                  />
                </motion.div>
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full space-y-3 sm:space-y-4">
              {/* Full Name */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  Họ tên đầy đủ
                </p>
                <h2 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: "'Exo 2 Bold', sans-serif" }}>
                  {currentData.name}
                </h2>
              </div>

              {/* Email */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  Email
                </p>
                <p className="text-sm text-gray-300 break-all" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                  {currentData.email}
                </p>
              </div>

              {/* Bio */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  Mô tả cá nhân
                </p>
                <p className="text-sm text-gray-300 line-clamp-3" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                  {currentData.bio}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditClick}
                  className="px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30 transition-colors text-sm font-medium"
                  style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                >
                  Chỉnh sửa thông tin
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsShareDialogOpen(true)}
                  className="px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-400/50 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                >
                  <Globe className="w-4 h-4" />
                  Xem hồ sơ công khai
                </motion.button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditUserInfoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        data={{
          avatar: currentData.avatar,
          name: currentData.name,
          email: currentData.email,
          bio: currentData.bio,
        }}
        onSave={handleSaveUserInfo}
      />

      {/* Share Public Profile Dialog */}
      <SharePublicProfileDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        userProfile={{
          name: currentData.name,
          bio: currentData.bio,
        }}
        publicProfile={publicProfile || undefined}
      />
    </>
  );
}
