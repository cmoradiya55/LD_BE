import { Module } from '@nestjs/common';
import { IProfileService } from './i-profile.service';
import { IProfileController } from './i-profile.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [IProfileController],
  providers: [IProfileService],
})
export class IProfileModule {}
