import { Customer } from '@entity/customer/customer.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, FindOptionsWhere, LessThanOrEqual, IsNull, Or } from 'typeorm';

@Injectable()
export class CustomerRepository {
    constructor(
        @InjectRepository(Customer)
        private readonly repo: Repository<Customer>,
    ) {}

    private async getRepo(manager?: EntityManager): Promise<Repository<Customer>> {
        return manager ? manager.getRepository(Customer) : this.repo;
    }

    /**
     * Get default where conditions (auto-applied to all queries)
     */
    private getDefaultConditions(): FindOptionsWhere<Customer> {
        return {
            is_active: true,
            is_blocked: false,
            deleted_at: IsNull(),
            locked_until: Or(IsNull(), LessThanOrEqual(new Date())),
        };
    }

    /**
     * Merge default conditions with custom conditions
     */
    private mergeConditions(
        customConditions: FindOptionsWhere<Customer> | FindOptionsWhere<Customer>[],
    ): FindOptionsWhere<Customer> | FindOptionsWhere<Customer>[] {
        const defaultConditions = this.getDefaultConditions();

        if (Array.isArray(customConditions)) {
            return customConditions.map(condition => ({
                ...defaultConditions,
                ...condition,
            }));
        }

        return {
            ...defaultConditions,
            ...customConditions,
        };
    }

    /**
     * Find customer by mobile number
     */
    async findByMobile(
        mobileCountryCode: number,
        mobileNo: number,
        manager?: EntityManager,
    ): Promise<Customer | null> {
        const repo = await this.getRepo(manager);
        return await repo.findOne({
            where: this.mergeConditions({
                mobile_country_code: mobileCountryCode,
                mobile_no: mobileNo,
            }),
        });
    }

    /**
     * Find customer by mobile number (without default conditions)
     * Use this when you need to find inactive/blocked/deleted customers
     */
    async findByMobileRaw(
        mobileCountryCode: number,
        mobileNo: number,
        manager?: EntityManager,
    ): Promise<Customer | null> {
        const repo = await this.getRepo(manager);
        return await repo.findOne({
            where: {
                mobile_country_code: mobileCountryCode,
                mobile_no: mobileNo,
            },
        });
    }

    /**
     * Find customer by ID
     */
    async findById(id: number, manager?: EntityManager): Promise<Customer | null> {
        const repo = await this.getRepo(manager);
        return await repo.findOne({
            where: this.mergeConditions({ id }),
        });
    }

    /**
     * Find customer by ID (without default conditions)
     */
    async findByIdRaw(id: number, manager?: EntityManager): Promise<Customer | null> {
        const repo = await this.getRepo(manager);
        return await repo.findOne({
            where: { id },
        });
    }

    /**
     * Find customer by email
     */
    async findByEmail(email: string, manager?: EntityManager): Promise<Customer | null> {
        const repo = await this.getRepo(manager);
        return await repo.findOne({
            where: this.mergeConditions({ email }),
        });
    }

    /**
     * Find all customers with pagination
     */
    async findAll(
        page: number = 1,
        limit: number = 10,
        manager?: EntityManager,
    ): Promise<{ data: Customer[]; total: number }> {
        const repo = await this.getRepo(manager);
        const [data, total] = await repo.findAndCount({
            where: this.getDefaultConditions(),
            skip: (page - 1) * limit,
            take: limit,
            order: { created_at: 'DESC' },
        });

        return { data, total };
    }

    /**
     * Check if customer exists by mobile
     */
    async existsByMobile(
        mobileCountryCode: number,
        mobileNo: number,
        manager?: EntityManager,
    ): Promise<boolean> {
        const repo = await this.getRepo(manager);
        const count = await repo.count({
            where: this.mergeConditions({
                mobile_country_code: mobileCountryCode,
                mobile_no: mobileNo,
            }),
        });
        return count > 0;
    }

    /**
     * Create new customer
     */
    async create(data: Partial<Customer>, manager?: EntityManager): Promise<Customer> {
        const repo = await this.getRepo(manager);
        const customer = repo.create(data);
        return await repo.save(customer);
    }

    /**
     * Update customer
     */
    async update(
        id: number,
        data: Partial<Customer>,
        manager?: EntityManager,
    ): Promise<Customer | null> {
        const repo = await this.getRepo(manager);
        await repo.update(id, data);
        return await this.findById(id, manager);
    }

    /**
     * Update login info
     */
    async updateLoginInfo(id: number, ipAddress: string, manager?: EntityManager): Promise<void> {
        const repo = await this.getRepo(manager);
        await repo.update(id, {
            last_login_at: new Date(),
            last_login_ip: ipAddress,
            login_attempts: 0,
        });
    }

    /**
     * Increment login attempts
     */
    async incrementLoginAttempts(id: number, manager?: EntityManager): Promise<void> {
        const repo = await this.getRepo(manager);
        await repo.increment({ id }, 'login_attempts', 1);
    }

    /**
     * Lock account
     */
    async lockAccount(id: number, until: Date, manager?: EntityManager): Promise<void> {
        const repo = await this.getRepo(manager);
        await repo.update(id, {
            locked_until: until,
        });
    }

    /**
     * Block customer
     */
    async blockCustomer(id: number, reason: string, manager?: EntityManager): Promise<void> {
        const repo = await this.getRepo(manager);
        await repo.update(id, {
            is_blocked: true,
            blocked_reason: reason,
            blocked_at: new Date(),
        });
    }

    /**
     * Unblock customer
     */
    async unblockCustomer(id: number, manager?: EntityManager): Promise<void> {
        const repo = await this.getRepo(manager);
        await repo.update(id, {
            is_blocked: false,
            blocked_reason: null,
            blocked_at: null,
        });
    }

    /**
     * Deactivate customer
     */
    async deactivate(id: number, manager?: EntityManager): Promise<void> {
        const repo = await this.getRepo(manager);
        await repo.update(id, {
            is_active: false,
        });
    }

    /**
     * Activate customer
     */
    async activate(id: number, manager?: EntityManager): Promise<void> {
        const repo = await this.getRepo(manager);
        await repo.update(id, {
            is_active: true,
        });
    }

    /**
     * Soft delete customer
     */
    async softDelete(id: number, manager?: EntityManager): Promise<void> {
        const repo = await this.getRepo(manager);
        await repo.softDelete(id);
    }

    /**
     * Restore soft-deleted customer
     */
    async restore(id: number, manager?: EntityManager): Promise<void> {
        const repo = await this.getRepo(manager);
        await repo.restore(id);
    }

    /**
     * Count active customers
     */
    async countActive(manager?: EntityManager): Promise<number> {
        const repo = await this.getRepo(manager);
        return await repo.count({
            where: this.getDefaultConditions(),
        });
    }
}