import { Module } from '@nestjs/common';
import { RepositoriesModule } from '@repository/repositories.module';
import { UAuthModule } from './u-auth/u-auth.module';
import { APP_GUARD } from '@nestjs/core';
import { UJwtAuthGuard } from './u-auth/guards/jwt-u-auth.guard';
import { UserEmailVerifiedGuard } from '@common/guards/user-email-verified.guard';

@Module({
    imports: [
        UAuthModule,
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
    ],
    exports: [],
})
export class AdminModule { }
