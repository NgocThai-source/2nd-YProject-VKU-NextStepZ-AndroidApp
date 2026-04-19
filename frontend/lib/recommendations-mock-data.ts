/**
 * Mock data for recommendations page
 * This includes job recommendations and community post recommendations
 */

export interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: [number, number];
  skills: string[];
  level: 'intern' | 'junior' | 'mid' | 'senior';
  matchScore: number;
  description: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  postedAt: string;
  applicants: number;
  isSaved?: boolean;
  matchReasons: string[];
}

export interface RecommendedPost {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified?: boolean;
    title?: string;
  };
  content: string;
  category: 'job-search' | 'experience' | 'discussion' | 'question' | 'opportunity';
  skills: string[];
  topic: string;
  likes: number;
  comments: number;
  relevanceScore: number;
  description: string;
  postedAt: string;
  isSaved?: boolean;
  matchReasons: string[];
}

export type RecommendationType = 'jobs' | 'posts';

export const mockRecommendedJobs: RecommendedJob[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    company: 'FPT Software',
    companyLogo: 'https://via.placeholder.com/48?text=FPT',
    location: 'Hà Nội, Việt Nam',
    salary: [1500, 2500],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    level: 'senior',
    matchScore: 95,
    description: 'Tìm kiếm Senior Frontend Developer với kinh nghiệm 5+ năm. Làm việc với React, TypeScript, Next.js.',
    type: 'full-time',
    postedAt: '2 ngày trước',
    applicants: 24,
    matchReasons: [
      'Kỹ năng React & TypeScript khớp 100%',
      'Yêu cầu cấp độ Senior phù hợp với hồ sơ của bạn',
      'Địa điểm tại Hà Nội - gần với bạn',
    ],
  },
  {
    id: 'job-2',
    title: 'Full Stack JavaScript Developer',
    company: 'Viettel IT',
    companyLogo: 'https://via.placeholder.com/48?text=VIT',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    salary: [1200, 2000],
    skills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'Docker'],
    level: 'mid',
    matchScore: 88,
    description: 'Cơ hội Full Stack với tech stack hiện đại: Node.js + React + MongoDB.',
    type: 'full-time',
    postedAt: '5 ngày trước',
    applicants: 42,
    matchReasons: [
      'Bạn có kinh nghiệm Node.js',
      'Kỹ năng MongoDB khớp với yêu cầu công việc',
      'Công ty có nhiều dự án thú vị',
    ],
  },
  {
    id: 'job-3',
    title: 'Frontend Developer - Web Application',
    company: 'CMCC Tech Solutions',
    companyLogo: 'https://via.placeholder.com/48?text=CMCC',
    location: 'Remote',
    salary: [1000, 1800],
    skills: ['React', 'CSS', 'TypeScript', 'Web Development', 'UI'],
    level: 'mid',
    matchScore: 82,
    description: 'Cần Frontend Developer với kỹ năng React & TypeScript. Phát triển các ứng dụng web hiện đại.',
    type: 'remote',
    postedAt: '1 tuần trước',
    applicants: 18,
    matchReasons: [
      'Bạn có portfolio frontend đẹp',
      'Kỹ năng React & TypeScript nâng cao',
      'Công việc remote - linh hoạt',
    ],
  },
  {
    id: 'job-4',
    title: 'Backend Developer (Node.js)',
    company: 'MobiFone IT',
    companyLogo: 'https://via.placeholder.com/48?text=MBIT',
    location: 'Hà Nội, Việt Nam',
    salary: [1300, 2200],
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
    level: 'mid',
    matchScore: 75,
    description: 'Tuyển Backend Developer làm việc với Node.js & Express. Xây dựng API hiệu năng cao.',
    type: 'full-time',
    postedAt: '3 ngày trước',
    applicants: 31,
    matchReasons: [
      'Yêu cầu Database & API design khớp với kỹ năng của bạn',
      'Công ty tích cực trong phát triển hạ tầng IT',
      'Mức lương cạnh tranh',
    ],
  },
  {
    id: 'job-5',
    title: 'QA Automation Engineer',
    company: 'KMS Technology',
    companyLogo: 'https://via.placeholder.com/48?text=KMS',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    salary: [1000, 1700],
    skills: ['JavaScript', 'Selenium', 'Jest', 'Cypress', 'CI/CD'],
    level: 'junior',
    matchScore: 78,
    description: 'QA Engineer tập trung vào automation testing với Cypress & Jest.',
    type: 'full-time',
    postedAt: '1 tuần trước',
    applicants: 15,
    matchReasons: [
      'Kỹ năng JavaScript & testing phù hợp',
      'Công ty IT uy tín và phát triển',
      'Cơ hội học hỏi rất tốt',
    ],
  },
  {
    id: 'job-6',
    title: 'DevOps Engineer',
    company: 'Techcombank IT',
    companyLogo: 'https://via.placeholder.com/48?text=TCB',
    location: 'Hà Nội, Việt Nam',
    salary: [1400, 2300],
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
    level: 'mid',
    matchScore: 81,
    description: 'Tuyển DevOps Engineer để xây dựng hệ thống CI/CD. Làm việc với Docker, Kubernetes, AWS.',
    type: 'full-time',
    postedAt: '4 ngày trước',
    applicants: 22,
    matchReasons: [
      'Kỹ năng DevOps & Cloud Infrastructure phù hợp',
      'Công ty Fintech hàng đầu Việt Nam',
      'Cơ hội làm việc với công nghệ mới nhất',
    ],
  },
];

export const mockRecommendedPosts: RecommendedPost[] = [
  {
    id: 'post-1',
    title: 'Kinh nghiệm phỏng vấn Senior Frontend tại Big Tech',
    author: {
      id: 'user-1',
      name: 'Nguyễn Văn A',
      avatar: 'https://via.placeholder.com/40?text=NVA',
      verified: true,
      title: 'Senior Frontend Developer @ Google',
    },
    content:
      'Vừa qua vòng phỏng vấn Senior Frontend tại Google. Để chia sẻ một số kinh nghiệm quý báu...',
    category: 'experience',
    skills: ['React', 'System Design', 'Interview Prep'],
    topic: 'Career Development',
    likes: 245,
    comments: 32,
    relevanceScore: 94,
    description: 'Chia sẻ chi tiết quá trình phỏng vấn Senior Frontend Developer',
    postedAt: '2 ngày trước',
    matchReasons: [
      'Liên quan đến kỹ năng React & Frontend của bạn',
      'Tác giả là Senior Developer tại công ty mục tiêu',
      'Nội dung về preparation cho vị trí cao',
    ],
  },
  {
    id: 'post-2',
    title: 'TypeScript Best Practices 2024 - Cập nhật mới nhất',
    author: {
      id: 'user-2',
      name: 'Trần Thị B',
      avatar: 'https://via.placeholder.com/40?text=TTB',
      verified: true,
      title: 'Tech Lead @ Startup',
    },
    content:
      'Năm 2024, TypeScript đã có nhiều cập nhật. Hãy cùng tìm hiểu những best practices mới...',
    category: 'discussion',
    skills: ['TypeScript', 'Best Practices', 'JavaScript'],
    topic: 'Technical Discussion',
    likes: 156,
    comments: 28,
    relevanceScore: 89,
    description: 'Thảo luận về TypeScript best practices và cập nhật mới nhất',
    postedAt: '4 ngày trước',
    matchReasons: [
      'Bạn sử dụng TypeScript trong hầu hết dự án',
      'Chủ đề giúp nâng cao kỹ năng',
      'Cộng đồng rất active trong bài viết này',
    ],
  },
  {
    id: 'post-3',
    title: 'Làm thế nào để đổi từ Frontend sang Full Stack?',
    author: {
      id: 'user-3',
      name: 'Lê Minh C',
      avatar: 'https://via.placeholder.com/40?text=LMC',
      verified: false,
      title: 'Junior Developer',
    },
    content: 'Mình hiện là Frontend Developer 2 năm. Muốn chuyển sang Full Stack như thế nào?',
    category: 'question',
    skills: ['Career Path', 'Backend Basics', 'Learning'],
    topic: 'Career Guidance',
    likes: 89,
    comments: 45,
    relevanceScore: 85,
    description: 'Câu hỏi về bước đi từ Frontend Developer sang Full Stack',
    postedAt: '1 tuần trước',
    matchReasons: [
      'Câu hỏi phù hợp với kỹ năng hiện tại của bạn',
      'Giúp định hướng sự phát triển sự nghiệp',
      'Nhiều Senior chia sẻ kinh nghiệm',
    ],
  },
  {
    id: 'post-4',
    title: 'Xây dựng Design System với React & Storybook',
    author: {
      id: 'user-4',
      name: 'Phạm Văn D',
      avatar: 'https://via.placeholder.com/40?text=PVD',
      verified: true,
      title: 'Design System Lead',
    },
    content:
      'Mình vừa tạo một series hướng dẫn xây dựng Design System modern. Hãy cùng bắt đầu...',
    category: 'opportunity',
    skills: ['React', 'Storybook', 'Component Design', 'CSS'],
    topic: 'Technical Skills',
    likes: 201,
    comments: 38,
    relevanceScore: 87,
    description: 'Series hướng dẫn chi tiết về Design System & Storybook',
    postedAt: '5 ngày trước',
    matchReasons: [
      'Nội dung kỹ thuật cao với React & CSS',
      'Giúp xây dựng component reusable',
      'Kỹ năng hữu ích cho Senior Frontend',
    ],
  },
  {
    id: 'post-5',
    title: 'Tối ưu Performance cho Next.js Application',
    author: {
      id: 'user-5',
      name: 'Hoàng Anh E',
      avatar: 'https://via.placeholder.com/40?text=HAE',
      verified: true,
      title: 'Performance Specialist',
    },
    content:
      'Cùng tìm hiểu cách tối ưu performance cho Next.js. Từ Image Optimization đến...',
    category: 'discussion',
    skills: ['Next.js', 'Performance', 'Optimization', 'Web Vitals'],
    topic: 'Web Performance',
    likes: 178,
    comments: 41,
    relevanceScore: 91,
    description: 'Hướng dẫn chi tiết tối ưu performance Next.js',
    postedAt: '6 ngày trước',
    matchReasons: [
      'Bạn sử dụng Next.js trong hầu hết dự án',
      'Chủ đề liên quan trực tiếp đến portfolio của bạn',
      'Giúp cải thiện user experience',
    ],
  },
];

// Helper functions
export function getRecommendationsByType(
  type: RecommendationType
): RecommendedJob[] | RecommendedPost[] {
  return type === 'jobs' ? mockRecommendedJobs : mockRecommendedPosts;
}

export function filterRecommendationsBySkills(
  recommendations: (RecommendedJob | RecommendedPost)[],
  skills: string[]
): (RecommendedJob | RecommendedPost)[] {
  if (skills.length === 0) return recommendations;

  return recommendations.filter((rec) => {
    const recSkills = 'skills' in rec ? rec.skills : [];
    return recSkills.some((skill) => skills.some((s) => s.toLowerCase() === skill.toLowerCase()));
  });
}

export function sortRecommendationsByScore(
  recommendations: (RecommendedJob | RecommendedPost)[],
  order: 'asc' | 'desc' = 'desc'
): (RecommendedJob | RecommendedPost)[] {
  const sorted = [...recommendations];
  const isJobs = recommendations.length > 0 && 'matchScore' in recommendations[0];
  const scoreKey = isJobs ? 'matchScore' : 'relevanceScore';

  return sorted.sort((a, b) => {
    const scoreA = (a as unknown as Record<string, number>)[scoreKey] ?? 0;
    const scoreB = (b as unknown as Record<string, number>)[scoreKey] ?? 0;
    return order === 'desc' ? scoreB - scoreA : scoreA - scoreB;
  });
}

export function searchRecommendations(
  recommendations: (RecommendedJob | RecommendedPost)[],
  query: string
): (RecommendedJob | RecommendedPost)[] {
  if (!query.trim()) return recommendations;

  const lowerQuery = query.toLowerCase();
  return recommendations.filter((rec) => {
    const title = 'title' in rec ? rec.title : '';
    const description = 'description' in rec ? rec.description : '';
    const company = 'company' in rec ? rec.company : '';

    return (
      title.toLowerCase().includes(lowerQuery) ||
      description.toLowerCase().includes(lowerQuery) ||
      company.toLowerCase().includes(lowerQuery)
    );
  });
}
