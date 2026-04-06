import { CustomerFcmToken } from '@entity/customer/customer-fcm-token.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class CustomerFcmTokenRepository {
    constructor(
        @InjectRepository(CustomerFcmToken)
        private readonly repo: Repository<CustomerFcmToken>,
    ) { }

    /**
     * Get repository (supports transactions)
     */
    private getRepo(manager?: EntityManager): Repository<CustomerFcmToken> {
        return manager ? manager.getRepository(CustomerFcmToken) : this.repo;
    }

    /**
     * Find FCM token by device
     */
    async findByDevice(
        customerId: number,
        deviceId: string,
        manager?: EntityManager,
    ): Promise<CustomerFcmToken | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                customer_id: customerId,
                device_id: deviceId,
            },
        });
    }

    /**
     * Find FCM token by token string
     */
    async findByToken(fcmToken: string, manager?: EntityManager): Promise<CustomerFcmToken | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                fcm_token: fcmToken,
            },
        });
    }

    /**
     * Get all active FCM tokens for customer
     */
    async findActiveTokens(customerId: number, manager?: EntityManager): Promise<CustomerFcmToken[]> {
        const repo = this.getRepo(manager);
        return await repo.find({
            where: {
                customer_id: customerId,
                is_active: true,
            },
            order: {
                last_used_at: 'DESC',
            },
        });
    }

    /**
     * Get all FCM tokens for customer (active and inactive)
     */
    async findAllForCustomer(customerId: number, manager?: EntityManager): Promise<CustomerFcmToken[]> {
        const repo = this.getRepo(manager);
        return await repo.find({
            where: {
                customer_id: customerId,
            },
            order: {
                created_at: 'DESC',
            },
        });
    }

    /**
     * Find token by ID
     */
    async findById(id: number, manager?: EntityManager): Promise<CustomerFcmToken | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: { id },
        });
    }

    /**
     * Create new FCM token entity (does not save)
     */
    create(data: Partial<CustomerFcmToken>, manager?: EntityManager): CustomerFcmToken {
        const repo = this.getRepo(manager);
        return repo.create(data);
    }

    /**
     * Save FCM token entity
     */
    async save(token: CustomerFcmToken, manager?: EntityManager): Promise<CustomerFcmToken> {
        const repo = this.getRepo(manager);
        return await repo.save(token);
    }

    /**
     * Create and save FCM token (convenience method)
     */
    async createAndSave(
        data: Partial<CustomerFcmToken>,
        manager?: EntityManager,
    ): Promise<CustomerFcmToken> {
        const token = this.create(data, manager);
        return await this.save(token, manager);
    }

    /**
     * Update FCM token
     */
    async update(
        id: number,
        data: Partial<CustomerFcmToken>,
        manager?: EntityManager,
    ): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.update(id, {
            ...data,
            updated_at: new Date(),
        });
    }

    /**
     * Update FCM token string
     */
    async updateToken(
        id: number,
        fcmToken: string,
        manager?: EntityManager,
    ): Promise<void> {
        await this.update(
            id,
            {
                fcm_token: fcmToken,
                is_active: true,
                last_used_at: new Date(),
            },
            manager,
        );
    }

    /**
     * Update last used timestamp
     */
    async updateLastUsed(id: number, manager?: EntityManager): Promise<void> {
        await this.update(
            id,
            {
                last_used_at: new Date(),
            },
            manager,
        );
    }

    /**
     * Activate FCM token
     */
    async activate(id: number, manager?: EntityManager): Promise<void> {
        await this.update(
            id,
            {
                is_active: true,
            },
            manager,
        );
    }

    /**
     * Deactivate FCM token
     */
    async deactivate(id: number, manager?: EntityManager): Promise<void> {
        await this.update(
            id,
            {
                is_active: false,
            },
            manager,
        );
    }

    /**
     * Deactivate FCM token by device
     */
    async deactivateByDevice(
        customerId: number,
        deviceId: string,
        manager?: EntityManager,
    ): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.update(
            {
                customer_id: customerId,
                device_id: deviceId,
            },
            {
                is_active: false,
            },
        );
    }

    /**
     * Deactivate all FCM tokens for customer
     */
    async deactivateAllForCustomer(customerId: number, manager?: EntityManager): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.update(
            {
                customer_id: customerId,
            },
            {
                is_active: false,
            },
        );
    }

    /**
     * Delete FCM token
     */
    async delete(id: number, manager?: EntityManager): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.delete(id);
    }

    /**
     * Delete FCM token by device
     */
    async deleteByDevice(
        customerId: number,
        deviceId: string,
        manager?: EntityManager,
    ): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.delete({
            customer_id: customerId,
            device_id: deviceId,
        });
    }

    /**
     * Delete inactive tokens (cleanup)
     */
    async deleteInactiveTokens(daysOld: number, manager?: EntityManager): Promise<number> {
        const repo = this.getRepo(manager);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await repo
            .createQueryBuilder()
            .delete()
            .where('is_active = :active', { active: false })
            .andWhere('updated_at < :cutoffDate', { cutoffDate })
            .execute();

        return result.affected || 0;
    }

    /**
     * Count active tokens for customer
     */
    async countActiveForCustomer(customerId: number, manager?: EntityManager): Promise<number> {
        const repo = this.getRepo(manager);
        return await repo.count({
            where: {
                customer_id: customerId,
                is_active: true,
            },
        });
    }

    /**
     * Count total tokens for customer
     */
    async countTotalForCustomer(customerId: number, manager?: EntityManager): Promise<number> {
        const repo = this.getRepo(manager);
        return await repo.count({
            where: {
                customer_id: customerId,
            },
        });
    }

    /**
     * Check if FCM token exists
     */
    async existsByToken(fcmToken: string, manager?: EntityManager): Promise<boolean> {
        const repo = this.getRepo(manager);
        const count = await repo.count({
            where: {
                fcm_token: fcmToken,
            },
        });
        return count > 0;
    }

    async softDeleteByCustomerId(customerId: number, manager?: EntityManager): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.softDelete({
            customer_id: customerId,
        });
    }
}