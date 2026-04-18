'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Heart, Share2, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CommunityPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  postDate: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

interface UserActivityProps {
  posts?: CommunityPost[];
  totalPosts?: number;
  onViewAllClick?: () => void;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Tin tức': { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-400/30' },
  'Thảo luận': { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-400/30' },
  'Chia sẻ kinh nghiệm': { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-400/30' },
  'Câu hỏi': { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-400/30' },
  default: { bg: 'bg-gray-500/10', text: 'text-gray-300', border: 'border-gray-400/30' },
};

export default function UserActivity({
  posts = [
    {
      id: '1',
      title: 'Kinh nghiệm phỏng vấn tại các công ty tech lớn',
      excerpt: 'Tôi vừa hoàn thành các vòng phỏng vấn tại Google, Meta và Amazon. Muốn chia sẻ...',
      category: 'Chia sẻ kinh nghiệm',
      postDate: '5 ngày trước',
      engagement: {
        likes: 89,
        comments: 34,
        shares: 12,
      },
    },
    {
      id: '2',
      title: 'Mẹo học React hooks hiệu quả',
      excerpt: 'Sau 2 năm làm việc với React, tôi tìm ra cách học hooks một cách...',
      category: 'Chia sẻ kinh nghiệm',
      postDate: '2 tuần trước',
      engagement: {
        likes: 156,
        comments: 42,
        shares: 23,
      },
    },
    {
      id: '3',
      title: 'Nên chọn startup hay công ty lớn?',
      excerpt: 'Tôi đang bối rối giữa việc nhận offer từ startup và công ty Fortune 500...',
      category: 'Thảo luận',
      postDate: '3 tuần trước',
      engagement: {
        likes: 234,
        comments: 67,
        shares: 18,
      },
    },
  ],
  totalPosts = 12,
  onViewAllClick,
}: UserActivityProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const getCategoryStyle = (category: string) => {
    return categoryColors[category] || categoryColors.default;
  };

  return (
    <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            Bài viết đã đăng trên diễn đàn
          </CardTitle>
          <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30">
            <p className="text-sm font-bold text-cyan-400" style={{ fontFamily: "'Exo 2 Bold', sans-serif" }}>
              {totalPosts}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {posts.length > 0 ? (
            <>
              {posts.map((post) => {
                const categoryStyle = getCategoryStyle(post.category);
                return (
                  <motion.div
                    key={post.id}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-400/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Category Badge */}
                        <div className="mb-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
                            {post.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                          {post.excerpt}
                        </p>

                        {/* Date and Engagement */}
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                            {post.postDate}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Heart className="w-3.5 h-3.5 text-red-400" />
                              <span>{post.engagement.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                              <span>{post.engagement.comments}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Share2 className="w-3.5 h-3.5 text-green-400" />
                              <span>{post.engagement.shares}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
                    </div>
                  </motion.div>
                );
              })}

              {/* View All Button */}
              {totalPosts > posts.length && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ x: 4 }}
                  onClick={onViewAllClick}
                  className="w-full mt-4 py-3 px-4 rounded-lg bg-cyan-500/10 border border-cyan-400/30 hover:border-cyan-400/50 hover:bg-cyan-500/20 transition-colors group"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-medium text-cyan-300 group-hover:text-cyan-200" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                      Xem tất cả bài viết
                    </span>
                    <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                  </div>
                </motion.button>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
              <p className="text-sm text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                Bạn chưa đăng bài viết nào trên diễn đàn
              </p>
              <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                Hãy chia sẻ kinh nghiệm của bạn với cộng đồng!
              </p>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
