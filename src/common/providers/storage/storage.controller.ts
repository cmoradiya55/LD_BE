import { Body, Controller, Get, Post } from '@nestjs/common';
import { StorageService } from './storage.service';
import { GroupedUploadUrlDto } from './dto/get-upload-url.dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) { }

  @Post('upload-url')
  async getUploadUrl(@Body() body: GroupedUploadUrlDto) {
    return await this.storageService.generateGroupedUrls(body);
  }
}
