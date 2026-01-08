import { Module } from '@nestjs/common';
import { UAuthModule } from './u-auth/u-auth.module';
import { UserManagementModule } from './admin/user-management/user-management.module';
import { InspectionCentreModule } from './admin/inspection-centre/inspection-centre.module';
import { InspectionModule } from './inspector/inspection/inspection.module';
import { MUserManagementModule } from './manager/user-management/user-management.module';
import { MUsedCarModule } from './manager/m-used-car/m-used-car.module';
import { VehicleVerificationModule } from './staff/vehicle-verification/vehicle-verification.module';

@Module({
    imports: [
        UAuthModule,
        UserManagementModule,
        InspectionCentreModule,
        InspectionModule,
        MUserManagementModule,
        MUsedCarModule,
        VehicleVerificationModule,
    ],
    providers: [],
    exports: [],
})
export class AdminPanelModule { }
