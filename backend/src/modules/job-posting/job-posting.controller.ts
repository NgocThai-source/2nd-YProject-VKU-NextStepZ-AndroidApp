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
import { JobPostingService } from './job-posting.service';
import { CreateJobPostingDto, UpdateJobPostingDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('job-postings')
export class JobPostingController {
    constructor(private readonly jobPostingService: JobPostingService) { }

    /**
     * Create a new job posting
     * POST /job-postings
     * Requires: Employer role
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createJobPostingDto: CreateJobPostingDto,
        @Request() req: any,
    ) {
        return this.jobPostingService.create(req.user.userId, createJobPostingDto);
    }

    /**
     * Get all job postings with optional filters
     * GET /job-postings?page=1&limit=10&tags=Technology,Design&address=Hanoi
     * Public endpoint
     */
    @Get()
    async findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('tags') tags?: string,
        @Query('address') address?: string,
    ) {
        const tagsArray = tags ? tags.split(',').map(t => t.trim()) : undefined;

        return this.jobPostingService.findAll({
            page: parseInt(page),
            limit: parseInt(limit),
            tags: tagsArray,
            address,
        });
    }

    /**
     * Get current user's job postings
     * GET /job-postings/my-postings
     * Requires: Authentication
     */
    @Get('my-postings')
    @UseGuards(JwtAuthGuard)
    async findMyPostings(@Request() req: any) {
        return this.jobPostingService.findByUser(req.user.userId);
    }

    /**
     * Get a single job posting by ID
     * GET /job-postings/:id
     * Public endpoint
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.jobPostingService.findOne(id);
    }

    /**
     * Update a job posting
     * PATCH /job-postings/:id
     * Requires: Owner (employer who created the posting)
     */
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateJobPostingDto: UpdateJobPostingDto,
        @Request() req: any,
    ) {
        return this.jobPostingService.update(id, req.user.userId, updateJobPostingDto);
    }

    /**
     * Delete a job posting
     * DELETE /job-postings/:id
     * Requires: Owner (employer who created the posting)
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string, @Request() req: any) {
        return this.jobPostingService.remove(id, req.user.userId);
    }

    /**
     * Increment view count (with anti-view-boosting protection)
     * POST /job-postings/:id/view
     * Public endpoint - but tracks user ID for logged-in users, IP for guests
     */
    @Post(':id/view')
    @UseGuards(OptionalJwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async incrementViewCount(
        @Param('id') id: string,
        @Request() req: any,
    ) {
        const userId = req.user?.userId;
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
        return this.jobPostingService.incrementViewCount(id, userId, ipAddress);
    }
}
