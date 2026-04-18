import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto, CreateCommentDto } from './dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommunityService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => NotificationService))
        private notificationService: NotificationService,
    ) { }

    // ==================== POSTS ====================

    /**
     * Create a new post
     */
    async createPost(userId: string, createPostDto: CreatePostDto) {
        return this.prisma.post.create({
            data: {
                userId,
                content: createPostDto.content,
                category: createPostDto.category || 'discussion',
                topics: createPostDto.topics || [],
                hashtags: createPostDto.hashtags || [],
                images: createPostDto.images || [],
            },
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
    }

    /**
     * Get all posts with pagination
     */
    async getPosts(page: number = 1, limit: number = 10, userId?: string) {
        const skip = (page - 1) * limit;

        const posts = await this.prisma.post.findMany({
            where: {
                isHidden: false,  // Filter out hidden posts
            } as any,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
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
                        isBanned: true,  // Filter out banned users
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
                likes: userId ? {
                    where: { userId },
                    select: { id: true },
                } : false,
            },
        });

        const total = await this.prisma.post.count({
            where: { isHidden: false } as any,
        });

        // Filter out posts from banned users and transform
        const transformedPosts = (posts as any[])
            .filter(post => !post.user?.isBanned)
            .map(post => ({
                ...post,
                likesCount: post._count?.likes ?? 0,
                commentsCount: post._count?.comments ?? 0,
                isLiked: userId ? post.likes && post.likes.length > 0 : false,
                likes: undefined,
                _count: undefined,
            }));

        return {
            posts: transformedPosts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get current user's posts with pagination
     */
    async getMyPosts(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const posts = await this.prisma.post.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
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

        const total = await this.prisma.post.count({
            where: { userId },
        });

        // Transform posts to include counts
        const transformedPosts = posts.map(post => ({
            ...post,
            likesCount: post._count.likes,
            commentsCount: post._count.comments,
            isLiked: false,
            _count: undefined,
        }));

        return {
            posts: transformedPosts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get single post by ID
     */
    async getPost(postId: string, userId?: string) {
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
                likes: userId ? {
                    where: { userId },
                    select: { id: true },
                } : false,
            },
        });

        if (!post) {
            throw new NotFoundException('Bài viết không tồn tại');
        }

        return {
            ...post,
            likesCount: post._count.likes,
            commentsCount: post._count.comments,
            isLiked: userId ? post.likes && post.likes.length > 0 : false,
            likes: undefined,
            _count: undefined,
        };
    }

    /**
     * Update a post
     */
    async updatePost(postId: string, userId: string, updatePostDto: UpdatePostDto) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new NotFoundException('Bài viết không tồn tại');
        }

        if (post.userId !== userId) {
            throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài viết này');
        }

        return this.prisma.post.update({
            where: { id: postId },
            data: updatePostDto,
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
            },
        });
    }

    /**
     * Delete a post
     */
    async deletePost(postId: string, userId: string) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new NotFoundException('Bài viết không tồn tại');
        }

        if (post.userId !== userId) {
            throw new ForbiddenException('Bạn không có quyền xóa bài viết này');
        }

        await this.prisma.post.delete({
            where: { id: postId },
        });

        return { message: 'Đã xóa bài viết thành công' };
    }

    // ==================== LIKES ====================

    /**
     * Toggle like on a post
     */
    async toggleLike(postId: string, userId: string) {
        // Fetch post with author info for notification
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        companyName: true,
                    },
                },
            },
        });

        if (!post) {
            throw new NotFoundException('Bài viết không tồn tại');
        }

        const existingLike = await this.prisma.like.findUnique({
            where: {
                postId_userId: { postId, userId },
            },
        });

        if (existingLike) {
            // Unlike
            await this.prisma.like.delete({
                where: { id: existingLike.id },
            });
        } else {
            // Like
            await this.prisma.like.create({
                data: { postId, userId },
            });

            // Create notification for post/question author (don't notify self)
            if (post.userId !== userId) {
                // Get liker info
                const liker = await this.prisma.user.findUnique({
                    where: { id: userId },
                    select: {
                        username: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        companyName: true,
                    },
                });

                if (liker) {
                    const likerName = liker.role === 'employer'
                        ? liker.companyName || liker.username
                        : liker.firstName && liker.lastName
                            ? `${liker.firstName} ${liker.lastName}`
                            : liker.username;

                    const isQuestion = post.category === 'question';
                    const notificationType = isQuestion ? 'question_like' : 'post_like';
                    const contentType = isQuestion ? 'câu hỏi' : 'bài viết';
                    const actionUrl = isQuestion ? `/community?tab=questions&questionId=${postId}` : `/shared-post/${postId}`;

                    await this.notificationService.createNotification({
                        userId: post.userId,
                        actorId: userId,
                        type: notificationType,
                        title: `Lượt thích ${contentType} mới`,
                        description: `${likerName} đã thích ${contentType} của bạn`,
                        postId,
                        actionUrl,
                    });
                }
            }
        }

        // Get updated like count
        const likesCount = await this.prisma.like.count({
            where: { postId },
        });

        return {
            isLiked: !existingLike,
            likesCount,
            message: existingLike ? 'Đã bỏ thích' : 'Đã thích',
        };
    }

    /**
     * Check if user liked a post
     */
    async checkLikeStatus(postId: string, userId: string) {
        const like = await this.prisma.like.findUnique({
            where: {
                postId_userId: { postId, userId },
            },
        });
        return { isLiked: !!like };
    }

    // ==================== COMMENTS ====================

    /**
     * Get comments for a post with unlimited nesting depth
     */
    async getComments(postId: string, userId?: string) {
        // Fetch ALL comments for this post (flat list)
        const allComments = await this.prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: 'asc' },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        replies: true,
                    },
                },
                likes: userId ? {
                    where: { userId },
                    select: { id: true },
                } : false,
            },
        });

        // Build a map of comments by ID
        const commentMap = new Map<string, any>();
        allComments.forEach(comment => {
            commentMap.set(comment.id, {
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                parentId: comment.parentId,
                author: {
                    id: comment.user.id,
                    name: `${comment.user.firstName || ''} ${comment.user.lastName || ''}`.trim() || comment.user.username,
                    avatar: comment.user.avatar,
                    role: comment.user.role,
                },
                likesCount: comment._count?.likes || 0,
                repliesCount: comment._count?.replies || 0,
                isLiked: userId ? comment.likes && (comment.likes as any[]).length > 0 : false,
                replies: [],
            });
        });

        // Build the tree structure
        const rootComments: any[] = [];
        const orphanedReplies: any[] = [];

        allComments.forEach(comment => {
            const transformedComment = commentMap.get(comment.id);
            if (comment.parentId) {
                // This is a reply - add to parent's replies array
                const parent = commentMap.get(comment.parentId);
                if (parent) {
                    parent.replies.push(transformedComment);
                } else {
                    // Parent not found - orphaned reply, add to orphaned list
                    orphanedReplies.push(transformedComment);
                }
            } else {
                // This is a top-level comment
                rootComments.push(transformedComment);
            }
        });

        // Add orphaned replies to root level so they're not lost
        // This handles edge cases where parent comments were deleted
        if (orphanedReplies.length > 0) {
            rootComments.push(...orphanedReplies);
        }

        // Sort root comments by createdAt desc, but replies are already sorted asc
        rootComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return rootComments;
    }

    private transformComment(comment: any, userId?: string): any {
        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            author: {
                id: comment.user.id,
                name: `${comment.user.firstName || ''} ${comment.user.lastName || ''}`.trim() || comment.user.username,
                avatar: comment.user.avatar,
                role: comment.user.role,
            },
            likesCount: comment._count?.likes || 0,
            repliesCount: comment._count?.replies || 0,
            isLiked: userId ? comment.likes && comment.likes.length > 0 : false,
            replies: comment.replies?.map((reply: any) => this.transformComment(reply, userId)) || [],
        };
    }

    /**
     * Add a comment to a post
     */
    async addComment(postId: string, userId: string, createCommentDto: CreateCommentDto) {
        // Fetch post with author info for notification
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            include: {
                user: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!post) {
            throw new NotFoundException('Bài viết không tồn tại');
        }

        // If it's a reply, verify parent exists
        if (createCommentDto.parentId) {
            const parentComment = await this.prisma.comment.findUnique({
                where: { id: createCommentDto.parentId },
            });
            if (!parentComment) {
                throw new NotFoundException('Bình luận gốc không tồn tại');
            }
        }

        const comment = await this.prisma.comment.create({
            data: {
                postId,
                userId,
                content: createCommentDto.content,
                parentId: createCommentDto.parentId || null,
            },
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
            },
        });

        // Create notification for post/question author (don't notify self)
        if (post.userId !== userId) {
            const commenterName = comment.user.role === 'employer'
                ? (comment.user as any).companyName || comment.user.username
                : comment.user.firstName && comment.user.lastName
                    ? `${comment.user.firstName} ${comment.user.lastName}`
                    : comment.user.username;

            const isQuestion = post.category === 'question';
            const notificationType = isQuestion ? 'question_comment' : 'post_comment';
            const contentType = isQuestion ? 'câu hỏi' : 'bài viết';
            const actionUrl = isQuestion ? `/community?tab=questions&questionId=${postId}` : `/shared-post/${postId}`;

            await this.notificationService.createNotification({
                userId: post.userId,
                actorId: userId,
                type: notificationType,
                title: `Bình luận ${contentType} mới`,
                description: `${commenterName} đã bình luận: "${createCommentDto.content.substring(0, 50)}${createCommentDto.content.length > 50 ? '...' : ''}"`,
                postId,
                actionUrl,
            });
        }

        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            author: {
                id: comment.user.id,
                name: `${comment.user.firstName || ''} ${comment.user.lastName || ''}`.trim() || comment.user.username,
                avatar: comment.user.avatar,
                role: comment.user.role,
            },
            likesCount: 0,
            repliesCount: 0,
            isLiked: false,
            replies: [],
        };
    }

    /**
     * Toggle like on a comment
     */
    async toggleCommentLike(commentId: string, userId: string) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            throw new NotFoundException('Bình luận không tồn tại');
        }

        const existingLike = await this.prisma.commentLike.findUnique({
            where: {
                commentId_userId: { commentId, userId },
            },
        });

        if (existingLike) {
            await this.prisma.commentLike.delete({
                where: { id: existingLike.id },
            });
            return { isLiked: false, message: 'Đã bỏ thích bình luận' };
        } else {
            await this.prisma.commentLike.create({
                data: { commentId, userId },
            });
            return { isLiked: true, message: 'Đã thích bình luận' };
        }
    }

    /**
     * Delete a comment
     */
    async deleteComment(commentId: string, userId: string) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            throw new NotFoundException('Bình luận không tồn tại');
        }

        if (comment.userId !== userId) {
            throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
        }

        await this.prisma.comment.delete({
            where: { id: commentId },
        });

        return { message: 'Đã xóa bình luận thành công' };
    }

    // ==================== SHARE ====================

    /**
     * Increment share count
     */
    async incrementShareCount(postId: string) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new NotFoundException('Bài viết không tồn tại');
        }

        await this.prisma.post.update({
            where: { id: postId },
            data: { shareCount: { increment: 1 } },
        });

        return { shareCount: post.shareCount + 1 };
    }

    /**
     * Get shared post (public endpoint)
     */
    async getSharedPost(postId: string, userId?: string) {
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
                        isBanned: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
                likes: userId ? {
                    where: { userId },
                    select: { id: true },
                } : false,
            },
        });

        if (!post) {
            throw new NotFoundException('Bài viết không tồn tại');
        }

        // Check if post is hidden or user is banned
        if ((post as any).isHidden || (post.user as any).isBanned) {
            throw new NotFoundException('Bài viết đã bị ẩn hoặc xóa');
        }

        return {
            ...post,
            likesCount: post._count.likes,
            commentsCount: post._count.comments,
            isLiked: userId ? post.likes && post.likes.length > 0 : false,
            likes: undefined,
            _count: undefined,
        };
    }

    // ==================== SUGGESTIONS & LEADERBOARD ====================

    /**
     * Get random user suggestions (3 users)
     */
    async getUserSuggestions(currentUserId?: string) {
        const users = await this.prisma.user.findMany({
            where: currentUserId ? { id: { not: currentUserId } } : {},
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
                companyName: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    },
                },
            },
            take: 20, // Get 20 users, then randomly select 3
        });

        // Shuffle and take 3
        const shuffled = users.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        return selected.map(user => ({
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
            avatar: user.avatar,
            role: user.role,
            title: user.role === 'employer' ? user.companyName : undefined,
            followers: user._count.followers,
            following: user._count.following,
        }));
    }

    /**
     * Get leaderboard data
     */
    async getLeaderboard(limit: number = 30) {
        // Get users with their post/like/follower counts
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
                companyName: true,
                _count: {
                    select: {
                        posts: true,
                        likes: true,
                        followers: true,
                    },
                },
            },
            take: limit * 2, // Get more to calculate scores
        });

        // Calculate scores and sort
        const usersWithScores = users.map(user => {
            // Score calculation: posts * 10 + likes * 2 + followers * 5
            const score = (user._count.posts * 10) + (user._count.likes * 2) + (user._count.followers * 5);
            return {
                id: user.id,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
                avatar: user.avatar,
                role: user.role,
                title: user.role === 'employer' ? user.companyName : undefined,
                verified: user._count.posts > 5 || user._count.followers > 10,
                score,
                posts: user._count.posts,
                likes: user._count.likes,
                followers: user._count.followers,
            };
        });

        // Sort by score descending and add rank
        usersWithScores.sort((a, b) => b.score - a.score);

        return usersWithScores.slice(0, limit).map((user, index) => ({
            rank: index + 1,
            user: {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
                title: user.title,
                verified: user.verified,
                followers: user.followers,
            },
            score: user.score,
            posts: user.posts,
            likes: user.likes,
            followers: user.followers,
            streak: Math.floor(Math.random() * 30) + 1, // Placeholder for activity streak
        }));
    }

    /**
     * Get user profile data for modal display
     * Includes computed stats: followers, posts, likes, comments, score
     */
    async getUserProfileForModal(userId: string, currentUserId?: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
                companyName: true,
                isBanned: true,
                _count: {
                    select: {
                        posts: true,
                        comments: true,
                        likes: true,
                        followers: true,
                        following: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('Người dùng không tồn tại');
        }

        // Get the user's public profile share token
        const publicProfile = await this.prisma.publicProfile.findUnique({
            where: { userId },
            select: { shareToken: true },
        });

        // Calculate total likes received on user's posts
        const likesReceived = await this.prisma.like.count({
            where: {
                post: {
                    userId: userId,
                },
            },
        });

        // Check if current user is following this user
        let isFollowing = false;
        if (currentUserId && currentUserId !== userId) {
            const followRelation = await this.prisma.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: userId,
                    },
                },
            });
            isFollowing = !!followRelation;
        }

        // Calculate score: Likes + Followers + (Posts + Comments) / 2
        const followersCount = user._count.followers;
        const postsCount = user._count.posts;
        const commentsCount = user._count.comments;
        const score = likesReceived + followersCount + Math.floor((postsCount + commentsCount) / 2);

        return {
            user: {
                id: user.id,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
                avatar: user.avatar,
                role: user.role,
                title: user.role === 'employer' ? user.companyName : undefined,
                verified: postsCount > 5 || followersCount > 10,
                isBanned: user.isBanned,
            },
            stats: {
                followers: followersCount,
                following: postsCount, // "Following" displays posts count as per user requirement
                postsCount,
                commentsCount,
                likesReceived,
                score,
            },
            shareToken: publicProfile?.shareToken || null,
            isFollowing,
            isSelf: currentUserId === userId,
        };
    }

    // ==================== QUESTIONS ====================

    /**
     * Create a new question
     */
    async createQuestion(userId: string, dto: {
        title: string;
        content: string;
        tags: string[];
    }) {
        const question = await this.prisma.post.create({
            data: {
                userId,
                title: dto.title,
                content: dto.content,
                tags: dto.tags,
                category: 'question',
            },
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

        return {
            id: question.id,
            title: question.title,
            content: question.content,
            tags: question.tags,
            category: question.category,
            viewCount: question.viewCount,
            isAnswered: question.isAnswered,
            likesCount: question._count.likes,
            commentsCount: question._count.comments,
            createdAt: question.createdAt.toISOString(),
            user: question.user,
        };
    }

    /**
     * Get paginated questions
     */
    async getQuestions(userId?: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const questions = await this.prisma.post.findMany({
            where: { category: 'question' },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
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
                likes: userId ? {
                    where: { userId },
                    select: { id: true },
                } : false,
            },
        });

        return questions.map(q => ({
            id: q.id,
            title: q.title,
            content: q.content,
            tags: q.tags,
            viewCount: q.viewCount,
            isAnswered: q.isAnswered,
            likesCount: q._count.likes,
            commentsCount: q._count.comments,
            isLiked: userId ? q.likes && q.likes.length > 0 : false,
            createdAt: q.createdAt.toISOString(),
            user: q.user,
        }));
    }

    /**
     * Get single question by ID
     */
    async getQuestion(questionId: string, userId?: string) {
        const question = await this.prisma.post.findFirst({
            where: { id: questionId, category: 'question' },
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
                likes: userId ? {
                    where: { userId },
                    select: { id: true },
                } : false,
            },
        });

        if (!question) {
            throw new NotFoundException('Câu hỏi không tồn tại');
        }

        return {
            id: question.id,
            title: question.title,
            content: question.content,
            tags: question.tags,
            viewCount: question.viewCount,
            isAnswered: question.isAnswered,
            acceptedCommentId: question.acceptedCommentId,
            likesCount: question._count.likes,
            commentsCount: question._count.comments,
            isLiked: userId ? question.likes && question.likes.length > 0 : false,
            createdAt: question.createdAt.toISOString(),
            user: question.user,
        };
    }

    /**
     * Toggle like on a question (same as post like)
     */
    async toggleQuestionLike(questionId: string, userId: string) {
        // Verify it's a question
        const question = await this.prisma.post.findFirst({
            where: { id: questionId, category: 'question' },
        });

        if (!question) {
            throw new NotFoundException('Câu hỏi không tồn tại');
        }

        // Reuse existing like logic
        return this.toggleLike(questionId, userId);
    }

    /**
     * Record unique question view per user
     */
    async recordQuestionView(questionId: string, userId: string) {
        // Verify it's a question
        const question = await this.prisma.post.findFirst({
            where: { id: questionId, category: 'question' },
        });

        if (!question) {
            throw new NotFoundException('Câu hỏi không tồn tại');
        }

        // Check if view already exists
        const existingView = await this.prisma.questionView.findUnique({
            where: {
                postId_userId: {
                    postId: questionId,
                    userId,
                },
            },
        });

        if (!existingView) {
            // Create view record and increment count
            await this.prisma.$transaction([
                this.prisma.questionView.create({
                    data: {
                        postId: questionId,
                        userId,
                    },
                }),
                this.prisma.post.update({
                    where: { id: questionId },
                    data: { viewCount: { increment: 1 } },
                }),
            ]);
        }

        // Get updated count
        const updated = await this.prisma.post.findUnique({
            where: { id: questionId },
            select: { viewCount: true },
        });

        return { viewCount: updated?.viewCount || 0 };
    }

    /**
     * Get featured questions (top 3 by likes)
     */
    async getFeaturedQuestions(limit: number = 3) {
        const questions = await this.prisma.post.findMany({
            where: { category: 'question' },
            orderBy: [
                { likes: { _count: 'desc' } },
                { createdAt: 'desc' },
            ],
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
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

        return questions.map(q => ({
            id: q.id,
            title: q.title,
            content: q.content,
            tags: q.tags,
            viewCount: q.viewCount,
            likesCount: q._count.likes,
            commentsCount: q._count.comments,
            isAnswered: q.isAnswered,
            createdAt: q.createdAt.toISOString(),
            user: q.user,
        }));
    }

    /**
     * Get top experts (top 3 users by question post count)
     */
    async getTopExperts(limit: number = 3) {
        const experts = await this.prisma.user.findMany({
            where: {
                posts: {
                    some: { category: 'question' },
                },
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
                companyName: true,
                _count: {
                    select: {
                        posts: {
                            where: { category: 'question' },
                        },
                    },
                },
            },
            orderBy: {
                posts: { _count: 'desc' },
            },
            take: limit,
        });

        return experts.map(e => ({
            id: e.id,
            name: `${e.firstName || ''} ${e.lastName || ''}`.trim() || e.username,
            avatar: e.avatar,
            role: e.role,
            title: e.role === 'employer' ? e.companyName : undefined,
            questionCount: e._count.posts,
        }));
    }

    /**
     * Get Q&A statistics
     */
    async getQAStats() {
        // Get total questions count
        const totalQuestions = await this.prisma.post.count({
            where: { category: 'question' },
        });

        // Get questions with at least 1 comment (answered/resolved questions)
        const questionsWithComments = await this.prisma.post.count({
            where: {
                category: 'question',
                comments: {
                    some: {}, // Has at least one comment
                },
            },
        });

        // Calculate unanswered count (questions with no comments)
        const unansweredCount = totalQuestions - questionsWithComments;

        // Calculate resolved rate (questions with at least 1 comment / total)
        const resolvedRate = totalQuestions > 0
            ? Math.round((questionsWithComments / totalQuestions) * 100)
            : 0;

        // Get answers (comments on questions) this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const answersThisWeek = await this.prisma.comment.count({
            where: {
                post: {
                    category: 'question',
                },
                createdAt: {
                    gte: oneWeekAgo,
                },
            },
        });

        return {
            totalQuestions,
            unansweredCount,
            resolvedRate,
            answersThisWeek,
        };
    }
}
