'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Trophy,
  Plus,
  HelpCircle,
  Search,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Feed } from '@/components/community/feed';
import { CreatePostModal } from '@/components/community/feed';
import { LeaderboardExpanded } from '@/components/community/leaderboard';
import { UserProfileModal } from '@/components/community/shared';
import { AdvancedSearch } from '@/components/community/shared';
import { UserManagementDialog } from '@/components/community/shared';
import { Recommendations } from '@/components/community/shared';
import { FeedFilter, type FilterType } from '@/components/community/feed';
import { mockQuestions, mockUsers, Post, Question, LeaderboardUser } from '@/lib/community-mock-data';
import { QuestionsPage } from '@/components/community/questions';
import * as communityApi from '@/lib/community-api';
import type { QuestionData } from '@/lib/community-api';
import { useAuth } from '@/lib/auth-context';

type SectionType = 'feed' | 'leaderboard' | 'questions';

export default function CommunityPage() {
  const [activeSection, setActiveSection] = useState<SectionType>('feed');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [newPost, setNewPost] = useState<Post | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  // Fetch leaderboard data from API
  const loadLeaderboard = useCallback(async () => {
    try {
      setIsLeaderboardLoading(true);
      const data = await communityApi.getLeaderboard(30);
      // Transform API data to match LeaderboardUser interface
      const transformed: LeaderboardUser[] = data.map(entry => ({
        rank: entry.rank,
        user: {
          id: entry.user.id,
          name: entry.user.name,
          avatar: entry.user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
          role: entry.user.role as 'user' | 'employer',
          title: entry.user.title,
          verified: entry.user.verified,
          followers: entry.user.followers,
          following: 0,
        },
        score: entry.score,
        posts: entry.posts,
        likes: entry.likes,
        followers: entry.followers,
        streak: entry.streak,
      }));
      setLeaderboardData(transformed);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    } finally {
      setIsLeaderboardLoading(false);
    }
  }, []);

  // Load leaderboard on mount and when switching to leaderboard tab
  useEffect(() => {
    if (activeSection === 'leaderboard' || activeSection === 'feed') {
      loadLeaderboard();
    }
  }, [activeSection, loadLeaderboard]);

  // Fetch questions from API
  const loadQuestions = useCallback(async () => {
    try {
      setIsQuestionsLoading(true);
      const data = await communityApi.getQuestions();
      // Transform API data to match Question interface
      const transformed: Question[] = data.map((q: QuestionData) => ({
        id: q.id,
        title: q.title || '',
        content: q.content,
        tags: q.tags,
        timestamp: q.createdAt,
        views: q.viewCount,
        votes: q.likesCount,
        answers: q.commentsCount,
        isAnswered: q.isAnswered,
        isUpvoted: q.isLiked,
        author: {
          id: q.user.id,
          name: `${q.user.firstName || ''} ${q.user.lastName || ''}`.trim() || q.user.username,
          avatar: q.user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
          role: q.user.role as 'user' | 'employer',
          followers: 0,
          following: 0,
        },
        comments: [],
      }));
      setQuestions(transformed);
    } catch (err) {
      console.error('Error loading questions:', err);
      // Fallback to mock data on error
      setQuestions(mockQuestions);
    } finally {
      setIsQuestionsLoading(false);
    }
  }, []);

  // Load questions when switching to questions tab
  useEffect(() => {
    if (activeSection === 'questions') {
      loadQuestions();
    }
  }, [activeSection, loadQuestions]);

  // Feed filter state
  const [feedFilter, setFeedFilter] = useState<FilterType>('all');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_blockedUsers, setBlockedUsers] = useState<Set<string>>(new Set());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_mutedUsers, setMutedUsers] = useState<Set<string>>(new Set());

  const sections = [
    { id: 'feed' as SectionType, label: 'Bảng Tin', icon: MessageSquare },
    { id: 'questions' as SectionType, label: 'Câu Hỏi', icon: HelpCircle },
    { id: 'leaderboard' as SectionType, label: 'Xếp Hạng', icon: Trophy },
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
      <div className="z-10 sticky top-0 backdrop-blur-md bg-slate-900/80 border-b border-cyan-400/10 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >

            </motion.div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAdvancedSearchOpen(true)}
                className="hidden md:p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 hover:text-cyan-300 transition-all"
                title="Tìm kiếm nâng cao"
              >
                <Search className="w-5 h-5" />
              </motion.button>


            </div>
          </div>

          {/* Feed Filter Bar - Shown only in feed section */}
          {activeSection === 'feed' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-lg border border-cyan-400/20 backdrop-blur-sm bg-transparent"
            >
              <FeedFilter
                onFilterChange={(filter, hashtags, query, topics) => {
                  setFeedFilter(filter);
                  setSelectedHashtags(hashtags);
                  setSearchQuery(query);
                  setSelectedTopics(topics);
                }}
              />
            </motion.div>
          )}

          {/* Navigation Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-x-visible">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg whitespace-nowrap transition-all md:flex-1 ${activeSection === section.id
                    ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:border-white/20'
                    }`}
                  style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-semibold">{section.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Feed Section - Main Content */}
          {activeSection === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-4">
                {/* Create Post Prompt - Only show if logged in */}
                {isLoggedIn && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl bg-white/5 border border-cyan-400/20 backdrop-blur-sm cursor-pointer hover:border-cyan-400/40 transition-all"
                    onClick={() => setIsCreatePostOpen(true)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-cyan-300" />
                      </div>
                      <input
                        type="text"
                        placeholder="Chia sẻ những suy nghĩ của bạn..."
                        className="flex-1 bg-transparent text-gray-300 placeholder-gray-500 outline-none cursor-pointer"
                        style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                        onClick={() => setIsCreatePostOpen(true)}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Feed */}
                <Feed
                  onCreatePostClick={() => setIsCreatePostOpen(true)}
                  onPostInteraction={() => {
                    // Handle post interactions
                  }}
                  onUserClick={(userId) => {
                    setSelectedUserId(userId);
                    setIsUserProfileOpen(true);
                  }}
                  onStatsChange={loadLeaderboard}
                  filter={feedFilter}
                  selectedHashtags={selectedHashtags}
                  selectedTopics={selectedTopics}
                  searchQuery={searchQuery}
                  newPost={newPost}
                />
              </div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 hidden lg:block"
              >
                {/* Feature 9: Recommendations */}
                <Recommendations
                  onFollow={(userId) => console.log('Follow user:', userId)}
                  onDismiss={(userId) => console.log('Dismiss user:', userId)}
                  onUserClick={(userId) => {
                    setSelectedUserId(userId);
                    setIsUserProfileOpen(true);
                  }}
                  onStatsChange={loadLeaderboard}
                />

                {/* Leaderboard */}
                <div className="rounded-xl bg-white/5 border border-cyan-400/20 backdrop-blur-sm p-6 overflow-hidden">
                  <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                    ⭐ Thành Viên Hàng Đầu
                  </h3>
                  <div className="space-y-3">
                    {leaderboardData.slice(0, 5).map((leaderboardUser) => (
                      <motion.button
                        key={leaderboardUser.user.id}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setSelectedUserId(leaderboardUser.user.id);
                          setIsUserProfileOpen(true);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm font-bold text-cyan-300">{leaderboardUser.rank}</span>
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-linear-to-br from-cyan-400/30 to-blue-500/30 flex items-center justify-center shrink-0">
                            {leaderboardUser.user.avatar ? (
                              <img
                                src={leaderboardUser.user.avatar}
                                alt={leaderboardUser.user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-bold text-cyan-300">{leaderboardUser.user.name.charAt(0)}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                              {leaderboardUser.user.name}
                            </p>
                            <p className="text-xs text-gray-400">{leaderboardUser.score} điểm</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Questions Section */}
          {activeSection === 'questions' && (
            <QuestionsPage
              questions={questions}
              onCreateQuestion={() => {
                // Refresh questions from API after creating a new one
                loadQuestions();
              }}
              onVote={(questionId, direction) => console.log(`Vote ${direction} on question ${questionId}`)}
              onAnswerClick={(questionId) => console.log(`View answers for question ${questionId}`)}
              onReport={(questionId) => console.log(`Open report modal for question ${questionId}`)}
              onLikeUpdate={(questionId, likesCount, isLiked) => {
                // Update local question state for real-time UI update
                setQuestions(prev => prev.map(q =>
                  q.id === questionId
                    ? { ...q, votes: likesCount, isUpvoted: isLiked }
                    : q
                ));
              }}
              onViewUpdate={(questionId, viewCount) => {
                // Update local question state with new view count
                setQuestions(prev => prev.map(q =>
                  q.id === questionId
                    ? { ...q, views: viewCount }
                    : q
                ));
              }}
              onUserClick={(userId) => {
                setSelectedUserId(userId);
                setIsUserProfileOpen(true);
              }}
            />
          )}

          {/* Leaderboard Section */}
          {activeSection === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="rounded-xl bg-white/5 border border-cyan-400/20 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
                <LeaderboardExpanded
                  users={leaderboardData}
                  onUserClick={(userId) => {
                    setSelectedUserId(userId);
                    setIsUserProfileOpen(true);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Explore Other Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16 p-8 rounded-lg border border-cyan-400/20 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm"
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
              <Trophy className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="font-semibold text-white mb-2" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
              Công Việc & Bài Viết Gợi Ý
            </h4>
            <p className="text-sm text-gray-400">
              Xem các gợi ý việc làm và bài viết cộng đồng được cá nhân hóa dựa trên hồ sơ của bạn.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mt-3">
              Tới Gợi Ý <Trophy className="w-4 h-4" />
            </div>
          </motion.button>

          {/* Companies Link */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = '/companies')}
            className="p-6 rounded-lg border border-cyan-400/20 bg-linear-to-br from-white/10 to-white/5 hover:border-cyan-400/40 transition-all text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <Search className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="font-semibold text-white mb-2" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
              Tìm Kiếm Công Ty
            </h4>
            <p className="text-sm text-gray-400">
              Duyệt danh sách các công ty, vị trí tuyển dụng và thông tin chi tiết về từng nơi làm việc.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mt-3">
              Tới Công Ty <Search className="w-4 h-4" />
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmit={(post) => {
          setNewPost(post);
          setIsCreatePostOpen(false);
          setTimeout(() => setNewPost(null), 100);
        }}
      />

      <UserProfileModal
        userId={selectedUserId}
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        onMessage={(userId) => console.log(`Message user ${userId}`)}
      />

      {/* Advanced Search */}
      <AdvancedSearch
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onSearch={(filters) => {
          console.log('Advanced search with filters:', filters);
          setIsAdvancedSearchOpen(false);
        }}
      />

      {/* Mobile Create Post Button - Only show if logged in */}
      {isLoggedIn && (
        <motion.button
          onClick={() => setIsCreatePostOpen(true)}
          className="fixed bottom-8 right-8 md:hidden p-4 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-lg hover:shadow-blue-500/50 transition-all z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}
    </main>
  );
}
