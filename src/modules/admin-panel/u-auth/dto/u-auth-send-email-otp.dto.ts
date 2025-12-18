import { IsInt, IsPositive, Min, Max, IsEmail } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UAuthEmailVerificationOtpDto {
    @Transform(({ value }) => value?.toLowerCase())
    @IsEmail()
    email: string;
}