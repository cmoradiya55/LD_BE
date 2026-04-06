import { Module } from '@nestjs/common';
import { InspectionCentreService } from './inspection-centre.service';
import { InspectionCentreController } from './inspection-centre.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [
    RepositoriesModule
  ],
  controllers: [InspectionCentreController],
  providers: [InspectionCentreService],
})
export class InspectionCentreModule { }
