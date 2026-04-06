import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RequestDeleteOtpDto {
    @IsOptional()
    @IsString()
    @MaxLength(500)
    reason?: string;
}