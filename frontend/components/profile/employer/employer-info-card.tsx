'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Camera, Edit2, Globe, CheckCircle2, Clock, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/lib/profile-context';
import EditEmployerInfoDialog from './edit-employer-info-dialog';
import ShareEmployerPublicProfileDialog from './share-employer-public-profile-dialog';

const DEFAULT_LOGO = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Company';

// Helper function to validate URL
const isValidUrl = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to get safe logo URL
const getSafeLogoUrl = (url?: string | null): string => {
  if (url && isValidUrl(url)) return url;
  return DEFAULT_LOGO;
};

interface EmployerInfoCardProps {
  companyLogo?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  isVerified?: boolean;
  onEditClick?: () => void;
  onAvatarChange?: (file: File) => void;
}

export default function EmployerInfoCard({
  companyLogo,
  companyName = 'Công ty TNHH ABC',
  email = 'company@example.com',
  phone = '+84 28 1234 5678',
  isVerified = false,
  onEditClick,
  onAvatarChange,
}: EmployerInfoCardProps) {
  const { userProfile, updateUserProfile } = useProfile();
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [publicProfile, setPublicProfile] = useState<{ id?: string; shareToken?: string; isActive?: boolean; viewCount?: number } | null>(null);
  const [employerData, setEmployerData] = useState({
    companyLogo: getSafeLogoUrl(userProfile?.avatar || companyLogo),
    companyName: userProfile?.name || companyName,
    email: userProfile?.email || email,
    phone: userProfile?.phone || phone,
  });

  // Sync with context changes
  useEffect(() => {
    if (userProfile) {
      setEmployerData({
        companyLogo: getSafeLogoUrl(userProfile.avatar || companyLogo),
        companyName: userProfile.name || companyName,
        email: userProfile.email || email,
        phone: userProfile.phone || phone,
      });
    }
  }, [userProfile, companyLogo, companyName, email, phone]);

  // Fetch public profile to get shareToken
  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
        if (!token) {
          console.warn('No auth token found');
          return;
        }

        const response = await fetch('/api/profiles/public', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({}),
        });

        if (response.ok) {
          const data = await response.json();
          setPublicProfile(data);
        } else {
          console.error('Failed to fetch public profile:', response.status);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchPublicProfile();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarChange?.(file);
    }
  };

  const handleEditClick = () => {
    onEditClick?.();
    setIsEditOpen(true);
  };

  const handleSaveEmployerInfo = (data: any) => {
    setEmployerData(data);
    updateUserProfile({
      avatar: data.companyLogo,
      name: data.companyName,
      email: data.email,
      phone: data.phone,
    });
  };

  return (
    <>
      <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Thông tin tài khoản
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          {/* Account Type Badge */}
          <div className="mb-4 pb-4 border-b border-slate-700">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              Loại tài khoản
            </p>
            <p className="text-lg font-medium text-amber-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              Nhà tuyển dụng
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 items-start">
            {/* Logo Section */}
            <div className="w-full flex justify-center sm:justify-start">
              <div className="relative group">
                <motion.div
                  onHoverStart={() => setIsHoveringLogo(true)}
                  onHoverEnd={() => setIsHoveringLogo(false)}
                  className="relative"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-cyan-400/30 shadow-lg relative mx-auto sm:mx-0">
                    <Image
                      src={getSafeLogoUrl(employerData.companyLogo)}
                      alt={employerData.companyName || 'Company Logo'}
                      fill
                      className="object-cover"
                      priority={false}
                      sizes="(max-width: 640px) 80px, 96px"
                    />
                  </div>

                  {/* Logo Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHoveringLogo ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="employer-logo-upload"
                    aria-label="Upload company logo"
                  />
                  <label
                    htmlFor="employer-logo-upload"
                    className="absolute inset-0 rounded-2xl cursor-pointer"
                  />
                </motion.div>
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full space-y-3 sm:space-y-4">
              {/* Company Name */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  Tên công ty
                </p>
                <h2 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: "'Exo 2 Bold', sans-serif" }}>
                  {employerData.companyName}
                </h2>
              </div>

              {/* Email */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  Email doanh nghiệp
                </p>
                <p className="text-sm text-gray-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                  {employerData.email}
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  Số điện thoại doanh nghiệp
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <p className="text-sm text-gray-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                    {employerData.phone}
                  </p>
                </div>
              </div>

              {/* Verification Status */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  Trạng thái xác thực
                </p>
                <div className="flex items-center gap-2">
                  {isVerified ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Đã xác thực doanh nghiệp
                      </div>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-amber-400" />
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Chưa xác thực
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
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
                  className="px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-400/50 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  onClick={() => setIsShareDialogOpen(true)}
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
      <EditEmployerInfoDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        data={employerData}
        onSave={handleSaveEmployerInfo}
      />
      <ShareEmployerPublicProfileDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        employerProfile={{
          companyName: employerData.companyName,
          email: employerData.email,
        }}
        publicProfile={publicProfile || undefined}
      />
    </>
  );
}
