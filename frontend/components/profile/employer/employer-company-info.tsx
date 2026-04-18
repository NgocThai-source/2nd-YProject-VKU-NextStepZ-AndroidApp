'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  Globe,
  Calendar,
  Users,
  Edit2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/lib/profile-context';
import EditEmployerCompanyInfoDialog from './edit-employer-company-info-dialog';

interface CompanyInfo {
  companyName: string;
  industry: string;
  companySize: '10-50' | '50-200' | '200-500' | '500+';
  address: string;
  website: string;
  foundingYear: string;
}

interface EmployerCompanyInfoProps {
  data?: CompanyInfo;
  onEditClick?: () => void;
}

const companySizeMap = {
  '10-50': '10 - 50 nhân viên',
  '50-200': '50 - 200 nhân viên',
  '200-500': '200 - 500 nhân viên',
  '500+': 'Trên 500 nhân viên',
};

export default function EmployerCompanyInfo({
  data = {
    companyName: 'Công ty TNHH ABC',
    industry: 'Công nghệ Thông tin',
    companySize: '50-200',
    address: '123 Đường Nguyễn Huệ, Tp. Hồ Chí Minh',
    website: 'https://example.com',
    foundingYear: '2020',
  },
  onEditClick,
}: EmployerCompanyInfoProps) {
  const { employerProfile, updateEmployerProfile } = useProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyInfo>(data);

  // Sync with context changes
  useEffect(() => {
    if (employerProfile) {
      setCompanyData({
        companyName: employerProfile.companyName || data.companyName,
        industry: employerProfile.industry || data.industry,
        companySize: (employerProfile.companySize as '10-50' | '50-200' | '200-500' | '500+') || data.companySize,
        address: employerProfile.address || data.address,
        website: employerProfile.website || data.website,
        foundingYear: employerProfile.foundingYear || data.foundingYear,
      });
    }
  }, [employerProfile, data]);

  const handleEditClick = () => {
    onEditClick?.();
    setIsEditOpen(true);
  };

  const handleSaveCompanyInfo = (newData: CompanyInfo) => {
    setCompanyData(newData);
    updateEmployerProfile({
      companyName: newData.companyName,
      industry: newData.industry,
      companySize: newData.companySize,
      address: newData.address,
      website: newData.website,
      foundingYear: newData.foundingYear,
    });
  };

  const infoItems = [
    { icon: Building2, label: 'Lĩnh vực hoạt động', value: companyData.industry },
    { icon: Users, label: 'Quy mô công ty', value: companySizeMap[companyData.companySize] },
    { icon: MapPin, label: 'Địa chỉ trụ sở', value: companyData.address },
    { icon: Globe, label: 'Website công ty', value: companyData.website, isLink: true },
    { icon: Calendar, label: 'Năm thành lập', value: companyData.foundingYear },
  ];

  return (
    <>
      <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
          Thông tin công ty
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
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {infoItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-400/30 transition-colors"
              >
                <div className="shrink-0 mt-0.5">
                  <IconComponent className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                    {item.label}
                  </p>
                  {item.isLink ? (
                    <motion.a
                      href={item.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyan-300 hover:text-cyan-200 break-all transition-colors font-medium"
                      style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                      whileHover={{ x: 2 }}
                    >
                      {item.value}
                    </motion.a>
                  ) : (
                    <p className="text-sm text-gray-200 whitespace-pre-wrap" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                      {item.value}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
    <EditEmployerCompanyInfoDialog
      isOpen={isEditOpen}
      onClose={() => setIsEditOpen(false)}
      data={companyData}
      onSave={handleSaveCompanyInfo}
    />
    </>
  );
}
