import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { EmployerModule } from './modules/employer/employer.module';
import { SavedPortfolioModule } from './modules/saved-portfolio/saved-portfolio.module';
import { FollowModule } from './modules/follow/follow.module';
import { CommunityModule } from './modules/community/community.module';
import { UploadModule } from './modules/upload/upload.module';
import { JobPostingModule } from './modules/job-posting/job-posting.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { NotificationModule } from './modules/notification/notification.module';
import { SavedItemsModule } from './modules/saved-items/saved-items.module';
import { AdminModule } from './modules/admin/admin.module';
import { ReportModule } from './modules/report/report.module';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    ProfileModule,
    EmployerModule,
    SavedPortfolioModule,
    FollowModule,
    CommunityModule,
    UploadModule,
    JobPostingModule,
    MessagingModule,
    NotificationModule,
    SavedItemsModule,
    AdminModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('auth', 'api');
  }
}

