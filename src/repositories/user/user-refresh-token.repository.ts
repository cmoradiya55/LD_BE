import { UserRefreshToken } from '@entity/user/user-refresh-token.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, LessThan, MoreThan } from 'typeorm';

@Injectable()
export class UserRefreshTokenRepository {
    constructor(
        @InjectRepository(UserRefreshToken)
        private readonly repo: Repository<UserRefreshToken>,
    ) { }

    /**
     * Get repository (supports transactions)
     */
    private getRepo(manager?: EntityManager): Repository<UserRefreshToken> {
        return manager ? manager.getRepository(UserRefreshToken) : this.repo;
    }

    /**
     * Find token by hash
     */
    async findByHash(
        tokenHash: string,
        manager?: EntityManager,
    ): Promise<UserRefreshToken | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                refresh_token_hash: tokenHash,
                is_revoked: false,
            },
            relations: ['user'],
        });
    }

    /**
     * Find token by hash (without relations)
     */
    async findByHashSimple(
        tokenHash: string,
        manager?: EntityManager,
    ): Promise<UserRefreshToken | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                refresh_token_hash: tokenHash,
                is_revoked: false,
            },
        });
    }

    /**
     * Find token by ID
     */
    async findById(id: number, manager?: EntityManager): Promise<UserRefreshToken | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: { id },
        });
    }

    /**
     * Create new refresh token entity (does not save)
     */
    create(data: Partial<UserRefreshToken>, manager?: EntityManager): UserRefreshToken {
        const repo = this.getRepo(manager);
        return repo.create(data);
    }

    /**
     * Save refresh token entity
     */
    async save(
        token: UserRefreshToken,
        manager?: EntityManager,
    ): Promise<UserRefreshToken> {
        const repo = this.getRepo(manager);
        return await repo.save(token);
    }

    /**
     * Create and save refresh token (convenience method)
     */
    async createAndSave(
        data: Partial<UserRefreshToken>,
        manager?: EntityManager,
    ): Promise<UserRefreshToken> {
        const token = this.create(data, manager);
        return await this.save(token, manager);
    }

    /**
     * Update refresh token
     */
    async update(
        id: number,
        data: Partial<UserRefreshToken>,
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
     * Revoke tokens by user ID
     */
    async revokeByUserId(
        userId: number,
        reason: string,
        manager?: EntityManager,
    ): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.update(
            {
                user_id: userId,
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
                user_id: customerId,
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
                user_id: customerId,
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
                user_id: customerId,
                is_revoked: true,
            },
        });
    }

    async softDeleteByCustomerId(customerId: number, manager?: EntityManager): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.softDelete({
            user_id: customerId,
        });
    }
}