import { Controller, Get, Patch, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import { NotificationService } from '../notification/notification.service';
import { AdminQueryDto, BanUserDto } from './dto';
import * as express from 'express';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminUsersController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly adminService: AdminService,
        private readonly notificationService: NotificationService,
    ) { }

    /**
     * Get all students (role = 'user') with pagination and search
     * GET /admin/users
     */
    @Get()
    async getUsers(@Query() query: AdminQueryDto) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const { search, status } = query;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = { role: 'user' };

        // Search filter
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
                { school: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Status filter
        if (status === 'active') {
            where.isActive = true;
            where.isBanned = false;
        } else if (status === 'inactive') {
            where.isActive = false;
        } else if (status === 'banned') {
            where.isBanned = true;
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    avatar: true,
                    school: true,
                    major: true,
                    isActive: true,
                    isBanned: true,
                    bannedReason: true,
                    createdAt: true,
                    _count: {
                        select: {
                            posts: true,
                            comments: true,
                            likes: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            users: users.map(user => ({
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username,
                phone: user.phone,
                avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
                school: user.school,
                major: user.major,
                isActive: user.isActive,
                isBanned: user.isBanned,
                bannedReason: user.bannedReason,
                postsCount: user._count.posts,
                commentsCount: user._count.comments,
                likesCount: user._count.likes,
                createdAt: user.createdAt,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get single user details
     * GET /admin/users/:id
     */
    @Get(':id')
    async getUserDetail(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id, role: 'user' },
            include: {
                profile: true,
                portfolio: {
                    include: { projects: true },
                },
                posts: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        content: true,
                        category: true,
                        createdAt: true,
                        _count: { select: { likes: true, comments: true } },
                    },
                },
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
            return { error: 'Không tìm thấy người dùng' };
        }

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
            bio: user.bio,
            birthDate: user.birthDate,
            province: user.province,
            school: user.school,
            major: user.major,
            isActive: user.isActive,
            isBanned: user.isBanned,
            bannedAt: user.bannedAt,
            bannedReason: user.bannedReason,
            createdAt: user.createdAt,
            stats: {
                posts: user._count.posts,
                comments: user._count.comments,
                likes: user._count.likes,
                followers: user._count.followers,
                following: user._count.following,
            },
            recentPosts: user.posts.map(post => ({
                id: post.id,
                content: post.content.substring(0, 100),
                category: post.category,
                likes: post._count.likes,
                comments: post._count.comments,
                createdAt: post.createdAt,
            })),
        };
    }

    /**
     * Ban or unban a user
     * PATCH /admin/users/:id/ban
     */
    @Patch(':id/ban')
    async banUser(
        @Param('id') id: string,
        @Body() dto: BanUserDto,
        @CurrentUser() admin: { userId: string },
        @Req() req: express.Request,
    ) {
        const user = await this.prisma.user.findUnique({
            where: { id, role: 'user' },
        });

        if (!user) {
            return { error: 'Không tìm thấy người dùng' };
        }

        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                isBanned: dto.banned,
                bannedAt: dto.banned ? new Date() : null,
                bannedReason: dto.banned ? dto.reason : null,
                isActive: dto.banned ? false : true,
            },
        });

        // Log admin action
        await this.adminService.logAction({
            adminId: admin.userId,
            action: dto.banned ? 'user_banned' : 'user_unbanned',
            targetType: 'user',
            targetId: id,
            details: {
                reason: dto.reason,
                userName: user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username,
            },
            ipAddress: req.ip,
        });

        // Send notification to the user if banned
        if (dto.banned) {
            await this.notificationService.createNotification({
                userId: id,
                actorId: admin.userId,
                type: 'account_banned',
                title: '🚫 Tài khoản đã bị khóa',
                description: dto.reason
                    ? `Tài khoản của bạn đã bị khóa. Lý do: ${dto.reason}`
                    : 'Tài khoản của bạn đã bị khóa do vi phạm quy định.',
                actionUrl: '/banned',
            });
        }

        return {
            success: true,
            message: dto.banned ? 'Đã khóa tài khoản người dùng' : 'Đã mở khóa tài khoản người dùng',
            user: {
                id: updated.id,
                isBanned: updated.isBanned,
                isActive: updated.isActive,
            },
        };
    }

    /**
     * Activate or deactivate a user
     * PATCH /admin/users/:id/activate
     */
    @Patch(':id/activate')
    async activateUser(
        @Param('id') id: string,
        @Body() dto: { active: boolean },
        @CurrentUser() admin: { userId: string },
        @Req() req: express.Request,
    ) {
        const user = await this.prisma.user.findUnique({
            where: { id, role: 'user' },
        });

        if (!user) {
            return { error: 'Không tìm thấy người dùng' };
        }

        const updated = await this.prisma.user.update({
            where: { id },
            data: { isActive: dto.active },
        });

        // Log admin action
        await this.adminService.logAction({
            adminId: admin.userId,
            action: dto.active ? 'user_activated' : 'user_deactivated',
            targetType: 'user',
            targetId: id,
            details: {
                userName: user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username,
            },
            ipAddress: req.ip,
        });

        return {
            success: true,
            message: dto.active ? 'Đã kích hoạt tài khoản' : 'Đã vô hiệu hóa tài khoản',
            user: {
                id: updated.id,
                isActive: updated.isActive,
            },
        };
    }
}
