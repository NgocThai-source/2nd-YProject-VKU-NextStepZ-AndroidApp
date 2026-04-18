'use client';

import { motion } from 'framer-motion';
import { Share2, TrendingUp } from 'lucide-react';

interface ShareStatsProps {
  shareCount: number;
  isShared?: boolean;
  onShareClick?: () => void;
}

export function ShareStats({ shareCount, isShared = false, onShareClick }: ShareStatsProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onShareClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
        isShared
          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/30'
          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
      }`}
    >
      <Share2 className="w-4 h-4" />
      <span className="text-xs font-medium" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
        {shareCount > 0 ? (
          <>
            <span>{shareCount}</span>
            {shareCount > 10 && <TrendingUp className="w-3 h-3 inline ml-1" />}
          </>
        ) : (
          'Chia sẻ'
        )}
      </span>
    </motion.div>
  );
}
