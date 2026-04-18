import { Module } from '@nestjs/common';
import { JobPostingController } from './job-posting.controller';
import { JobPostingService } from './job-posting.service';
import { UploadModule } from '../upload/upload.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [UploadModule, PrismaModule],
    controllers: [JobPostingController],
    providers: [JobPostingService],
    exports: [JobPostingService],
})
export class JobPostingModule { }
