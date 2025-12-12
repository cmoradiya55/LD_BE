import { CUSTOMER_OTP_LENGTH } from "@common/constants/app.constant";
import { CustomerOtpType } from "@common/enums/customer.enum";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class GenerateOtpAndSaveDto {
    @IsNotEmpty()
    @IsString()
    identifier: string;

    @IsNotEmpty()
    @IsEnum(CustomerOtpType)
    otpType: CustomerOtpType;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    otpExpiryMs: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    otpLength: number = CUSTOMER_OTP_LENGTH;

    @IsOptional()
    @IsString()
    requestIp: string;
}