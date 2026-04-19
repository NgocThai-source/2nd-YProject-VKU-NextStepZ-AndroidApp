import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminService } from './admin.service';
import { AdminQueryDto } from './dto';

@Controller('admin/logs')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminLogsController {
    constructor(private readonly adminService: AdminService) { }

    /**
     * Get admin action logs with pagination and filters
     * GET /admin/logs
     */
    @Get()
    async getLogs(@Query() query: AdminQueryDto & { adminId?: string; action?: string }) {
        const { page = 1, limit = 20, adminId, action } = query;

        return this.adminService.getLogs({
            page,
            limit,
            adminId,
            action,
        });
    }
}
