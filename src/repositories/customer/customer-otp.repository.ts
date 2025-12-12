import { SORT_ORDER } from '@common/constants/app.constant';
import { CustomerOtpType } from '@common/enums/customer.enum';
import { CustomerOtp } from '@entity/customer/customer-otp.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, LessThan } from 'typeorm';

@Injectable()
export class CustomerOtpRepository {
    constructor(
        @InjectRepository(CustomerOtp)
        private readonly repo: Repository<CustomerOtp>,
    ) { }

    /**
     * Get repository (supports transactions)
     */
    private getRepo(manager?: EntityManager): Repository<CustomerOtp> {
        return manager ? manager.getRepository(CustomerOtp) : this.repo;
    }

    /**
     * Find active OTP by mobile and OTP code
     */
    async findActiveOtp(
        identifier: string,
        otp: string,
        otpType: CustomerOtpType,
        manager?: EntityManager,
    ): Promise<CustomerOtp | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                identifier: identifier,
                otp,
                otp_type: otpType,
                is_verified: false,
            },
            order: {
                created_at: SORT_ORDER.DESC,
            },
        });
    }

    /**
     * Find latest OTP for mobile (regardless of verification status)
     */
    async findLatestOtp(
        identifier: string,
        otpType: CustomerOtpType,
        manager?: EntityManager,
    ): Promise<CustomerOtp | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                identifier,
                otp_type: otpType,
            },
            order: {
                created_at: 'DESC',
            },
        });
    }

    /**
     * Create new OTP entity (does not save)
     */
    create(data: CustomerOtp, manager?: EntityManager): CustomerOtp {
        const repo = this.getRepo(manager);
        return repo.create(data);
    }

    /**
     * Save OTP entity
     */
    async save(otp: CustomerOtp, manager?: EntityManager): Promise<CustomerOtp> {
        const repo = this.getRepo(manager);
        return await repo.save(otp);
    }

    /**
     * Create and save OTP (convenience method)
     */
    async createAndSave(data: CustomerOtp, manager?: EntityManager): Promise<CustomerOtp> {
        const otp = this.create(data, manager);
        return await this.save(otp, manager);
    }

    /**
     * Update OTP
     */
    async update(
        id: number,
        data: Partial<CustomerOtp>,
        manager?: EntityManager,
    ): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.update(id, data);
    }

    /**
     * Mark OTP as verified
     */
    async markAsVerified(id: number, manager?: EntityManager): Promise<void> {
        await this.update(
            id,
            {
                is_verified: true,
                verified_at: new Date(),
            },
            manager,
        );
    }

    /**
     * Increment attempts
     */
    async incrementAttempts(id: number, manager?: EntityManager): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.increment({ id }, 'attempts', 1);
    }

    /**
     * Invalidate all previous OTPs for mobile
     */
    async invalidatePreviousOtps(
        identifier: string,
        otpType: CustomerOtpType,
        manager?: EntityManager,
    ): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.update(
            {
                identifier,
                otp_type: otpType,
                is_verified: false,
            },
            {
                is_verified: true,
            },
        );
    }

    /**
     * Count unverified OTPs for mobile (rate limiting)
     */
    async countUnverifiedOtps(
        identifier: string,
        otpType: CustomerOtpType,
        sinceMinutes: number,
        manager?: EntityManager,
    ): Promise<number> {
        const repo = this.getRepo(manager);
        const cutoffDate = new Date();
        cutoffDate.setMinutes(cutoffDate.getMinutes() - sinceMinutes);

        return await repo.count({
            where: {
                identifier,
                otp_type: otpType,
                is_verified: false,
                created_at: LessThan(cutoffDate) as any,
            },
        });
    }

    /**
     * Delete expired OTPs (cleanup)
     */
    async deleteExpiredOtps(manager?: EntityManager): Promise<number> {
        const repo = this.getRepo(manager);
        const result = await repo.delete({
            expires_at: LessThan(new Date()),
        });
        return result.affected || 0;
    }

    /**
     * Delete old verified OTPs (cleanup)
     */
    async deleteOldVerifiedOtps(daysOld: number, manager?: EntityManager): Promise<number> {
        const repo = this.getRepo(manager);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await repo
            .createQueryBuilder()
            .delete()
            .where('is_verified = :verified', { verified: true })
            .andWhere('verified_at < :cutoffDate', { cutoffDate })
            .execute();

        return result.affected || 0;
    }

    /**
     * Find OTP by ID
     */
    async findById(id: number, manager?: EntityManager): Promise<CustomerOtp | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: { id },
        });
    }
}