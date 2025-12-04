import { Module } from '@nestjs/common';
import { SellCarModule } from './sell-car/sell-car.module';
import { RepositoriesModule } from '@repository/repositories.module';
import { UsedCarModule } from './used-car/used-car.module';

@Module({
    imports: [
        // Modules
        SellCarModule,
        UsedCarModule,
    ],
    providers: [],
    exports: [],
})
export class CustomerModule { }
