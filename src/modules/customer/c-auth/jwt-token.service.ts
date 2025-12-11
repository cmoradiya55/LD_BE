import { BaseService } from "@common/base/base.service";
import { JWT_ACCESS_EXPIRY_UNIT, JWT_REFRESH_EXPIRY_UNIT, JWT_TOKEN_TYPES } from "@common/constants/app.constant";
import { Customer } from "@entity/customer/customer.entity";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { CustomerRefreshTokenRepository } from "@repository/customer/customer-refresh-token.repository";
import * as crypto from 'crypto';
import { DeviceInfo } from "./c-auth.service";
import { EntityManager } from "typeorm";
import { Response } from "express";
import { CustomerRefreshToken } from "@entity/customer/customer-refresh-token.entity";


interface JwtAccessTokenPayload {
    id: number;
    country_code: number;
    mobile_no: number;
}

interface JwtRefreshTokenPayload {
    id: number;
    device_id: string;
    country_code: number;
    mobile_no: number;
}

@Injectable()
export class JwtTokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly baseService: BaseService,
        private readonly configService: ConfigService,
        private readonly refreshTokenRepo: CustomerRefreshTokenRepository
    ) { }

    async generateAccessToken(payload: JwtAccessTokenPayload): Promise<{ accessToken: string, accessTokenExpiryInMs: number }> {
        return this.baseService.catch(async () => {
            const { id, country_code, mobile_no } = payload;
            const jwtSecret = this.configService.getOrThrow<string>('customerJwt.secret');
            const accessTokenExpiry = this.configService.getOrThrow<number>('customerJwt.accessExpiry');
            const accessTokenExpiryInMs = accessTokenExpiry * 60 * 1000;

            // Step 1: Access Token
            const accessToken = this.jwtService.sign(
                {
                    sub: id,
                    mobile: `${country_code}${mobile_no}`,
                    type: JWT_TOKEN_TYPES.ACCESS,
                },
                {
                    secret: jwtSecret,
                    expiresIn: `${accessTokenExpiry}${JWT_ACCESS_EXPIRY_UNIT}`
                },
            );

            return {
                accessToken,
                accessTokenExpiryInMs
            }
        });
    }

    async generateRefreshTokenAndHash(payload: JwtRefreshTokenPayload): Promise<{ refreshToken: string, refreshTokenExpiryInMs: number, hashedToken: string }> {
        return this.baseService.catch(async () => {
            const { id, device_id } = payload;
            const jwtSecret = this.configService.getOrThrow<string>('customerJwt.secret');
            const refreshTokenExpiry = this.configService.getOrThrow<number>('customerJwt.refreshExpiry');

            const refreshTokenExpiryInMs = refreshTokenExpiry * 24 * 60 * 60 * 1000;

            // Step 1: Access Token
            const refreshToken = this.jwtService.sign(
                {
                    sub: id,
                    deviceId: device_id,
                    type: JWT_TOKEN_TYPES.REFRESH,
                    jti: crypto.randomUUID(),
                },
                {
                    secret: jwtSecret,
                    expiresIn: `${refreshTokenExpiry}${JWT_REFRESH_EXPIRY_UNIT}`
                },
            );
            const hashedToken = this.hashToken(refreshToken);

            return {
                refreshToken,
                refreshTokenExpiryInMs,
                hashedToken,
            }
        });
    }

    async verifyRefreshToken(refreshToken: string, deviceId: string): Promise<CustomerRefreshToken> {
        const jwtRefreshTokenSecret = this.configService.getOrThrow<string>('customerJwt.secret');
        // Verify token and return payload
        const payload = this.jwtService.verify(refreshToken, {
            secret: jwtRefreshTokenSecret,
        });

        // Check if token type is actually 'refresh'
        if (payload.type !== JWT_TOKEN_TYPES.REFRESH) {
            throw new UnauthorizedException('Invalid token type');
        }


        // Check DB
        const tokenHash = this.hashToken(refreshToken);
        const storedToken = await this.refreshTokenRepo.findByHash(
            tokenHash,
            deviceId,
        );

        if (!storedToken) throw new UnauthorizedException('Invalid refresh token');

        if (new Date() > storedToken.expires_at) throw new UnauthorizedException('Refresh token expired');

        await this.refreshTokenRepo.updateLastUsed(storedToken.id);

        return storedToken;
    }

    /**
     * Generate access and refresh tokens
     */
    async generateAccessAndRefreshTokens(
        customer: Customer,
        deviceInfo: DeviceInfo,
        manager?: EntityManager,
    ): Promise<{ accessToken: string; refreshToken: string; expiresInMs: number, refreshTokenExpiryInMs: number }> {
        // Step 1: Access Token
        const {
            accessToken,
            accessTokenExpiryInMs
        } = await this.generateAccessToken({
            id: customer.id,
            country_code: customer.mobile_country_code,
            mobile_no: customer.mobile_no,
        });

        // Step 2: Refresh Token and Hash of it
        const {
            refreshToken,
            refreshTokenExpiryInMs,
            hashedToken
        } = await this.generateRefreshTokenAndHash({
            id: customer.id,
            device_id: deviceInfo.deviceId,
            country_code: customer.mobile_country_code,
            mobile_no: customer.mobile_no,
        });

        // Step 3: Store refresh token
        await this.refreshTokenRepo.createAndSave({
            customer_id: customer.id,
            refresh_token: refreshToken,
            refresh_token_hash: hashedToken,
            device_id: deviceInfo.deviceId,
            device_type: deviceInfo.deviceType,
            device_name: deviceInfo.deviceName || 'Unknown Device',
            ip_address: deviceInfo.ipAddress,
            user_agent: deviceInfo.userAgent,
            expires_at: new Date(Date.now() + refreshTokenExpiryInMs),
        }, manager);

        // this.logger.log(`✅ Created refresh token for device: ${ deviceInfo.deviceId } `);

        return {
            accessToken,
            expiresInMs: accessTokenExpiryInMs,
            refreshToken,
            refreshTokenExpiryInMs
        };
    }

    /**
     * Store token in cookie
     */
    async storeTokenInCookie(
        token: string,
        tokenName: string,
        res: Response,
        refreshTokenExpiryInMs: number
    ): Promise<void> {
        const prefix = this.configService.getOrThrow<string>('app.apiPrefix');
        res.cookie(tokenName, token, {
            httpOnly: true,
            secure: true, // true in production (HTTPS only)
            sameSite: 'strict', // or 'Lax' depending on your needs
            path: `/${prefix}/customer/auth/refresh`,
            maxAge: refreshTokenExpiryInMs,
        });
        return;
    }

    private hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}