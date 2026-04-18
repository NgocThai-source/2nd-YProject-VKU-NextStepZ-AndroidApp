import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export class CreateEmployerProfileDto {
  industry?: string;
  companySize?: string;
  foundingYear?: number;
  about?: string;
  website?: string;
  address?: string;
}

export class UpdateEmployerProfileDto {
  industry?: string;
  companySize?: string;
  foundingYear?: number;
  about?: string;
  website?: string;
  address?: string;
}

export class CreateJobPostingDto {
  title: string;
  description?: string;
  location?: string;
  salary?: string;
}

export class UpdateJobPostingDto {
  title?: string;
  description?: string;
  location?: string;
  salary?: string;
}

@Injectable()
export class EmployerService {
  constructor(private prisma: PrismaService) { }

  /**
   * Create or get employer profile for a user
   * Only users with role 'employer' can have an employer profile
   */
  async getOrCreateEmployerProfile(userId: string) {
    // Verify user exists and has employer role
    // Also fetch website and address to copy to employer profile if needed
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, website: true, address: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'employer') {
      throw new BadRequestException(
        'Only users with employer role can create employer profile',
      );
    }

    // Get or create profile
    let profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await this.prisma.profile.create({
        data: { userId },
      });
    }

    // Check if employer profile already exists
    let employerProfile = await this.prisma.employerProfile.findUnique({
      where: { profileId: profile.id },
      include: {
        jobPostings: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!employerProfile) {
      // Create employer profile with website and address from User registration data
      employerProfile = await this.prisma.employerProfile.create({
        data: {
          profileId: profile.id,
          website: user.website || null,
          address: user.address || null,
        },
        include: {
          jobPostings: true,
        },
      });
    }

    return employerProfile;
  }

  /**
   * Get employer profile by user ID with full user data
   * Returns complete employer profile with company name, email, phone, and avatar
   */
  async getEmployerProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        user: {
          select: {
            id: true,
            companyName: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        employerProfile: {
          include: {
            jobPostings: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    if (!profile?.employerProfile) {
      throw new NotFoundException('Employer profile not found');
    }

    // Build full employer profile response with user data
    return {
      ...profile.employerProfile,
      // Company info from User model
      companyName: profile.user?.companyName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Công ty',
      email: profile.email || profile.user?.email || '',
      phone: profile.phone || profile.user?.phone || '',
      avatar: profile.avatar || profile.user?.avatar || '',
    };
  }

  /**
   * Update employer profile
   */
  async updateEmployerProfile(
    userId: string,
    updateDto: UpdateEmployerProfileDto,
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        employerProfile: true,
      },
    });

    if (!profile?.employerProfile) {
      throw new NotFoundException('Employer profile not found');
    }

    const updated = await this.prisma.employerProfile.update({
      where: { id: profile.employerProfile.id },
      data: updateDto,
      include: {
        jobPostings: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return updated;
  }

  /**
   * Create job posting
   */
  async createJobPosting(userId: string, createDto: CreateJobPostingDto) {
    // Get employer profile
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: {
        employerProfile: true,
      },
    });

    if (!profile?.employerProfile) {
      throw new NotFoundException('Employer profile not found');
    }

    const jobPosting = await this.prisma.jobPosting.create({
      data: {
        employerProfileId: profile.employerProfile.id,
        ...createDto,
      },
    });

    return jobPosting;
  }

  /**
   * Get job postings for employer
   */
  async getJobPostings(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: {
        employerProfile: {
          select: {
            id: true,
            jobPostings: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    if (!profile?.employerProfile) {
      throw new NotFoundException('Employer profile not found');
    }

    return profile.employerProfile.jobPostings;
  }

  /**
   * Get job posting by ID
   */
  async getJobPostingById(jobPostingId: string) {
    const jobPosting = await this.prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
    });

    if (!jobPosting) {
      throw new NotFoundException('Job posting not found');
    }

    return jobPosting;
  }

  /**
   * Update job posting
   */
  async updateJobPosting(
    userId: string,
    jobPostingId: string,
    updateDto: UpdateJobPostingDto,
  ) {
    // Verify the job posting belongs to the employer
    const jobPosting = await this.prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
      include: {
        employerProfile: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!jobPosting) {
      throw new NotFoundException('Job posting not found');
    }

    if (jobPosting.employerProfile.profile.userId !== userId) {
      throw new BadRequestException(
        'You can only update your own job postings',
      );
    }

    const updated = await this.prisma.jobPosting.update({
      where: { id: jobPostingId },
      data: updateDto,
    });

    return updated;
  }

  /**
   * Delete job posting
   */
  async deleteJobPosting(userId: string, jobPostingId: string) {
    // Verify the job posting belongs to the employer
    const jobPosting = await this.prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
      include: {
        employerProfile: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!jobPosting) {
      throw new NotFoundException('Job posting not found');
    }

    if (jobPosting.employerProfile.profile.userId !== userId) {
      throw new BadRequestException(
        'You can only delete your own job postings',
      );
    }

    await this.prisma.jobPosting.delete({
      where: { id: jobPostingId },
    });

    return { message: 'Job posting deleted successfully' };
  }
}
