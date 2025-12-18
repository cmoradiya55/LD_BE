// common/decorators/allow-unverified-email.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const USER_ALLOW_UNVERIFIED_DOCUMENT = 'allowUnverifiedDocument';

export const UserAllowUnverifiedDocument = () =>
    SetMetadata(USER_ALLOW_UNVERIFIED_DOCUMENT, true);