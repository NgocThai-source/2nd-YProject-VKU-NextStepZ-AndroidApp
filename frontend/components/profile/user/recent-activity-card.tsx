'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  MessageSquare,
  Share2,
  Heart,
  Bookmark,
  Eye,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Activity {
  id: string;
  type: 'view' | 'apply' | 'save' | 'share' | 'comment' | 'like';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    [key: string]: string | number | boolean;
  };
}

interface RecentActivityCardProps {
  activities?: Activity[];
}

export type { Activity };

const activityIcons = {
  view: Eye,
  apply: FileText,
  save: Bookmark,
  share: Share2,
  comment: MessageSquare,
  like: Heart,
};

const activityColors = {
  view: 'from-blue-500 to-blue-600',
  apply: 'from-cyan-500 to-cyan-600',
  save: 'from-purple-500 to-purple-600',
  share: 'from-green-500 to-green-600',
  comment: 'from-yellow-500 to-yellow-600',
  like: 'from-red-500 to-red-600',
};

const activityLabels = {
  view: 'Xem',
  apply: 'Ứng tuyển',
  save: 'Lưu',
  share: 'Chia sẻ',
  comment: 'Bình luận',
  like: 'Thích',
};

export default function RecentActivityCard({
  activities = [
    {
      id: '1',
      type: 'view',
      title: 'Xem công việc: Senior React Developer',
      description: 'Tech Company Vietnam',
      timestamp: '2 giờ trước',
      metadata: { company: 'Tech Company Vietnam', position: 'Senior React Developer' },
    },
    {
      id: '2',
      type: 'apply',
      title: 'Ứng tuyển: Frontend Developer',
      description: 'Startup ABC - Hành động thành công',
      timestamp: '1 ngày trước',
      metadata: { company: 'Startup ABC', status: 'success' },
    },
    {
      id: '3',
      type: 'save',
      title: 'Lưu công việc: UI/UX Designer',
      description: 'Design Studio XYZ',
      timestamp: '2 ngày trước',
      metadata: { company: 'Design Studio XYZ' },
    },
    {
      id: '4',
      type: 'share',
      title: 'Chia sẻ hồ sơ công khai',
      description: 'Với 5 bạn bè',
      timestamp: '3 ngày trước',
      metadata: { count: 5 },
    },
    {
      id: '5',
      type: 'comment',
      title: 'Bình luận trên một bài viết',
      description: '"Công việc mơ ước của tôi"',
      timestamp: '5 ngày trước',
      metadata: { postTitle: 'Công việc mơ ước của tôi' },
    },
    {
      id: '6',
      type: 'like',
      title: 'Thích một bài viết',
      description: 'Chia sẻ từ cộng đồng',
      timestamp: '1 tuần trước',
      metadata: { author: 'Cộng đồng' },
    },
  ],
}: RecentActivityCardProps) {
  const formatRelativeTime = (timeStr: string): string => {
    return timeStr;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Hoạt động gần đây
        </CardTitle>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <Eye className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-50" />
            <p className="text-gray-400">Chưa có hoạt động nào</p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {activities.map((activity, index) => {
              const IconComponent = activityIcons[activity.type];
              const bgGradient = activityColors[activity.type];

              return (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  className="flex gap-4 group"
                >
                  {/* Timeline Icon */}
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={`bg-linear-to-br ${bgGradient} p-3 rounded-full shadow-lg`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </motion.div>

                    {/* Timeline Line */}
                    {index !== activities.length - 1 && (
                      <div className="w-0.5 h-12 bg-linear-to-b from-cyan-500/30 to-transparent mt-2" />
                    )}
                  </div>

                  {/* Activity Content */}
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex-1 pt-1.5 pb-2 group-hover:bg-slate-800/30 px-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-gray-400 text-xs">
                          {activity.description}
                        </p>
                      </div>

                      {/* Type Badge */}
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white bg-linear-to-r ${bgGradient} shrink-0 ml-2`}
                      >
                        {activityLabels[activity.type]}
                      </motion.span>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(activity.timestamp)}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* View All Link */}
        {activities.length > 0 && (
          <motion.button
            whileHover={{ x: 4 }}
            className="w-full mt-6 pt-4 border-t border-slate-700 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
          >
            Xem tất cả hoạt động →
          </motion.button>
        )}
      </CardContent>
    </Card>
  );
}
