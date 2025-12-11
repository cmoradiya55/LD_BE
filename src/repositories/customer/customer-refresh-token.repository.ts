import { CustomerRefreshToken } from '@entity/customer/customer-refresh-token.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, LessThan, MoreThan } from 'typeorm';

@Injectable()
export class CustomerRefreshTokenRepository {
    constructor(
        @InjectRepository(CustomerRefreshToken)
        private readonly repo: Repository<CustomerRefreshToken>,
    ) {}

    /**
     * Get repository (supports transactions)
     */
    private getRepo(manager?: EntityManager): Repository<CustomerRefreshToken> {
        return manager ? manager.getRepository(CustomerRefreshToken) : this.repo;
    }

    /**
     * Find token by hash
     */
    async findByHash(
        tokenHash: string,
        deviceId: string,
        manager?: EntityManager,
    ): Promise<CustomerRefreshToken | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                refresh_token_hash: tokenHash,
                device_id: deviceId,
                is_revoked: false,
            },
            relations: ['customer'],
        });
    }

    /**
     * Find token by hash (without relations)
     */
    async findByHashSimple(
        tokenHash: string,
        deviceId: string,
        manager?: EntityManager,
    ): Promise<CustomerRefreshToken | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                refresh_token_hash: tokenHash,
                device_id: deviceId,
                is_revoked: false,
            },
        });
    }

    /**
     * Find token by device ID
     */
    async findByDeviceId(
        customerId: number,
        deviceId: string,
        manager?: EntityManager,
    ): Promise<CustomerRefreshToken | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                customer_id: customerId,
                device_id: deviceId,
            },
            order: {
                created_at: 'DESC',
            },
        });
    }

    /**
     * Find all tokens for device
     */
    async findAllByDeviceId(
        customerId: number,
        deviceId: string,
        manager?: EntityManager,
    ): Promise<CustomerRefreshToken[]> {
        const repo = this.getRepo(manager);
        return await repo.find({
            where: {
                customer_id: customerId,
                device_id: deviceId,
            },
            order: {
                created_at: 'DESC',
            },
        });
    }

    /**
     * Count active devices for customer
     */
    async countActiveDevices(customerId: number, manager?: EntityManager): Promise<number> {
        const repo = this.getRepo(manager);
        return await repo.count({
            where: {
                customer_id: customerId,
                is_revoked: false,
                expires_at: MoreThan(new Date()),
            },
        });
    }

    /**
     * Find oldest active device
     */
    async findOldestDevice(
        customerId: number,
        manager?: EntityManager,
    ): Promise<CustomerRefreshToken | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                customer_id: customerId,
                is_revoked: false,
            },
            order: {
                last_used_at: 'ASC',
            },
        });
    }

    /**
     * Get all active devices for customer
     */
    async findActiveDevices(
        customerId: number,
        manager?: EntityManager,
    ): Promise<CustomerRefreshToken[]> {
        const repo = this.getRepo(manager);
        return await repo.find({
            where: {
                customer_id: customerId,
                is_revoked: false,
                expires_at: MoreThan(new Date()),
            },
            order: {
                last_used_at: 'DESC',
            },
        });
    }

    /**
     * Find token by ID
     */
    async findById(id: number, manager?: EntityManager): Promise<CustomerRefreshToken | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: { id },
        });
    }

    /**
     * Create new refresh token entity (does not save)
     */
    create(data: Partial<CustomerRefreshToken>, manager?: EntityManager): CustomerRefreshToken {
        const repo = this.getRepo(manager);
        return repo.create(data);
    }

    /**
     * Save refresh token entity
     */
    async save(
        token: CustomerRefreshToken,
        manager?: EntityManager,
    ): Promise<CustomerRefreshToken> {
        const repo = this.getRepo(manager);
        return await repo.save(token);
    }

    /**
     * Create and save refresh token (convenience method)
     */
    async createAndSave(
        data: Partial<CustomerRefreshToken>,
        manager?: EntityManager,
    ): Promise<CustomerRefreshToken> {
        const token = this.create(data, manager);
        return await this.save(token, manager);
    }

    /**
     * Update refresh token
     */
    async update(
        id: number,
        data: Partial<CustomerRefreshToken>,
        manager?: EntityManager,
    ): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.update(id, data);
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
     * Revoke token by ID
     */
    async revoke(id: number, reason: string, manager?: EntityManager): Promise<void> {
        await this.update(
            id,
            {
                is_revoked: true,
                revoked_at: new Date(),
                revoked_reason: reason,
            },
            manager,
        );
    }

    /**
     * Revoke tokens by device
     */
    async revokeByDevice(
        customerId: number,
        deviceId: string,
        reason: string,
        manager?: EntityManager,
    ): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.update(
            {
                customer_id: customerId,
                device_id: deviceId,
                is_revoked: false,
            },
            {
                is_revoked: true,
                revoked_at: new Date(),
                revoked_reason: reason,
            },
        );
    }

    /**
     * Revoke all tokens for customer
     */
    async revokeAllForCustomer(
        customerId: number,
        reason: string,
        manager?: EntityManager,
    ): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.update(
            {
                customer_id: customerId,
                is_revoked: false,
            },
            {
                is_revoked: true,
                revoked_at: new Date(),
                revoked_reason: reason,
            },
        );
    }

    /**
     * Delete token by ID
     */
    async delete(id: number, manager?: EntityManager): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.delete(id);
    }

    /**
     * Delete expired tokens (cleanup)
     */
    async deleteExpiredTokens(manager?: EntityManager): Promise<number> {
        const repo = this.getRepo(manager);
        const result = await repo.delete({
            expires_at: LessThan(new Date()),
        });
        return result.affected || 0;
    }

    /**
     * Delete old revoked tokens (cleanup)
     */
    async deleteOldRevokedTokens(daysOld: number, manager?: EntityManager): Promise<number> {
        const repo = this.getRepo(manager);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await repo
            .createQueryBuilder()
            .delete()
            .where('is_revoked = :revoked', { revoked: true })
            .andWhere('revoked_at < :cutoffDate', { cutoffDate })
            .execute();

        return result.affected || 0;
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
     * Count revoked tokens for customer
     */
    async countRevokedForCustomer(customerId: number, manager?: EntityManager): Promise<number> {
        const repo = this.getRepo(manager);
        return await repo.count({
            where: {
                customer_id: customerId,
                is_revoked: true,
            },
        });
    }
}