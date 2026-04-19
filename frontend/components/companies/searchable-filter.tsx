'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { useState, useMemo } from 'react';

interface SearchableFilterProps {
  title: string;
  options: string[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  textSearchOnly?: boolean;
}

export function SearchableFilter({
  title,
  options,
  selected,
  onSelectionChange,
  isExpanded,
  onToggleExpand,
  textSearchOnly = false,
}: SearchableFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const toggleOption = (option: string) => {
    onSelectionChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option]
    );
  };

  // For text-only search mode, add the search query to selection when Enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (textSearchOnly && e.key === 'Enter' && searchQuery.trim()) {
      // Find the first matching option
      const matchingOption = options.find((option) =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchingOption && !selected.includes(matchingOption)) {
        onSelectionChange([...selected, matchingOption]);
      }
      setSearchQuery('');
    }
  };

  return (
    <motion.div className="rounded-lg border border-cyan-400/20 bg-slate-800/30 overflow-hidden">
      <motion.button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span
            className="font-semibold text-white"
            style={{ fontFamily: "'Poppins Medium', sans-serif" }}
          >
            {title}
          </span>
          {selected.length > 0 && (
            <span className="text-xs bg-cyan-400/30 text-cyan-300 px-2 py-1 rounded-full">
              {selected.length}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-cyan-400/10 relative"
          >
            {/* Fixed Header Container */}
            <div className="relative z-50 bg-slate-800/30 border-b border-cyan-400/10">
              {/* Search Box */}
              <div className="relative p-4 border-b border-cyan-400/10">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={textSearchOnly ? "Nhập và nhấn Enter để thêm..." : "Tìm kiếm..."}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-700/50 border border-cyan-400/20 text-white placeholder-gray-500 text-sm focus:border-cyan-400 focus:outline-none transition-all"
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                />
              </div>

              {/* Selected Items */}
              {selected.length > 0 && (
                <div className="flex flex-wrap gap-2 px-4 pt-3 pb-3 border-b border-cyan-400/10">
                  {selected.map((item) => (
                    <motion.div
                      key={item}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-2 bg-cyan-400/20 text-cyan-300 px-3 py-1 rounded-full text-sm"
                    >
                      {item}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOption(item);
                        }}
                        className="hover:text-cyan-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Scrollable Options List - only show when not in text search only mode */}
            {!textSearchOnly && (
              <div className="space-y-2 max-h-48 overflow-y-auto p-4">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => {
                    const isChecked = selected.includes(option);
                    return (
                      <motion.div
                        key={option}
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="checkbox"
                          id={`option-${option}`}
                          checked={isChecked}
                          onChange={() => toggleOption(option)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`option-${option}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleOption(option);
                          }}
                          className="flex items-center gap-3 flex-1 cursor-pointer group p-3 rounded-lg border border-cyan-400/20 hover:border-cyan-400/40 hover:bg-slate-700/30 transition-all"
                        >
                          {/* Custom Checkbox */}
                          <motion.div
                            className={`relative w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${isChecked
                              ? 'bg-linear-to-r from-cyan-400 to-blue-500 border-cyan-400'
                              : 'border-cyan-400/40 bg-slate-700/50 group-hover:border-cyan-400/60'
                              }`}
                            animate={{
                              scale: isChecked ? 1 : 1,
                            }}
                          >
                            <AnimatePresence mode="wait">
                              {isChecked && (
                                <motion.div
                                  key="checked"
                                  initial={{ scale: 0, rotate: -90 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 90 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                          <span
                            className={`text-sm transition-colors ${isChecked
                              ? 'text-cyan-300 font-medium'
                              : 'text-gray-300 group-hover:text-white'
                              }`}
                            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                          >
                            {option}
                          </span>
                        </label>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm text-center py-3">
                    Không tìm thấy kết quả
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
