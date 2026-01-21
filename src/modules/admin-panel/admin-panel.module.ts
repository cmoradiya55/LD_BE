import { Module } from '@nestjs/common';
import { UAuthModule } from './u-auth/u-auth.module';
import { UserManagementModule } from './admin/user-management/user-management.module';
import { InspectionCentreModule } from './admin/inspection-centre/inspection-centre.module';
import { InspectionModule } from './inspector/inspection/inspection.module';
import { MUserManagementModule } from './manager/user-management/user-management.module';
import { MUsedCarModule } from './manager/m-used-car/m-used-car.module';
import { VehicleVerificationModule } from './staff/vehicle-verification/vehicle-verification.module';
import { AUsedCarModule } from './admin/a-used-car/a-used-car.module';
import { AProfileModule } from './admin/a-profile/a-profile.module';
import { MProfileModule } from './manager/m-profile/m-profile.module';
import { SProfileModule } from './staff/s-profile/s-profile.module';
import { IProfileModule } from './inspector/i-profile/i-profile.module';

@Module({
    imports: [
        UAuthModule,
        UserManagementModule,
        InspectionCentreModule,
        InspectionModule,
        MUserManagementModule,
        MUsedCarModule,
        VehicleVerificationModule,
        AUsedCarModule,
        AProfileModule,
        MProfileModule,
        SProfileModule,
        IProfileModule,
    ],
    providers: [],
    exports: [],
})
export class AdminPanelModule { }
