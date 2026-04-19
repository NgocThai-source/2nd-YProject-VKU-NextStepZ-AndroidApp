import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller('auth/admin')
export class AdminAuthController {
    constructor(private readonly adminAuthService: AdminAuthService) { }

    /**
     * Admin login endpoint - separate from regular user login
     * POST /auth/admin/login
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: AdminLoginDto) {
        return this.adminAuthService.login(loginDto.email, loginDto.password);
    }

    /**
     * Get admin profile
     * GET /auth/admin/profile
     */
    @Get('profile')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async getProfile(@CurrentUser() user: { userId: string }) {
        return this.adminAuthService.getProfile(user.userId);
    }
}
