import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto, UpdatePostDto, CreateCommentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('community')
export class CommunityController {
    constructor(private readonly communityService: CommunityService) { }

    // ==================== POSTS ====================

    /**
     * Get all posts with pagination
     * GET /community/posts?page=1&limit=10
     */
    @Get('posts')
    @UseGuards(OptionalJwtAuthGuard)
    async getPosts(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Request() req: any,
    ) {
        const userId = req.user?.userId;
        return this.communityService.getPosts(parseInt(page), parseInt(limit), userId);
    }

    /**
     * Get current user's posts
     * GET /community/posts/my
     */
    @Get('posts/my')
    @UseGuards(JwtAuthGuard)
    async getMyPosts(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Request() req: any,
    ) {
        return this.communityService.getMyPosts(req.user.userId, parseInt(page), parseInt(limit));
    }

    /**
     * Get single post by ID
     * GET /community/posts/:id
     */
    @Get('posts/:id')
    @UseGuards(OptionalJwtAuthGuard)
    async getPost(@Param('id') id: string, @Request() req: any) {
        const userId = req.user?.userId;
        return this.communityService.getPost(id, userId);
    }

    /**
     * Create a new post
     * POST /community/posts
     */
    @Post('posts')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
        return this.communityService.createPost(req.user.userId, createPostDto);
    }

    /**
     * Update a post
     * PATCH /community/posts/:id
     */
    @Patch('posts/:id')
    @UseGuards(JwtAuthGuard)
    async updatePost(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Request() req: any,
    ) {
        return this.communityService.updatePost(id, req.user.userId, updatePostDto);
    }

    /**
     * Delete a post
     * DELETE /community/posts/:id
     */
    @Delete('posts/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async deletePost(@Param('id') id: string, @Request() req: any) {
        return this.communityService.deletePost(id, req.user.userId);
    }

    // ==================== LIKES ====================

    /**
     * Toggle like on a post
     * POST /community/posts/:id/like
     */
    @Post('posts/:id/like')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async toggleLike(@Param('id') id: string, @Request() req: any) {
        return this.communityService.toggleLike(id, req.user.userId);
    }

    /**
     * Check if user liked a post
     * GET /community/posts/:id/like
     */
    @Get('posts/:id/like')
    @UseGuards(JwtAuthGuard)
    async checkLikeStatus(@Param('id') id: string, @Request() req: any) {
        return this.communityService.checkLikeStatus(id, req.user.userId);
    }

    // ==================== COMMENTS ====================

    /**
     * Get comments for a post
     * GET /community/posts/:id/comments
     */
    @Get('posts/:id/comments')
    @UseGuards(OptionalJwtAuthGuard)
    async getComments(@Param('id') id: string, @Request() req: any) {
        const userId = req.user?.userId;
        return this.communityService.getComments(id, userId);
    }

    /**
     * Add a comment to a post
     * POST /community/posts/:id/comments
     */
    @Post('posts/:id/comments')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async addComment(
        @Param('id') id: string,
        @Body() createCommentDto: CreateCommentDto,
        @Request() req: any,
    ) {
        return this.communityService.addComment(id, req.user.userId, createCommentDto);
    }

    /**
     * Toggle like on a comment
     * POST /community/comments/:id/like
     */
    @Post('comments/:id/like')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async toggleCommentLike(@Param('id') id: string, @Request() req: any) {
        return this.communityService.toggleCommentLike(id, req.user.userId);
    }

    /**
     * Delete a comment
     * DELETE /community/comments/:id
     */
    @Delete('comments/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteComment(@Param('id') id: string, @Request() req: any) {
        return this.communityService.deleteComment(id, req.user.userId);
    }

    // ==================== SHARE ====================

    /**
     * Increment share count (public endpoint)
     * POST /community/posts/:id/share
     */
    @Post('posts/:id/share')
    @HttpCode(HttpStatus.OK)
    async incrementShareCount(@Param('id') id: string) {
        return this.communityService.incrementShareCount(id);
    }

    /**
     * Get shared post (public endpoint with optional auth for like status)
     * GET /community/shared/:id
     */
    @Get('shared/:id')
    @UseGuards(OptionalJwtAuthGuard)
    async getSharedPost(@Param('id') id: string, @Request() req: any) {
        const userId = req.user?.userId;
        return this.communityService.getSharedPost(id, userId);
    }

    // ==================== SUGGESTIONS & LEADERBOARD ====================

    /**
     * Get random user suggestions
     * GET /community/suggestions
     */
    @Get('suggestions')
    @UseGuards(OptionalJwtAuthGuard)
    async getUserSuggestions(@Request() req: any) {
        const userId = req.user?.userId;
        return this.communityService.getUserSuggestions(userId);
    }

    /**
     * Get leaderboard data
     * GET /community/leaderboard
     */
    @Get('leaderboard')
    async getLeaderboard(@Query('limit') limit: string = '30') {
        return this.communityService.getLeaderboard(parseInt(limit));
    }

    // ==================== USER PROFILE MODAL ====================

    /**
     * Get user profile data for modal display
     * GET /community/users/:userId/profile-modal
     */
    @Get('users/:userId/profile-modal')
    @UseGuards(OptionalJwtAuthGuard)
    async getUserProfileForModal(@Param('userId') userId: string, @Request() req: any) {
        const currentUserId = req.user?.userId;
        return this.communityService.getUserProfileForModal(userId, currentUserId);
    }

    // ==================== QUESTIONS ====================

    /**
     * Create a new question
     * POST /community/questions
     */
    @Post('questions')
    @UseGuards(JwtAuthGuard)
    async createQuestion(@Request() req: any, @Body() body: { title: string; content: string; tags: string[] }) {
        return this.communityService.createQuestion(req.user.userId, body);
    }

    /**
     * Get paginated questions
     * GET /community/questions
     */
    @Get('questions')
    @UseGuards(OptionalJwtAuthGuard)
    async getQuestions(
        @Request() req: any,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
    ) {
        const userId = req.user?.userId;
        return this.communityService.getQuestions(userId, parseInt(page), parseInt(limit));
    }

    /**
     * Get featured questions (top 3 by likes)
     * GET /community/questions/featured
     */
    @Get('questions/featured')
    async getFeaturedQuestions(@Query('limit') limit: string = '3') {
        return this.communityService.getFeaturedQuestions(parseInt(limit));
    }

    /**
     * Get top experts (top 3 by question count)
     * GET /community/questions/top-experts
     */
    @Get('questions/top-experts')
    async getTopExperts(@Query('limit') limit: string = '3') {
        return this.communityService.getTopExperts(parseInt(limit));
    }

    /**
     * Get Q&A statistics
     * GET /community/questions/stats
     */
    @Get('questions/stats')
    async getQAStats() {
        return this.communityService.getQAStats();
    }

    /**
     * Get single question by ID
     * GET /community/questions/:id
     */
    @Get('questions/:id')
    @UseGuards(OptionalJwtAuthGuard)
    async getQuestion(@Param('id') id: string, @Request() req: any) {
        const userId = req.user?.userId;
        return this.communityService.getQuestion(id, userId);
    }

    /**
     * Toggle like on a question
     * POST /community/questions/:id/like
     */
    @Post('questions/:id/like')
    @UseGuards(JwtAuthGuard)
    async toggleQuestionLike(@Param('id') id: string, @Request() req: any) {
        return this.communityService.toggleQuestionLike(id, req.user.userId);
    }

    /**
     * Record question view
     * POST /community/questions/:id/view
     */
    @Post('questions/:id/view')
    @UseGuards(JwtAuthGuard)
    async recordQuestionView(@Param('id') id: string, @Request() req: any) {
        return this.communityService.recordQuestionView(id, req.user.userId);
    }
}
