'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TrendingUp, DollarSign, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface SortOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions: SortOption[] = [
    {
      value: 'trending',
      label: 'Trending',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      value: 'salary',
      label: 'Lương Cao Nhất',
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      value: 'newest',
      label: 'Mới Nhất',
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  const selectedOption = sortOptions.find((opt) => opt.value === value);

  return (
    <motion.div className="relative w-full sm:w-auto">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-slate-800/50 border border-cyan-400/20 text-white hover:border-cyan-400/40 focus:border-cyan-400 focus:outline-none transition-all cursor-pointer group"
        whileHover={{ borderColor: 'rgb(34, 211, 238, 0.4)' }}
      >
        <div className="flex items-center gap-2">
          <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
            {selectedOption?.icon}
          </div>
          <span style={{ fontFamily: "'Poppins Medium', sans-serif" }}>
            {selectedOption?.label}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-cyan-400/20 bg-slate-800 shadow-lg overflow-hidden z-50"
          >
            <div className="p-2 space-y-1">
              {sortOptions.map((option) => {
                const isSelected = value === option.value;
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${isSelected
                        ? 'bg-linear-to-r from-cyan-400/20 to-blue-500/20 text-cyan-300 border border-cyan-400/40'
                        : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`transition-colors ${isSelected ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-400'
                      }`}>
                      {option.icon}
                    </div>
                    <span style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 rounded-full bg-cyan-400"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40"
        />
      )}
    </motion.div>
  );
}
