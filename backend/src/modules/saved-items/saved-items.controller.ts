/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { SavedItemsService } from './saved-items.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * Saved Items Controller
 * - All endpoints require JWT authentication
 */
@Controller('saved-items')
@UseGuards(JwtAuthGuard)
export class SavedItemsController {
    constructor(private readonly savedItemsService: SavedItemsService) { }

    /**
     * Get all saved items (posts and job postings)
     * GET /saved-items
     */
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAll(@CurrentUser() user: any) {
        return this.savedItemsService.getAllSavedItems(user.userId);
    }

    // ==================== POSTS ====================

    /**
     * Save a post
     * POST /saved-items/posts/:postId
     */
    @Post('posts/:postId')
    @HttpCode(HttpStatus.CREATED)
    async savePost(
        @CurrentUser() user: any,
        @Param('postId') postId: string,
    ) {
        return this.savedItemsService.savePost(user.userId, postId);
    }

    /**
     * Unsave a post
     * DELETE /saved-items/posts/:postId
     */
    @Delete('posts/:postId')
    @HttpCode(HttpStatus.OK)
    async unsavePost(
        @CurrentUser() user: any,
        @Param('postId') postId: string,
    ) {
        return this.savedItemsService.unsavePost(user.userId, postId);
    }

    /**
     * Check if a post is saved
     * GET /saved-items/posts/:postId/status
     */
    @Get('posts/:postId/status')
    @HttpCode(HttpStatus.OK)
    async isPostSaved(
        @CurrentUser() user: any,
        @Param('postId') postId: string,
    ) {
        return this.savedItemsService.isPostSaved(user.userId, postId);
    }

    /**
     * Remove all saved posts
     * DELETE /saved-items/posts
     */
    @Delete('posts')
    @HttpCode(HttpStatus.OK)
    async removeAllPosts(@CurrentUser() user: any) {
        return this.savedItemsService.removeAllSavedPosts(user.userId);
    }

    // ==================== JOB POSTINGS ====================

    /**
     * Save a job posting
     * POST /saved-items/job-postings/:id
     */
    @Post('job-postings/:id')
    @HttpCode(HttpStatus.CREATED)
    async saveJobPosting(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.savedItemsService.saveJobPosting(user.userId, id);
    }

    /**
     * Unsave a job posting
     * DELETE /saved-items/job-postings/:id
     */
    @Delete('job-postings/:id')
    @HttpCode(HttpStatus.OK)
    async unsaveJobPosting(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.savedItemsService.unsaveJobPosting(user.userId, id);
    }

    /**
     * Check if a job posting is saved
     * GET /saved-items/job-postings/:id/status
     */
    @Get('job-postings/:id/status')
    @HttpCode(HttpStatus.OK)
    async isJobPostingSaved(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.savedItemsService.isJobPostingSaved(user.userId, id);
    }

    /**
     * Remove all saved job postings
     * DELETE /saved-items/job-postings
     */
    @Delete('job-postings')
    @HttpCode(HttpStatus.OK)
    async removeAllJobPostings(@CurrentUser() user: any) {
        return this.savedItemsService.removeAllSavedJobPostings(user.userId);
    }
}
