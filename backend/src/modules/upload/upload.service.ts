import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
    private readonly uploadDir = path.join(process.cwd(), 'uploads');

    constructor() {
        // Ensure upload directories exist
        this.ensureDirectoryExists(this.uploadDir);
        this.ensureDirectoryExists(path.join(this.uploadDir, 'job-postings'));
        this.ensureDirectoryExists(path.join(this.uploadDir, 'avatars'));
    }

    private ensureDirectoryExists(dir: string): void {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    /**
     * Upload a file from base64 data
     * @param base64Data - The base64 encoded file data (with or without data URL prefix)
     * @param folder - Subfolder to store the file (e.g., 'job-postings', 'avatars')
     * @returns The URL path to access the uploaded file
     */
    async uploadBase64File(base64Data: string, folder: string = 'job-postings'): Promise<string> {
        // Extract the actual base64 data and file type
        let fileData: string;
        let extension = 'png'; // default extension

        if (base64Data.startsWith('data:')) {
            // Has data URL prefix like "data:image/png;base64,..."
            const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
            if (matches) {
                extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
                fileData = matches[2];
            } else {
                // Fallback: just remove the prefix
                fileData = base64Data.split(',')[1] || base64Data;
            }
        } else {
            fileData = base64Data;
        }

        // Generate unique filename
        const filename = `${uuidv4()}.${extension}`;
        const folderPath = path.join(this.uploadDir, folder);
        this.ensureDirectoryExists(folderPath);

        const filePath = path.join(folderPath, filename);

        // Write file to disk
        const buffer = Buffer.from(fileData, 'base64');
        await fs.promises.writeFile(filePath, buffer);

        // Return the URL path (relative to server)
        return `/uploads/${folder}/${filename}`;
    }

    /**
     * Upload multiple base64 files
     * @param base64Files - Array of base64 encoded file data
     * @param folder - Subfolder to store the files
     * @returns Array of URL paths
     */
    async uploadMultipleBase64Files(base64Files: string[], folder: string = 'job-postings'): Promise<string[]> {
        const uploadPromises = base64Files.map(file => this.uploadBase64File(file, folder));
        return Promise.all(uploadPromises);
    }

    /**
     * Delete a file by its URL path
     * @param urlPath - The URL path returned from upload (e.g., '/uploads/job-postings/xxx.png')
     */
    async deleteFile(urlPath: string): Promise<void> {
        if (!urlPath || !urlPath.startsWith('/uploads/')) {
            return;
        }

        const relativePath = urlPath.replace('/uploads/', '');
        const filePath = path.join(this.uploadDir, relativePath);

        try {
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
        } catch (error) {
            console.error(`Failed to delete file: ${filePath}`, error);
        }
    }

    /**
     * Delete multiple files
     * @param urlPaths - Array of URL paths
     */
    async deleteMultipleFiles(urlPaths: string[]): Promise<void> {
        await Promise.all(urlPaths.map(path => this.deleteFile(path)));
    }
}
