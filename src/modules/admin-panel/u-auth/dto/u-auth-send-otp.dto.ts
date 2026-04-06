import { IsInt, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UAuthSendOtpOnMobileDto {
    @IsInt()
    @Min(1)
    @Max(999)
    @Type(() => Number)
    countryCode: number;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    mobileNo: number;
}