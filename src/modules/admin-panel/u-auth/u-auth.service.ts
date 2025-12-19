import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UAuthLoginDto } from './dto/u-auth.login.dto';
import { BaseService } from '@common/base/base.service';
import { UAuthSendOtpOnMobileDto } from './dto/u-auth-send-otp.dto';
import { UserDocumentVerificationStatus, UserOtpType } from '@common/enums/user.enum';
import { UserRepository } from '@repository/user/user.repository';
import { User } from '@entity/user/user.entity';
import { CommonHelper } from '@common/helpers/common.helper';
import { ADMIN_COOKIE_NAMES, ADMIN_PANEL_OTP_EXPIRY_MS } from '@common/constants/app.constant';
import { UAuthEmailVerificationOtpDto } from './dto/u-auth-send-email-otp.dto';
import { UserJwtTokenService } from './user-jwt-token.service';
import { Request, Response } from 'express';
import { UAuthVerifyEmailOtpDto } from './dto/u-auth.verify-email-otp.dto';
import { UploadUserDocumentsDto } from './dto/upload-verification-document.dto';

@Injectable()
export class UAuthService {
    constructor(
        private readonly baseService: BaseService,
        private readonly userRepo: UserRepository,
        private readonly userJwtTokenService: UserJwtTokenService,
    ) { }


    /**
     * Send OTP
     */
    async sendOtpForLogin(
        dto: UAuthSendOtpOnMobileDto,
    ): Promise<void> {
        return this.baseService.catch(async () => {
            const { countryCode, mobileNo } = dto;
            const otpType = UserOtpType.REGISTRATION_OR_LOGIN;

            let user = await this.userRepo.findByMobileRaw(countryCode, mobileNo);
            if (!user) throw new BadRequestException('User not found');

            // if user exists, check status
            if (user.deleted_at) {
                throw new BadRequestException('Account has been deleted');
            }
            if (!user.is_active) {
                throw new BadRequestException('User is inactive. Please contact support.');
            }

            // Generate OTP
            const otp = CommonHelper.generateAdminOtp();
            const expiresAt = new Date(Date.now() + ADMIN_PANEL_OTP_EXPIRY_MS.MOBILE);

            // Invalidate previous OTPs
            await this.userRepo.otpSaveOfActiveUser(user.id, otpType, otp, expiresAt);

            // send sms and email(if email exist) via external service

            return;
        });
    }

    async userLogin(
        dto: UAuthLoginDto,
        res: Response
    ) {
        return this.baseService.catch(async (manager) => {
            const {
                countryCode,
                mobileNo,
                otp,
                fcmToken,
            } = dto;
            const otpType = UserOtpType.REGISTRATION_OR_LOGIN;

            // ✅ Verify OTP (OTP cleared inside this method)
            const user = await this.userRepo.verifyMobileOtp(countryCode, mobileNo, otp, otpType, manager);
            if (!user) {
                throw new BadRequestException('Invalid OTP or OTP expired');
            }

            // 2. Single update for mobile verification + FCM token
            const updates: Partial<User> = {};

            if (!user.is_mobile_verified) {
                updates.is_mobile_verified = true;
                updates.mobile_verified_at = new Date();
            }

            if (fcmToken && user.fcm_token !== fcmToken) {
                updates.fcm_token = fcmToken;
            }

            let finaluser: User | null = user;
            // 3. Update user if needed
            if (Object.keys(updates).length > 0) {
                finaluser = await this.userRepo.updateActiveUserAndReturn(user.id, updates, manager);
                if (!finaluser) throw new NotFoundException('User not found after OTP verification');
            }

            // Step 4:Generate tokens
            const {
                accessToken,
                expiresInMs,
                refreshToken,
                refreshTokenExpiryInMs
            } = await this.userJwtTokenService.generateUserAccessAndRefreshTokens(
                finaluser,
                manager
            );

            await this.userJwtTokenService.storeTokenInCookie(
                refreshToken,
                ADMIN_COOKIE_NAMES.REFRESH_TOKEN,
                res,
                refreshTokenExpiryInMs
            );
            return {
                user: finaluser,
                accessToken,
                expiresInMs,
            }
        }, true)
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken(
        req: Request,
    ): Promise<{ accessToken: string; expiresInMs: number }> {
        return this.baseService.catch(async () => {
            const refreshToken = req.cookies[ADMIN_COOKIE_NAMES.REFRESH_TOKEN];

            if (!refreshToken) throw new UnauthorizedException('Refresh token expired');

            // Verify JWT
            const storedToken = await this.userJwtTokenService.verifyRefreshToken(refreshToken);

            // Generate new access token
            const { accessToken, accessTokenExpiryInMs } = await this.userJwtTokenService.generateAccessToken({
                id: storedToken.user.id,
                country_code: storedToken.user.country_code,
                mobile_no: storedToken.user.mobile_number,
                jwt_version: storedToken.user.jwt_version,
            })

            return {
                accessToken,
                expiresInMs: accessTokenExpiryInMs,
            };
        });
    }

    /**
     * Send OTP
     */
    async sendOtpForEmailVerification(
        user: User,
        dto: UAuthEmailVerificationOtpDto,
    ): Promise<void> {
        return this.baseService.catch(async (manager) => {
            const { email } = dto;
            const otpType = UserOtpType.EMAIL_VERIFY;

            if (user.is_email_verified) {
                throw new BadRequestException('Email already verified');
            }

            let isUserExist = await this.userRepo.findVerifiedEmailForOtherUser(email, user.id, manager);
            if (isUserExist) throw new BadRequestException('Email already in use');

            // Generate OTP
            const otp = CommonHelper.generateAdminOtp();
            const expiresAt = new Date(Date.now() + ADMIN_PANEL_OTP_EXPIRY_MS.EMAIL);

            // Invalidate previous OTPs
            user.email = email;
            await this.userRepo.save(user, manager);
            await this.userRepo.otpSaveOfActiveUser(user.id, otpType, otp, expiresAt, manager);

            // send email via external service

            return;
        }, true);
    }

    async verifyOtpForEmailVerification(
        user: User,
        dto: UAuthVerifyEmailOtpDto,
    ): Promise<void> {
        return this.baseService.catch(async (manager) => {
            const { email, otp } = dto;
            const otpType = UserOtpType.EMAIL_VERIFY;

            if (user.is_email_verified) {
                throw new BadRequestException('Email already verified');
            }

            let existingUser = await this.userRepo.findVerifiedEmailForOtherUser(email, user.id, manager);
            if (existingUser) throw new BadRequestException('Email already in use');

            // ✅ Verify OTP (OTP cleared inside this method)
            const userAfterVerification = await this.userRepo.verifyEmailOtp(user.id, email, otp, otpType, manager);
            if (!userAfterVerification) {
                throw new BadRequestException('Invalid OTP or OTP expired');
            }

            userAfterVerification.is_email_verified = true;
            userAfterVerification.email_verified_at = new Date();
            await this.userRepo.save(userAfterVerification, manager);
        }, true);
    }

    /**
     * Submit documents for verification
     */
    async submitDocumentsForVerification(
        user: User,
        dto: UploadUserDocumentsDto,
    ): Promise<void> {
        return this.baseService.catch(async (manager) => {
            const {
                selfieImage,
                aadharCardNo,
                aadharCardFrontImage,
                aadharCardBackImage,
                panCardNo,
                panCardImage
            } = dto;

            // ✅ Parallel duplicate checks (run simultaneously)
            const [otherUserWithAadhar, otherUserWithPan] = await Promise.all([
                this.userRepo.existsByAadharExcludingUser(aadharCardNo, user.id, manager),
                this.userRepo.existsByPanExcludingUser(panCardNo, user.id, manager),
            ]);

            if (otherUserWithAadhar) {
                throw new ConflictException('Aadhar card number already registered with another user');
            }

            if (otherUserWithPan) {
                throw new ConflictException('PAN card number already registered with another user');
            }

            // ✅ Validate status
            const blockedStatuses = [
                UserDocumentVerificationStatus.VERIFIED,
                UserDocumentVerificationStatus.REQUEST_RAISE,
            ];

            if (blockedStatuses.includes(user.document_status)) {
                const messages = {
                    [UserDocumentVerificationStatus.VERIFIED]:
                        'Documents already verified. Cannot resubmit.',
                    [UserDocumentVerificationStatus.REQUEST_RAISE]:
                        'Document verification request is already pending.',
                };
                throw new BadRequestException(messages[user.document_status]);
            }

            // ✅ Map DTO to DB fields
            const documentData: Partial<User> = {
                selfie_image: selfieImage,
                aadhar_number: aadharCardNo,
                aadhar_front_image: aadharCardFrontImage,
                aadhar_back_image: aadharCardBackImage,
                pan_number: panCardNo,
                pan_image: panCardImage,
                document_status: UserDocumentVerificationStatus.REQUEST_RAISE,
                updated_by: user.id,
            };

            // ✅ Single update query
            await this.userRepo.update(user.id, documentData, manager);
        }, true);
    }
}
