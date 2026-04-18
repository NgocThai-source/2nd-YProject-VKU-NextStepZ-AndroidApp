export interface TemplateConfig {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  previewComponent: 'modern' | 'professional' | 'creative' | 'minimal';
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 1,
    name: 'Hiện Đại Tối Giản',
    description: 'Giao diện một cột tinh gọn, bố cục rõ ràng, tông xanh hiện đại và sáng tạo.',
    icon: '🎨',
    color: 'from-cyan-500 to-blue-500',
    previewComponent: 'modern',
  },
  {
    id: 2,
    name: 'Chuyên Nghiệp Song Song',
    description: 'Bố cục hai cột giúp trình bày thông tin nhanh, mạch lạc và phù hợp môi trường chuyên nghiệp.',
    icon: '📋',
    color: 'from-slate-500 to-slate-700',
    previewComponent: 'professional',
  },
  {
    id: 3,
    name: 'Sáng Tạo',
    description: 'Phong cách thẻ hiện đại, hiệu ứng tương tác trẻ trung, phù hợp cá tính sáng tạo.',
    icon: '🎯',
    color: 'from-purple-500 to-pink-500',
    previewComponent: 'creative',
  },
  {
    id: 4,
    name: 'Tối Giản Dark Mode',
    description: 'Tone tối nhã nhặn, sang trọng, phù hợp phong cách tinh tế & ít chi tiết.',
    icon: '🌙',
    color: 'from-gray-800 to-black',
    previewComponent: 'minimal',
  },
];

export function getTemplateById(id: number): TemplateConfig | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
