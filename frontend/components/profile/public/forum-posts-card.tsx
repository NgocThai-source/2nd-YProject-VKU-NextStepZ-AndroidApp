'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface ForumPost {
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

interface PublicForumPostsCardProps {
  posts?: ForumPost[];
  isLoading?: boolean;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Tin tức': { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-400/30' },
  'Thảo luận': { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-400/30' },
  'Chia sẻ kinh nghiệm': { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-400/30' },
  'Câu hỏi': { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-400/30' },
  'Tuyển dụng': { bg: 'bg-green-500/10', text: 'text-green-300', border: 'border-green-400/30' },
  default: { bg: 'bg-gray-500/10', text: 'text-gray-300', border: 'border-gray-400/30' },
};

export default function PublicForumPostsCard({
  posts = [],
  isLoading = false,
}: PublicForumPostsCardProps) {
  const displayPosts = posts || [];

  const getCategoryStyle = (category: string) => {
    return categoryColors[category] || categoryColors.default;
  };

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

  if (isLoading) {
    return (
      <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            Bài viết đã đăng trên diễn đàn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-pulse text-gray-400">Đang tải bài viết...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          Bài viết đã đăng trên diễn đàn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {displayPosts.length > 0 ? (
            displayPosts.map((post) => {
              const categoryStyle = getCategoryStyle(post.category);
              return (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 transition-all cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                          {post.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
                        style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}
                      >
                        {post.category}
                      </div>
                      <p className="text-xs text-gray-500" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                        {post.postDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-2 border-t border-slate-700">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">❤️</span>
                        <span className="text-xs text-gray-400">{post.engagement.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">💬</span>
                        <span className="text-xs text-gray-400">{post.engagement.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">↗️</span>
                        <span className="text-xs text-gray-400">{post.engagement.shares}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                Chưa có bài viết nào
              </p>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
