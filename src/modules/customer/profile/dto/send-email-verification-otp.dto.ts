import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class SendEmailVerificationOtpDto {
    @Transform(({ value }) => value?.toLowerCase())
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;
}