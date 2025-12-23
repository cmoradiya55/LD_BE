import { Module } from '@nestjs/common';
import { UAuthModule } from './u-auth/u-auth.module';
import { UserManagementModule } from './admin/user-management/user-management.module';
import { InspectionCentreModule } from './admin/inspection-centre/inspection-centre.module';
import { InspectionModule } from './inspector/inspection/inspection.module';

@Module({
    imports: [
        UAuthModule,
        UserManagementModule,
        InspectionCentreModule,
        InspectionModule,
    ],
    providers: [],
    exports: [],
})
export class AdminPanelModule { }
