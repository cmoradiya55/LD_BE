import { CustomerRefreshToken } from '@entity/customer/customer-refresh-token.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CustomerRefreshTokenRepository {
    constructor(
        @InjectRepository(CustomerRefreshToken)
        private readonly repo: Repository<CustomerRefreshToken>,
    ) { }

    private async getRepo(manager?: EntityManager): Promise<Repository<CustomerRefreshToken>> {
        return manager ? manager.getRepository(CustomerRefreshToken) : this.repo;
    }
}