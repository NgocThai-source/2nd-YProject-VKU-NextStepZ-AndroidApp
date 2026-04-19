import {
    Controller,
    Post,
    Delete,
    Get,
    Param,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) { }

    /**
     * Follow a user
     * POST /follow/:userId
     */
    @Post(':userId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async followUser(@Param('userId') userId: string, @Request() req: any) {
        const followerId = req.user.userId;
        return this.followService.followUser(followerId, userId);
    }

    /**
     * Unfollow a user
     * DELETE /follow/:userId
     */
    @Delete(':userId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async unfollowUser(@Param('userId') userId: string, @Request() req: any) {
        const followerId = req.user.userId;
        return this.followService.unfollowUser(followerId, userId);
    }

    /**
     * Check if current user is following a user
     * GET /follow/:userId/status
     */
    @Get(':userId/status')
    @UseGuards(JwtAuthGuard)
    async checkFollowStatus(@Param('userId') userId: string, @Request() req: any) {
        const followerId = req.user.userId;
        const isFollowing = await this.followService.isFollowing(followerId, userId);
        return { isFollowing };
    }

    /**
     * Get follower count for a user (public endpoint)
     * GET /follow/:userId/count
     */
    @Get(':userId/count')
    async getFollowerCount(@Param('userId') userId: string) {
        const count = await this.followService.getFollowerCount(userId);
        return { count };
    }

    /**
     * Get list of users that current user is following
     * GET /follow/following/list
     */
    @Get('following/list')
    @UseGuards(JwtAuthGuard)
    async getFollowingUsers(@Request() req: any) {
        const userId = req.user.userId;
        return this.followService.getFollowingUsers(userId);
    }
}
