import { Module } from '@nestjs/common';
import { InspectionImageService } from './inspection-image.service';
import { InspectionImageController } from './inspection-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionImage } from '@entity/used-car/inspection-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InspectionImage])],
  controllers: [InspectionImageController],
  providers: [InspectionImageService],
})
export class InspectionImageModule {}
