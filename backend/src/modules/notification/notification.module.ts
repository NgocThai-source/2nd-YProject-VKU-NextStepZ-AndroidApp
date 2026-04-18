import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
    imports: [PrismaModule, forwardRef(() => MessagingModule)],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService],
})
export class NotificationModule { }

