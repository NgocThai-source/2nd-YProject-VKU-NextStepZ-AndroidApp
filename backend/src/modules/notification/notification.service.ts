import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MessagingGateway } from '../messaging/messaging.gateway';

export interface CreateNotificationDto {
    userId: string;      // User who receives the notification
    actorId: string;     // User who triggered the notification
    type: 'follow' | 'post_like' | 'post_comment' | 'question_like' | 'question_comment' | 'comment_like' | 'employer_verified' | 'employer_unverified' | 'account_banned' | 'post_hidden' | 'post_deleted' | 'job_approved' | 'job_rejected' | 'job_deleted' | 'report_resolved' | 'report_dismissed';
    title: string;
    description: string;
    postId?: string;     // Optional reference to post/question
    actionUrl?: string;
}

@Injectable()
export class NotificationService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => MessagingGateway))
        private messagingGateway: MessagingGateway,
    ) { }

    /**
     * Create a new notification
     */
    async createNotification(data: CreateNotificationDto) {
        // Don't create notification if user is notifying themselves
        if (data.userId === data.actorId) {
            return null;
        }

        // Create notification in database
        const notification = await this.prisma.notification.create({
            data: {
                userId: data.userId,
                actorId: data.actorId,
                type: data.type,
                title: data.title,
                description: data.description,
                postId: data.postId,
                actionUrl: data.actionUrl,
            },
            include: {
                actor: {
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

        // Broadcast notification via WebSocket for real-time updates
        try {
            const transformedNotification = this.transformNotification(notification);
            this.messagingGateway.broadcastNotification(data.userId, transformedNotification);
        } catch (error) {
            // Don't fail if WebSocket broadcast fails
            console.error('Failed to broadcast notification:', error);
        }

        return notification;
    }

    /**
     * Get notifications for a user with pagination
     */
    async getNotifications(userId: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [notifications, total] = await Promise.all([
            this.prisma.notification.findMany({
                where: { userId },
                include: {
                    actor: {
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
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.notification.count({ where: { userId } }),
        ]);

        return {
            notifications: notifications.map((n) => this.transformNotification(n)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get unread notification count
     */
    async getUnreadCount(userId: string): Promise<number> {
        return this.prisma.notification.count({
            where: { userId, read: false },
        });
    }

    /**
     * Mark a single notification as read
     */
    async markAsRead(notificationId: string, userId: string) {
        const notification = await this.prisma.notification.findFirst({
            where: { id: notificationId, userId },
        });

        if (!notification) {
            return null;
        }

        return this.prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: string) {
        await this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });

        return { message: 'Đã đánh dấu tất cả thông báo là đã đọc' };
    }

    /**
     * Delete a notification
     */
    async deleteNotification(notificationId: string, userId: string) {
        const notification = await this.prisma.notification.findFirst({
            where: { id: notificationId, userId },
        });

        if (!notification) {
            return null;
        }

        await this.prisma.notification.delete({
            where: { id: notificationId },
        });

        return { message: 'Đã xóa thông báo' };
    }

    /**
     * Transform notification to API response format
     */
    private transformNotification(notification: any) {
        const actor = notification.actor;
        const actorName = actor.role === 'employer'
            ? actor.companyName || actor.username
            : actor.firstName && actor.lastName
                ? `${actor.firstName} ${actor.lastName}`
                : actor.username;

        return {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            description: notification.description,
            read: notification.read,
            actionUrl: notification.actionUrl,
            createdAt: notification.createdAt,
            actor: {
                id: actor.id,
                name: actorName,
                avatar: actor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${actor.id}`,
            },
        };
    }

    /**
     * Delete all notifications for a user
     */
    async deleteAllNotifications(userId: string) {
        const result = await this.prisma.notification.deleteMany({
            where: { userId },
        });

        return {
            message: 'Đã xóa tất cả thông báo',
            count: result.count,
        };
    }
}

