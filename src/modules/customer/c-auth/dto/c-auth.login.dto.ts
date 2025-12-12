import { IsInt, IsString, IsPositive, Length, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IsOtp } from '@common/decorators/is-otp.decorator';
import { IsDeviceId } from '@common/decorators/is-device-id.decorator';

export class CAuthLoginDto {
    @IsInt()
    @Min(1)
    @Max(999)
    @Type(() => Number)
    country_code: number;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    mobile_no: number;

    @IsOtp()
    otp: string;

    @IsDeviceId()
    device_id: string;

    @IsInt()
    @Min(1)
    @Max(3)
    @Type(() => Number)
    device_type: number;

    @IsString()
    @IsOptional()
    device_name?: string;

    @IsString()
    @IsOptional()
    fcm_token?: string;
}