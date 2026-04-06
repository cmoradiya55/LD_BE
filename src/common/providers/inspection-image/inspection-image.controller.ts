import { Controller } from '@nestjs/common';
import { InspectionImageService } from './inspection-image.service';

@Controller('inspection-image')
export class InspectionImageController {
  constructor(private readonly inspectionImageService: InspectionImageService) {}
}
