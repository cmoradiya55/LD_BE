import { BaseService } from '@common/base/base.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerWishlistRepository } from '@repository/customer-ops/customer-wishlist.repository';
import { UsedCarRepository } from '@repository/used-car/used-car.repository';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { Customer } from '@entity/customer/customer.entity';
import { RemoveFromWishlistDto } from './dto/remove-from-wishlist.dto';
import { GetWishlistDto } from './dto/get-wishlist.dto';

@Injectable()
export class WishlistService {

    constructor(
        private readonly wishlistRepo: CustomerWishlistRepository,
        private readonly usedCarRepo: UsedCarRepository,
        private readonly baseService: BaseService,
    ) { }

    /**
     * Add car to wishlist
     */
    async addToWishlist(customer_id: number, dto: AddToWishlistDto): Promise<void> {
        return this.baseService.catch(async () => {
            const { listing_id } = dto;

            // Check if car exists
            const car = await this.usedCarRepo.findById(listing_id);
            if (!car) throw new NotFoundException('Car not found for adding to wishlist');

            // Check if already in wishlist
            const exists = await this.wishlistRepo.isInWishlist(customer_id, listing_id);
            if (exists) throw new BadRequestException('Car already in wishlist');

            // Add to wishlist
            await this.wishlistRepo.addToWishlist(customer_id, listing_id);

            // this.logger.log(`Customer ${customerId} added car ${usedCarId} to wishlist`);
        });
    }

    /**
     * Remove car from wishlist
     */
    async removeFromWishlist(customer_id: number, dto: RemoveFromWishlistDto): Promise<void> {
        return this.baseService.catch(async () => {
            const { listing_id } = dto;

            // Check if in wishlist
            const exists = await this.wishlistRepo.isInWishlist(customer_id, listing_id);
            if (!exists) throw new NotFoundException('Car not found in wishlist');

            // Remove from wishlist
            await this.wishlistRepo.removeFromWishlist(customer_id, listing_id);

            // this.logger.log(`Customer ${customerId} removed car ${usedCarId} from wishlist`);
        });
    }

    /**
     * Get customer wishlist
     */
    async getWishlist(customer_id: number, dto: GetWishlistDto) {
        return this.baseService.catch(async () => {
            const { page, limit } = dto;
            const used_car_ids = await this.wishlistRepo.getWishlistedCarIds(customer_id);
            const result = await this.usedCarRepo.findByIds(customer_id, used_car_ids, page, limit);
            return result;
        });
    }

    /**
     * Get wishlist count
     */
    async getWishlistCount(customerId: number): Promise<number> {
        return this.baseService.catch(async () => {
            return await this.wishlistRepo.countByCustomer(customerId);
        });
    }

    /**
     * Clear entire wishlist
     */
    async clearWishlist(customerId: number): Promise<void> {
        return this.baseService.catch(async () => {
            await this.wishlistRepo.clearWishlist(customerId);
            // this.logger.log(`Customer ${customerId} cleared their wishlist`);
        });
    }
}
