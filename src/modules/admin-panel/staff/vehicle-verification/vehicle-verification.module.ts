import { Module } from '@nestjs/common';
import { VehicleVerificationService } from './vehicle-verification.service';
import { VehicleVerificationController } from './vehicle-verification.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [VehicleVerificationController],
  providers: [VehicleVerificationService],
})
export class VehicleVerificationModule { }
