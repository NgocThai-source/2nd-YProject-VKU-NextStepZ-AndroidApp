// Utility functions for community features

export const formatNumberCompact = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getPostCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'job-search': '💼',
    experience: '📝',
    discussion: '💬',
    question: '❓',
    offer: '✨',
  };
  return icons[category] || '📌';
};

export const getPostCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    'job-search': 'Tìm Việc',
    experience: 'Kinh Nghiệm',
    discussion: 'Thảo Luận',
    question: 'Câu Hỏi',
    offer: 'Cơ Hội',
  };
  return labels[category] || 'Khác';
};

export const getUserRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    user: '📚 Sinh viên',
    employer: '🤝 Nhà tuyển dụng',
  };
  return labels[role] || role;
};

export const getTrendingTrend = (trend: string): string => {
  const trends: Record<string, string> = {
    up: '📈 Tăng',
    stable: '➡️ Ổn định',
    down: '📉 Giảm',
  };
  return trends[trend] || trend;
};

export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const sanitizeContent = (content: string): string => {
  return content
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};

export const extractHashtags = (content: string): string[] => {
  const hashtagRegex = /#\w+/g;
  const matches = content.match(hashtagRegex);
  return matches ? [...new Set(matches)] : [];
};

export const truncateText = (text: string, length: number = 100): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n.charAt(0).toUpperCase())
    .join('');
};

export const formatTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'vừa xong';
  if (diffMins < 60) return `${diffMins}m trước`;
  if (diffHours < 24) return `${diffHours}h trước`;
  if (diffDays < 7) return `${diffDays}d trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w trước`;
  return past.toLocaleDateString('vi-VN');
};

export const isImageUrl = (url: string): boolean => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const generateMockId = (): string => {
  return `id-${(Math.random() * 10000000).toFixed(0)}`;
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getColorByScore = (score: number, maxScore: number = 100): string => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return 'text-green-600 dark:text-green-400';
  if (percentage >= 60) return 'text-blue-600 dark:text-blue-400';
  if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

export const validatePostContent = (content: string): { valid: boolean; error?: string } => {
  if (!content.trim()) {
    return { valid: false, error: 'Nội dung không thể trống' };
  }
  if (content.trim().length < 10) {
    return { valid: false, error: 'Nội dung phải ít nhất 10 ký tự' };
  }
  if (content.length > 500) {
    return { valid: false, error: 'Nội dung không quá 500 ký tự' };
  }
  return { valid: true };
};

/**
 * Calculate total number of comments including all nested replies
 * @param comments - Array of Comment objects
 * @returns Total count of comments and all their replies recursively
 */
export const calculateTotalComments = (comments: any[]): number => {
  if (!comments || comments.length === 0) {
    return 0;
  }

  let total = comments.length;

  comments.forEach((comment) => {
    if (comment.replyList && comment.replyList.length > 0) {
      // Recursively count replies
      total += calculateTotalComments(comment.replyList);
    }
  });

  return total;
};
