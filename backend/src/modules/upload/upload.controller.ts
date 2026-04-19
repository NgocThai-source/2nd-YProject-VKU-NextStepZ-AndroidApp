import {
    Controller,
    Post,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    /**
     * Upload a single base64 image
     * POST /upload/image
     */
    @Post('image')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async uploadImage(
        @Body() body: { base64Data: string; folder?: string },
    ): Promise<{ url: string }> {
        const url = await this.uploadService.uploadBase64File(
            body.base64Data,
            body.folder || 'job-postings',
        );
        return { url };
    }

    /**
     * Upload multiple base64 images
     * POST /upload/images
     */
    @Post('images')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async uploadImages(
        @Body() body: { base64Files: string[]; folder?: string },
    ): Promise<{ urls: string[] }> {
        const urls = await this.uploadService.uploadMultipleBase64Files(
            body.base64Files,
            body.folder || 'job-postings',
        );
        return { urls };
    }
}
