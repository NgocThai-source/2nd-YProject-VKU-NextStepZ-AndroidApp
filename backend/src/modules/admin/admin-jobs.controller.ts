import { Controller, Get, Patch, Delete, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import { NotificationService } from '../notification/notification.service';
import { AdminQueryDto, ApproveJobDto } from './dto';
import * as express from 'express';

@Controller('admin/jobs')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminJobsController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly adminService: AdminService,
        private readonly notificationService: NotificationService,
    ) { }

    /**
     * Get all job postings with pagination and filters
     * GET /admin/jobs
     */
    @Get()
    async getJobs(@Query() query: AdminQueryDto) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const { search, status } = query;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        // Search filter
        if (search) {
            where.OR = [
                { companyName: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Status filter
        if (status === 'pending') {
            where.status = 'pending';
        } else if (status === 'approved') {
            where.status = 'approved';
        } else if (status === 'rejected') {
            where.status = 'rejected';
        }

        const [jobs, total] = await Promise.all([
            this.prisma.companyJobPosting.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            companyName: true,
                            isVerified: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.companyJobPosting.count({ where }),
        ]);

        return {
            jobs: jobs.map(job => ({
                id: job.id,
                companyName: job.companyName,
                companyLogo: job.companyLogo,
                address: job.address,
                description: job.description?.substring(0, 100),
                status: job.status,
                isActive: job.isActive,
                viewCount: job.viewCount,
                positions: job.jobPositions,
                createdAt: job.createdAt,
                employer: {
                    id: job.user.id,
                    email: job.user.email,
                    companyName: job.user.companyName,
                    isVerified: job.user.isVerified,
                },
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
     * Get pending jobs that need approval
     * GET /admin/jobs/pending
     */
    @Get('pending')
    async getPendingJobs(@Query() query: AdminQueryDto) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;

        const where = { status: 'pending' };

        const [jobs, total] = await Promise.all([
            this.prisma.companyJobPosting.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            companyName: true,
                            isVerified: true,
                            createdAt: true,
                            _count: {
                                select: { companyJobPostings: true },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'asc' }, // Oldest first
                skip,
                take: limit,
            }),
            this.prisma.companyJobPosting.count({ where }),
        ]);

        return {
            jobs: jobs.map(job => ({
                id: job.id,
                companyName: job.companyName,
                companyLogo: job.companyLogo,
                description: job.description,
                address: job.address,
                positions: job.jobPositions,
                tags: job.tags,
                createdAt: job.createdAt,
                employer: {
                    id: job.user.id,
                    email: job.user.email,
                    companyName: job.user.companyName,
                    isVerified: job.user.isVerified,
                    totalJobs: job.user._count.companyJobPostings,
                    memberSince: job.user.createdAt,
                },
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
     * Get single job posting details
     * GET /admin/jobs/:id
     */
    @Get(':id')
    async getJobDetail(@Param('id') id: string) {
        const job = await this.prisma.companyJobPosting.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        companyName: true,
                        phone: true,
                        isVerified: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!job) {
            return { error: 'Không tìm thấy tin tuyển dụng' };
        }

        return {
            id: job.id,
            companyName: job.companyName,
            companyLogo: job.companyLogo,
            description: job.description,
            mission: job.mission,
            vision: job.vision,
            address: job.address,
            phone: job.phone,
            email: job.email,
            website: job.website,
            positions: job.jobPositions,
            tags: job.tags,
            workingHours: job.workingHours,
            offDays: job.offDays,
            vacationDays: job.vacationDays,
            insurances: job.insurances,
            benefits: job.benefits,
            galleryImages: job.galleryImages,
            status: job.status,
            isActive: job.isActive,
            viewCount: job.viewCount,
            approvedAt: job.approvedAt,
            rejectionReason: job.rejectionReason,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
            employer: {
                id: job.user.id,
                email: job.user.email,
                companyName: job.user.companyName,
                phone: job.user.phone,
                isVerified: job.user.isVerified,
                memberSince: job.user.createdAt,
            },
        };
    }

    /**
     * Approve or reject a job posting
     * PATCH /admin/jobs/:id/approve
     */
    @Patch(':id/approve')
    async approveJob(
        @Param('id') id: string,
        @Body() dto: ApproveJobDto,
        @CurrentUser() admin: { userId: string },
        @Req() req: express.Request,
    ) {
        const job = await this.prisma.companyJobPosting.findUnique({
            where: { id },
            include: {
                user: { select: { companyName: true } },
            },
        });

        if (!job) {
            return { error: 'Không tìm thấy tin tuyển dụng' };
        }

        const updated = await this.prisma.companyJobPosting.update({
            where: { id },
            data: {
                status: dto.approved ? 'approved' : 'rejected',
                approvedAt: dto.approved ? new Date() : null,
                approvedById: dto.approved ? admin.userId : null,
                rejectionReason: dto.approved ? null : dto.rejectionReason,
                isActive: dto.approved ? true : false,
            },
        });

        // Log admin action
        await this.adminService.logAction({
            adminId: admin.userId,
            action: dto.approved ? 'job_approved' : 'job_rejected',
            targetType: 'job_posting',
            targetId: id,
            details: {
                companyName: job.companyName,
                rejectionReason: dto.rejectionReason,
            },
            ipAddress: req.ip,
        });

        // Send notification to employer
        await this.notificationService.createNotification({
            userId: job.userId,
            actorId: admin.userId,
            type: dto.approved ? 'job_approved' : 'job_rejected',
            title: dto.approved
                ? '✅ Tin tuyển dụng đã được duyệt'
                : '❌ Tin tuyển dụng bị từ chối',
            description: dto.approved
                ? `Tin tuyển dụng "${job.companyName}" của bạn đã được duyệt và hiển thị trên hệ thống.`
                : dto.rejectionReason
                    ? `Tin tuyển dụng "${job.companyName}" bị từ chối. Lý do: ${dto.rejectionReason}`
                    : `Tin tuyển dụng "${job.companyName}" bị từ chối. Vui lòng kiểm tra lại nội dung.`,
            actionUrl: '/companies',
        });

        return {
            success: true,
            message: dto.approved
                ? 'Đã duyệt tin tuyển dụng'
                : 'Đã từ chối tin tuyển dụng',
            job: {
                id: updated.id,
                status: updated.status,
                isActive: updated.isActive,
            },
        };
    }

    /**
     * Delete a job posting
     * DELETE /admin/jobs/:id
     */
    @Delete(':id')
    async deleteJob(
        @Param('id') id: string,
        @CurrentUser() admin: { userId: string },
        @Req() req: express.Request,
    ) {
        const job = await this.prisma.companyJobPosting.findUnique({
            where: { id },
        });

        if (!job) {
            return { error: 'Không tìm thấy tin tuyển dụng' };
        }

        // Store job info for notification before deletion
        const jobInfo = {
            userId: job.userId,
            companyName: job.companyName,
        };

        await this.prisma.companyJobPosting.delete({ where: { id } });

        // Log admin action
        await this.adminService.logAction({
            adminId: admin.userId,
            action: 'job_deleted',
            targetType: 'job_posting',
            targetId: id,
            details: {
                companyName: job.companyName,
            },
            ipAddress: req.ip,
        });

        // Send notification to employer
        await this.notificationService.createNotification({
            userId: jobInfo.userId,
            actorId: admin.userId,
            type: 'job_deleted',
            title: '🗑️ Tin tuyển dụng đã bị xóa',
            description: `Tin tuyển dụng "${jobInfo.companyName}" đã bị xóa bởi quản trị viên do vi phạm quy định.`,
            actionUrl: '/companies',
        });

        return {
            success: true,
            message: 'Đã xóa tin tuyển dụng',
        };
    }

    /**
     * Hide/Unhide a job posting
     * PATCH /admin/jobs/:id/toggle-visibility
     */
    @Patch(':id/toggle-visibility')
    async toggleJobVisibility(
        @Param('id') id: string,
        @Body() dto: { isActive: boolean; reason?: string },
        @CurrentUser() admin: { userId: string },
        @Req() req: express.Request,
    ) {
        const job = await this.prisma.companyJobPosting.findUnique({
            where: { id },
        });

        if (!job) {
            return { error: 'Không tìm thấy tin tuyển dụng' };
        }

        const updated = await this.prisma.companyJobPosting.update({
            where: { id },
            data: { isActive: dto.isActive },
        });

        // Log admin action
        await this.adminService.logAction({
            adminId: admin.userId,
            action: dto.isActive ? 'job_unhidden' : 'job_hidden',
            targetType: 'job_posting',
            targetId: id,
            details: {
                companyName: job.companyName,
                reason: dto.reason,
            },
            ipAddress: req.ip,
        });

        // Send notification to employer
        await this.notificationService.createNotification({
            userId: job.userId,
            actorId: admin.userId,
            type: dto.isActive ? 'job_approved' : 'job_rejected',
            title: dto.isActive
                ? '👁️ Tin tuyển dụng đã được hiển thị lại'
                : '🚫 Tin tuyển dụng đã bị ẩn',
            description: dto.isActive
                ? `Tin tuyển dụng "${job.companyName}" đã được hiển thị lại trên hệ thống.`
                : dto.reason
                    ? `Tin tuyển dụng "${job.companyName}" đã bị ẩn. Lý do: ${dto.reason}`
                    : `Tin tuyển dụng "${job.companyName}" đã bị ẩn bởi quản trị viên.`,
            actionUrl: '/companies',
        });

        return {
            success: true,
            isActive: updated.isActive,
            message: dto.isActive ? 'Đã hiển thị tin tuyển dụng' : 'Đã ẩn tin tuyển dụng',
        };
    }
}
