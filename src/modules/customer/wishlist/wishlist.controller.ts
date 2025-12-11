import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CJwtAuthGuard } from '../c-auth/guards/jwt-c-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Customer } from '@entity/customer/customer.entity';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { RemoveFromWishlistDto } from './dto/remove-from-wishlist.dto';
import { GetWishlistDto } from './dto/get-wishlist.dto';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { UsedCarListingResource } from '../used-car/resources/used-car-listing.resource';

@Controller(`${MODULE_PREFIX.CUSTOMER}/wishlist`)
@UseGuards(CJwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  /**
    * Add car to wishlist
    */
  @Post()
  async addToWishlist(
    @CurrentUser('id') customer_id: number,
    @Body() addToWishlistDto: AddToWishlistDto,
  ) {
    await this.wishlistService.addToWishlist(customer_id, addToWishlistDto);
    return ApiResponseUtil.success('Car added to wishlist');
  }

  /**
   * Remove car from wishlist
   */
  @Delete()
  async removeFromWishlist(
    @CurrentUser('id') customer_id: number,
    @Body() removeFromWishlistDto: RemoveFromWishlistDto,
  ) {
    await this.wishlistService.removeFromWishlist(customer_id, removeFromWishlistDto);
    return ApiResponseUtil.success('Car removed from wishlist');
  }

  /**
   * Get customer wishlist
   */
  @Get()
  async getWishlist(
    @CurrentUser('id') customer_id: number,
    @Query() getWishlistDto: GetWishlistDto,
  ) {
    const { data, page, limit, total } = await this.wishlistService.getWishlist(customer_id, getWishlistDto);
    return ApiResponseUtil.paginated(
      'Wishlist retrieved successfully',
      UsedCarListingResource.collection(data),
      page,
      limit,
      total,
    );
  }

  /**
   * Get wishlist count
   */
  @Get('count')
  async getWishlistCount(@CurrentUser('id') customer_id: number) {
    const count = await this.wishlistService.getWishlistCount(customer_id);
    return ApiResponseUtil.success(
      'Wishlist count retrieved',
      {
        count,
      });
  }

  /**
   * Clear entire wishlist
   */
  @Delete('clear')
  async clearWishlist(@CurrentUser() user: Customer) {
    await this.wishlistService.clearWishlist(user.id);
    return ApiResponseUtil.success('Wishlist cleared successfully');
  }
}
