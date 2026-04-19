import { Injectable, BadRequestException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class FollowService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => NotificationService))
        private notificationService: NotificationService,
    ) { }

    /**
     * Follow a user
     * @param followerId - The user who wants to follow
     * @param followingId - The user to be followed
     */
    async followUser(followerId: string, followingId: string) {
        // Prevent self-following
        if (followerId === followingId) {
            throw new BadRequestException('Không thể tự theo dõi chính mình');
        }

        // Check if target user exists and get follower info for notification
        const [targetUser, follower] = await Promise.all([
            this.prisma.user.findUnique({
                where: { id: followingId },
            }),
            this.prisma.user.findUnique({
                where: { id: followerId },
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    companyName: true,
                },
            }),
        ]);

        if (!targetUser) {
            throw new NotFoundException('Người dùng không tồn tại');
        }

        // Check if already following
        const existingFollow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        if (existingFollow) {
            throw new BadRequestException('Bạn đã theo dõi người dùng này rồi');
        }

        // Create follow relationship
        const follow = await this.prisma.follow.create({
            data: {
                followerId,
                followingId,
            },
        });

        // Create notification for the followed user
        if (follower) {
            const followerName = follower.role === 'employer'
                ? follower.companyName || follower.username
                : follower.firstName && follower.lastName
                    ? `${follower.firstName} ${follower.lastName}`
                    : follower.username;

            // Get follower's public profile share token
            const followerPublicProfile = await this.prisma.publicProfile.findUnique({
                where: { userId: followerId },
                select: { shareToken: true },
            });

            const actionUrl = followerPublicProfile
                ? `/public-profile/${followerPublicProfile.shareToken}`
                : `/public-profile/${followerId}`;

            await this.notificationService.createNotification({
                userId: followingId,
                actorId: followerId,
                type: 'follow',
                title: 'Người theo dõi mới',
                description: `${followerName} đã bắt đầu theo dõi bạn`,
                actionUrl,
            });
        }

        return follow;
    }

    /**
     * Unfollow a user
     * @param followerId - The user who wants to unfollow
     * @param followingId - The user to be unfollowed
     */
    async unfollowUser(followerId: string, followingId: string) {
        // Check if follow relationship exists
        const existingFollow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        if (!existingFollow) {
            throw new BadRequestException('Bạn chưa theo dõi người dùng này');
        }

        // Delete follow relationship
        return this.prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });
    }

    /**
     * Check if a user is following another user
     * @param followerId - The potential follower
     * @param followingId - The user being checked
     */
    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        const follow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        return !!follow;
    }

    /**
     * Get follower count for a user
     * @param userId - The user to get follower count for
     */
    async getFollowerCount(userId: string): Promise<number> {
        return this.prisma.follow.count({
            where: {
                followingId: userId,
            },
        });
    }

    /**
     * Get following count for a user (users that this user follows)
     * @param userId - The user to get following count for
     */
    async getFollowingCount(userId: string): Promise<number> {
        return this.prisma.follow.count({
            where: {
                followerId: userId,
            },
        });
    }

    /**
     * Get list of users that this user is following
     * @param userId - The user to get following list for
     */
    async getFollowingUsers(userId: string) {
        const follows = await this.prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            include: {
                following: {
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
            orderBy: {
                createdAt: 'desc',
            },
        });

        return follows.map(follow => {
            const user = follow.following;
            const displayName = user.role === 'employer'
                ? user.companyName || user.username
                : user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username;

            return {
                id: user.id,
                name: displayName,
                username: user.username,
                avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
                role: user.role,
                followedAt: follow.createdAt,
            };
        });
    }
}
