import { Body, Controller, Get, Post } from '@nestjs/common';
import { StorageService } from './storage.service';
import { GroupedUploadUrlDto } from './dto/get-upload-url.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { UploadUrlResource } from './resource/upload-url.resource';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) { }

  @Post('upload-url')
  async getUploadUrl(@Body() body: GroupedUploadUrlDto) {
    const data = await this.storageService.generateGroupedUrls(body);
    return ApiResponseUtil.success(
      'Upload URLs generated successfully',
      UploadUrlResource.collection(data)
    );
  }
}
