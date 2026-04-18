/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    MessageSquare,
    Search,
    Building2,
    Users,
    Loader2,
    MapPin,
    Heart,
    MessageCircle,
    ExternalLink,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getJobPostings } from '@/lib/job-posting-api';
import type { JobPosting } from '@/components/companies/job-posting.types';
import { API_URL } from '@/lib/api';

type TabType = 'companies' | 'community';

interface CommunityPost {
    id: string;
    title?: string;
    content: string;
    category: string;
    createdAt: string;
    user: {
        id: string;
        firstName?: string;
        lastName?: string;
        username: string;
        avatar?: string;
        companyName?: string;
    };
    _count?: {
        likes: number;
        comments: number;
    };
    topics?: string[];
}

export default function FindPage() {
    const { isLoggedIn } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('companies');
    const [searchQuery, setSearchQuery] = useState('');

    // Data state
    const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
    const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
    const [isLoadingJobs, setIsLoadingJobs] = useState(true);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    const tabs = [
        { id: 'companies' as TabType, label: 'Công Ty', icon: Building2, count: jobPostings.length },
        { id: 'community' as TabType, label: 'Cộng Đồng', icon: Users, count: communityPosts.length },
    ];

    // Fetch job postings
    const fetchJobs = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setIsLoadingJobs(true);
            const response = await getJobPostings({ limit: 100 });
            setJobPostings(response.data || []);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setIsLoadingJobs(false);
        }
    }, []);

    // Fetch community posts
    const fetchPosts = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setIsLoadingPosts(true);
            const response = await fetch(`${API_URL}/community/posts?limit=100`);
            const data = await response.json();
            // API returns { posts: [...] } not { data: [...] }
            const posts = (data.posts || []).map((post: any) => ({
                ...post,
                _count: post._count || {
                    likes: post.likesCount || 0,
                    comments: post.commentsCount || 0,
                },
            }));
            setCommunityPosts(posts);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setIsLoadingPosts(false);
        }
    }, []);

    // Initial fetch on mount
    useEffect(() => {
        fetchJobs(true);
        fetchPosts(true);
    }, [fetchJobs, fetchPosts]);

    // Real-time polling every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchJobs(false); // Silent refresh (no loading spinner)
            fetchPosts(false);
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, [fetchJobs, fetchPosts]);

    // Filter jobs by search
    const filteredJobs = useMemo(() => {
        if (!searchQuery.trim()) return jobPostings;
        const query = searchQuery.toLowerCase();
        return jobPostings.filter(job => {
            const companyName = (job.companyName || '').toLowerCase();
            const description = (job.description || '').toLowerCase();
            const tags = (job.tags || []).join(' ').toLowerCase();
            const positions = (job.jobPositions || []).map(p => p.title?.toLowerCase() || '').join(' ');
            return companyName.includes(query) || description.includes(query) ||
                tags.includes(query) || positions.includes(query);
        });
    }, [jobPostings, searchQuery]);

    // Filter posts by search
    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) return communityPosts;
        const query = searchQuery.toLowerCase();
        return communityPosts.filter(post => {
            const title = (post.title || '').toLowerCase();
            const content = (post.content || '').toLowerCase();
            const topics = (post.topics || []).join(' ').toLowerCase();
            const author = `${post.user.firstName || ''} ${post.user.lastName || ''} ${post.user.username}`.toLowerCase();
            return title.includes(query) || content.includes(query) ||
                topics.includes(query) || author.includes(query);
        });
    }, [communityPosts, searchQuery]);

    const isLoading = activeTab === 'companies' ? isLoadingJobs : isLoadingPosts;
    const currentItems = activeTab === 'companies' ? filteredJobs : filteredPosts;

    return (
        <main className="min-h-screen w-full overflow-x-hidden bg-slate-900">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
                    animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />
            </div>

            {/* Header */}
            <div className="z-10 sticky top-0 backdrop-blur-md bg-slate-900/80 border-b border-cyan-400/10 py-6">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-lg bg-linear-to-br from-cyan-500/30 to-blue-500/30">
                                <Search className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h1
                                    className="text-3xl md:text-4xl font-bold text-white"
                                    style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
                                >
                                    Tìm kiếm
                                </h1>
                            </div>
                        </div>
                        <p className="text-gray-400 ml-11">
                            Tìm kiếm các công việc và các bài viết trên cộng đồng phù hợp với cá nhân bạn
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={activeTab === 'companies' ? 'Tìm kiếm công ty, vị trí, kỹ năng...' : 'Tìm kiếm bài viết, chủ đề...'}
                            className="w-full py-3 pl-12 pr-4 rounded-lg bg-slate-800/50 border border-cyan-400/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-3">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <motion.button
                                    key={tab.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${activeTab === tab.id
                                        ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white'
                                        : 'bg-slate-800/50 text-gray-400 hover:text-white border border-cyan-400/20 hover:border-cyan-400/40'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-cyan-400/20 text-cyan-300'
                                        }`}>
                                        {tab.count}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="z-10 relative py-8">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                        </div>
                    ) : currentItems.length === 0 ? (
                        <div className="text-center py-20">
                            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                Không tìm thấy kết quả
                            </h3>
                            <p className="text-gray-500">
                                Hãy thử tìm kiếm với từ khóa khác
                            </p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {activeTab === 'companies' ? (
                                    filteredJobs.map((job, index) => (
                                        <JobCard key={job.id} job={job} index={index} />
                                    ))
                                ) : (
                                    filteredPosts.map((post, index) => (
                                        <PostCard key={post.id} post={post} index={index} />
                                    ))
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </main>
    );
}

// Job Card Component
function JobCard({ job, index }: { job: JobPosting; index: number }) {
    const position = job.jobPositions?.[0];
    const salaryText = position?.minSalary && position?.maxSalary
        ? `${position.minSalary} - ${position.maxSalary} triệu`
        : 'Thương lượng';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="rounded-lg border border-cyan-400/20 backdrop-blur-sm bg-linear-to-br from-white/10 to-white/5 overflow-hidden hover:border-cyan-400/40 transition-all cursor-pointer"
            onClick={() => window.location.href = `/companies?search=${encodeURIComponent(job.companyName)}`}
        >
            <div className="p-5">
                {/* Company Info */}
                <div className="flex gap-3 items-start mb-4">
                    <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-700 flex items-center justify-center">
                        {job.companyLogo ? (
                            <Image src={job.companyLogo} alt={job.companyName} fill className="object-cover" unoptimized />
                        ) : (
                            <span className="text-lg font-bold text-cyan-400">{job.companyName?.charAt(0)}</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white line-clamp-1">{position?.title || job.companyName}</h3>
                        <p className="text-sm text-gray-400 line-clamp-1">{job.companyName}</p>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {(job.tags || []).slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Location & Salary */}
                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        <span className="line-clamp-1">{job.address || 'Việt Nam'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-cyan-400" />
                        <span>{salaryText}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-cyan-400/10 flex items-center justify-between">
                <span className="text-xs text-gray-500">{job.viewCount || 0} lượt xem</span>
                <ExternalLink className="w-4 h-4 text-cyan-400" />
            </div>
        </motion.div>
    );
}

// Post Card Component
function PostCard({ post, index }: { post: CommunityPost; index: number }) {
    const authorName = post.user.firstName && post.user.lastName
        ? `${post.user.firstName} ${post.user.lastName}`
        : post.user.username;

    const categoryLabels: Record<string, string> = {
        'experience': '📝 Kinh Nghiệm',
        'discussion': '💬 Thảo Luận',
        'question': '❓ Câu Hỏi',
        'opportunity': '🎯 Cơ Hội',
        'job-search': '💼 Tìm Việc',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="rounded-lg border border-cyan-400/20 backdrop-blur-sm bg-linear-to-br from-white/10 to-white/5 overflow-hidden hover:border-cyan-400/40 transition-all cursor-pointer"
            onClick={() => window.location.href = '/community'}
        >
            <div className="p-5">
                {/* Author Info */}
                <div className="flex gap-3 items-start mb-3">
                    <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                        {post.user.avatar ? (
                            <Image src={post.user.avatar} alt={authorName} fill className="object-cover" unoptimized />
                        ) : (
                            <span className="text-sm font-bold text-cyan-400">{authorName.charAt(0)}</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white line-clamp-1">{authorName}</h3>
                        <p className="text-xs text-gray-400">{post.user.companyName || 'Thành viên cộng đồng'}</p>
                    </div>
                </div>

                {/* Category */}
                <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 mb-3">
                    {categoryLabels[post.category] || post.category}
                </span>

                {/* Content */}
                <p className="text-sm text-gray-300 line-clamp-3 mb-3">
                    {post.title || post.content}
                </p>

                {/* Topics */}
                {post.topics && post.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.topics.slice(0, 3).map((topic) => (
                            <span key={topic} className="px-2 py-0.5 text-xs rounded-full bg-slate-700/50 text-gray-400">
                                #{topic}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-cyan-400/10 flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post._count?.likes || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post._count?.comments || 0}</span>
                </div>
                <span className="ml-auto">
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                </span>
            </div>
        </motion.div>
    );
}
