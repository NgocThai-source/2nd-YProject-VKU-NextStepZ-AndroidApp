'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/lib/profile-context';
import EditEmployerAboutDialog from './edit-employer-about-dialog';

interface EmployerAboutProps {
  description?: string;
  onEditClick?: () => void;
}

export default function EmployerAbout({
  description = `Công ty chúng tôi là một nhà cung cấp hàng đầu các giải pháp công nghệ thông tin. Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao cho khách hàng.`,
  onEditClick,
}: EmployerAboutProps) {
  const { employerProfile, updateEmployerProfile } = useProfile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [aboutData, setAboutData] = useState(description);
  const truncatedLength = 150;
  const isTruncated = aboutData.length > truncatedLength;

  // Sync with context changes
  useEffect(() => {
    if (employerProfile?.about) {
      setAboutData(employerProfile.about);
    }
  }, [employerProfile]);

  const handleEditClick = () => {
    onEditClick?.();
    setIsEditOpen(true);
  };

  const handleSaveAbout = (newDescription: string) => {
    setAboutData(newDescription);
    updateEmployerProfile({
      about: newDescription,
    });
  };

  return (
    <>
      <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            <FileText className="w-5 h-5 text-cyan-400" />
            Giới thiệu công ty
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

        <CardContent>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Description */}
            <motion.p
              className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            >
              {isExpanded || !isTruncated
                ? aboutData
                : `${aboutData.slice(0, truncatedLength)}...`}
            </motion.p>

            {/* Show More/Less Button */}
            {isTruncated && (
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ x: 0 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                {isExpanded ? 'Hiển thị ít hơn' : 'Xem thêm'}
              </motion.button>
            )}


          </motion.div>
        </CardContent>
      </Card>
      <EditEmployerAboutDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        data={aboutData}
        onSave={handleSaveAbout}
      />
    </>
  );
}
