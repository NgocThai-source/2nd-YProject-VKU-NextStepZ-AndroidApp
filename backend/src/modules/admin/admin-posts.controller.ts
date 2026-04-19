import { Controller, Get, Patch, Delete, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import { NotificationService } from '../notification/notification.service';
import * as express from 'express';

@Controller('admin/posts')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminPostsController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly adminService: AdminService,
        private readonly notificationService: NotificationService,
    ) { }

    /**
     * Get all posts with filters
     * GET /admin/posts
     */
    @Get()
    async getPosts(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
        @Query('userId') userId?: string,
        @Query('type') type?: string, // 'post' | 'question'
        @Query('hidden') hidden?: string, // 'true' | 'false'
        @Query('search') search?: string,
    ) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};

        if (userId) {
            where.userId = userId;
        }

        if (type === 'question') {
            where.category = 'question';
        } else if (type === 'post') {
            where.category = { not: 'question' };
        }

        if (hidden === 'true') {
            where.isHidden = true;
        } else if (hidden === 'false') {
            where.isHidden = false;
        }

        if (search) {
            where.OR = [
                { content: { contains: search, mode: 'insensitive' } },
                { title: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { createdAt: 'desc' },
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
                            comments: true,
                            likes: true,
                        },
                    },
                },
            }),
            this.prisma.post.count({ where }),
        ]);

        return {
            posts: posts.map((post: any) => ({
                id: post.id,
                content: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : ''),
                title: post.title,
                category: post.category,
                isHidden: post.isHidden === true,
                isQuestion: post.category === 'question',
                commentsCount: post._count.comments,
                likesCount: post._count.likes,
                viewCount: post.viewCount,
                user: {
                    id: post.user.id,
                    username: post.user.username,
                    name: `${post.user.firstName || ''} ${post.user.lastName || ''}`.trim() || post.user.username,
                    avatar: post.user.avatar,
                },
                createdAt: post.createdAt,
            })),
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        };
    }

    /**
     * Get posts by user ID (for user details modal)
     * GET /admin/posts/user/:userId
     */
    @Get('user/:userId')
    async getPostsByUser(
        @Param('userId') userId: string,
        @Query('type') type?: string,
    ) {
        const where: any = { userId };

        if (type === 'question') {
            where.category = 'question';
        } else if (type === 'post') {
            where.category = { not: 'question' };
        }

        const posts = await this.prisma.post.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });

        // Get share tokens for posts
        const publicProfiles = await this.prisma.publicProfile.findMany({
            where: {
                userId: userId,
            },
            select: {
                shareToken: true,
                userId: true,
            },
        });

        const shareToken = publicProfiles[0]?.shareToken;

        return posts.map(post => ({
            id: post.id,
            content: post.content.substring(0, 150) + (post.content.length > 150 ? '...' : ''),
            title: post.title,
            category: post.category,
            isHidden: (post as any).isHidden,
            isQuestion: post.category === 'question',
            commentsCount: post._count.comments,
            likesCount: post._count.likes,
            viewCount: post.viewCount,
            shareToken: shareToken,
            createdAt: post.createdAt,
        }));
    }

    /**
     * Get single post details
     * GET /admin/posts/:id
     */
    @Get(':id')
    async getPost(@Param('id') id: string) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        publicProfile: {
                            select: { shareToken: true },
                        },
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });

        if (!post) {
            return { error: 'Post not found' };
        }

        return {
            id: post.id,
            content: post.content,
            title: post.title,
            category: post.category,
            topics: post.topics,
            hashtags: post.hashtags,
            images: post.images,
            tags: post.tags,
            isHidden: (post as any).isHidden,
            isQuestion: post.category === 'question',
            isAnswered: post.isAnswered,
            commentsCount: post._count.comments,
            likesCount: post._count.likes,
            viewCount: post.viewCount,
            shareCount: post.shareCount,
            shareToken: post.user.publicProfile?.shareToken,
            user: {
                id: post.user.id,
                username: post.user.username,
                name: `${post.user.firstName || ''} ${post.user.lastName || ''}`.trim() || post.user.username,
                avatar: post.user.avatar,
            },
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
    }

    /**
     * Hide/Unhide a post
     * PATCH /admin/posts/:id/hide
     */
    @Patch(':id/hide')
    async hidePost(
        @Param('id') id: string,
        @Body() dto: { hidden: boolean; reason?: string },
        @CurrentUser() admin: { userId: string },
        @Req() req: express.Request,
    ) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: { user: { select: { username: true } } },
        });

        if (!post) {
            return { error: 'Post not found' };
        }

        await this.prisma.post.update({
            where: { id },
            data: { isHidden: dto.hidden } as any,
        });

        // Log admin action
        await this.adminService.logAction({
            adminId: admin.userId,
            action: dto.hidden ? 'post_hidden' : 'post_unhidden',
            targetType: 'post',
            targetId: id,
            details: {
                reason: dto.reason,
                postContent: post.content.substring(0, 100),
                postAuthor: post.user.username,
            },
            ipAddress: req.ip,
        });

        // Send notification to post author when hidden
        if (dto.hidden) {
            const isQuestion = post.category === 'question';
            const contentType = isQuestion ? 'câu hỏi' : 'bài viết';
            await this.notificationService.createNotification({
                userId: post.userId,
                actorId: admin.userId,
                type: 'post_hidden',
                title: `🚫 ${isQuestion ? 'Câu hỏi' : 'Bài viết'} đã bị ẩn`,
                description: dto.reason
                    ? `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} của bạn đã bị ẩn. Lý do: ${dto.reason}`
                    : `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} của bạn đã bị ẩn do vi phạm quy định cộng đồng.`,
                postId: id,
                actionUrl: isQuestion ? `/community?tab=questions` : `/community`,
            });
        }

        return { success: true, isHidden: dto.hidden };
    }

    /**
     * Delete a post
     * DELETE /admin/posts/:id
     */
    @Delete(':id')
    async deletePost(
        @Param('id') id: string,
        @Body() dto: { reason?: string },
        @CurrentUser() admin: { userId: string },
        @Req() req: express.Request,
    ) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: { user: { select: { username: true } } },
        });

        if (!post) {
            return { error: 'Post not found' };
        }

        // Store post info for logging and notification before deletion
        const postInfo = {
            content: post.content.substring(0, 100),
            author: post.user.username,
            category: post.category,
            userId: post.userId,
        };

        const isQuestion = post.category === 'question';

        await this.prisma.post.delete({ where: { id } });

        // Log admin action
        await this.adminService.logAction({
            adminId: admin.userId,
            action: 'post_deleted',
            targetType: 'post',
            targetId: id,
            details: {
                reason: dto.reason,
                content: postInfo.content,
                author: postInfo.author,
                category: postInfo.category,
            },
            ipAddress: req.ip,
        });

        // Send notification to post author
        const contentType = isQuestion ? 'câu hỏi' : 'bài viết';
        await this.notificationService.createNotification({
            userId: postInfo.userId,
            actorId: admin.userId,
            type: 'post_deleted',
            title: `🗑️ ${isQuestion ? 'Câu hỏi' : 'Bài viết'} đã bị xóa`,
            description: dto.reason
                ? `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} của bạn đã bị xóa. Lý do: ${dto.reason}`
                : `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} của bạn đã bị xóa do vi phạm quy định cộng đồng.`,
            actionUrl: isQuestion ? `/community?tab=questions` : `/community`,
        });

        return { success: true };
    }
}
