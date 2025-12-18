import { IsInt, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UAuthSendOtpOnMobileDto {
    @IsInt()
    @Min(1)
    @Max(999)
    @Type(() => Number)
    country_code: number;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    mobile_no: number;
}