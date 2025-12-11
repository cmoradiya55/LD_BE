import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { RepositoriesModule } from '@repository/repositories.module';

@Module({
  imports: [
    RepositoriesModule
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule { }
