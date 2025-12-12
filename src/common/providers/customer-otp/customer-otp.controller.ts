import { Controller } from '@nestjs/common';
import { CustomerOtpService } from './customer-otp.service';

@Controller('customer-otp')
export class CustomerOtpController {
  constructor(private readonly customerOtpService: CustomerOtpService) {}
}
