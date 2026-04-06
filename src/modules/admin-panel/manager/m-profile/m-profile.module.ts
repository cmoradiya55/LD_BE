import { Module } from '@nestjs/common';
import { MProfileService } from './m-profile.service';
import { MProfileController } from './m-profile.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [MProfileController],
  providers: [MProfileService],
})
export class MProfileModule { }
