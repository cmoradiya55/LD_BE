import { Module } from '@nestjs/common';
import { AProfileService } from './a-profile.service';
import { AProfileController } from './a-profile.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [AProfileController],
  providers: [AProfileService],
})
export class AProfileModule {}
