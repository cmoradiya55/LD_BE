import { Module } from '@nestjs/common';
import { UsedCarService } from './used-car.service';
import { UsedCarController } from './used-car.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [UsedCarController],
  providers: [UsedCarService],
})
export class UsedCarModule { }
