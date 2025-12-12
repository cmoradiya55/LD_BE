import { BaseService } from '@common/base/base.service';
import { CustomerOtpType } from '@common/enums/customer.enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerOtpRepository } from '@repository/customer/customer-otp.repository';
import { EntityManager } from 'typeorm';
import { GenerateOtpAndSaveDto } from './dto/generate-otp-and-save.dto';
import { CustomerOtp } from '@entity/customer/customer-otp.entity';
import { CommonHelper } from '@common/helpers/common.helper';

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

    async generateOtpAndSave(customerId: number, dto: GenerateOtpAndSaveDto, manager?: EntityManager): Promise<CustomerOtp> {
        return this.baseService.catch(async () => {
            const { identifier, otpType, otpExpiryMs, otpLength, requestIp } = dto;
            // Generate OTP
            const otp = CommonHelper.generateOtp(otpLength);
            const expiresAt = new Date(Date.now() + otpExpiryMs);

            // Invalidate previous OTPs
            await this.otpRepo.invalidatePreviousOtps(identifier, otpType, manager);

            // Create new OTP
            const otpEntity = this.otpRepo.create({
                customer_id: customerId,
                identifier: identifier,
                otp,
                otp_type: otpType,
                expires_at: expiresAt,
                request_ip: requestIp,
            } as CustomerOtp, manager);

            const otpData = await this.otpRepo.save(otpEntity, manager);
            console.log('OTP Data:', otpData);
            return otpData;

        });
    }

}
