'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Filter,
  TrendingUp,
  Plus,
  Loader2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { CompanyFilter } from '@/components/companies/company-filter';
import { CompanySearch } from '@/components/companies/company-search';
import { SortDropdown } from '@/components/companies/sort-dropdown';
import { Pagination } from '@/components/companies/pagination';
import { CreateJobPostingModal } from '@/components/companies/create-job-posting-modal';
import { JobPostingCard } from '@/components/companies/job-posting-card';
import { JobPostingDetailModal } from '@/components/companies/job-posting-detail-modal';
import { JobPostingReportModal } from '@/components/companies/job-posting-report-modal';
import type { JobPosting } from '@/components/companies/job-posting.types';
import {
  getJobPostings,
  createJobPosting,
  type CreateJobPostingData,
} from '@/lib/job-posting-api';

type SortType = 'trending' | 'salary' | 'newest';
type ViewType = 'grid' | 'list';

export default function CompaniesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateJobPostingOpen, setIsCreateJobPostingOpen] = useState(false);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [selectedPosting, setSelectedPosting] = useState<JobPosting | null>(null);
  const [isPostingDetailOpen, setIsPostingDetailOpen] = useState(false);
  const [isLoadingPostings, setIsLoadingPostings] = useState(true);
  const [isCreatingPosting, setIsCreatingPosting] = useState(false);
  const [postingError, setPostingError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [reportingPosting, setReportingPosting] = useState<JobPosting | null>(null);

  // Initialize search query from URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get('search');
    if (queryParam) {
      setSearchQuery(decodeURIComponent(queryParam));
    }
  }, []);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortType>('trending');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filters
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 100]);

  // Sort and filter job postings based on search query and sort option
  const sortedJobPostings = useMemo(() => {
    // First, filter by search query
    let filtered = [...jobPostings];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(posting => {
        const companyName = (posting.companyName || '').toLowerCase();
        const description = (posting.description || '').toLowerCase();
        const tags = (posting.tags || []).join(' ').toLowerCase();
        const positions = (posting.jobPositions || [])
          .map(p => p.title?.toLowerCase() || '')
          .join(' ');

        return (
          companyName.includes(query) ||
          description.includes(query) ||
          tags.includes(query) ||
          positions.includes(query)
        );
      });
    }

    // Then sort
    switch (sortBy) {
      case 'trending':
        // Sort by view count (highest first)
        filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'salary':
        // Sort by highest salary (using max salary from first job position)
        filtered.sort((a, b) => {
          const aMaxSalary = a.jobPositions?.[0]?.maxSalary || 0;
          const bMaxSalary = b.jobPositions?.[0]?.maxSalary || 0;
          return bMaxSalary - aMaxSalary;
        });
        break;
      case 'newest':
        // Sort by creation date (newest first)
        filtered.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [jobPostings, sortBy, searchQuery]);

  // Pagination logic for job postings
  const totalPages = Math.ceil(sortedJobPostings.length / itemsPerPage);
  const paginatedJobPostings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedJobPostings.slice(startIndex, endIndex);
  }, [sortedJobPostings, currentPage, itemsPerPage]);

  // Fetch job postings from API
  const fetchJobPostings = useCallback(async () => {
    try {
      setIsLoadingPostings(true);
      setPostingError(null);
      const response = await getJobPostings({
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        address: selectedLocations.length > 0 ? selectedLocations[0] : undefined,
        limit: 50, // Get more postings
      });
      setJobPostings(response.data);
    } catch (error) {
      console.error('Failed to fetch job postings:', error);
      setPostingError('Failed to load job postings');
    } finally {
      setIsLoadingPostings(false);
    }
  }, [selectedTags, selectedLocations]);

  // Fetch job postings on mount and when filters change
  useEffect(() => {
    fetchJobPostings();
  }, [fetchJobPostings]);

  const handleCreateJobPosting = async (data: any) => {
    try {
      setIsCreatingPosting(true);
      setPostingError(null);

      // Prepare data for API
      const postingData: CreateJobPostingData = {
        companyName: data.companyName,
        companyLogo: data.galleryImages?.[0], // Use first gallery image as logo
        tags: data.tags,
        description: data.description,
        mission: data.mission,
        vision: data.vision,
        companyHistory: data.companyHistory,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website,
        jobPositions: data.jobPositions,
        workingHours: data.workingHours,
        offDays: data.offDays,
        vacationDays: data.vacationDays,
        insurances: data.insurances,
        salaryBenefits: data.salaryBenefits,
        allowances: data.allowances,
        benefits: data.benefits,
        galleryImages: data.galleryImages,
      };

      const newPosting = await createJobPosting(postingData);

      // Add to job postings array (newest first)
      setJobPostings([newPosting, ...jobPostings]);
      setIsCreateJobPostingOpen(false);
    } catch (error: any) {
      // Don't use console.error to avoid Next.js dev overlay
      setPostingError(error.message || 'Failed to create job posting');
      setIsCreateJobPostingOpen(false); // Close the create modal
      setShowErrorModal(true);
    } finally {
      setIsCreatingPosting(false);
    }
  };

  // Handle view count update from modal
  const handleViewCountUpdate = useCallback((postingId: string, newViewCount: number) => {
    setJobPostings(prevPostings =>
      prevPostings.map(posting =>
        posting.id === postingId
          ? { ...posting, viewCount: newViewCount }
          : posting
      )
    );
  }, []);

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
      <div className="z-10 sticky top-0 backdrop-blur-md bg-slate-900/80 border-b border-cyan-400/10 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Search Bar */}
          <CompanySearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>


      {/* Main Content */}
      <div className="z-10 relative py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Filters */}
            <div className="shrink-0">
              <div className="sticky top-32">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full lg:hidden mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-linear-to-r from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 text-cyan-300 font-semibold hover:border-cyan-400/50 transition-all"
                >
                  <Filter className="w-5 h-5" />
                  Bộ Lọc
                </motion.button>

                <AnimatePresence>
                  {(isFilterOpen || true) && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CompanyFilter
                        selectedLocations={selectedLocations}
                        onLocationsChange={setSelectedLocations}
                        selectedSizes={selectedSizes}
                        onSizesChange={setSelectedSizes}
                        selectedTags={selectedTags}
                        onTagsChange={setSelectedTags}
                        ratingFilter={ratingFilter}
                        onRatingChange={setRatingFilter}
                        salaryRange={salaryRange}
                        onSalaryRangeChange={setSalaryRange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Main Content - Companies Grid/List */}
            <div className="flex-1 min-w-0">
              {/* Header với nút tạo bài tuyển dụng */}
              {user?.role === 'employer' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCreateJobPostingOpen(true)}
                  className="w-full mb-6 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Đăng Bài Tuyển Dụng
                </motion.button>
              )}

              {/* Sort and View Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
              >
                <div className="flex items-center gap-2 text-gray-300">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <span
                    style={{ fontFamily: "'Poppins Medium', sans-serif" }}
                  >
                    {jobPostings.length} bài đăng
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  {/* Sort Dropdown */}
                  <SortDropdown
                    value={sortBy}
                    onChange={(value) => setSortBy(value as SortType)}
                  />

                  {/* View Toggle */}
                  <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg border border-cyan-400/20">
                    {(['grid', 'list'] as const).map((view) => (
                      <motion.button
                        key={view}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewType(view)}
                        className={`px-3 py-1 rounded transition-all ${viewType === view
                          ? 'bg-cyan-400/30 text-cyan-300 border border-cyan-400/50'
                          : 'text-gray-400 hover:text-gray-300'
                          }`}
                      >
                        {view === 'grid' ? '⊞' : '≡'}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Job Postings Grid/List */}
              {paginatedJobPostings.length > 0 ? (
                <>
                  <div
                    className={`grid gap-6 ${viewType === 'grid'
                      ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                      }`}
                  >
                    {/* Job Postings */}
                    {paginatedJobPostings.map((posting, index) => (
                      <motion.div
                        key={posting.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <JobPostingCard
                          posting={posting}
                          viewType={viewType}
                          onViewDetails={(posting) => {
                            setSelectedPosting(posting);
                            setIsPostingDetailOpen(true);
                          }}
                          onReport={(posting) => setReportingPosting(posting)}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="mb-4">
                    <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  </div>
                  <h3
                    className="text-xl font-semibold text-gray-300 mb-2"
                    style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                  >
                    Không tìm thấy nơi làm việc
                  </h3>
                  <p className="text-gray-500">
                    Hãy thử điều chỉnh các bộ lọc của bạn
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Explore Other Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16 p-8 rounded-lg border border-cyan-400/20 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm mb-8"
      >
        <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
          Khám Phá Thêm
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recommendations Link */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = '/find')}
            className="p-6 rounded-lg border border-cyan-400/20 bg-linear-to-br from-white/10 to-white/5 hover:border-cyan-400/40 transition-all text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="font-semibold text-white mb-2" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
              Công Việc & Bài Viết Gợi Ý
            </h4>
            <p className="text-sm text-gray-400">
              Xem các gợi ý việc làm và bài viết cộng đồng được cá nhân hóa dựa trên hồ sơ của bạn.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mt-3">
              Tới Gợi Ý <TrendingUp className="w-4 h-4" />
            </div>
          </motion.button>

          {/* Community Link */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = '/community')}
            className="p-6 rounded-lg border border-cyan-400/20 bg-linear-to-br from-white/10 to-white/5 hover:border-cyan-400/40 transition-all text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <Briefcase className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="font-semibold text-white mb-2" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
              Cộng Đồng & Bài Viết
            </h4>
            <p className="text-sm text-gray-400">
              Tham gia cộng đồng, chia sẻ kinh nghiệm, đặt câu hỏi và học từ các chuyên gia khác.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mt-3">
              Tới Cộng Đồng <Briefcase className="w-4 h-4" />
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Job Posting Detail Modal */}
      <AnimatePresence>
        {isPostingDetailOpen && selectedPosting && (
          <JobPostingDetailModal
            posting={selectedPosting}
            onClose={() => {
              setIsPostingDetailOpen(false);
              setTimeout(() => setSelectedPosting(null), 300);
            }}
            onViewCountUpdate={handleViewCountUpdate}
          />
        )}
      </AnimatePresence>

      {/* Create Job Posting Modal */}
      <CreateJobPostingModal
        isOpen={isCreateJobPostingOpen}
        onClose={() => setIsCreateJobPostingOpen(false)}
        onSubmit={handleCreateJobPosting}
      />

      {/* Job Posting Report Modal */}
      <JobPostingReportModal
        isOpen={!!reportingPosting}
        posting={reportingPosting}
        onClose={() => setReportingPosting(null)}
        onSubmit={(reason, description) => {
          console.log('Report submitted:', { postingId: reportingPosting?.id, reason, description });
        }}
      />

      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowErrorModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-xl border border-amber-500/30 bg-slate-900 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-amber-300">Thông báo</h3>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="ml-auto p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 leading-relaxed">{postingError}</p>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowErrorModal(false)}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  Đã hiểu
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
