import { BaseService } from '@common/base/base.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '@repository/customer/customer.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Customer } from '@entity/customer/customer.entity';
import { SendEmailVerificationOtpDto } from './dto/send-email-verification-otp.dto';
import { OTP_EXPIRY_MS } from '@common/constants/app.constant';
import { CustomerOtpRepository } from '@repository/customer/customer-otp.repository';
import { CustomerOtpType } from '@common/enums/customer.enum';
import { VerifyEmailVerificationOtpDto } from './dto/verify-email-verification-otp.dto';
import { CustomerOtpService } from '@common/providers/customer-otp/customer-otp.service';
import { RequestDeleteOtpDto } from './dto/request-delete-otp.dto';
import { GenerateOtpAndSaveDto } from '@common/providers/customer-otp/dto/generate-otp-and-save.dto';
import { ConfirmDeleteDto } from './dto/confirm-delete.dto';
import { CustomerFcmTokenRepository } from '@repository/customer/customer-fcm-token.repository';
import { CustomerRefreshTokenRepository } from '@repository/customer/customer-refresh-token.repository';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { UpdateCityDto } from './dto/update-city.dto';
import { CityRepository } from '@repository/general/city.repository';
import { City } from '@entity/general/city.entity';

@Injectable()
export class ProfileService {
    constructor(
        private readonly baseService: BaseService,
        private readonly customerRepo: CustomerRepository,
        private readonly otpRepo: CustomerOtpRepository,
        private readonly customerOtpService: CustomerOtpService,
        private readonly customerFcmTokenRepo: CustomerFcmTokenRepository,
        private readonly customerRefreshTokenRepo: CustomerRefreshTokenRepository,
        private readonly usedCarRepo: UsedCarRepository,
        private readonly cityRepo: CityRepository,
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
     * Update customer's city profile
    */
    async updateCity(
        customer: Customer,
        dto: UpdateCityDto,
    ): Promise<City> {
        return this.baseService.catch(async () => {
            const { id } = dto;

            if (customer.city_id === id) {
                const city = await this.cityRepo.getCityById(id);
                if (!city) {
                    throw new NotFoundException('City not found');
                }
                return city;
            }

            const isCityIdValid = await this.cityRepo.isCityIdValid(id);
            if (!isCityIdValid) {
                throw new NotFoundException('City not found');
            }

            const updatedCustomer = await this.customerRepo.update(customer.id, { city_id: Number(id) });
            if (!updatedCustomer) {
                throw new NotFoundException('Customer not found after update');
            }
            const city = await this.cityRepo.getCityById(updatedCustomer.city_id!);
            if (!city) {
                throw new NotFoundException('City not found');
            }
            return city;
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

            // Generate OTP and save in database
            const otpData = await this.customerOtpService.generateOtpAndSave(customer.id, {
                identifier,
                otpType,
                otpExpiryMs: OTP_EXPIRY_MS.EMAIL,
                requestIp,
            } as GenerateOtpAndSaveDto)
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
    async sendProfileDeleteOtp(customer: Customer, dto: RequestDeleteOtpDto, requestIp: string) {
        return this.baseService.catch(async (manager) => {
            const { reason } = dto;

            await this.customerRepo.update(customer.id, {
                account_delete_reason: reason,
            }, manager);


            // Generate OTP and save in database
            const otpData = await this.customerOtpService.generateOtpAndSave(customer.id, {
                identifier: `${customer.mobile_country_code}${customer.mobile_no}`,
                otpType: CustomerOtpType.ACCOUNT_DELETE,
                otpExpiryMs: OTP_EXPIRY_MS.ACCOUNT_DELETE,
                requestIp,
            } as GenerateOtpAndSaveDto, manager);

            // send otp to mobile number
        }, true);
    }

    /**
     * Confirm account deletion with OTP
     */
    async confirmProfileDelete(customer: Customer, dto: ConfirmDeleteDto) {
        return this.baseService.catch(async (manager) => {
            const { otp } = dto;
            const identifier = `${customer.mobile_country_code}${customer.mobile_no}`;
            const otpType = CustomerOtpType.ACCOUNT_DELETE;

            await this.customerOtpService.verifyOtp(
                identifier,
                otp,
                otpType,
                manager
            );

            await this.customerRepo.softDelete(customer.id, manager);
            await this.otpRepo.softDeleteByCustomerId(customer.id, manager);
            await this.customerFcmTokenRepo.softDeleteByCustomerId(customer.id, manager);
            await this.customerRefreshTokenRepo.softDeleteByCustomerId(customer.id, manager);
            await this.usedCarRepo.softDeleteByCustomerId(customer.id, manager);
        }, true);
    }
}
