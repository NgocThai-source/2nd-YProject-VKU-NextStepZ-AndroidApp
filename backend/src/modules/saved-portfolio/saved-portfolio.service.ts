import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSavedPortfolioDto, UpdateSavedPortfolioDto } from './dto';

@Injectable()
export class SavedPortfolioService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new portfolio for the current user
     */
    async create(userId: string, createDto: CreateSavedPortfolioDto) {
        const portfolio = await this.prisma.savedPortfolio.create({
            data: {
                userId,
                name: createDto.name,
                title: createDto.title,
                headline: createDto.headline,
                summary: createDto.summary,
                photoUrl: createDto.photoUrl,
                contactJson: createDto.contactJson ?? undefined,
                skills: createDto.skills ?? undefined,
                experience: createDto.experience ?? undefined,
                education: createDto.education ?? undefined,
                projects: createDto.projects ?? undefined,
                selectedTemplate: createDto.selectedTemplate ?? 1,
            },
        });

        return {
            success: true,
            message: 'Portfolio created successfully',
            data: this.formatPortfolio(portfolio),
        };
    }

    /**
     * Get all portfolios for the current user
     */
    async findAll(userId: string) {
        const portfolios = await this.prisma.savedPortfolio.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });

        return {
            success: true,
            data: portfolios.map(p => this.formatPortfolio(p)),
        };
    }

    /**
     * Get a single portfolio by ID (must belong to user)
     */
    async findOne(userId: string, portfolioId: string) {
        const portfolio = await this.prisma.savedPortfolio.findUnique({
            where: { id: portfolioId },
        });

        if (!portfolio) {
            throw new NotFoundException('Portfolio not found');
        }

        if (portfolio.userId !== userId) {
            throw new ForbiddenException('You do not have access to this portfolio');
        }

        return {
            success: true,
            data: this.formatPortfolio(portfolio),
        };
    }

    /**
     * Update a portfolio (must belong to user)
     */
    async update(userId: string, portfolioId: string, updateDto: UpdateSavedPortfolioDto) {
        // Check ownership
        const existing = await this.prisma.savedPortfolio.findUnique({
            where: { id: portfolioId },
        });

        if (!existing) {
            throw new NotFoundException('Portfolio not found');
        }

        if (existing.userId !== userId) {
            throw new ForbiddenException('You do not have access to this portfolio');
        }

        const portfolio = await this.prisma.savedPortfolio.update({
            where: { id: portfolioId },
            data: {
                name: updateDto.name,
                title: updateDto.title,
                headline: updateDto.headline,
                summary: updateDto.summary,
                photoUrl: updateDto.photoUrl,
                contactJson: updateDto.contactJson ?? undefined,
                skills: updateDto.skills ?? undefined,
                experience: updateDto.experience ?? undefined,
                education: updateDto.education ?? undefined,
                projects: updateDto.projects ?? undefined,
                selectedTemplate: updateDto.selectedTemplate,
            },
        });

        return {
            success: true,
            message: 'Portfolio updated successfully',
            data: this.formatPortfolio(portfolio),
        };
    }

    /**
     * Delete a portfolio (must belong to user)
     */
    async remove(userId: string, portfolioId: string) {
        // Check ownership
        const existing = await this.prisma.savedPortfolio.findUnique({
            where: { id: portfolioId },
        });

        if (!existing) {
            throw new NotFoundException('Portfolio not found');
        }

        if (existing.userId !== userId) {
            throw new ForbiddenException('You do not have access to this portfolio');
        }

        await this.prisma.savedPortfolio.delete({
            where: { id: portfolioId },
        });

        return {
            success: true,
            message: 'Portfolio deleted successfully',
        };
    }

    /**
     * Format portfolio for API response
     */
    private formatPortfolio(portfolio: any) {
        return {
            id: portfolio.id,
            name: portfolio.name,
            title: portfolio.title,
            headline: portfolio.headline,
            summary: portfolio.summary,
            photoUrl: portfolio.photoUrl,
            contactJson: portfolio.contactJson,
            skills: portfolio.skills,
            experience: portfolio.experience,
            education: portfolio.education,
            projects: portfolio.projects,
            selectedTemplate: portfolio.selectedTemplate,
            savedAt: portfolio.createdAt.toISOString(),
            updatedAt: portfolio.updatedAt.toISOString(),
        };
    }
}
