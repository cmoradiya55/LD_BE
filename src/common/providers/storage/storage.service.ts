// src/media/media.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { GroupedUploadUrlDto } from './dto/get-upload-url.dto';
import { MEDIA_ZONE_MAP, VIDEO_CATEGORIES } from '@common/enums/storage.enum';
import { ALLOWED_FILE_TYPES, ALLOWED_VIDEO_FILE_TYPES, VIDEO_CONSTRAINTS } from '@common/constants/app.constant';
import { S3Service } from './s3.service';
import { BaseService } from '@common/base/base.service';
import { VideoUploadUrlDto } from './dto/video-upload-url.dto';

@Injectable()
export class StorageService {
    constructor(
        private readonly baseService: BaseService,
        private readonly s3Service: S3Service
    ) { }

    async generateGroupedUrls(dto: GroupedUploadUrlDto) {
        return this.baseService.catch(async () => {
            // 1. Destructure based on your requirement: "At a time only one category files coming"
            const { category, files, entityId } = dto;

            // 2. Validate Zone Logic
            const zone = MEDIA_ZONE_MAP[category];
            if (!zone) throw new BadRequestException(`Unknown category: ${category}`);

            // 3. Process Files in Parallel
            const urlPromises = files.map(async (file) => {
                const { name, type } = file;

                // A. VALIDATION LAYER (Replaces your giant if/else block)
                this.validateFileType(name, type);

                // B. SANITIZATION LAYER
                const cleanName = StorageService.sanitizeFilename(name);

                const key = this.buildS3Key(zone, category, entityId, cleanName);

                // D. INFRASTRUCTURE LAYER
                const presigned = await this.s3Service.signUrl(key, type);

                return {
                    originalName: name,
                    uploadUrl: presigned.url,
                    key: presigned.key,
                    contentType: type,
                };
            });

            return Promise.all(urlPromises);
        })
    }

    // --- Private Helper Method to keep main logic clean ---
    private validateFileType(fileName: string, mimeType: string): void {
        // Check 1: Is the MIME type allowed?
        const allowedExtensions = ALLOWED_FILE_TYPES[mimeType];
        if (!allowedExtensions) {
            throw new BadRequestException(`File type ${mimeType} is not supported`);
        }

        // Check 2: Does the extension match the MIME type?
        // (Prevents naming a .exe file as .jpg)
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (!extension || !allowedExtensions.includes(extension)) {
            throw new BadRequestException(
                `File extension .${extension} does not match content type ${mimeType}`
            );
        }
    }

    private validateVideoFileType(fileName: string, mimeType: string): void {
        // Check 1: Is the MIME type allowed?
        const allowedExtensions = ALLOWED_VIDEO_FILE_TYPES[mimeType];
        if (!allowedExtensions) {
            throw new BadRequestException(`File type ${mimeType} is not supported`);
        }

        // Check 2: Does the extension match the MIME type?
        // (Prevents naming a .exe file as .jpg)
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (!extension || !allowedExtensions.includes(extension)) {
            throw new BadRequestException(
                `File extension .${extension} does not match content type ${mimeType}`
            );
        }
    }

    /**
     * ✅ Generate upload URLs for videos (separate endpoint)
     */
    async generateVideoUploadUrls(dto: VideoUploadUrlDto) {
        return this.baseService.catch(async () => {
            const { category, files, entityId } = dto;

            // Validate category is for videos
            if (!VIDEO_CATEGORIES.includes(category)) {
                throw new BadRequestException(
                    `Category ${category} is not valid for video uploads`
                );
            }

            const zone = MEDIA_ZONE_MAP[category];
            if (!zone) throw new BadRequestException(`Unknown category: ${category}`);

            // Process videos in parallel
            const urlPromises = files.map(async (file) => {
                // Validate as video
                this.validateVideoFile(file);

                const cleanName = StorageService.sanitizeFilename(file.name);
                const key = this.buildS3Key(zone, category, entityId, cleanName);

                // ✅ Videos need longer upload time (15 minutes)
                const presigned = await this.s3Service.signUrl(key, file.type, 900); // 15 min

                return {
                    originalName: file.name,
                    uploadUrl: presigned.url,
                    key: presigned.key,
                    contentType: file.type,
                    maxSize: VIDEO_CONSTRAINTS.MAX_SIZE,
                    maxDuration: VIDEO_CONSTRAINTS.MAX_DURATION,
                    expiresIn: 900, // 15 minutes
                };
            });

            return Promise.all(urlPromises);
        });
    }


    private static sanitizeFilename(name: string): string {
        return name
            .trim()                                // remove leading/trailing spaces
            .replace(/[^a-zA-Z0-9._ -]/g, '_')     // replace unsafe chars
            .replace(/_+/g, '_')                    // collapse multiple underscores
            .replace(/\s+/g, '_')                   // replace spaces with underscore
            .replace(/\.{2,}/g, '.')                // collapse multiple dots
            .replace(/^\.*/, '')                     // remove leading dots
            .substring(0, 255);                     // max filename length
    }

    /**
    * ✅ Validate video file
    */
    private validateVideoFile(file: {
        name: string;
        type: string;
        size: number;
        duration?: number
    }): void {

        this.validateVideoFileType(file.name, file.type);

        // Check file size
        if (file.size > VIDEO_CONSTRAINTS.MAX_SIZE) {
            throw new BadRequestException(
                `Video size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${VIDEO_CONSTRAINTS.MAX_SIZE / 1024 / 1024}MB`
            );
        }

        // Check duration (if provided)
        if (file.duration && file.duration > VIDEO_CONSTRAINTS.MAX_DURATION) {
            throw new BadRequestException(
                `Video duration ${file.duration}s exceeds maximum ${VIDEO_CONSTRAINTS.MAX_DURATION}s (${VIDEO_CONSTRAINTS.MAX_DURATION / 60} minutes)`
            );
        }
    }


    /**
     * Build S3 key
     */
    private buildS3Key(
        zone: string,
        category: string,
        entityId: string | undefined,
        fileName: string,
    ): string {
        const parts: string[] = [zone, category];

        if (entityId?.trim()) {
            parts.push(entityId.trim());
        }

        const timestamp = Date.now();
        return `${parts.join('/')}/${timestamp}_${fileName}`;
    }
}