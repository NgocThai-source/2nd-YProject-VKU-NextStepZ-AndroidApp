import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Log an admin action for audit trail
     */
    async logAction(data: {
        adminId: string;
        action: string;
        targetType: string;
        targetId: string;
        details?: Record<string, unknown>;
        ipAddress?: string;
    }) {
        return this.prisma.adminLog.create({
            data: {
                adminId: data.adminId,
                action: data.action,
                targetType: data.targetType,
                targetId: data.targetId,
                details: (data.details || null) as Prisma.InputJsonValue,
                ipAddress: data.ipAddress || null,
            },
        });
    }

    /**
     * Get admin logs with pagination
     */
    async getLogs(options: {
        page?: number;
        limit?: number;
        adminId?: string;
        action?: string;
        targetType?: string;
    }) {
        const page = Number(options.page) || 1;
        const limit = Number(options.limit) || 20;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};
        if (options.adminId) where.adminId = options.adminId;
        if (options.action) where.action = options.action;
        if (options.targetType) where.targetType = options.targetType;

        const [logs, total] = await Promise.all([
            this.prisma.adminLog.findMany({
                where,
                include: {
                    admin: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.adminLog.count({ where }),
        ]);

        return {
            logs: logs.map(log => ({
                id: log.id,
                action: log.action,
                targetType: log.targetType,
                targetId: log.targetId,
                details: log.details,
                ipAddress: log.ipAddress,
                createdAt: log.createdAt,
                admin: {
                    id: log.admin.id,
                    name: log.admin.firstName && log.admin.lastName
                        ? `${log.admin.firstName} ${log.admin.lastName}`
                        : log.admin.username,
                    email: log.admin.email,
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
}
