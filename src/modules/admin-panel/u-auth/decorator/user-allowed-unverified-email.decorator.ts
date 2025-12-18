// common/decorators/allow-unverified-email.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const USER_ALLOW_UNVERIFIED_EMAIL = 'allowUnverifiedEmail';

export const UserAllowUnverifiedEmail = () =>
    SetMetadata(USER_ALLOW_UNVERIFIED_EMAIL, true);
