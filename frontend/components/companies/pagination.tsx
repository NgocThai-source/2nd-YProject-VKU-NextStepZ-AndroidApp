'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const leftSide = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - leftSide);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add first page if not included
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page if not included
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-cyan-400/20 text-gray-400 hover:text-cyan-300 hover:border-cyan-400/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <div key={`dots-${index}`} className="text-gray-500 px-2">
              ...
            </div>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <motion.button
            key={pageNum}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
              isActive
                ? 'bg-linear-to-r from-cyan-400 to-blue-500 text-white border border-cyan-400/50'
                : 'border border-cyan-400/20 text-gray-300 hover:text-cyan-300 hover:border-cyan-400/40'
            }`}
            style={{ fontFamily: "'Poppins Medium', sans-serif" }}
          >
            {pageNum}
          </motion.button>
        );
      })}

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-cyan-400/20 text-gray-400 hover:text-cyan-300 hover:border-cyan-400/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
