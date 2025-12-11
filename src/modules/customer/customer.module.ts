import { Module } from '@nestjs/common';
import { SellCarModule } from './sell-car/sell-car.module';
import { RepositoriesModule } from '@repository/repositories.module';
import { UsedCarModule } from './used-car/used-car.module';
import { CAuthModule } from './c-auth/c-auth.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
    imports: [
        // Modules
        SellCarModule,
        UsedCarModule,
        CAuthModule,
        WishlistModule,
    ],
    providers: [],
    exports: [],
})
export class CustomerModule { }
