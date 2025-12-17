import { Module } from '@nestjs/common';
import { RepositoriesModule } from '@repository/repositories.module';
import { UAuthModule } from './u-auth/u-auth.module';

@Module({
    imports: [
        UAuthModule,
    ],
    providers: [],
    exports: [],
})
export class AdminModule { }
