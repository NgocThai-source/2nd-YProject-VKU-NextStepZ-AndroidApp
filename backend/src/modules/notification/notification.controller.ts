import { Controller, Get, Patch, Delete, Param, Query, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    /**
     * Get notifications for the current user
     */
    @Get()
    async getNotifications(
        @Req() req: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const userId = req.user.userId;
        return this.notificationService.getNotifications(
            userId,
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 20,
        );
    }

    /**
     * Get unread notification count
     */
    @Get('unread-count')
    async getUnreadCount(@Req() req: any) {
        const userId = req.user.userId;
        const count = await this.notificationService.getUnreadCount(userId);
        return { unreadCount: count };
    }

    /**
     * Mark a single notification as read
     */
    @Patch(':id/read')
    async markAsRead(@Req() req: any, @Param('id') notificationId: string) {
        const userId = req.user.userId;
        const result = await this.notificationService.markAsRead(notificationId, userId);
        if (!result) {
            return { error: 'Notification not found' };
        }
        return { message: 'Đã đánh dấu là đã đọc' };
    }

    /**
     * Mark all notifications as read
     */
    @Patch('read-all')
    async markAllAsRead(@Req() req: any) {
        const userId = req.user.userId;
        return this.notificationService.markAllAsRead(userId);
    }

    /**
     * Delete all notifications for the current user
     */
    @Delete('clear-all')
    async clearAllNotifications(@Req() req: any) {
        const userId = req.user.userId;
        return this.notificationService.deleteAllNotifications(userId);
    }
}

