import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { RepositoriesModule } from '@repository/repositories.module';
import { CustomerOtpModule } from '@common/providers/customer-otp/customer-otp.module';

@Module({
  imports: [
    RepositoriesModule,
    CustomerOtpModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule { }
