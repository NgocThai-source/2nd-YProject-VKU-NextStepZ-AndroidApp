'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPosts } from '@/lib/user-posts-context';

interface UserForumPostsProps {
  userId?: string;
  userName?: string;
  maxPosts?: number;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Tin tức': { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-400/30' },
  'Thảo luận': { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-400/30' },
  'Chia sẻ kinh nghiệm': { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-400/30' },
  'Câu hỏi': { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-400/30' },
  'Tuyển dụng': { bg: 'bg-green-500/10', text: 'text-green-300', border: 'border-green-400/30' },
  default: { bg: 'bg-gray-500/10', text: 'text-gray-300', border: 'border-gray-400/30' },
};

export default function UserForumPosts({
  userId,
  userName,
  maxPosts = 5,
}: UserForumPostsProps) {
  const router = useRouter();
  const { userPosts, totalPosts, isLoading, fetchUserPosts } = useUserPosts();

  useEffect(() => {
    fetchUserPosts(userId, userName);
  }, [userId, userName, fetchUserPosts]);

  const handlePostClick = (postId: string) => {
    router.push(`/community/posts/${postId}`);
  };

  const getCategoryStyle = (category: string) => {
    return categoryColors[category] || categoryColors.default;
  };

  if (isLoading) {
    return (
      <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            Bài viết đã đăng trên diễn đàn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="text-gray-400 text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              Đang tải...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            Bài viết đã đăng trên diễn đàn
          </CardTitle>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-semibold" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            {totalPosts}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {userPosts.length > 0 ? (
          <AnimatePresence>
            {userPosts.slice(0, maxPosts).map((post, idx) => {
              const categoryStyle = getCategoryStyle(post.category);
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handlePostClick(post.id)}
                  className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 transition-all cursor-pointer group"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm truncate group-hover:text-cyan-400 transition-colors" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                        {post.title}
                      </h4>
                      <span className="text-xs text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                        {post.postDate}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border} group-hover:opacity-80 transition-opacity`} style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                      {post.category}
                    </span>
                  </div>

                  {/* Post Content */}
                  <p className="text-xs text-gray-300 line-clamp-2 group-hover:text-gray-200 transition-colors" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                    {post.excerpt}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <div className="py-6 text-center">
            <MessageSquare className="w-6 h-6 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-xs" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              Chưa có bài viết nào trên diễn đàn
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
