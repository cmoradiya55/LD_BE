// common/decorators/user-auth-public.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { UPublic } from './user-public.decorator';
import { UserAllowUnverifiedEmail } from './user-allowed-unverified-email.decorator';
import { UserAllowUnverifiedDocument } from './user-allowed-unverified-document.decorator';

export function AllowUnverifiedEmailAndDocument() {
    return applyDecorators(
        UserAllowUnverifiedEmail(),
        UserAllowUnverifiedDocument(),
    );
}
