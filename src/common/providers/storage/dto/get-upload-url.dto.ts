// src/media/dto/generate-grouped-url.dto.ts
import { IsEnum, IsString, IsArray, ValidateNested, Matches, ArrayMaxSize, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { MediaCategory } from '@common/enums/storage.enum';
import { MAX_FILE_UPLOAD_ALLOWED, MIN_FILE_UPLOAD_REQUIRED } from '@common/constants/app.constant';

class FileRequestDto {
    @IsString()
    @Matches(/^[a-zA-Z0-9.-]+$/, { message: 'Invalid filename' })
    name: string;


    @IsString()
    type: string;
}

export class GroupedUploadUrlDto {
    @IsString()
    entityId: string; // The Car UUID

    @IsEnum(MediaCategory)
    category: MediaCategory;

    @IsArray()
    @ArrayMinSize(MIN_FILE_UPLOAD_REQUIRED, { message: `At least ${MIN_FILE_UPLOAD_REQUIRED} file must be provided` })
    @ArrayMaxSize(MAX_FILE_UPLOAD_ALLOWED, { message: `Maximum ${MAX_FILE_UPLOAD_ALLOWED} files allowed` })
    @ValidateNested({ each: true })
    @Type(() => FileRequestDto)
    files: FileRequestDto[];
}