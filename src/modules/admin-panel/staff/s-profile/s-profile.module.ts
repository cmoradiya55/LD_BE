import { Module } from '@nestjs/common';
import { SProfileService } from './s-profile.service';
import { SProfileController } from './s-profile.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [SProfileController],
  providers: [SProfileService],
})
export class SProfileModule {}
