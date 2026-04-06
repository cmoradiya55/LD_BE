import { CUSTOMER_OTP_LENGTH } from '@common/constants/app.constant';
import { applyDecorators } from '@nestjs/common';
import { IsString } from 'class-validator';

export function IsDeviceId(length = CUSTOMER_OTP_LENGTH) {
    return applyDecorators(
        IsString(),
    );
}
