import { Controller, Get, Patch, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import { NotificationService } from '../notification/notification.service';
import * as express from 'express';

@Controller('admin/reports')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminReportsController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly adminService: AdminService,
        private readonly notificationService: NotificationService,
    ) { }

    @Get()
    async getReports(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
        @Query('targetType') targetType?: string,
        @Query('status') status?: string,
        @Query('search') search?: string,
    ) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};

        if (targetType && targetType !== 'all') {
            where.targetType = targetType;
        }

        if (status && status !== 'all') {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { reason: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [reports, total] = await Promise.all([
            this.prisma.report.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
            }),
            this.prisma.report.count({ where }),
        ]);

        // Enrich reports with target and reporter info
        const enrichedReports = await Promise.all(
            reports.map(async (report) => {
                const reporter = await this.prisma.user.findUnique({
                    where: { id: report.reporterId },
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                });

                let targetInfo: any = null;
                switch (report.targetType) {
                    case 'post':
                    case 'question':
                        const post = await this.prisma.post.findUnique({
                            where: { id: report.targetId },
                            select: {
                                id: true,
                                content: true,
                                title: true,
                                category: true,
                                isHidden: true,
                                user: {
                                    select: {
                                        id: true,
                                        username: true,
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        });
                        targetInfo = post;
                        break;
                    case 'job_posting':
                        const job = await this.prisma.companyJobPosting.findUnique({
                            where: { id: report.targetId },
                            select: {
                                id: true,
                                companyName: true,
                                description: true,
                                isActive: true,
                                user: {
                                    select: {
                                        id: true,
                                        username: true,
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        });
                        targetInfo = job;
                        break;
                    case 'profile':
                        const user = await this.prisma.user.findUnique({
                            where: { id: report.targetId },
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                avatar: true,
                                isBanned: true,
                                role: true,
                            },
                        });
                        targetInfo = user;
                        break;
                }

                return {
                    ...report,
                    reporter,
                    targetInfo,
                };
            }),
        );

        return {
            reports: enrichedReports,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        };
    }

    @Get(':id')
    async getReportDetail(@Param('id') id: string) {
        const report = await this.prisma.report.findUnique({
            where: { id },
        });

        if (!report) {
            return { error: 'Report not found' };
        }

        // Get reporter info
        const reporter = await this.prisma.user.findUnique({
            where: { id: report.reporterId },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                email: true,
            },
        });

        // Get target info based on type
        let targetInfo: any = null;
        switch (report.targetType) {
            case 'post':
            case 'question':
                targetInfo = await this.prisma.post.findUnique({
                    where: { id: report.targetId },
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
                break;
            case 'job_posting':
                targetInfo = await this.prisma.companyJobPosting.findUnique({
                    where: { id: report.targetId },
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
                    },
                });
                break;
            case 'profile':
                targetInfo = await this.prisma.user.findUnique({
                    where: { id: report.targetId },
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        isBanned: true,
                        bannedReason: true,
                        role: true,
                        createdAt: true,
                    },
                });
                break;
        }

        // Get reviewer info if reviewed
        let reviewer: { id: string; username: string; firstName: string | null; lastName: string | null } | null = null;
        if (report.reviewedById) {
            reviewer = await this.prisma.user.findUnique({
                where: { id: report.reviewedById },
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                },
            });
        }

        return {
            ...report,
            reporter,
            targetInfo,
            reviewer,
        };
    }

    @Patch(':id/action')
    async takeAction(
        @Param('id') id: string,
        @Body() dto: { action: 'hide' | 'delete' | 'ban'; reason?: string },
        @CurrentUser() admin: { userId: string },
        @Req() req: express.Request,
    ) {
        const report = await this.prisma.report.findUnique({
            where: { id },
        });

        if (!report) {
            return { error: 'Report not found' };
        }

        let actionResult: any = { success: false };

        // Perform action based on target type
        switch (report.targetType) {
            case 'post':
            case 'question':
                if (dto.action === 'hide') {
                    await this.prisma.post.update({
                        where: { id: report.targetId },
                        data: { isHidden: true },
                    });
                    actionResult = { success: true, action: 'hidden' };
                } else if (dto.action === 'delete') {
                    await this.prisma.post.delete({
                        where: { id: report.targetId },
                    });
                    actionResult = { success: true, action: 'deleted' };
                }
                break;

            case 'job_posting':
                if (dto.action === 'hide') {
                    await this.prisma.companyJobPosting.update({
                        where: { id: report.targetId },
                        data: { isActive: false },
                    });
                    actionResult = { success: true, action: 'hidden' };
                } else if (dto.action === 'delete') {
                    await this.prisma.companyJobPosting.delete({
                        where: { id: report.targetId },
                    });
                    actionResult = { success: true, action: 'deleted' };
                }
                break;

            case 'profile':
                if (dto.action === 'ban') {
                    await this.prisma.user.update({
                        where: { id: report.targetId },
                        data: {
                            isBanned: true,
                            bannedAt: new Date(),
                            bannedReason: dto.reason || 'Vi phạm quy định cộng đồng',
                        },
                    });
                    actionResult = { success: true, action: 'banned' };
                }
                break;
        }

        if (actionResult.success) {
            // Update report status
            await this.prisma.report.update({
                where: { id },
                data: {
                    status: 'resolved',
                    reviewedById: admin.userId,
                    reviewedAt: new Date(),
                    actionTaken: actionResult.action,
                    adminNotes: dto.reason,
                },
            });

            // Also resolve other pending reports for the same target
            await this.prisma.report.updateMany({
                where: {
                    targetType: report.targetType,
                    targetId: report.targetId,
                    status: 'pending',
                    id: { not: id },
                },
                data: {
                    status: 'resolved',
                    reviewedById: admin.userId,
                    reviewedAt: new Date(),
                    actionTaken: actionResult.action,
                    adminNotes: 'Auto-resolved: Action taken on another report',
                },
            });

            // Log the action
            await this.adminService.logAction({
                adminId: admin.userId,
                action: `report_${dto.action}`,
                targetType: report.targetType,
                targetId: report.targetId,
                details: { reportId: id, reason: dto.reason },
                ipAddress: req.ip,
            });

            // Send notification to reporter
            const targetTypeLabels: Record<string, string> = {
                post: 'bài viết',
                question: 'câu hỏi',
                job_posting: 'tin tuyển dụng',
                profile: 'hồ sơ',
            };
            const actionLabels: Record<string, string> = {
                hidden: 'đã được ẩn',
                deleted: 'đã bị xóa',
                banned: 'đã bị khóa',
            };

            await this.notificationService.createNotification({
                userId: report.reporterId,
                actorId: admin.userId,
                type: 'report_resolved',
                title: '✅ Báo cáo của bạn đã được xử lý',
                description: `${targetTypeLabels[report.targetType] || 'Nội dung'} bạn báo cáo ${actionLabels[actionResult.action] || 'đã được xử lý'}. Cảm ơn bạn đã đóng góp cho cộng đồng!`,
                actionUrl: '/community',
            });
        }

        return actionResult;
    }

    @Patch(':id/dismiss')
    async dismissReport(
        @Param('id') id: string,
        @Body() dto: { reason?: string },
        @CurrentUser() admin: { userId: string },
        @Req() req: express.Request,
    ) {
        const report = await this.prisma.report.findUnique({
            where: { id },
        });

        if (!report) {
            return { error: 'Report not found' };
        }

        await this.prisma.report.update({
            where: { id },
            data: {
                status: 'dismissed',
                reviewedById: admin.userId,
                reviewedAt: new Date(),
                actionTaken: 'none',
                adminNotes: dto.reason || 'Dismissed by admin',
            },
        });

        // Log the action
        await this.adminService.logAction({
            adminId: admin.userId,
            action: 'report_dismissed',
            targetType: 'report',
            targetId: id,
            details: { reason: dto.reason },
            ipAddress: req.ip,
        });

        // Send notification to reporter
        await this.notificationService.createNotification({
            userId: report.reporterId,
            actorId: admin.userId,
            type: 'report_dismissed',
            title: 'ℹ️ Báo cáo của bạn đã được xem xét',
            description: dto.reason
                ? `Báo cáo của bạn đã được xem xét. Ghi chú: ${dto.reason}`
                : 'Báo cáo của bạn đã được xem xét. Sau khi kiểm tra, chúng tôi nhận thấy nội dung không vi phạm quy định.',
            actionUrl: '/community',
        });

        return { success: true, message: 'Report dismissed' };
    }

    @Patch(':id/review')
    async markAsReviewed(
        @Param('id') id: string,
        @CurrentUser() admin: { userId: string },
    ) {
        const report = await this.prisma.report.findUnique({
            where: { id },
        });

        if (!report) {
            return { error: 'Report not found' };
        }

        await this.prisma.report.update({
            where: { id },
            data: {
                status: 'reviewed',
                reviewedById: admin.userId,
                reviewedAt: new Date(),
            },
        });

        return { success: true, message: 'Report marked as reviewed' };
    }

    @Get('stats/summary')
    async getReportStats() {
        const [pending, reviewed, resolved, dismissed] = await Promise.all([
            this.prisma.report.count({ where: { status: 'pending' } }),
            this.prisma.report.count({ where: { status: 'reviewed' } }),
            this.prisma.report.count({ where: { status: 'resolved' } }),
            this.prisma.report.count({ where: { status: 'dismissed' } }),
        ]);

        const [posts, questions, jobs, profiles] = await Promise.all([
            this.prisma.report.count({ where: { targetType: 'post', status: 'pending' } }),
            this.prisma.report.count({ where: { targetType: 'question', status: 'pending' } }),
            this.prisma.report.count({ where: { targetType: 'job_posting', status: 'pending' } }),
            this.prisma.report.count({ where: { targetType: 'profile', status: 'pending' } }),
        ]);

        return {
            byStatus: { pending, reviewed, resolved, dismissed },
            byType: { posts, questions, jobs, profiles },
            total: pending + reviewed + resolved + dismissed,
        };
    }
}
