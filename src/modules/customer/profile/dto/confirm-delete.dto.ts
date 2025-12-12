import { IsOtp } from '@common/decorators/is-otp.decorator';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ConfirmDeleteDto {
    @IsOtp()
    otp: string;
}