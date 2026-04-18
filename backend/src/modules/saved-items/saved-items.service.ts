/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MessagingGateway } from '../messaging/messaging.gateway';

@Injectable()
export class SavedItemsService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => MessagingGateway))
        private messagingGateway: MessagingGateway,
    ) { }

    /**
     * Get all saved items for a user (posts and job postings)
     */
    async getAllSavedItems(userId: string) {
        const [savedPosts, savedJobPostings] = await Promise.all([
            this.prisma.savedPost.findMany({
                where: { userId },
                include: {
                    post: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    firstName: true,
                                    lastName: true,
                                    avatar: true,
                                    role: true,
                                    companyName: true,
                                },
                            },
                            _count: {
                                select: {
                                    likes: true,
                                    comments: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.savedJobPosting.findMany({
                where: { userId },
                include: {
                    jobPosting: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    companyName: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        return {
            posts: savedPosts.map((sp) => this.transformSavedPost(sp)),
            jobPostings: savedJobPostings.map((sj) => this.transformSavedJobPosting(sj)),
        };
    }

    /**
     * Save a post
     */
    async savePost(userId: string, postId: string) {
        // Check if already saved
        const existing = await this.prisma.savedPost.findUnique({
            where: {
                userId_postId: { userId, postId },
            },
        });

        if (existing) {
            return { success: true, message: 'Bài viết đã được lưu trước đó' };
        }

        // Check if post exists
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true,
                        companyName: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });

        if (!post) {
            return { success: false, message: 'Bài viết không tồn tại' };
        }

        const savedPost = await this.prisma.savedPost.create({
            data: {
                userId,
                postId,
            },
            include: {
                post: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                                role: true,
                                companyName: true,
                            },
                        },
                        _count: {
                            select: {
                                likes: true,
                                comments: true,
                            },
                        },
                    },
                },
            },
        });

        // Broadcast real-time update
        try {
            this.messagingGateway.broadcastSavedItemUpdate(userId, {
                type: 'saved',
                itemType: 'post',
                item: this.transformSavedPost(savedPost),
            });
        } catch (error) {
            console.error('Failed to broadcast saved item update:', error);
        }

        return {
            success: true,
            message: 'Đã lưu bài viết',
            data: this.transformSavedPost(savedPost),
        };
    }

    /**
     * Unsave a post
     */
    async unsavePost(userId: string, postId: string) {
        const existing = await this.prisma.savedPost.findUnique({
            where: {
                userId_postId: { userId, postId },
            },
        });

        if (!existing) {
            return { success: false, message: 'Bài viết chưa được lưu' };
        }

        await this.prisma.savedPost.delete({
            where: {
                userId_postId: { userId, postId },
            },
        });

        // Broadcast real-time update
        try {
            this.messagingGateway.broadcastSavedItemUpdate(userId, {
                type: 'unsaved',
                itemType: 'post',
                itemId: postId,
            });
        } catch (error) {
            console.error('Failed to broadcast saved item update:', error);
        }

        return { success: true, message: 'Đã bỏ lưu bài viết' };
    }

    /**
     * Check if a post is saved
     */
    async isPostSaved(userId: string, postId: string) {
        const saved = await this.prisma.savedPost.findUnique({
            where: {
                userId_postId: { userId, postId },
            },
        });

        return { isSaved: !!saved };
    }

    /**
     * Save a job posting
     */
    async saveJobPosting(userId: string, jobPostingId: string) {
        // Check if already saved
        const existing = await this.prisma.savedJobPosting.findUnique({
            where: {
                userId_jobPostingId: { userId, jobPostingId },
            },
        });

        if (existing) {
            return { success: true, message: 'Công ty đã được lưu trước đó' };
        }

        // Check if job posting exists
        const jobPosting = await this.prisma.companyJobPosting.findUnique({
            where: { id: jobPostingId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        companyName: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!jobPosting) {
            return { success: false, message: 'Công ty không tồn tại' };
        }

        const savedJobPosting = await this.prisma.savedJobPosting.create({
            data: {
                userId,
                jobPostingId,
            },
            include: {
                jobPosting: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                companyName: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });

        // Broadcast real-time update
        try {
            this.messagingGateway.broadcastSavedItemUpdate(userId, {
                type: 'saved',
                itemType: 'jobPosting',
                item: this.transformSavedJobPosting(savedJobPosting),
            });
        } catch (error) {
            console.error('Failed to broadcast saved item update:', error);
        }

        return {
            success: true,
            message: 'Đã lưu công ty',
            data: this.transformSavedJobPosting(savedJobPosting),
        };
    }

    /**
     * Unsave a job posting
     */
    async unsaveJobPosting(userId: string, jobPostingId: string) {
        const existing = await this.prisma.savedJobPosting.findUnique({
            where: {
                userId_jobPostingId: { userId, jobPostingId },
            },
        });

        if (!existing) {
            return { success: false, message: 'Công ty chưa được lưu' };
        }

        await this.prisma.savedJobPosting.delete({
            where: {
                userId_jobPostingId: { userId, jobPostingId },
            },
        });

        // Broadcast real-time update
        try {
            this.messagingGateway.broadcastSavedItemUpdate(userId, {
                type: 'unsaved',
                itemType: 'jobPosting',
                itemId: jobPostingId,
            });
        } catch (error) {
            console.error('Failed to broadcast saved item update:', error);
        }

        return { success: true, message: 'Đã bỏ lưu công ty' };
    }

    /**
     * Check if a job posting is saved
     */
    async isJobPostingSaved(userId: string, jobPostingId: string) {
        const saved = await this.prisma.savedJobPosting.findUnique({
            where: {
                userId_jobPostingId: { userId, jobPostingId },
            },
        });

        return { isSaved: !!saved };
    }

    /**
     * Remove all saved posts for a user
     */
    async removeAllSavedPosts(userId: string) {
        const result = await this.prisma.savedPost.deleteMany({
            where: { userId },
        });

        // Broadcast real-time update
        try {
            this.messagingGateway.broadcastSavedItemUpdate(userId, {
                type: 'cleared',
                itemType: 'post',
            });
        } catch (error) {
            console.error('Failed to broadcast saved item update:', error);
        }

        return {
            success: true,
            message: `Đã xóa ${result.count} bài viết đã lưu`,
            count: result.count,
        };
    }

    /**
     * Remove all saved job postings for a user
     */
    async removeAllSavedJobPostings(userId: string) {
        const result = await this.prisma.savedJobPosting.deleteMany({
            where: { userId },
        });

        // Broadcast real-time update
        try {
            this.messagingGateway.broadcastSavedItemUpdate(userId, {
                type: 'cleared',
                itemType: 'jobPosting',
            });
        } catch (error) {
            console.error('Failed to broadcast saved item update:', error);
        }

        return {
            success: true,
            message: `Đã xóa ${result.count} công ty đã lưu`,
            count: result.count,
        };
    }

    /**
     * Transform saved post for API response
     */
    private transformSavedPost(savedPost: any) {
        const post = savedPost.post;
        const author = post.user;
        const authorName = author.role === 'employer'
            ? author.companyName || author.username
            : author.firstName && author.lastName
                ? `${author.firstName} ${author.lastName}`
                : author.username;

        return {
            id: savedPost.id,
            savedAt: savedPost.createdAt.toISOString(),
            post: {
                id: post.id,
                content: post.content,
                category: post.category,
                images: post.images || [],
                hashtags: post.hashtags || [],
                title: post.title,
                tags: post.tags || [],
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
                likesCount: post._count?.likes || 0,
                commentsCount: post._count?.comments || 0,
                author: {
                    id: author.id,
                    name: authorName,
                    avatar: author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.id}`,
                    role: author.role,
                },
            },
        };
    }

    /**
     * Transform saved job posting for API response
     */
    private transformSavedJobPosting(savedJobPosting: any) {
        const jobPosting = savedJobPosting.jobPosting;
        const user = jobPosting.user;

        return {
            id: savedJobPosting.id,
            savedAt: savedJobPosting.createdAt.toISOString(),
            company: {
                id: jobPosting.id,
                name: jobPosting.companyName,
                logo: jobPosting.companyLogo || `https://api.dicebear.com/7.x/shapes/svg?seed=${jobPosting.id}`,
                location: jobPosting.address || '',
                description: jobPosting.description || '',
                tags: jobPosting.tags || [],
                jobPositions: jobPosting.jobPositions || [],
                workingHours: jobPosting.workingHours,
                benefits: jobPosting.benefits || [],
                insurances: jobPosting.insurances || [],
                vacationDays: jobPosting.vacationDays,
                website: jobPosting.website,
                email: jobPosting.email,
                phone: jobPosting.phone,
                mission: jobPosting.mission,
                vision: jobPosting.vision,
                galleryImages: jobPosting.galleryImages || [],
                createdAt: jobPosting.createdAt.toISOString(),
                owner: {
                    id: user.id,
                    username: user.username,
                    companyName: user.companyName,
                    avatar: user.avatar,
                },
            },
        };
    }
}
