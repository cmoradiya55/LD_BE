import { CustomerFcmToken } from '@entity/customer/customer-fcm-token.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CustomerFcmTokenRepository {
    constructor(
        @InjectRepository(CustomerFcmToken)
        private readonly repo: Repository<CustomerFcmToken>,
    ) { }

    private async getRepo(manager?: EntityManager): Promise<Repository<CustomerFcmToken>> {
        return manager ? manager.getRepository(CustomerFcmToken) : this.repo;
    }
}