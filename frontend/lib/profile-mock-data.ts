// Mock data for Profile Page components
// Use this for testing and development

export const mockUserInfo = {
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  name: 'Nguyễn Văn A',
  email: 'user@example.com',
  bio: 'Frontend Developer | Creative Designer | Always Learning',
};

export const mockPersonalInfo = {
  fullName: 'Nguyễn Văn A',
  phone: '+84 912 345 678',
  birthDate: '1999-01-15',
  address: 'Hà Nội, Việt Nam',
  socialLinks: [
    {
      id: '1',
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/user',
      icon: () => null,
    },
    {
      id: '2',
      platform: 'GitHub',
      url: 'https://github.com/user',
      icon: () => null,
    },
    {
      id: '3',
      platform: 'Facebook',
      url: 'https://facebook.com/user',
      icon: () => null,
    },
  ],
};

export const mockActivities = [
  {
    id: '1',
    type: 'view' as const,
    title: 'Xem công việc',
    description: 'Senior React Developer - Tech Company Vietnam',
    timestamp: '2 giờ trước',
  },
  {
    id: '2',
    type: 'apply' as const,
    title: 'Ứng tuyển thành công',
    description: 'Frontend Developer - Startup ABC',
    timestamp: '1 ngày trước',
  },
  {
    id: '3',
    type: 'save' as const,
    title: 'Lưu công việc',
    description: 'UI/UX Designer - Design Studio XYZ',
    timestamp: '2 ngày trước',
  },
  {
    id: '4',
    type: 'share' as const,
    title: 'Chia sẻ hồ sơ',
    description: 'Với 5 bạn bè',
    timestamp: '3 ngày trước',
  },
  {
    id: '5',
    type: 'comment' as const,
    title: 'Bình luận bài viết',
    description: 'Chia sẻ cộng đồng',
    timestamp: '5 ngày trước',
  },
  {
    id: '6',
    type: 'like' as const,
    title: 'Thích bài viết',
    description: 'Từ cộng đồng NextStepZ',
    timestamp: '1 tuần trước',
  },
  {
    id: '7',
    type: 'view' as const,
    title: 'Xem công việc',
    description: 'Full Stack Developer - Company DEF',
    timestamp: '1 tuần trước',
  },
];

// Type exports for use in components
export type { PersonalInfo } from '@/components/profile/user/personal-info-card';
export type { Activity } from '@/components/profile/user/recent-activity-card';
