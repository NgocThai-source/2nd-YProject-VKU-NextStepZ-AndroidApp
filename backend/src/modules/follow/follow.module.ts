import { Module, forwardRef } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [PrismaModule, forwardRef(() => NotificationModule)],
    controllers: [FollowController],
    providers: [FollowService],
    exports: [FollowService],
})
export class FollowModule { }

