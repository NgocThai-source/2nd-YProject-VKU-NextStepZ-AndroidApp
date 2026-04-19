'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Filter,
  Building2,
  FileText,
  Trash2,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useSavedItems } from '@/lib/saved-items-context';
import { SavedCompanyCard, SavedPostCard } from '@/components/saved-items';
import { useToast } from '@/components/ui/toast';
import { ConfirmModal } from '@/components/ui/confirm-modal';

type TabType = 'companies' | 'posts';
type SortType = 'newest' | 'oldest';

export default function SavedJobsPage() {
  const { savedCompanies, removeSavedCompany, savedPosts, removeSavedPost, removeAllCompanies, removeAllPosts } = useSavedItems();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('companies');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Confirm modal states
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'company' | 'post' | null;
    action: 'single' | 'all';
    itemId?: string;
  }>({
    isOpen: false,
    type: null,
    action: 'single',
  });

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    let result = [...savedCompanies];

    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.company.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    } else {
      result.sort((a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime());
    }

    return result;
  }, [savedCompanies, searchQuery, sortBy]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...savedPosts];

    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    } else {
      result.sort((a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime());
    }

    return result;
  }, [savedPosts, searchQuery, sortBy]);

  const tabs = [
    {
      id: 'companies' as TabType,
      label: 'Công Ty',
      icon: Building2,
      count: savedCompanies.length,
    },
    {
      id: 'posts' as TabType,
      label: 'Bài Viết',
      icon: FileText,
      count: savedPosts.length,
    },
  ];

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Header */}
      <div className="z-20 sticky top-0 backdrop-blur-md bg-slate-900/80 border-b border-cyan-400/10 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Back Button & Title */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Quay lại</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1
              className="text-4xl md:text-5xl font-bold bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2"
              style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
            >
              Mục Đã Lưu
            </h1>
            <p className="text-gray-400">
              Quản lý các công việc, công ty và bài viết yêu thích của bạn
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-linear-to-r from-cyan-400/30 to-blue-500/30 text-cyan-200 border border-cyan-400/40'
                    : 'bg-white/5 text-gray-400 border border-cyan-400/10 hover:border-cyan-400/20'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold">
                      {tab.count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-cyan-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/40 focus:bg-white/15 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 rounded-lg bg-white/10 border border-cyan-400/20 text-cyan-300 hover:border-cyan-400/40 hover:bg-white/15 transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Lọc</span>
            </motion.button>
          </div>

          {/* Sort Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-lg bg-white/5 border border-cyan-400/20"
            >
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Sắp xếp theo</h3>
              <div className="flex gap-2">
                {(['newest', 'oldest'] as SortType[]).map((sort) => (
                  <motion.button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${sortBy === sort
                      ? 'bg-cyan-400/30 text-cyan-200 border border-cyan-400/40'
                      : 'bg-white/5 text-gray-400 border border-cyan-400/10 hover:border-cyan-400/20'
                      }`}
                  >
                    {sort === 'newest' ? 'Mới nhất' : 'Cũ nhất'}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-1 max-w-7xl mx-auto px-4 md:px-8 py-12">
        <AnimatePresence mode="wait">
          {/* Companies Tab */}
          {activeTab === 'companies' && (
            <motion.div
              key="companies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredCompanies.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                    >
                      Nơi Làm Việc Đã Lưu
                    </motion.h2>
                    {filteredCompanies.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            type: 'company',
                            action: 'all',
                          });
                        }}
                        className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-400/30 hover:border-red-400/50 hover:bg-red-500/20 transition-all flex items-center gap-2 text-sm font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa tất cả
                      </motion.button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {filteredCompanies.map((item, index) => (
                        <motion.div
                          key={item.company.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <SavedCompanyCard
                            savedCompany={item}
                            onRemove={removeSavedCompany}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-300 mb-2">
                    Chưa có công ty nào được lưu
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Hãy duyệt các công ty và lưu những công ty yêu thích của bạn
                  </p>
                  <Link href="/companies">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-lg bg-linear-to-r from-cyan-400/30 to-blue-500/30 text-cyan-300 border border-cyan-400/40 hover:border-cyan-400/60 transition-all font-semibold"
                    >
                      Khám Phá Công Ty
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredPosts.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                    >
                      Bài Viết Đã Lưu
                    </motion.h2>
                    {filteredPosts.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            type: 'post',
                            action: 'all',
                          });
                        }}
                        className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-400/30 hover:border-red-400/50 hover:bg-red-500/20 transition-all flex items-center gap-2 text-sm font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa tất cả
                      </motion.button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {filteredPosts.map((item, index) => (
                        <motion.div
                          key={item.post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <SavedPostCard
                            savedPost={item}
                            onRemove={removeSavedPost}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-300 mb-2">
                    Chưa có bài viết nào được lưu
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Hãy duyệt các bài viết cộng đồng và lưu những bài viết yêu thích của bạn
                  </p>
                  <Link href="/community">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-lg bg-linear-to-r from-cyan-400/30 to-blue-500/30 text-cyan-300 border border-cyan-400/40 hover:border-cyan-400/60 transition-all font-semibold"
                    >
                      Khám Phá Cộng Đồng
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm Modal - Outside content to avoid z-index stacking context */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.type === 'company'
            ? 'Xóa tất cả công ty'
            : 'Xóa tất cả bài viết'
        }
        description={
          confirmModal.type === 'company'
            ? `Bạn chắc chắn muốn xóa ${filteredCompanies.length} công ty đã lưu? Hành động này không thể hoàn tác.`
            : `Bạn chắc chắn muốn xóa ${filteredPosts.length} bài viết đã lưu? Hành động này không thể hoàn tác.`
        }
        confirmText="Xóa"
        cancelText="Hủy"
        isDangerous
        onConfirm={async () => {
          if (confirmModal.type === 'company' && confirmModal.action === 'all') {
            const count = filteredCompanies.length;
            await removeAllCompanies();
            addToast(`Đã xóa ${count} công ty`, 'success');
          } else if (confirmModal.type === 'post' && confirmModal.action === 'all') {
            const count = filteredPosts.length;
            await removeAllPosts();
            addToast(`Đã xóa ${count} bài viết`, 'success');
          }
          setConfirmModal({ isOpen: false, type: null, action: 'single' });
        }}
        onCancel={() => {
          setConfirmModal({ isOpen: false, type: null, action: 'single' });
        }}
      />
    </main>
  );
}


