import { CustomerWishlist } from '@entity/customer-ops/customer-wishlist.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

export interface CustomerWishlistResult {
    data: any[];
    total: number;
    page: number;
    limit: number;
}

@Injectable()
export class CustomerWishlistRepository {
    constructor(
        @InjectRepository(CustomerWishlist)
        private readonly repo: Repository<CustomerWishlist>,
    ) { }

    /**
     * Get repository (supports transactions)
     */
    private getRepo(manager?: EntityManager): Repository<CustomerWishlist> {
        return manager ? manager.getRepository(CustomerWishlist) : this.repo;
    }

    /**
     * Check if car is in wishlist
     */
    async isInWishlist(
        customerId: number,
        usedCarId: number,
        manager?: EntityManager,
    ): Promise<boolean> {
        const repo = this.getRepo(manager);
        const count = await repo.count({
            where: {
                customer_id: customerId,
                used_car_id: usedCarId,
            },
        });
        return count > 0;
    }

    /**
     * Get customer wishlist with car details
     */
    async findByCustomer(
        customerId: number,
        page: number = 1,
        limit: number = 20,
        manager?: EntityManager,
    ): Promise<CustomerWishlistResult> {
        const repo = this.getRepo(manager);
        const skip = (page - 1) * limit;

        const [data, total] = await repo.findAndCount({
            where: {
                customer_id: customerId,
            },
            relations: ['usedCar', 'usedCar.brand', 'usedCar.model', 'usedCar.variant'],
            order: {
                created_at: 'DESC',
            },
            skip: skip,
            take: limit,
        });

        return {
            data,
            page,
            total,
            limit
        };
    }

    /**
     * Get all wishlisted car IDs for customer (for checking)
     */
    async getWishlistedCarIds(
        customerId: number,
        manager?: EntityManager,
    ): Promise<number[]> {
        const repo = this.getRepo(manager);
        const wishlists = await repo.find({
            where: {
                customer_id: customerId,
            },
            select: ['used_car_id'],
        });

        return wishlists.map(w => w.used_car_id);
    }

    /**
     * Count customer wishlist items
     */
    async countByCustomer(customerId: number, manager?: EntityManager): Promise<number> {
        const repo = this.getRepo(manager);
        return await repo.count({
            where: {
                customer_id: customerId,
            },
        });
    }

    /**
     * Create wishlist entity (does not save)
     */
    private create(data: Partial<CustomerWishlist>, manager?: EntityManager): CustomerWishlist {
        const repo = this.getRepo(manager);
        return repo.create(data);
    }

    /**
     * Save wishlist entity
     */
    private async save(wishlist: CustomerWishlist, manager?: EntityManager): Promise<CustomerWishlist> {
        const repo = this.getRepo(manager);
        return await repo.save(wishlist);
    }

    /**
     * Add to wishlist (convenience method)
     */
    async addToWishlist(
        customerId: number,
        usedCarId: number,
        manager?: EntityManager,
    ): Promise<CustomerWishlist> {
        const wishlist = this.create(
            {
                customer_id: customerId,
                used_car_id: usedCarId,
            },
            manager,
        );
        return await this.save(wishlist, manager);
    }

    /**
     * Remove from wishlist
     */
    async removeFromWishlist(
        customerId: number,
        usedCarId: number,
        manager?: EntityManager,
    ): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.delete({
            customer_id: customerId,
            used_car_id: usedCarId,
        });
    }


    /**
     * Clear customer wishlist
     */
    async clearWishlist(customerId: number, manager?: EntityManager): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.delete({
            customer_id: customerId,
        });
    }
}