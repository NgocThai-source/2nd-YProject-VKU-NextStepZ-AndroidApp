import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { AdminService } from './admin.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminUsersController } from './admin-users.controller';
import { AdminEmployersController } from './admin-employers.controller';
import { AdminJobsController } from './admin-jobs.controller';
import { AdminStatsController } from './admin-stats.controller';
import { AdminLogsController } from './admin-logs.controller';
import { AdminPostsController } from './admin-posts.controller';
import { AdminReportsController } from './admin-reports.controller';

@Module({
    imports: [
        PrismaModule,
        NotificationModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '24h' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [
        AdminAuthController,
        AdminUsersController,
        AdminEmployersController,
        AdminJobsController,
        AdminStatsController,
        AdminLogsController,
        AdminPostsController,
        AdminReportsController,
    ],
    providers: [AdminService, AdminAuthService],
    exports: [AdminService],
})
export class AdminModule { }

