import {
    IsString,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    IsEnum,
    IsOptional,
    IsNumber,
    Min,
    Max,
    ArrayMinSize,
    ArrayMaxSize,
    ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VideoCategory } from '@common/enums/storage.enum';
import { MAX_VIDEO_FILE_UPLOAD_ALLOWED, MIN_VIDEO_FILE_UPLOAD_REQUIRED } from '@common/constants/app.constant';

export class FileMetadataDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: string; // MIME type

    @IsNumber()
    @Min(1)
    @Max(500 * 1024 * 1024) // 500MB max
    size: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(300) // 5 minutes max
    duration?: number; // Video duration in seconds (optional, for videos)
}

// ✅ Separate DTO for video uploads (stricter validation)
export class VideoUploadUrlDto {
    @IsEnum(VideoCategory)
    category: VideoCategory;

    @IsArray()
    @ArrayMinSize(MIN_VIDEO_FILE_UPLOAD_REQUIRED, { message: `At least ${MIN_VIDEO_FILE_UPLOAD_REQUIRED} file must be provided` })
    @ArrayMaxSize(MAX_VIDEO_FILE_UPLOAD_ALLOWED, { message: `Maximum ${MAX_VIDEO_FILE_UPLOAD_ALLOWED} files allowed` }) // Max 5 videos at once
    @ValidateNested({ each: true })
    @Type(() => FileMetadataDto)
    files: FileMetadataDto[];

    @ValidateIf((o) => Array.isArray(o.files) && o.files.length > 1)
    @IsNotEmpty()
    @IsString()
    entityId: string; // The Car UUID
}