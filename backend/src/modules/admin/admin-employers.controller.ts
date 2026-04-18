import { Controller, Get, Patch, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import { NotificationService } from '../notification/notification.service';
import { AdminQueryDto, VerifyEmployerDto, BanUserDto } from './dto';
import * as express from 'express';

@Controller('admin/employers')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminEmployersController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly adminService: AdminService,
        private readonly notificationService: NotificationService,
    ) { }

    /**
     * Get all employers (role = 'employer') with pagination and search
     * GET /admin/employers
     */
    @Get()
    async getEmployers(@Query() query: AdminQueryDto) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const { search, status } = query;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = { role: 'employer' };

        // Search filter
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { companyName: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
            ];
        }

        // Status filter
        if (status === 'verified') {
            where.isVerified = true;
        } else if (status === 'pending') {
            where.isVerified = false;
            where.isBanned = false;
        } else if (status === 'banned') {
            where.isBanned = true;
        }

        const [employers, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    username: true,
                    companyName: true,
                    phone: true,
                    avatar: true,
                    website: true,
                    address: true,
                    taxId: true,
                    isActive: true,
                    isVerified: true,
                    verifiedAt: true,
                    isBanned: true,
                    bannedReason: true,
                    createdAt: true,
                    _count: {
                        select: {
                            companyJobPostings: true,
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
            employers: employers.map(emp => ({
                id: emp.id,
                email: emp.email,
                username: emp.username,
                companyName: emp.companyName || emp.username,
                phone: emp.phone,
                avatar: emp.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${emp.companyName || emp.username}`,
                website: emp.website,
                address: emp.address,
                taxId: emp.taxId,
                isActive: emp.isActive,
                isVerified: emp.isVerified,
                verifiedAt: emp.verifiedAt,
                isBanned: emp.isBanned,
                bannedReason: emp.bannedReason,
                jobPostingsCount: emp._count.companyJobPostings,
                createdAt: emp.createdAt,
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
     * Get single employer details with job postings
     * GET /admin/employers/:id
     */
    @Get(':id')
    async getEmployerDetail(@Param('id') id: string) {
        const employer = await this.prisma.user.findUnique({
            where: { id, role: 'employer' },
            include: {
                companyJobPostings: {
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        companyName: true,
                        status: true,
                        isActive: true,
                        viewCount: true,
                        createdAt: true,
                        jobPositions: true,
                    },
                },
                profile: {
                    include: {
                        employerProfile: true,
                    },
                },
            },
        });

        if (!employer) {
            return { error: 'Không tìm thấy nhà tuyển dụng' };
        }

        return {
            id: employer.id,
            email: employer.email,
            username: employer.username,
            companyName: employer.companyName || employer.username,
            phone: employer.phone,
            avatar: employer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${employer.companyName || employer.username}`,
            website: employer.website,
            address: employer.address,
            taxId: employer.taxId,
            isActive: employer.isActive,
            isVerified: employer.isVerified,
            verifiedAt: employer.verifiedAt,
            verifiedById: employer.verifiedById,
            isBanned: employer.isBanned,
            bannedAt: employer.bannedAt,
            bannedReason: employer.bannedReason,
            createdAt: employer.createdAt,
            employerProfile: employer.profile?.employerProfile || null,
            jobPostings: employer.companyJobPostings.map(job => ({
                id: job.id,
                companyName: job.companyName,
                status: job.status,
                isActive: job.isActive,
                viewCount: job.viewCount,
                positions: job.jobPositions,
                createdAt: job.createdAt,
            })),
            stats: {
                totalJobs: employer.companyJobPostings.length,
                approvedJobs: employer.companyJobPostings.filter(j => j.status === 'approved').length,
                pendingJobs: employer.companyJobPostings.filter(j => j.status === 'pending').length,
                rejectedJobs: employer.companyJobPostings.filter(j => j.status === 'rejected').length,
            },
        };
    }

    /**
     * Verify or revoke verification for an employer
     * PATCH /admin/employers/:id/verify
     */
    @Patch(':id/verify')
    async verifyEmployer(
        @Param('id') id: string,
        @Body() dto: VerifyEmployerDto,
        @CurrentUser() admin: { userId: string },
        @Req() req: express.Request,
    ) {
        const employer = await this.prisma.user.findUnique({
            where: { id, role: 'employer' },
        });

        if (!employer) {
            return { error: 'Không tìm thấy nhà tuyển dụng' };
        }

        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                isVerified: dto.verified,
                verifiedAt: dto.verified ? new Date() : null,
                verifiedById: dto.verified ? admin.userId : null,
            },
        });

        // Log admin action
        await this.adminService.logAction({
            adminId: admin.userId,
            action: dto.verified ? 'employer_verified' : 'employer_verification_revoked',
            targetType: 'employer',
            targetId: id,
            details: {
                companyName: employer.companyName,
                reason: dto.reason,
            },
            ipAddress: req.ip,
        });

        // Send notification to the employer
        await this.notificationService.createNotification({
            userId: id,
            actorId: admin.userId,
            type: dto.verified ? 'employer_verified' : 'employer_unverified',
            title: dto.verified
                ? '✅ Tài khoản đã được xác minh'
                : '⚠️ Xác minh tài khoản đã bị thu hồi',
            description: dto.verified
                ? 'Chúc mừng! Tài khoản nhà tuyển dụng của bạn đã được xác minh. Bạn có thể đăng tin tuyển dụng ngay bây giờ.'
                : dto.reason
                    ? `Xác minh tài khoản đã bị thu hồi. Lý do: ${dto.reason}`
                    : 'Xác minh tài khoản của bạn đã bị thu hồi.',
            actionUrl: '/profile',
        });

        return {
            success: true,
            message: dto.verified
                ? 'Đã xác minh nhà tuyển dụng'
                : 'Đã thu hồi xác minh nhà tuyển dụng',
            employer: {
                id: updated.id,
                isVerified: updated.isVerified,
                verifiedAt: updated.verifiedAt,
            },
        };
    }

    /**
     * Ban or unban an employer
     * PATCH /admin/employers/:id/ban
     */
    @Patch(':id/ban')
    async banEmployer(
        @Param('id') id: string,
        @Body() dto: BanUserDto,
        @CurrentUser() admin: { userId: string },
        @Req() req: express.Request,
    ) {
        const employer = await this.prisma.user.findUnique({
            where: { id, role: 'employer' },
        });

        if (!employer) {
            return { error: 'Không tìm thấy nhà tuyển dụng' };
        }

        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                isBanned: dto.banned,
                bannedAt: dto.banned ? new Date() : null,
                bannedReason: dto.banned ? dto.reason : null,
                isActive: dto.banned ? false : true,
                // If banned, also revoke verification
                isVerified: dto.banned ? false : employer.isVerified,
            },
        });

        // Log admin action
        await this.adminService.logAction({
            adminId: admin.userId,
            action: dto.banned ? 'employer_banned' : 'employer_unbanned',
            targetType: 'employer',
            targetId: id,
            details: {
                companyName: employer.companyName,
                reason: dto.reason,
            },
            ipAddress: req.ip,
        });

        // Send notification to the employer if banned
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
            message: dto.banned
                ? 'Đã khóa tài khoản nhà tuyển dụng'
                : 'Đã mở khóa tài khoản nhà tuyển dụng',
            employer: {
                id: updated.id,
                isBanned: updated.isBanned,
                isActive: updated.isActive,
            },
        };
    }
}
