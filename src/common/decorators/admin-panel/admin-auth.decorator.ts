// common/decorators/admin-auth.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserEmailVerifiedGuard } from '@common/guards/admin-panel/user-email-verified.guard';
import { UserDocumentVerifiedGuard } from '@common/guards/admin-panel/user-document-verified.guard';
import { RolesGuard } from '@common/guards/admin-panel/user-role.guard';
import { UJwtAuthGuard } from '../../../modules/admin-panel/u-auth/guards/jwt-u-auth.guard';

export function AdminAuth() {
    return applyDecorators(
        UseGuards(
            UJwtAuthGuard,
            UserEmailVerifiedGuard,
            UserDocumentVerifiedGuard,
            RolesGuard
        )
    );
}