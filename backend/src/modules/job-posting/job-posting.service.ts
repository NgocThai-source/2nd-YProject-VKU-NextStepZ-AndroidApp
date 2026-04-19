import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateJobPostingDto, UpdateJobPostingDto } from './dto';

@Injectable()
export class JobPostingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly uploadService: UploadService,
    ) { }

    /**
     * Create a new job posting
     * Only VERIFIED employers can create job postings
     * First job requires admin approval, subsequent jobs are auto-approved
     */
    async create(userId: string, dto: CreateJobPostingDto) {
        // Verify user is an employer
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true, isVerified: true },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.role !== 'employer') {
            throw new ForbiddenException('Only employers can create job postings');
        }

        // Verified employers = auto-approved, Unverified employers = pending (requires admin approval)
        const jobStatus = user.isVerified ? 'approved' : 'pending';

        // Process gallery images - convert base64 to URLs
        let galleryImageUrls: string[] = [];
        if (dto.galleryImages && dto.galleryImages.length > 0) {
            // Filter out any non-base64 data (in case URLs are passed)
            const base64Images = dto.galleryImages.filter(img =>
                img.startsWith('data:') || !img.startsWith('http')
            );
            const existingUrls = dto.galleryImages.filter(img =>
                img.startsWith('http') || img.startsWith('/uploads')
            );

            if (base64Images.length > 0) {
                const uploadedUrls = await this.uploadService.uploadMultipleBase64Files(
                    base64Images,
                    'job-postings',
                );
                galleryImageUrls = [...existingUrls, ...uploadedUrls];
            } else {
                galleryImageUrls = existingUrls;
            }
        }

        // Process company logo if it's base64
        let companyLogoUrl = dto.companyLogo;
        if (dto.companyLogo && dto.companyLogo.startsWith('data:')) {
            companyLogoUrl = await this.uploadService.uploadBase64File(
                dto.companyLogo,
                'job-postings',
            );
        }

        const jobPosting = await this.prisma.companyJobPosting.create({
            data: {
                userId,
                companyName: dto.companyName,
                companyLogo: companyLogoUrl,
                tags: dto.tags || [],
                description: dto.description,
                mission: dto.mission,
                vision: dto.vision,
                companyHistory: dto.companyHistory ? JSON.parse(JSON.stringify(dto.companyHistory)) : undefined,
                address: dto.address,
                phone: dto.phone,
                email: dto.email,
                website: dto.website,
                jobPositions: dto.jobPositions ? JSON.parse(JSON.stringify(dto.jobPositions)) : undefined,
                workingHours: dto.workingHours,
                offDays: dto.offDays ?? 2,
                vacationDays: dto.vacationDays ?? 12,
                insurances: dto.insurances || [],
                salaryBenefits: dto.salaryBenefits || [],
                allowances: dto.allowances || [],
                benefits: dto.benefits || [],
                galleryImages: galleryImageUrls,
                // Approval workflow: first job = pending, subsequent = auto-approved
                status: jobStatus,
                isActive: jobStatus === 'approved', // Only approved jobs are active
                approvedAt: jobStatus === 'approved' ? new Date() : null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        companyName: true,
                    },
                },
            },
        });

        return this.formatJobPosting(jobPosting);
    }

    /**
     * Get all job postings with optional filters and pagination
     */
    async findAll(options: {
        page?: number;
        limit?: number;
        tags?: string[];
        address?: string;
    }) {
        const { page = 1, limit = 10, tags, address } = options;
        const skip = (page - 1) * limit;

        // Build where clause with filters
        const where: any = {
            isActive: true,
            status: 'approved', // Only show approved jobs to public
            user: {
                isBanned: false, // Filter out jobs from banned employers
            },
        };

        // Filter by tags (any match)
        if (tags && tags.length > 0) {
            where.tags = {
                hasSome: tags,
            };
        }

        // Filter by address (contains search)
        if (address) {
            where.address = {
                contains: address,
                mode: 'insensitive',
            };
        }

        const [jobPostings, total] = await Promise.all([
            this.prisma.companyJobPosting.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                            companyName: true,
                        },
                    },
                },
            }),
            this.prisma.companyJobPosting.count({ where }),
        ]);

        return {
            data: jobPostings.map(jp => this.formatJobPosting(jp)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get a single job posting by ID
     */
    async findOne(id: string) {
        const jobPosting = await this.prisma.companyJobPosting.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        companyName: true,
                    },
                },
            },
        });

        if (!jobPosting) {
            throw new NotFoundException('Job posting not found');
        }

        return this.formatJobPosting(jobPosting);
    }

    /**
     * Update a job posting
     * Only the owner (employer who created it) can update
     */
    async update(id: string, userId: string, dto: UpdateJobPostingDto) {
        const jobPosting = await this.prisma.companyJobPosting.findUnique({
            where: { id },
        });

        if (!jobPosting) {
            throw new NotFoundException('Job posting not found');
        }

        if (jobPosting.userId !== userId) {
            throw new ForbiddenException('You can only update your own job postings');
        }

        // Process new gallery images if any
        let galleryImageUrls = jobPosting.galleryImages;
        if (dto.galleryImages !== undefined) {
            // Delete old images that are not in the new list
            const oldImages = jobPosting.galleryImages;
            const imagesToDelete = oldImages.filter(
                img => !dto.galleryImages?.includes(img),
            );
            await this.uploadService.deleteMultipleFiles(imagesToDelete);

            // Upload new base64 images
            const base64Images = dto.galleryImages.filter(img =>
                img.startsWith('data:'),
            );
            const existingUrls = dto.galleryImages.filter(
                img => !img.startsWith('data:'),
            );

            if (base64Images.length > 0) {
                const uploadedUrls = await this.uploadService.uploadMultipleBase64Files(
                    base64Images,
                    'job-postings',
                );
                galleryImageUrls = [...existingUrls, ...uploadedUrls];
            } else {
                galleryImageUrls = existingUrls;
            }
        }

        // Process company logo if it's new base64
        let companyLogoUrl = dto.companyLogo ?? jobPosting.companyLogo;
        if (dto.companyLogo && dto.companyLogo.startsWith('data:')) {
            // Delete old logo if exists
            if (jobPosting.companyLogo) {
                await this.uploadService.deleteFile(jobPosting.companyLogo);
            }
            companyLogoUrl = await this.uploadService.uploadBase64File(
                dto.companyLogo,
                'job-postings',
            );
        }

        const updated = await this.prisma.companyJobPosting.update({
            where: { id },
            data: {
                ...(dto.companyName !== undefined && { companyName: dto.companyName }),
                ...(companyLogoUrl !== undefined && { companyLogo: companyLogoUrl }),
                ...(dto.tags !== undefined && { tags: dto.tags }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.mission !== undefined && { mission: dto.mission }),
                ...(dto.vision !== undefined && { vision: dto.vision }),
                ...(dto.companyHistory !== undefined && { companyHistory: JSON.parse(JSON.stringify(dto.companyHistory)) }),
                ...(dto.address !== undefined && { address: dto.address }),
                ...(dto.phone !== undefined && { phone: dto.phone }),
                ...(dto.email !== undefined && { email: dto.email }),
                ...(dto.website !== undefined && { website: dto.website }),
                ...(dto.jobPositions !== undefined && { jobPositions: JSON.parse(JSON.stringify(dto.jobPositions)) }),
                ...(dto.workingHours !== undefined && { workingHours: dto.workingHours }),
                ...(dto.offDays !== undefined && { offDays: dto.offDays }),
                ...(dto.vacationDays !== undefined && { vacationDays: dto.vacationDays }),
                ...(dto.insurances !== undefined && { insurances: dto.insurances }),
                ...(dto.salaryBenefits !== undefined && { salaryBenefits: dto.salaryBenefits }),
                ...(dto.allowances !== undefined && { allowances: dto.allowances }),
                ...(dto.benefits !== undefined && { benefits: dto.benefits }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
                galleryImages: galleryImageUrls,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        companyName: true,
                    },
                },
            },
        });

        return this.formatJobPosting(updated);
    }

    /**
     * Delete a job posting
     * Only the owner can delete
     */
    async remove(id: string, userId: string) {
        const jobPosting = await this.prisma.companyJobPosting.findUnique({
            where: { id },
        });

        if (!jobPosting) {
            throw new NotFoundException('Job posting not found');
        }

        if (jobPosting.userId !== userId) {
            throw new ForbiddenException('You can only delete your own job postings');
        }

        // Delete associated images
        if (jobPosting.companyLogo) {
            await this.uploadService.deleteFile(jobPosting.companyLogo);
        }
        if (jobPosting.galleryImages.length > 0) {
            await this.uploadService.deleteMultipleFiles(jobPosting.galleryImages);
        }

        await this.prisma.companyJobPosting.delete({
            where: { id },
        });

        return { message: 'Job posting deleted successfully' };
    }

    /**
     * Increment view count for a job posting (with anti-view-boosting protection)
     * Only counts unique views per user (logged-in) or IP (guests) within 24 hours
     */
    async incrementViewCount(id: string, userId?: string, ipAddress?: string) {
        const jobPosting = await this.prisma.companyJobPosting.findUnique({
            where: { id },
        });

        if (!jobPosting) {
            throw new NotFoundException('Job posting not found');
        }

        // Check if this is a unique view (not seen by this user/IP in the last 24 hours)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        let isUniqueView = false;

        if (userId) {
            // For logged-in users: check by user ID
            const existingView = await this.prisma.jobPostingView.findUnique({
                where: {
                    jobPostingId_userId: {
                        jobPostingId: id,
                        userId: userId,
                    },
                },
            });

            if (!existingView) {
                // First time viewing - create record and count as unique
                await this.prisma.jobPostingView.create({
                    data: {
                        jobPostingId: id,
                        userId: userId,
                    },
                });
                isUniqueView = true;
            } else if (existingView.createdAt < twentyFourHoursAgo) {
                // Viewed more than 24 hours ago - update timestamp and count as unique
                await this.prisma.jobPostingView.update({
                    where: { id: existingView.id },
                    data: { createdAt: new Date() },
                });
                isUniqueView = true;
            }
            // Else: viewed within 24 hours - don't count
        } else if (ipAddress) {
            // For guests: check by IP address
            const existingView = await this.prisma.jobPostingView.findFirst({
                where: {
                    jobPostingId: id,
                    ipAddress: ipAddress,
                    userId: null,
                    createdAt: { gte: twentyFourHoursAgo },
                },
            });

            if (!existingView) {
                // No recent view from this IP - create record and count as unique
                await this.prisma.jobPostingView.create({
                    data: {
                        jobPostingId: id,
                        ipAddress: ipAddress,
                    },
                });
                isUniqueView = true;
            }
            // Else: viewed within 24 hours - don't count
        }

        // Only increment if it's a unique view
        if (isUniqueView) {
            await this.prisma.companyJobPosting.update({
                where: { id },
                data: {
                    viewCount: { increment: 1 },
                },
            });
            return { viewCount: jobPosting.viewCount + 1, isNewView: true };
        }

        // Return current count without incrementing
        return { viewCount: jobPosting.viewCount, isNewView: false };
    }

    /**
     * Get job postings by a specific user (employer)
     */
    async findByUser(userId: string) {
        const jobPostings = await this.prisma.companyJobPosting.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        companyName: true,
                    },
                },
            },
        });

        return jobPostings.map(jp => this.formatJobPosting(jp));
    }

    /**
     * Format job posting for frontend consumption
     */
    private formatJobPosting(jobPosting: any) {
        const serverBaseUrl = process.env.SERVER_BASE_URL || 'http://localhost:3001';

        // Helper function to format image URL
        const formatImageUrl = (url: string | null): string | null => {
            if (!url) return null;
            // If already a full URL, return as-is
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
                return url;
            }
            // Convert relative path to full URL
            return `${serverBaseUrl}${url}`;
        };

        return {
            id: jobPosting.id,
            companyName: jobPosting.companyName,
            companyLogo: formatImageUrl(jobPosting.companyLogo),
            tags: jobPosting.tags,
            description: jobPosting.description,
            mission: jobPosting.mission,
            vision: jobPosting.vision,
            companyHistory: jobPosting.companyHistory,
            address: jobPosting.address,
            phone: jobPosting.phone,
            email: jobPosting.email,
            website: jobPosting.website,
            jobPositions: jobPosting.jobPositions,
            workingHours: jobPosting.workingHours,
            offDays: jobPosting.offDays,
            vacationDays: jobPosting.vacationDays,
            insurances: jobPosting.insurances,
            salaryBenefits: jobPosting.salaryBenefits,
            allowances: jobPosting.allowances,
            benefits: jobPosting.benefits,
            galleryImages: (jobPosting.galleryImages || []).map((img: string) => formatImageUrl(img)),
            isActive: jobPosting.isActive,
            viewCount: jobPosting.viewCount,
            createdAt: jobPosting.createdAt.toISOString(),
            postedBy: jobPosting.userId,
            user: jobPosting.user,
        };
    }
}
