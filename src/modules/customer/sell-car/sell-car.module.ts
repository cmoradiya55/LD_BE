import { Module } from '@nestjs/common';
import { SellCarService } from './sell-car.service';
import { SellCarController } from './sell-car.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [SellCarController],
  providers: [SellCarService],
})
export class SellCarModule {}
