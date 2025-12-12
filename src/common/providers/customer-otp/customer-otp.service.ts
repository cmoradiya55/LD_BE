import { BaseService } from '@common/base/base.service';
import { CustomerOtpType } from '@common/enums/customer.enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerOtpRepository } from '@repository/customer/customer-otp.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class CustomerOtpService {

    constructor(
        private readonly otpRepo: CustomerOtpRepository,
        private readonly baseService: BaseService,
    ) { }

    /**
        * Verify OTP
        */
    async verifyOtp(
        identifier: string,
        otp: string,
        otpType: CustomerOtpType,
        manager?: EntityManager,
    ): Promise<void> {
        const otpEntity = await this.otpRepo.findActiveOtp(
            identifier,
            otp,
            otpType,
            manager
        );

        if (!otpEntity) {
            throw new BadRequestException('Invalid OTP');
        }

        if (new Date() > otpEntity.expires_at) {
            throw new BadRequestException('OTP expired');
        }

        if (otpEntity.attempts >= otpEntity.max_attempts) {
            throw new BadRequestException('Max attempts exceeded');
        }

        // Mark as verified
        await this.otpRepo.markAsVerified(otpEntity.id, manager);

        return;
    }

}
