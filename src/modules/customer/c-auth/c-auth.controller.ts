import { Body, Controller, Delete, Get, Headers, Ip, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CAuthService } from './c-auth.service';
import { COOKIE_NAMES, MODULE_PREFIX } from '@common/constants/app.constant';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Customer } from '@entity/customer/customer.entity';
import { CAuthSendOtpDto } from './dto/c-auth-send-otp.dto';
import { CAuthLoginDto } from './dto/c-auth.login.dto';
import { CJwtAuthGuard } from './guards/jwt-c-auth.guard';
import { CAuthLogoutDto } from './dto/c-auth.logout.dto';
import { CAuthRefreshTokenDto } from './dto/c-auth-refresh-token.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { VerifyAndLoginResource } from './resources/verify-and-login.resource';
import type { Request, Response } from 'express';
import { RefreshAccessTokenResource } from './resources/refresh-access-token.resource';

@Controller(`${MODULE_PREFIX.CUSTOMER}/auth`)
export class CAuthController {
  constructor(private readonly cAuthService: CAuthService) { }

  @Post('send-otp')
  async sendOtp(@Body() sendOtpDto: CAuthSendOtpDto, @Ip() ip: string) {
    await this.cAuthService.sendOtpForLogin(sendOtpDto, ip);
    return ApiResponseUtil.success('OTP sent successfully')
  }

  @Post('verify-and-login')
  async verifyAndLogin(
    @Body() loginDto: CAuthLoginDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response, // <-- enable setting cookies
  ) {
    const data = await this.cAuthService.loginWithOtp(loginDto, ip, userAgent, res);
    return ApiResponseUtil.success(
      'Login successful',
      new VerifyAndLoginResource(data)
    );
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Body() refreshTokenDto: CAuthRefreshTokenDto
  ) {
    console.log('Request: ', req.cookies);
    const data = await this.cAuthService.refreshAccessToken(req, refreshTokenDto);
    return ApiResponseUtil.success(
      'Token refreshed successfully',
      new RefreshAccessTokenResource(data)
    );
  }

  @UseGuards(CJwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: Customer, @Body() logoutDto: CAuthLogoutDto) {
    await this.cAuthService.logout(user.id, logoutDto.deviceId);
    return ApiResponseUtil.success('Logged out successfully');
  }

  // @UseGuards(CJwtAuthGuard)
  // @Post('logout-all')
  // async logoutAll(@CurrentUser() user: Customer) {
  //   await this.cAuthService.logoutAllDevices(user.id);
  //   return { message: 'Logged out from all devices' };
  // }

  // @UseGuards(CJwtAuthGuard)
  // @Get('devices')
  // async getDevices(@CurrentUser() user: Customer) {
  //   return this.cAuthService.getActiveDevices(user.id);
  // }

  // @UseGuards(CJwtAuthGuard)
  // @Delete('devices/:deviceId')
  // async removeDevice(
  //   @CurrentUser() user: Customer,
  //   @Param('deviceId') deviceId: string,
  // ) {
  //   await this.cAuthService.removeDevice(user.id, deviceId);
  //   return { message: 'Device removed successfully' };
  // }
}
