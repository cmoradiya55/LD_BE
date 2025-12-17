import { IsInt, IsString, IsPositive, Length, IsOptional, Min, Max, IsEnum, IsStrongPassword } from 'class-validator';
import { Type } from 'class-transformer';
import { IsAdminOtp } from '@common/decorators/is-admin-otp.decorator';

export class UAuthLoginDto {
    @IsInt()
    @Min(1)
    @Max(999)
    @Type(() => Number)
    countryCode: number;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    mobileNo: number;

    @IsAdminOtp()
    otp: string;

    @IsString()
    @IsOptional()
    fcmToken?: string;
}