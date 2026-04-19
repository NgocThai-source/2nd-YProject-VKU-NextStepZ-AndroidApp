import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Post()
    async createReport(
        @Body() dto: CreateReportDto,
        @CurrentUser() user: { userId: string },
    ) {
        return this.reportService.createReport(user.userId, dto);
    }
}
