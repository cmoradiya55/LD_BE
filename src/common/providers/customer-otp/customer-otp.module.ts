import { Module } from '@nestjs/common';
import { CustomerOtpService } from './customer-otp.service';
import { CustomerOtpController } from './customer-otp.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [
    RepositoriesModule
  ],
  controllers: [CustomerOtpController],
  providers: [CustomerOtpService],
  exports: [CustomerOtpService],
})
export class CustomerOtpModule { }
