'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Phone, Mail } from 'lucide-react';

interface PublicPersonalInfo {
  phone?: string | null;
  birthDate?: string | null;
  city?: string | null;
  district?: string | null;
  email?: string | null;
}

interface PublicPersonalInfoCardProps {
  data?: PublicPersonalInfo;
}

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Chưa cập nhật';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return 'Không hợp lệ';
  }
};

export default function PublicPersonalInfoCard({
  data,
}: PublicPersonalInfoCardProps) {
  const displayData = data || {
    phone: '',
    birthDate: '',
    city: '',
    district: '',
    email: '',
  };

  const infoItems = [
    { 
      icon: Mail, 
      label: 'Email', 
      value: displayData.email || 'Chưa cập nhật',
      isEmail: true 
    },
    { 
      icon: Phone, 
      label: 'Số điện thoại', 
      value: displayData.phone || 'Chưa cập nhật' 
    },
    { 
      icon: Calendar, 
      label: 'Ngày sinh', 
      value: formatDate(displayData.birthDate) 
    },
    { 
      icon: MapPin, 
      label: 'Nơi sinh', 
      value: displayData.city && displayData.district 
        ? `${displayData.district}, ${displayData.city}`
        : displayData.city || 'Chưa cập nhật'
    },
  ];

  return (
    <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
          <Mail className="w-5 h-5 text-cyan-400" />
          Thông tin cá nhân
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {infoItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                  {item.label}
                </p>
                {item.isEmail ? (
                  <a
                    href={`mailto:${displayData.email}`}
                    className="text-sm text-cyan-400 hover:text-cyan-300 break-all"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-gray-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
