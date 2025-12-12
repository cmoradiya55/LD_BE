import { IsOtp } from '@common/decorators/is-otp.decorator';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class VerifyEmailVerificationOtpDto {
    @Transform(({ value }) => value?.toLowerCase())
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @IsOtp()
    otp: string;
}