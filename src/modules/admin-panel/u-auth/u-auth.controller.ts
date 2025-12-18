import { Body, Controller, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UAuthService } from './u-auth.service';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { UAuthLoginDto } from './dto/u-auth.login.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { UAuthSendOtpOnMobileDto } from './dto/u-auth-send-otp.dto';
import { UserVerifyAndLoginResource } from './resource/verify-and-login.resource';
import { UAuthEmailVerificationOtpDto } from './dto/u-auth-send-email-otp.dto';
import type { Request, Response } from 'express';
import { UserRefreshAccessTokenResource } from './resource/refresh-access-token.resource';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { User } from '@entity/user/user.entity';
import { UAuthVerifyEmailOtpDto } from './dto/u-auth.verify-email-otp.dto';
import { UploadUserDocumentsDto } from './dto/upload-verification-document.dto';
import { UserAuthPublic } from './decorator/user-auth-public.decorator';
import { AllowUnverifiedEmailAndDocument } from './decorator/allow-unverified-email-document.decorator';

@Controller(`${MODULE_PREFIX.ADMIN}/auth`)
export class UAuthController {
  constructor(private readonly uAuthService: UAuthService) { }

  @UserAuthPublic()
  @Post('mobile/send-otp')
  async sendOtp(@Body() sendOtpDto: UAuthSendOtpOnMobileDto) {
    await this.uAuthService.sendOtpForLogin(sendOtpDto);
    return ApiResponseUtil.success('OTP sent successfully')
  }

  @UserAuthPublic()
  @Post('mobile/verify-otp')
  async userLogin(
    @Body() dto: UAuthLoginDto,
    @Res({ passthrough: true }) res: Response, // <-- enable setting cookies
  ) {
    const data = await this.uAuthService.userLogin(dto, res);
    return ApiResponseUtil.created(
      'Login successful',
      new UserVerifyAndLoginResource(data)
    );
  }

  @AllowUnverifiedEmailAndDocument()
  @Post('email/send-otp')
  async sendOtpOnEmail(
    @CurrentUser() user: User,
    @Body() sendOtpDto: UAuthEmailVerificationOtpDto,
  ) {
    await this.uAuthService.sendOtpForEmailVerification(user, sendOtpDto);
    return ApiResponseUtil.success('OTP sent successfully')
  }

  @AllowUnverifiedEmailAndDocument()
  @Post('email/verify-otp')
  async verifyOtpOnEmail(
    @CurrentUser() user: User,
    @Body() dto: UAuthVerifyEmailOtpDto
  ) {
    await this.uAuthService.verifyOtpForEmailVerification(user, dto);
    return ApiResponseUtil.success('OTP verified successfully')
  }

  @UserAuthPublic()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
  ) {
    const data = await this.uAuthService.refreshAccessToken(req);
    return ApiResponseUtil.success(
      'Token refreshed successfully',
      new UserRefreshAccessTokenResource(data)
    );
  }

  @AllowUnverifiedEmailAndDocument()
  @Patch('documents')
  async submitDocumentsForVerification(
    @CurrentUser() user: User,
    @Body() dto: UploadUserDocumentsDto,
  ) {
    await this.uAuthService.submitDocumentsForVerification(user, dto);
    return ApiResponseUtil.created(
      'Documents submitted successfully'
    );
  }
}
