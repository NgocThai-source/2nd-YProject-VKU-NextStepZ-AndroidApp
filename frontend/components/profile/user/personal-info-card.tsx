'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Edit2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditPersonalInfoDialog from './edit-personal-info-dialog';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  city: string;
  district: string;
  socialLinks: {
    id: string;
    platform: string;
    url: string;
  }[];
}

interface PersonalInfoCardProps {
  data?: PersonalInfo;
  onUpdate?: (data: PersonalInfo) => void;
}

export type { PersonalInfo };

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Chưa cập nhật';
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

export default function PersonalInfoCard({
  data = {
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    phone: '+84 912 345 678',
    birthDate: '1999-01-15',
    city: 'Hà Nội',
    district: 'Hoàn Kiếm',
    socialLinks: [
      {
        id: '1',
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/user',
      },
      {
        id: '2',
        platform: 'GitHub',
        url: 'https://github.com/user',
      },
    ],
  },
  onUpdate,
}: PersonalInfoCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [displayData, setDisplayData] = useState<PersonalInfo>(() => ({
    ...data,
    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
  }));

  // Update displayData whenever data prop changes
  useEffect(() => {
    const normalizedData = {
      ...data,
      socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
    };
    setDisplayData(normalizedData);
  }, [data]);

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleSavePersonalInfo = (newData: PersonalInfo | any) => {
    setDisplayData(newData);
    onUpdate?.(newData);
  };

  const infoItems = [
    { icon: Phone, label: 'Số điện thoại', key: 'phone' as const },
    { icon: Calendar, label: 'Ngày sinh', key: 'birthDate' as const },
  ];

  return (
    <>
      <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            Thông tin cá nhân
          </CardTitle>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEditClick}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            aria-label="Edit"
          >
            <Edit2 className="w-4 h-4 text-cyan-400" />
          </motion.button>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4">
          {/* Personal Information Section */}
          <div className="w-full space-y-3 sm:space-y-4">
            {infoItems.map((item, idx) => {
              const IconComponent = item.icon;
              let value = displayData[item.key as keyof PersonalInfo] as string;
              
              // Format birthDate for display
              if (item.key === 'birthDate') {
                value = formatDate(value);
              }

              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 pb-3 border-b border-slate-700/50"
                >
                  <div className="shrink-0 mt-1">
                    <IconComponent className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                      {item.label}
                    </p>
                    <p className="text-sm sm:text-base text-white font-medium" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                      {value || 'Chưa cập nhật'}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* City & District */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-start gap-3 pb-3 border-b border-slate-700/50"
            >
              <div className="shrink-0 mt-1">
                <MapPin className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                  Nơi sinh
                </p>
                <p className="text-sm sm:text-base text-white font-medium" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                  {displayData.district && displayData.city
                    ? `${displayData.district}, ${displayData.city}`
                    : displayData.city || 'Chưa cập nhật'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Social Links Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 pt-4 border-t border-slate-700"
          >
            <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-3" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
              Liên kết xã hội
            </h3>

            <div className="space-y-2">
              <AnimatePresence>
                {displayData.socialLinks.length > 0 ? (
                  displayData.socialLinks.map((link, idx) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                          {link.platform}
                        </p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors truncate block"
                          style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                        >
                          {link.url}
                        </a>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 py-2" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                    Chưa có liên kết nào
                  </p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-4 border-t border-slate-700"
          >
            <motion.button
              onClick={handleEditClick}
              whileHover={{ scale: 1.02, y: -2 }}
              className="w-full px-4 py-2 rounded-lg font-medium text-sm transition-all bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-400"
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              Chỉnh sửa
            </motion.button>
          </motion.div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditPersonalInfoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        data={displayData}
        onSave={handleSavePersonalInfo}
      />
    </>
  );
}
