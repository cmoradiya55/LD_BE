import { Module } from '@nestjs/common';
import { SellCarModule } from './sell-car/sell-car.module';
import { RepositoriesModule } from '@repository/repositories.module';
import { UsedCarModule } from './used-car/used-car.module';
import { CAuthModule } from './c-auth/c-auth.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ProfileModule } from './profile/profile.module';

@Module({
    imports: [
        // Modules
        SellCarModule,
        UsedCarModule,
        CAuthModule,
        WishlistModule,
        ProfileModule,
    ],
    providers: [],
    exports: [],
})
export class CustomerModule { }
