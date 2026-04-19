'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface CompanySearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CompanySearch({ searchQuery, onSearchChange }: CompanySearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-linear-to-r from-cyan-400/20 to-blue-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-cyan-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm công ty, ngành công nghiệp, địa điểm..."
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800/50 border border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
          style={{ fontFamily: "'Poppins Regular', sans-serif" }}
        />
      </div>
    </motion.div>
  );
}
