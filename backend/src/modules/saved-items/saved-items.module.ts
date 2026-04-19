import { Module, forwardRef } from '@nestjs/common';
import { SavedItemsController } from './saved-items.controller';
import { SavedItemsService } from './saved-items.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
    imports: [
        PrismaModule,
        forwardRef(() => MessagingModule),
    ],
    controllers: [SavedItemsController],
    providers: [SavedItemsService],
    exports: [SavedItemsService],
})
export class SavedItemsModule { }
