import { Body, Controller, Delete, Get, Ip, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { Customer } from '@entity/customer/customer.entity';
import { CJwtAuthGuard } from '../c-auth/guards/jwt-c-auth.guard';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { CustomerProfileResource } from './resources/customer-profile.resource';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SendEmailVerificationOtpDto } from './dto/send-email-verification-otp.dto';
import { VerifyEmailVerificationOtpDto } from './dto/verify-email-verification-otp.dto';
import { RequestDeleteOtpDto } from './dto/request-delete-otp.dto';
import { ConfirmDeleteDto } from './dto/confirm-delete.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CityUpdateResource } from './resources/city-update.resource';
import { UpdatedCustomerProfileResource } from './resources/updated-customer-profile.resource';
import { CurrentCustomer } from '@common/decorators/current-customer.decorator';

@Controller(`${MODULE_PREFIX.CUSTOMER}/profile`)
@UseGuards(CJwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  /**
  * Get current customer profile
  */
  @Get()
  async getProfile(@CurrentCustomer() customer: Customer) {
    const customerData = await this.profileService.getProfile(customer.id);
    return ApiResponseUtil.success(
      'Profile fetched successfully',
      new CustomerProfileResource(customerData),
    );
  }

  @Patch('city/:id')
  async updateCity(
    @CurrentCustomer() customer: Customer,
    @Param() dto: UpdateCityDto,
  ) {
    const data = await this.profileService.updateCity(customer, dto);
    return ApiResponseUtil.updated(
      'Profile city updated successfully',
      new CityUpdateResource(data),
    );
  }

  /**
  * Update customer profile
  */
  @Put()
  async updateProfile(
    @CurrentCustomer() customer: Customer,
    @Body() dto: UpdateProfileDto,
  ) {
    const data = await this.profileService.updateProfile(customer, dto);

    return ApiResponseUtil.updated(
      'Profile updated successfully',
      new UpdatedCustomerProfileResource(data),
    );
  }

  @Post('email-otp/send')
  async sendEmailVerificationOtp(
    @CurrentCustomer() customer: Customer,
    @Body() dto: SendEmailVerificationOtpDto,
    @Ip() ip: string
  ) {
    await this.profileService.sendEmailVerificationOtp(customer, dto, ip);

    return ApiResponseUtil.success(
      'Email verification OTP sent successfully',
    );
  }

  @Post('email-otp/verify')
  async verifyEmailVerificationOtp(
    @CurrentCustomer() customer: Customer,
    @Body() dto: VerifyEmailVerificationOtpDto,
  ) {
    await this.profileService.verifyEmailVerificationOtp(customer, dto);

    return ApiResponseUtil.success(
      'Email verification OTP verified successfully',
    );
  }

  @Post('delete/send-otp')
  async sendProfileDeleteOtp(
    @CurrentCustomer() customer: Customer,
    @Body() dto: RequestDeleteOtpDto,
    @Ip() ip: string
  ) {
    await this.profileService.sendProfileDeleteOtp(customer, dto, ip);

    return ApiResponseUtil.success(
      'Account deletion OTP sent successfully',
    );
  }


  @Delete('delete')
  async confirmProfileDelete(
    @CurrentCustomer() customer: Customer,
    @Body() dto: ConfirmDeleteDto,
  ) {
    await this.profileService.confirmProfileDelete(customer, dto);

    return ApiResponseUtil.success(
      'Account deleted successfully',
    );
  }
}
