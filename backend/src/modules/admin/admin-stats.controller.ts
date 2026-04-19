import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';

@Controller('admin/stats')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminStatsController {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Get dashboard overview statistics
     * GET /admin/stats/overview
     */
    @Get('overview')
    async getOverview() {
        const [
            totalUsers,
            totalEmployers,
            totalAdmins,
            totalPosts,
            totalJobs,
            pendingJobs,
            verifiedEmployers,
            bannedUsers,
        ] = await Promise.all([
            this.prisma.user.count({ where: { role: 'user' } }),
            this.prisma.user.count({ where: { role: 'employer' } }),
            this.prisma.user.count({ where: { role: 'admin' } }),
            this.prisma.post.count(),
            this.prisma.companyJobPosting.count(),
            this.prisma.companyJobPosting.count({ where: { status: 'pending' } }),
            this.prisma.user.count({ where: { role: 'employer', isVerified: true } }),
            this.prisma.user.count({ where: { isBanned: true } }),
        ]);

        return {
            users: {
                total: totalUsers,
                role: 'student',
            },
            employers: {
                total: totalEmployers,
                verified: verifiedEmployers,
                pendingVerification: totalEmployers - verifiedEmployers,
            },
            admins: {
                total: totalAdmins,
            },
            posts: {
                total: totalPosts,
            },
            jobs: {
                total: totalJobs,
                pending: pendingJobs,
                approved: totalJobs - pendingJobs,
            },
            moderation: {
                bannedUsers,
                pendingJobApprovals: pendingJobs,
            },
        };
    }

    /**
     * Get user growth statistics
     * GET /admin/stats/users
     */
    @Get('users')
    async getUserStats() {
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const [
            totalUsers,
            usersLast30Days,
            usersLast7Days,
            usersToday,
            activeUsers,
        ] = await Promise.all([
            this.prisma.user.count({ where: { role: 'user' } }),
            this.prisma.user.count({
                where: { role: 'user', createdAt: { gte: last30Days } },
            }),
            this.prisma.user.count({
                where: { role: 'user', createdAt: { gte: last7Days } },
            }),
            this.prisma.user.count({
                where: { role: 'user', createdAt: { gte: today } },
            }),
            this.prisma.user.count({
                where: { role: 'user', isActive: true, isBanned: false },
            }),
        ]);

        return {
            total: totalUsers,
            active: activeUsers,
            growth: {
                last30Days: usersLast30Days,
                last7Days: usersLast7Days,
                today: usersToday,
            },
        };
    }

    /**
     * Get employer statistics
     * GET /admin/stats/employers
     */
    @Get('employers')
    async getEmployerStats() {
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            totalEmployers,
            verifiedEmployers,
            employersLast30Days,
            totalJobs,
            approvedJobs,
            pendingJobs,
        ] = await Promise.all([
            this.prisma.user.count({ where: { role: 'employer' } }),
            this.prisma.user.count({ where: { role: 'employer', isVerified: true } }),
            this.prisma.user.count({
                where: { role: 'employer', createdAt: { gte: last30Days } },
            }),
            this.prisma.companyJobPosting.count(),
            this.prisma.companyJobPosting.count({ where: { status: 'approved' } }),
            this.prisma.companyJobPosting.count({ where: { status: 'pending' } }),
        ]);

        return {
            total: totalEmployers,
            verified: verifiedEmployers,
            pending: totalEmployers - verifiedEmployers,
            newLast30Days: employersLast30Days,
            jobs: {
                total: totalJobs,
                approved: approvedJobs,
                pending: pendingJobs,
            },
        };
    }

    /**
     * Get community/content statistics
     * GET /admin/stats/content
     */
    @Get('content')
    async getContentStats() {
        const [
            totalPosts,
            totalQuestions,
            totalComments,
            totalLikes,
            totalMessages,
            totalConversations,
        ] = await Promise.all([
            this.prisma.post.count({ where: { category: { not: 'question' } } }),
            this.prisma.post.count({ where: { category: 'question' } }),
            this.prisma.comment.count(),
            this.prisma.like.count(),
            this.prisma.message.count(),
            this.prisma.conversation.count(),
        ]);

        return {
            posts: totalPosts,
            questions: totalQuestions,
            comments: totalComments,
            likes: totalLikes,
            messages: totalMessages,
            conversations: totalConversations,
        };
    }
}
