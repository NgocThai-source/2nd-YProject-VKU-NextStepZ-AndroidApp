/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { SavedPortfolioService } from './saved-portfolio.service';
import { CreateSavedPortfolioDto, UpdateSavedPortfolioDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * Saved Portfolio Controller
 * - All endpoints require JWT authentication
 * - All endpoints require 'user' (Student) role
 * - Employers cannot access portfolio features
 */
@Controller('saved-portfolios')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('user') // Only students can access
export class SavedPortfolioController {
    constructor(private readonly savedPortfolioService: SavedPortfolioService) { }

    /**
     * Create a new portfolio
     * POST /saved-portfolios
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUser() user: any,
        @Body() createDto: CreateSavedPortfolioDto,
    ) {
        return this.savedPortfolioService.create(user.userId, createDto);
    }

    /**
     * Get all portfolios for current user
     * GET /saved-portfolios
     */
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@CurrentUser() user: any) {
        return this.savedPortfolioService.findAll(user.userId);
    }

    /**
     * Get a single portfolio by ID
     * GET /saved-portfolios/:id
     */
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.savedPortfolioService.findOne(user.userId, id);
    }

    /**
     * Update a portfolio
     * PUT /saved-portfolios/:id
     */
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body() updateDto: UpdateSavedPortfolioDto,
    ) {
        return this.savedPortfolioService.update(user.userId, id, updateDto);
    }

    /**
     * Delete a portfolio
     * DELETE /saved-portfolios/:id
     */
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.savedPortfolioService.remove(user.userId, id);
    }
}
