'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import { SavedPortfolio } from '@/lib/saved-portfolio-context';

interface PortfolioCardProps {
  portfolio: SavedPortfolio;
  onView?: (portfolio: SavedPortfolio) => void;
}

export default function PortfolioCard({ portfolio, onView }: PortfolioCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-cyan-500/50 transition-colors cursor-pointer"
      onClick={() => onView?.(portfolio)}
    >
      <div className="flex gap-3 items-start">
        {/* Portfolio Thumbnail */}
        {portfolio.photoUrl && (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-600">
            <Image
              src={portfolio.photoUrl}
              alt={portfolio.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Portfolio Info */}
        <div className="flex-1 min-w-0">
          <h4
            className="font-semibold text-sm text-white truncate"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
          >
            {portfolio.name}
          </h4>
          <p
            className="text-xs text-gray-400 truncate"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            {portfolio.title || portfolio.headline}
          </p>
          {portfolio.summary && (
            <p
              className="text-xs text-gray-500 line-clamp-2 mt-1"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            >
              {portfolio.summary}
            </p>
          )}
        </div>

        {/* View Button */}
        {onView && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="shrink-0 p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onView(portfolio);
            }}
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
