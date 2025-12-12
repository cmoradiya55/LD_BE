import { BaseService } from '@common/base/base.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '@repository/customer/customer.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Customer } from '@entity/customer/customer.entity';
import { SendEmailVerificationOtpDto } from './dto/send-email-verification-otp.dto';
import { CommonHelper } from '@common/helpers/common.helper';
import { OTP_EXPIRY_MS } from '@common/constants/app.constant';
import { CustomerOtpRepository } from '@repository/customer/customer-otp.repository';
import { CustomerOtpType } from '@common/enums/customer.enum';
import { CustomerOtp } from '@entity/customer/customer-otp.entity';
import { VerifyEmailVerificationOtpDto } from './dto/verify-email-verification-otp.dto';
import { CustomerOtpService } from '@common/providers/customer-otp/customer-otp.service';

@Injectable()
export class ProfileService {
    constructor(
        private readonly baseService: BaseService,
        private readonly customerRepo: CustomerRepository,
        private readonly otpRepo: CustomerOtpRepository,
        private readonly customerOtpService: CustomerOtpService,
    ) { }

    /**
        * Get customer profile
        */
    async getProfile(customerId: number) {
        return this.baseService.catch(async () => {
            const customer = await this.customerRepo.findById(customerId);

            if (!customer) {
                throw new NotFoundException('Customer not found');
            }

            return customer;
        });
    }

    /**
     * Update customer profile
     */
    async updateProfile(customer: Customer, dto: UpdateProfileDto) {
        return this.baseService.catch(async () => {
            const { email, full_name, profile_image } = dto;

            // Check if email is already taken by another customer
            const existingCustomer = await this.customerRepo.findByEmailExcludingId(email, customer.id);
            if (existingCustomer) throw new ConflictException('Email is already in use by another account');

            // Check if email changed - reset verification
            const emailChanged = customer.email !== email;
            if (emailChanged) {
                await this.customerRepo.update(customer.id, {
                    full_name,
                    email,
                    is_email_verified: false,
                    profile_image,
                });
            } else {
                // Update profile
                await this.customerRepo.update(customer.id, {
                    full_name,
                    profile_image,
                });
            }

            // Fetch updated profile
            const updatedCustomer = await this.customerRepo.findById(customer.id);
            if (!updatedCustomer) throw new NotFoundException('Customer not found after update');
            return updatedCustomer;
        });
    }

    /**
     * Request OTP for email verification
     */
    async sendEmailVerificationOtp(
        customer: Customer,
        dto: SendEmailVerificationOtpDto,
        requestIp: string
    ) {
        return this.baseService.catch(async () => {
            const { email } = dto;
            const identifier = email;
            const otpType = CustomerOtpType.EMAIL_VERIFY;

            console.log('Sending email verification OTP to:', email);
            console.log('Customer:', customer);
            console.log('Request IP:', customer.email === email ? 'Same as customer email' : requestIp);

            // check this is our email and is already verified
            if (customer.email === email && customer.is_email_verified) {
                throw new ConflictException('Email is already verified');
            }
            // check that email is not already taken and verified by another customer
            const existingCustomer = await this.customerRepo.findByEmailExcludingId(email, customer.id);
            if (existingCustomer) throw new ConflictException('Email is already in use by another account');

            // Generate OTP
            const otp = CommonHelper.generateOtp();
            const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS.EMAIL);

            // Invalidate previous OTPs
            await this.otpRepo.invalidatePreviousOtps(identifier, otpType);

            // Create new OTP
            const otpEntity = this.otpRepo.create({
                customer_id: customer.id,
                identifier: email,
                otp,
                otp_type: otpType,
                expires_at: expiresAt,
                request_ip: requestIp,
            } as CustomerOtp);

            const otpData = await this.otpRepo.save(otpEntity);
            console.log('OTP Data:', otpData);

            // send otp to email
        });
    }

    /**
     * Request OTP for email verification
    */
    async verifyEmailVerificationOtp(
        customer: Customer,
        dto: VerifyEmailVerificationOtpDto,
    ) {
        return this.baseService.catch(async (manager) => {
            const { email, otp } = dto;
            const identifier = email;
            const otpType = CustomerOtpType.EMAIL_VERIFY;

            await this.customerOtpService.verifyOtp(
                identifier,
                otp,
                otpType,
                manager
            );

            await this.customerRepo.update(customer.id, {
                email: email,
                is_email_verified: true,
                email_verified_at: new Date(),
            }, manager);

        }, true);
    }

    /**
     * Request OTP for account deletion
     */
    async requestDeleteOtp(customerId: number, reason?: string) {
        return this.baseService.catch(async () => {
            // // Get customer mobile
            // const customer = await this.customerRepo.getCustomerMobile(customerId);
            // if (!customer) {
            //     throw new NotFoundException('Customer not found');
            // }

            // // Generate and send OTP
            // const otp = await this.otpService.generateAndSend({
            //     countryCode: customer.mobile_country_code,
            //     mobileNo: customer.mobile_no,
            //     purpose: OTP_PURPOSE.ACCOUNT_DELETE,
            //     customerId,
            //     metadata: { reason },
            // });

            // // Mask mobile number for response
            // const maskedMobile = this.maskMobileNumber(customer.mobile_no.toString());

            // return {
            //     message: 'OTP sent successfully',
            //     maskedMobile: `+${customer.mobile_country_code} ${maskedMobile}`,
            //     expiresIn: 300, // 5 minutes
            // };
        });
    }

    /**
     * Confirm account deletion with OTP
     */
    async confirmDelete(customerId: number, otp: string) {
        return this.baseService.catch(async () => {
            // // Get customer mobile for OTP verification
            // const customer = await this.customerRepo.getCustomerMobile(customerId);
            // if (!customer) {
            //     throw new NotFoundException('Customer not found');
            // }

            // // Verify OTP
            // const isValid = await this.otpService.verify({
            //     countryCode: customer.mobile_country_code,
            //     mobileNo: customer.mobile_no,
            //     otp,
            //     purpose: OTP_PURPOSE.ACCOUNT_DELETE,
            //     customerId,
            // });

            // if (!isValid) {
            //     throw new BadRequestException('Invalid or expired OTP');
            // }

            // // Soft delete customer
            // await this.customerRepo.softDeleteCustomer(customerId);

            // // Optionally: Invalidate all tokens, sessions, etc.
            // // await this.authService.invalidateAllSessions(customerId);

            // return {
            //     message: 'Account deleted successfully',
            // };
        });
    }
}
