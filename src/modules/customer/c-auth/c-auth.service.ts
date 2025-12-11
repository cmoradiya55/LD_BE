import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomerFcmTokenRepository } from '@repository/customer/customer-fcm-token.repository';
import { CustomerOtpRepository } from '@repository/customer/customer-otp.repository';
import { CustomerRefreshTokenRepository } from '@repository/customer/customer-refresh-token.repository';
import { CustomerRepository } from '@repository/customer/customer.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Customer } from '@entity/customer/customer.entity';
import { CustomerOtpType } from '@common/enums/customer.enum';
import { CAuthLoginDto } from './dto/c-auth.login.dto';
import { CAuthRefreshTokenDto } from './dto/c-auth-refresh-token.dto';
import { CAuthSendOtpDto } from './dto/c-auth-send-otp.dto';
import { BaseService } from '@common/base/base.service';
import { CommonHelper } from '@common/helpers/common.helper';
import { COOKIE_NAMES, OTP_EXPIRY_MS } from '@common/constants/app.constant';
import { CustomerOtp } from '@entity/customer/customer-otp.entity';
import { EntityManager } from 'typeorm';
import { Request, Response } from 'express';
import { JwtTokenService } from './jwt-token.service';


export interface DeviceInfo {
    deviceId: string;
    deviceType: number;
    deviceName?: string;
    deviceFingerprint?: string;
    ipAddress?: string;
    userAgent?: string;
}

@Injectable()
export class CAuthService {
    constructor(
        private readonly baseService: BaseService,
        private readonly customerRepo: CustomerRepository,
        private readonly otpRepo: CustomerOtpRepository,
        private readonly refreshTokenRepo: CustomerRefreshTokenRepository,
        private readonly fcmTokenRepo: CustomerFcmTokenRepository,
        private readonly jwtTokenService: JwtTokenService,
        private readonly configService: ConfigService,
    ) {
        // Schedule cleanup
        this.scheduleTokenCleanup();
    }

    /**
     * Send OTP
     */
    async sendOtpForLogin(
        dto: CAuthSendOtpDto,
        requestIp: string,
    ): Promise<void> {
        return this.baseService.catch(async (manager) => {
            const { country_code, mobile_no } = dto;
            const otpType = CustomerOtpType.REGISTRATION_OR_LOGIN;

            let customer = await this.customerRepo.findByMobileRaw(country_code, mobile_no);

            // if customer exists, check status
            if (customer) {
                if (customer.deleted_at) {
                    throw new BadRequestException('Account has been deleted');
                }
                if (!customer.is_active || customer.is_blocked || (customer.locked_until && customer.locked_until > new Date())) {
                    throw new BadRequestException('Customer is inactive or blocked');
                }
            } else {
                // Create a new inactive customer record
                const newCustomer = this.customerRepo.create({
                    mobile_country_code: country_code,
                    mobile_no: mobile_no,
                } as Customer, manager);

                customer = await this.customerRepo.save(newCustomer, manager);
            }

            if (!customer) throw new BadRequestException('Error while processing your request');

            // Generate OTP
            const otp = CommonHelper.generateOtp();
            const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS.MOBILE);

            // Invalidate previous OTPs
            await this.otpRepo.invalidatePreviousOtps(country_code, mobile_no, otpType);

            // Create new OTP
            const otpEntity = this.otpRepo.create({
                customer_id: customer?.id,
                mobile_country_code: country_code,
                mobile_no: mobile_no,
                otp,
                otp_type: otpType,
                expires_at: expiresAt,
                request_ip: requestIp,
            } as CustomerOtp, manager);

            console.log('Customer: ', customer);
            const otpData = await this.otpRepo.save(otpEntity, manager);
            console.log('OTP Data:', otpData);

            // send sms via external service

            return;

        }, true);
    }

    /**
     * Login with OTP
     */
    async loginWithOtp(
        dto: CAuthLoginDto,
        ipAddress: string,
        userAgent: string,
        res: Response,
    ): Promise<{
        accessToken: string;
        expiresInMs: number;
        isNewDevice: boolean;
        customer: Customer;
    }> {
        return this.baseService.catch(async (manager) => {
            const {
                country_code,
                mobile_no,
                otp,
                device_id,
                device_type,
                device_name,
                fcm_token
            } = dto;

            // Step 1: Verify OTP
            const customer = await this.verifyOtp(
                country_code,
                mobile_no,
                otp,
                manager
            );

            // Step 2:Update customer login info
            await this.customerRepo.updateLoginInfo(
                customer.id,
                ipAddress,
                manager
            );

            // Step 3:Device management
            const deviceInfo: DeviceInfo = {
                deviceId: device_id,
                deviceType: device_type,
                deviceName: device_name,
                ipAddress,
                userAgent,
            };

            const { isNewDevice } = await this.manageDeviceLogin(customer.id, deviceInfo, manager);

            // Step 4:Generate tokens
            const {
                accessToken,
                expiresInMs,
                refreshToken,
                refreshTokenExpiryInMs
            } = await this.jwtTokenService.generateAccessAndRefreshTokens(customer, deviceInfo, manager);

            // Step 5: Register FCM token if provided
            if (fcm_token) {
                await this.registerFcmToken(
                    customer.id,
                    fcm_token,
                    device_id,
                    device_type,
                    device_name,
                );
            }

            // Step 6: Store refresh token in HttpOnly cookie
            await this.jwtTokenService.storeTokenInCookie(refreshToken, COOKIE_NAMES.REFRESH_TOKEN, res, refreshTokenExpiryInMs);

            return {
                accessToken,
                expiresInMs,
                isNewDevice,
                customer,
            };
        }, true);
    }

    /**
     * Verify OTP
     */
    private async verifyOtp(
        mobileCountryCode: number,
        mobileNo: number,
        otp: string,
        manager?: EntityManager,
    ): Promise<Customer> {
        const otpEntity = await this.otpRepo.findActiveOtp(
            mobileCountryCode,
            mobileNo,
            otp,
            CustomerOtpType.REGISTRATION_OR_LOGIN,
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

        // Get or create customer
        let customer = await this.customerRepo.findByMobileOrThrowError(mobileCountryCode, mobileNo);
        if (!customer.is_mobile_verified) {
            await this.customerRepo.update(customer.id, {
                is_mobile_verified: true,
                mobile_verified_at: new Date(),
            });
        }

        return customer;
    }

    /**
     * Device management
     */
    private async manageDeviceLogin(
        customerId: number,
        deviceInfo: DeviceInfo,
        manager?: EntityManager,
    ): Promise<{ isNewDevice: boolean }> {

        const maxDevices = this.configService.getOrThrow<number>('customerJwt.maxDevices');
        // Check if device exists
        const existingDevice = await this.refreshTokenRepo.findByDeviceId(
            customerId,
            deviceInfo.deviceId,
            manager,
        );

        if (existingDevice) {
            // Revoke old token
            // this.logger.log(`♻️ Reusing device: ${deviceInfo.deviceId}`);
            await this.refreshTokenRepo.revokeByDevice(customerId, deviceInfo.deviceId, 'new_login', manager);
            return { isNewDevice: false };
        }

        // Count active devices
        const activeCount = await this.refreshTokenRepo.countActiveDevices(customerId);
        // this.logger.log(`📱 Active devices for user ${customerId}: ${activeCount}`);

        // Check limit
        if (activeCount >= maxDevices) {
            const oldest = await this.refreshTokenRepo.findOldestDevice(customerId);
            if (oldest) {
                await this.refreshTokenRepo.revoke(oldest.id, 'device_limit_exceeded');
                // this.logger.log(`🗑️ Removed oldest device`);
            }
        }

        return { isNewDevice: true };
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken(
        req: Request,
        refreshTokenDto: CAuthRefreshTokenDto,
    ): Promise<{ accessToken: string; expiresInMs: number }> {
        return this.baseService.catch(async () => {
            const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
            const { device_id } = refreshTokenDto;

            if (!refreshToken) throw new UnauthorizedException('Refresh token expired');

            // Verify JWT
            const storedToken = await this.jwtTokenService.verifyRefreshToken(refreshToken, device_id);

            // Generate new access token
            const { accessToken, accessTokenExpiryInMs } = await this.jwtTokenService.generateAccessToken({
                id: storedToken.customer.id,
                country_code: storedToken.customer.mobile_country_code,
                mobile_no: storedToken.customer.mobile_no,
            })

            return {
                accessToken,
                expiresInMs: accessTokenExpiryInMs,
            };
        });
    }

    /**
     * Logout
     */
    async logout(customerId: number, deviceId: string): Promise<void> {
        await this.refreshTokenRepo.revokeByDevice(customerId, deviceId, 'logout');
        await this.fcmTokenRepo.deactivateByDevice(customerId, deviceId);
        // this.logger.log(`👋 User ${ customerId } logged out from device ${ deviceId } `);
    }

    // /**
    //  * Logout all devices
    //  */
    // async logoutAllDevices(customerId: number): Promise<void> {
    //     await this.refreshTokenRepo.revokeAllForCustomer(customerId, 'logout_all');
    //     await this.fcmTokenRepo.deactivateAllForCustomer(customerId);
    //     // this.logger.log(`👋 User ${ customerId } logged out from all devices`);
    // }

    // /**
    //  * Get active devices
    //  */
    // async getActiveDevices(customerId: number) {
    //     const devices = await this.refreshTokenRepo.findActiveDevices(customerId);
    //     return devices.map(device => ({
    //         id: device.id,
    //         device_id: device.device_id,
    //         deviceType: device.device_type,
    //         deviceName: device.device_name,
    //         ipAddress: device.ip_address,
    //         lastUsedAt: device.last_used_at,
    //         createdAt: device.created_at,
    //     }));
    // }

    // /**
    //  * Remove device
    //  */
    // async removeDevice(customerId: number, deviceId: string): Promise<void> {
    //     await this.refreshTokenRepo.revokeByDevice(customerId, deviceId, 'device_removed');
    //     await this.fcmTokenRepo.deactivateByDevice(customerId, deviceId);
    // }

    /**
     * Register FCM token
     */
    private async registerFcmToken(
        customerId: number,
        fcmToken: string,
        deviceId: string,
        deviceType: number,
        deviceName?: string,
        manager?: EntityManager,
    ): Promise<void> {
        const existingToken = await this.fcmTokenRepo.findByDevice(customerId, deviceId);

        if (existingToken) {
            await this.fcmTokenRepo.update(existingToken.id, {
                fcm_token: fcmToken,
                device_name: deviceName,
                is_active: true,
                last_used_at: new Date(),
            }, manager);
        } else {
            const fcmTokenEntity = this.fcmTokenRepo.create({
                customer_id: customerId,
                fcm_token: fcmToken,
                device_id: deviceId,
                device_type: deviceType,
                device_name: deviceName,
            }, manager);

            await this.fcmTokenRepo.save(fcmTokenEntity, manager);
        }
    }

    /**
     * Cleanup
     */
    private scheduleTokenCleanup(): void {
        setInterval(async () => {
            await this.cleanupExpiredTokens();
        }, 60 * 60 * 1000);

        setTimeout(() => this.cleanupExpiredTokens(), 5000);
    }

    async cleanupExpiredTokens(): Promise<void> {
        const count = await this.refreshTokenRepo.deleteExpiredTokens();
        if (count > 0) {
            // this.logger.log(`🧹 Cleaned up ${ count } expired tokens`);
        }
    }
}
