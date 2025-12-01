// src/media/media.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { GroupedUploadUrlDto } from './dto/get-upload-url.dto';
import { MEDIA_ZONE_MAP } from '@common/enums/storage.enum';
import { ALLOWED_FILE_TYPES } from '@common/constants/app.constant';
import { S3Service } from './s3.service';
import { BaseService } from '@common/base/base.service';

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

                // A. VALIDATION LAYER (Replaces your giant if/else block)
                this.validateFileType(file.name, file.type);

                // B. SANITIZATION LAYER
                const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

                // C. PATH BUILDER LAYER
                const key = `${zone}/${category}/${entityId}/${Date.now()}_${cleanName}`;

                // D. INFRASTRUCTURE LAYER
                const presigned = await this.s3Service.signUrl(key, file.type);

                return {
                    originalName: file.name,
                    uploadUrl: presigned.url,
                    key: presigned.key,
                    contentType: file.type,
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
}