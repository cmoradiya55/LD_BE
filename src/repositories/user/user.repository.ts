import { SORT_ORDER } from '@common/constants/app.constant';
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
        entity.updated_at = new Date();
        return await repo.save(entity);
    }

    async createAndSave(data: User, manager?: EntityManager): Promise<User> {
        const repo = this.getRepo(manager);
        const user = repo.create(data);
        await repo.save(user);
        return user;
    }

    async update(id: number, data: Partial<User>, manager?: EntityManager): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.update(id, {
            ...data,
            updated_at: new Date(),
        });
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
    async findVerifiedEmailForOtherUser(
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

    /**
     * Find active user by mobile number
     */
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

    // =========== OTP OPERATIONS ============
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
        userId: number,
        email: string,
        otp: string,
        otpType: UserOtpType,
        manager?: EntityManager,
    ): Promise<User | null> {
        const repo = this.getRepo(manager);
        // Find user with OTP
        const user = await repo.findOne({
            where: {
                id: userId,
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

    async getAllUsers(query: any, page: number, limit: number, manager?: EntityManager) {
        const repo = this.getRepo(manager);
        const skip = (page - 1) * limit;
        const [data, total] = await repo.findAndCount({
            relations: ['city', 'manager', 'createdByUser', 'updatedByUser'],
            take: limit,
            skip: skip,
            order: {
                id: SORT_ORDER.DESC,
            },
        });
        return { data, total, page, limit };
    }

    async findById(id: number, manager?: EntityManager): Promise<User | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: {
                id,
            },
        });
    }

    /**
     * Check if Aadhar number exists (excluding specific user)
     */
    async existsByAadharExcludingUser(
        aadharNumber: string,
        excludeUserId: number,
        manager?: EntityManager,
    ): Promise<boolean> {
        const repo = this.getRepo(manager);

        const exist = await repo.exists({
            where: {
                aadhar_number: aadharNumber,
                id: Not(excludeUserId),
            },
        });

        return exist;
    }

    /**
     * Check if PAN number exists (excluding specific user)
     */
    async existsByPanExcludingUser(
        panNumber: string,
        excludeUserId: number,
        manager?: EntityManager,
    ): Promise<boolean> {
        const repo = this.getRepo(manager);

        const exist = await repo.exists({
            where: {
                pan_number: panNumber,
                id: Not(excludeUserId),
            },
        });

        return exist;
    }
}