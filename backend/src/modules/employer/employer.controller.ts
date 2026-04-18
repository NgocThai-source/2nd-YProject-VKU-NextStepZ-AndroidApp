import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  EmployerService,
  UpdateEmployerProfileDto,
  CreateJobPostingDto,
  UpdateJobPostingDto,
} from './employer.service';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('employers')
export class EmployerController {
  constructor(private employerService: EmployerService) {}

  /**
   * Get or create employer profile for current user
   * Only accessible by employers
   */
  @Post('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employer')
  @HttpCode(HttpStatus.OK)
  async getOrCreateProfile(@CurrentUser() user: any) {
    return this.employerService.getOrCreateEmployerProfile(user.userId);
  }

  /**
   * Get employer profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employer')
  async getProfile(@CurrentUser() user: any) {
    return this.employerService.getEmployerProfile(user.userId);
  }

  /**
   * Update employer profile
   */
  @Put('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employer')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateEmployerProfileDto,
  ) {
    return this.employerService.updateEmployerProfile(user.userId, updateDto);
  }

  /**
   * Create job posting
   */
  @Post('job-postings')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employer')
  @HttpCode(HttpStatus.CREATED)
  async createJobPosting(
    @CurrentUser() user: any,
    @Body() createDto: CreateJobPostingDto,
  ) {
    return this.employerService.createJobPosting(user.userId, createDto);
  }

  /**
   * Get all job postings for current employer
   */
  @Get('job-postings')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employer')
  async getJobPostings(@CurrentUser() user: any) {
    return this.employerService.getJobPostings(user.userId);
  }

  /**
   * Get specific job posting
   */
  @Get('job-postings/:jobPostingId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employer')
  async getJobPosting(@Param('jobPostingId') jobPostingId: string) {
    return this.employerService.getJobPostingById(jobPostingId);
  }

  /**
   * Update job posting
   */
  @Put('job-postings/:jobPostingId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employer')
  @HttpCode(HttpStatus.OK)
  async updateJobPosting(
    @CurrentUser() user: any,
    @Param('jobPostingId') jobPostingId: string,
    @Body() updateDto: UpdateJobPostingDto,
  ) {
    return this.employerService.updateJobPosting(
      user.userId,
      jobPostingId,
      updateDto,
    );
  }

  /**
   * Delete job posting
   */
  @Delete('job-postings/:jobPostingId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employer')
  @HttpCode(HttpStatus.OK)
  async deleteJobPosting(
    @CurrentUser() user: any,
    @Param('jobPostingId') jobPostingId: string,
  ) {
    return this.employerService.deleteJobPosting(user.userId, jobPostingId);
  }
}
