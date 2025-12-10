import { Customer } from '@entity/customer/customer.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CustomerRepository {
    constructor(
        @InjectRepository(Customer)
        private readonly repo: Repository<Customer>,
    ) { }

    private async getRepo(manager?: EntityManager): Promise<Repository<Customer>> {
        return manager ? manager.getRepository(Customer) : this.repo;
    }
}