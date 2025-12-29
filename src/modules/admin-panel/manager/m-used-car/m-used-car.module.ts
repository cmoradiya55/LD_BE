import { Module } from '@nestjs/common';
import { MUsedCarService } from './m-used-car.service';
import { MUsedCarController } from './m-used-car.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [MUsedCarController],
  providers: [MUsedCarService],
})
export class MUsedCarModule {}
