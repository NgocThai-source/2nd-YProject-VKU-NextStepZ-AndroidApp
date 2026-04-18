'use client';

import { motion } from 'framer-motion';
import { Plus, TrendingUp } from 'lucide-react';
import { Topic } from '@/lib/community-mock-data';
import { useState } from 'react';

interface TopicCardProps {
  topic: Topic;
  onFollow?: (topicId: string) => void;
}

export function TopicCard({ topic, onFollow }: TopicCardProps) {
  const [isFollowing, setIsFollowing] = useState(topic.isFollowing || false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow?.(topic.id);
  };

  return (
    <motion.div
      whileHover={{ translateY: -4 }}
      className="rounded-lg border border-cyan-400/20 backdrop-blur-sm bg-linear-to-br from-white/10 to-white/5 p-4 space-y-3 hover:border-cyan-400/40 transition-all"
    >
      {/* Icon & Title */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-3xl mb-2">{topic.icon}</div>
          <h3 className="font-semibold text-white text-lg">
            {topic.name}
          </h3>
          <p className="text-sm text-gray-300 line-clamp-2 mt-1">
            {topic.description}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-gray-400 pt-2 border-t border-cyan-400/10">
        <div className="flex flex-col">
          <span className="font-semibold text-white">
            {topic.postsCount.toLocaleString()}
          </span>
          <span className="text-xs">bài viết</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-white">
            {topic.followersCount.toLocaleString()}
          </span>
          <span className="text-xs">người theo dõi</span>
        </div>
        {topic.trendingScore && topic.trendingScore >= 75 && (
          <div className="flex items-center gap-1 ml-auto text-cyan-300">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-semibold">Xu hước</span>
          </div>
        )}
      </div>

      {/* Follow Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleFollow}
        className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
          isFollowing
            ? 'bg-white/10 text-gray-300 hover:bg-white/15'
            : 'bg-linear-to-r from-cyan-400 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
        }`}
      >
        {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
        {!isFollowing && <Plus className="w-4 h-4" />}
      </motion.button>
    </motion.div>
  );
}
