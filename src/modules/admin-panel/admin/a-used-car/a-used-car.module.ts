import { Module } from '@nestjs/common';
import { AUsedCarService } from './a-used-car.service';
import { AUsedCarController } from './a-used-car.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [AUsedCarController],
  providers: [AUsedCarService],
})
export class AUsedCarModule {}
