import { Module } from '@nestjs/common';
import { SellCarModule } from './sell-car/sell-car.module';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
    imports: [
        // Modules
        SellCarModule,
    ],
    providers: [],
    exports: [],
})
export class CustomerModule { }
