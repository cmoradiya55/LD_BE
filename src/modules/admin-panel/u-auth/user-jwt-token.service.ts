import { BaseService } from "@common/base/base.service";
import { JWT_ACCESS_EXPIRY_UNIT, JWT_REFRESH_EXPIRY_UNIT, JWT_TOKEN_TYPES } from "@common/constants/app.constant";
import { Customer } from "@entity/customer/customer.entity";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as crypto from 'crypto';
import { EntityManager } from "typeorm";
import { Response } from "express";
import { User } from "@entity/user/user.entity";
import { UserRefreshTokenRepository } from "@repository/user/user-refresh-token.repository";
import { UserRefreshToken } from "@entity/user/user-refresh-token.entity";
import { UserRepository } from "@repository/user/user.repository";


interface JwtAccessTokenPayload {
    id: number;
    country_code: number;
    mobile_no: number;
    jwt_version: number;
}

interface JwtRefreshTokenPayload {
    id: number;
    country_code: number;
    mobile_no: number;
}

@Injectable()
export class UserJwtTokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly baseService: BaseService,
        private readonly configService: ConfigService,
        private readonly refreshTokenRepo: UserRefreshTokenRepository,
        private readonly userRepo: UserRepository,
    ) { }

    async generateAccessToken(payload: JwtAccessTokenPayload): Promise<{ accessToken: string, accessTokenExpiryInMs: number }> {
        return this.baseService.catch(async () => {
            const { id, country_code, mobile_no, jwt_version } = payload;
            const jwtSecret = this.configService.getOrThrow<string>('adminJwt.secret');
            const accessTokenExpiry = this.configService.getOrThrow<number>('adminJwt.accessExpiry');
            const accessTokenExpiryInMs = accessTokenExpiry * 60 * 1000;

            // Step 1: Access Token
            const accessToken = this.jwtService.sign(
                {
                    sub: id,
                    mobile: `${country_code}${mobile_no}`,
                    type: JWT_TOKEN_TYPES.ACCESS,
                    jti: jwt_version,
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
            const { id } = payload;
            const jwtSecret = this.configService.getOrThrow<string>('adminJwt.secret');
            const refreshTokenExpiry = this.configService.getOrThrow<number>('adminJwt.refreshExpiry');

            const refreshTokenExpiryInMs = refreshTokenExpiry * 24 * 60 * 60 * 1000;

            // Step 1: Access Token
            const refreshToken = this.jwtService.sign(
                {
                    sub: id,
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

    async verifyRefreshToken(refreshToken: string): Promise<UserRefreshToken> {
        const jwtRefreshTokenSecret = this.configService.getOrThrow<string>('adminJwt.secret');
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
        );

        if (!storedToken) throw new UnauthorizedException('Invalid refresh token');

        if (new Date() > storedToken.expires_at) throw new UnauthorizedException('Refresh token expired');

        await this.refreshTokenRepo.updateLastUsed(storedToken.id);

        return storedToken;
    }

    /**
     * Generate access and refresh tokens
     */
    async generateUserAccessAndRefreshTokens(
        user: User,
        manager?: EntityManager,
    ): Promise<{ accessToken: string; refreshToken: string; expiresInMs: number, refreshTokenExpiryInMs: number }> {
        user.jwt_version += 1;
        const updatedUser = await this.userRepo.save(user, manager);

        // Step 1: Access Token
        const {
            accessToken,
            accessTokenExpiryInMs
        } = await this.generateAccessToken({
            id: updatedUser.id,
            country_code: updatedUser.country_code,
            mobile_no: updatedUser.mobile_number,
            jwt_version: updatedUser.jwt_version,
        });

        // Step 2: Refresh Token and Hash of it
        const {
            refreshToken,
            refreshTokenExpiryInMs,
            hashedToken
        } = await this.generateRefreshTokenAndHash({
            id: updatedUser.id,
            country_code: updatedUser.country_code,
            mobile_no: updatedUser.mobile_number,
        });

        // Step 3: Invalidate old tokens
        await this.refreshTokenRepo.revokeByUserId(updatedUser.id, 'new_login', manager);

        // Step 4: Store refresh token
        await this.refreshTokenRepo.createAndSave({
            user_id: updatedUser.id,
            refresh_token: refreshToken,
            refresh_token_hash: hashedToken,
            expires_at: new Date(Date.now() + refreshTokenExpiryInMs),
        }, manager);

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
            path: `/${prefix}/admin/auth/refresh`,
            maxAge: refreshTokenExpiryInMs,
        });
        return;
    }

    private hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}