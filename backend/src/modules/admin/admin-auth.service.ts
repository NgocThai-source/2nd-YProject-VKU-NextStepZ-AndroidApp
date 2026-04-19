import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminAuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Admin login - separate from regular user login
     * Only users with role 'admin' can login here
     */
    async login(email: string, password: string) {
        // Find user by email
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }

        // IMPORTANT: Only admin role can login through this endpoint
        if (user.role !== 'admin') {
            throw new ForbiddenException('Chỉ tài khoản Admin mới có thể đăng nhập tại đây');
        }

        // Check if account is active
        if (!user.isActive) {
            throw new ForbiddenException('Tài khoản đã bị vô hiệu hóa');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }

        // Generate JWT token with admin role
        const payload = {
            sub: user.id,  // Use 'sub' to match JwtStrategy validation
            email: user.email,
            role: user.role,
            isAdmin: true,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }

    /**
     * Get admin profile
     */
    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user || user.role !== 'admin') {
            throw new ForbiddenException('Không có quyền truy cập');
        }

        return user;
    }

    /**
     * Validate if user is admin
     */
    async validateAdmin(userId: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, isActive: true },
        });

        return user?.role === 'admin' && user?.isActive === true;
    }
}
