/**
 * Footer Configuration & Constants
 * Tập trung các dữ liệu static cho footer components
 */

export interface SocialLinkConfig {
  name: string;
  href: string;
  ariaLabel: string;
}

export interface FooterLinkGroup {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

// Social Media Links
export const SOCIAL_MEDIA_LINKS: SocialLinkConfig[] = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/nextstepz',
    ariaLabel: 'Truy cập Facebook của NextStepZ',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/nextstepz',
    ariaLabel: 'Truy cập LinkedIn của NextStepZ',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/nextstepz',
    ariaLabel: 'Truy cập Instagram của NextStepZ',
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/nextstepz',
    ariaLabel: 'Truy cập Discord của NextStepZ',
  },
];

// Footer Navigation Links
export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: 'Điều hướng',
    links: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Sáng tạo hồ sơ', href: '/portfolio' },
      { label: 'Đề xuất', href: '/suggestions' },
      { label: 'Cộng đồng', href: '/community' },
    ],
  },
  {
    title: 'Khám phá',
    links: [
      { label: 'Công ty', href: '/companies' },
      { label: 'Job Map', href: '/job-map' },
      { label: 'Bài đăng mới nhất', href: '/latest' },
      { label: 'Xu hướng sự nghiệp', href: '/trends' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Về chúng tôi', href: '/about' },
      { label: 'Liên hệ', href: '/contact' },
      { label: 'Hỗ trợ', href: '/support' },
      { label: 'Chính sách bảo mật', href: '/privacy' },
    ],
  },
];

// Brand Information
export const BRAND_INFO = {
  name: 'NextStepZ',
  tagline: 'Your First Step to the Future',
  description:
    'NextStepZ là nền tảng thông minh kết nối sinh viên với các cơ hội sự nghiệp tiềm năng. Sử dụng công nghệ AI tiên tiến để tối ưu hóa hồ sơ và kết nối bạn với những vị trí việc làm phù hợp nhất.',
  logo: '/images/logofull-transprent.png',
  copyright: `© ${new Date().getFullYear()} NextStepZ. All rights reserved.`,
};

// Newsletter Configuration
export const NEWSLETTER_CONFIG = {
  title: 'Đăng ký nhận tin',
  subtitle: 'Nhận thông báo về các cơ hội mới và cập nhật từ NextStepZ',
  placeholder: 'Nhập email để nhận thông báo',
  buttonText: 'Đăng ký',
  messages: {
    empty: 'Vui lòng nhập email',
    invalid: 'Email không hợp lệ',
    success: 'Đăng ký thành công! Cảm ơn bạn.',
    loading: 'Đang xử lý...',
  },
};

// Animation Timings (in seconds)
export const ANIMATION_TIMINGS = {
  short: 0.2,
  normal: 0.3,
  medium: 0.5,
  long: 0.8,
  delay: {
    stagger: 0.1,
    initial: 0.15,
  },
};
