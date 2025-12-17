import { UserOtpType } from '@common/enums/user.enum';
import { Customer } from '@entity/customer/customer.entity';
import { User } from '@entity/user/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, FindOptionsWhere, LessThanOrEqual, IsNull, Or, Not, MoreThan } from 'typeorm';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) { }

    private getRepo(manager?: EntityManager): Repository<User> {
        return manager ? manager.getRepository(User) : this.repo;
    }

    async findActiveUserById(id: number, manager?: EntityManager): Promise<User | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                id,
                is_active: true,
            }
        });
    }

    async findActiveUserByIdAndJwtVersion(id: number, jwtVersion: number, manager?: EntityManager): Promise<User | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                id,
                is_active: true,
                jwt_version: Number(jwtVersion),
            }
        });
    }

    /**
     * Create new user
     */
    create(data: User, manager?: EntityManager): User {
        const repo = this.getRepo(manager);
        return repo.create(data);
    }

    async save(entity: User, manager?: EntityManager): Promise<User> {
        const repo = this.getRepo(manager);
        return await repo.save(entity);
    }

    /**
     * Find user by mobile number (without default conditions)
     * Use this when you need to find inactive/blocked/deleted users
    */
    async findByMobileRaw(
        mobileCountryCode: number,
        mobileNo: number,
        manager?: EntityManager,
    ): Promise<User | null> {
        const repo = await this.getRepo(manager);
        return await repo.findOne({
            where: {
                country_code: mobileCountryCode,
                mobile_number: mobileNo,
            },
            withDeleted: true,
        });
    }

    /**
     * Find user by mobile number (without default conditions)
     * Use this when you need to find inactive/blocked/deleted users
    */
    async existsVerifiedEmailForOther(
        email: string,
        userId: number,
        manager?: EntityManager,
    ): Promise<User | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                email: email,
                is_email_verified: true,
                id: Not(userId),
            },
            withDeleted: true,
        });
    }

    async findActiveByMobile(
        mobileCountryCode: number,
        mobileNo: number,
        manager?: EntityManager,
    ): Promise<User | null> {
        const repo = await this.getRepo(manager);
        return await repo.findOne({
            where: {
                country_code: mobileCountryCode,
                mobile_number: mobileNo,
                is_active: true,
            },
        });
    }

    /**
        * Update FCM token
        */
    async updateActiveUserAndReturn(
        id: number,
        data: Partial<User>,
        manager?: EntityManager,
    ): Promise<User | null> {
        const repo = this.getRepo(manager);
        await repo.update({ id, is_active: true }, {
            ...data,
            updated_at: new Date(),
        });
        const updatedUser = await repo.findOne({ where: { id, is_active: true } });
        return updatedUser;
    }

    async verifyMobileOtp(
        country_code: number,
        mobile_no: number,
        otp: string,
        otpType: UserOtpType,
        manager?: EntityManager,
    ): Promise<User | null> {
        const repo = this.getRepo(manager);
        // Find user with OTP
        const user = await repo.findOne({
            where: {
                country_code: country_code,
                mobile_number: mobile_no,
                otp: otp,
                otp_type: otpType,
                otp_expires_at: MoreThan(new Date()),
            },
        });

        if (!user) {
            return null;
        }

        user.otp = null;
        user.otp_type = null;
        user.otp_expires_at = null;

        await repo.save(user);

        return user;
    }

    async verifyEmailOtp(
        email: string,
        otp: string,
        otpType: UserOtpType,
        manager?: EntityManager,
    ): Promise<User | null> {
        const repo = this.getRepo(manager);
        // Find user with OTP
        const user = await repo.findOne({
            where: {
                email: email,
                otp: otp,
                otp_type: otpType,
                otp_expires_at: MoreThan(new Date()),
            },
        });

        if (!user) {
            return null;
        }

        user.otp = null;
        user.otp_type = null;
        user.otp_expires_at = null;

        await repo.save(user);

        return user;
    }

    async otpSaveOfActiveUser(userId: number, otpType: UserOtpType, otp: string, otpExpiry: Date, manager?: EntityManager) {
        const repo = this.getRepo(manager);
        return await repo.update(
            {
                id: userId,
                is_active: true,
            },
            {
                otp_type: otpType,
                otp: otp,
                otp_expires_at: otpExpiry,
            });
    }
}