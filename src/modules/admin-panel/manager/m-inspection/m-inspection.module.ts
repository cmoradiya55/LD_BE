import { Module } from '@nestjs/common';
import { MInspectionService } from './m-inspection.service';
import { MInspectionController } from './m-inspection.controller';
import { RepositoriesModule } from '@repository/repositories.module';
import { InspectionModule } from '../../inspector/inspection/inspection.module';

@Module({
  imports: [RepositoriesModule , InspectionModule],
  controllers: [MInspectionController],
  providers: [MInspectionService],
})
export class MInspectionModule {}
