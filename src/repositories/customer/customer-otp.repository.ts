import { CustomerOtp } from '@entity/customer/customer-otp.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CustomerOtpRepository {
    constructor(
        @InjectRepository(CustomerOtp)
        private readonly repo: Repository<CustomerOtp>,
    ) { }

    private async getRepo(manager?: EntityManager): Promise<Repository<CustomerOtp>> {
        return manager ? manager.getRepository(CustomerOtp) : this.repo;
    }
}