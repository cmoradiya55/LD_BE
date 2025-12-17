import { IsInt, IsString, IsPositive, Length, IsOptional, Min, Max, IsEnum, IsEmail } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsOtp } from '@common/decorators/is-otp.decorator';
import { IsDeviceId } from '@common/decorators/is-device-id.decorator';
import { CustomerDeviceType } from '@common/enums/customer.enum';
import { IsAdminOtp } from '@common/decorators/is-admin-otp.decorator';

export class UAuthVerifyEmailOtpDto {
    @Transform(({ value }) => value?.toLowerCase())
    @IsEmail()
    email: string;

    @IsAdminOtp()
    otp: string;
}