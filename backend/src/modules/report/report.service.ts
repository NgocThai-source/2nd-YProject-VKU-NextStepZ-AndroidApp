import { Injectable, BadRequestException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReportDto } from './dto';
import { MessagingGateway } from '../messaging/messaging.gateway';

@Injectable()
export class ReportService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(forwardRef(() => MessagingGateway))
        private readonly messagingGateway: MessagingGateway,
    ) { }

    async createReport(reporterId: string, dto: CreateReportDto) {
        // Validate that the target exists
        await this.validateTarget(dto.targetType, dto.targetId);

        // Check if user already reported this target
        const existingReport = await (this.prisma as any).report.findFirst({
            where: {
                reporterId,
                targetType: dto.targetType,
                targetId: dto.targetId,
                status: { in: ['pending', 'reviewed'] },
            },
        });

        if (existingReport) {
            throw new BadRequestException('Bạn đã báo cáo nội dung này trước đó');
        }

        // Get reporter info
        const reporter = await this.prisma.user.findUnique({
            where: { id: reporterId },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
            },
        });

        // Create the report
        const report = await (this.prisma as any).report.create({
            data: {
                reporterId,
                targetType: dto.targetType,
                targetId: dto.targetId,
                reason: dto.reason,
                description: dto.description,
            },
        });

        // Get target info for the broadcast
        let targetInfo: any = null;
        try {
            targetInfo = await this.getTargetInfo(dto.targetType, dto.targetId);
        } catch (e) {
            console.error('Failed to get target info:', e);
        }

        // Broadcast to admin dashboard for real-time updates
        try {
            this.messagingGateway.broadcastNewReport({
                ...report,
                reporter,
                targetInfo,
            });
        } catch (error) {
            console.error('Failed to broadcast new report:', error);
        }

        return {
            success: true,
            message: 'Báo cáo đã được gửi thành công',
            reportId: report.id,
        };
    }

    private async getTargetInfo(targetType: string, targetId: string) {
        switch (targetType) {
            case 'post':
            case 'question':
                return await this.prisma.post.findUnique({
                    where: { id: targetId },
                    select: {
                        id: true,
                        content: true,
                        title: true,
                        category: true,
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
            case 'job_posting':
                return await this.prisma.companyJobPosting.findUnique({
                    where: { id: targetId },
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
            case 'profile':
                return await this.prisma.user.findUnique({
                    where: { id: targetId },
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
            default:
                return null;
        }
    }

    private async validateTarget(targetType: string, targetId: string) {
        let exists = false;

        switch (targetType) {
            case 'post':
            case 'question':
                const post = await this.prisma.post.findUnique({
                    where: { id: targetId },
                });
                exists = !!post;
                break;
            case 'job_posting':
                const job = await this.prisma.companyJobPosting.findUnique({
                    where: { id: targetId },
                });
                exists = !!job;
                break;
            case 'profile':
                const user = await this.prisma.user.findUnique({
                    where: { id: targetId },
                });
                exists = !!user;
                break;
        }

        if (!exists) {
            throw new NotFoundException('Nội dung được báo cáo không tồn tại');
        }
    }
}
