import { Module } from '@nestjs/common';
import { RepositoriesModule } from '@repository/repositories.module';
import { UAuthModule } from './u-auth/u-auth.module';
import { APP_GUARD } from '@nestjs/core';
import { UJwtAuthGuard } from './u-auth/guards/jwt-u-auth.guard';
import { UserEmailVerifiedGuard } from '@common/guards/admin-panel/user-email-verified.guard';
import { UserManagementModule } from './admin/user-management/user-management.module';
import { RolesGuard } from '@common/guards/admin-panel/user-role.guard';
import { UserDocumentVerifiedGuard } from '@common/guards/admin-panel/user-document-verified.guard';
import { InspectionCentreModule } from './admin/inspection-centre/inspection-centre.module';

@Module({
    imports: [
        UAuthModule,
        UserManagementModule,
        InspectionCentreModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: UJwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: UserEmailVerifiedGuard,
        },
        {
            provide: APP_GUARD,
            useClass: UserDocumentVerifiedGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [],
})
export class AdminPanelModule { }
