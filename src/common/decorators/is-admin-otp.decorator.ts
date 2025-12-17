import { ADMIN_OTP_LENGTH, CUSTOMER_OTP_LENGTH } from '@common/constants/app.constant';
import { applyDecorators } from '@nestjs/common';
import { IsString, Length } from 'class-validator';

export function IsAdminOtp(length = ADMIN_OTP_LENGTH) {
    return applyDecorators(
        IsString(),
        Length(length, length, { message: `OTP must be ${length} digits` }),
    );
}
