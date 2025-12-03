// src/repositories/car.repository.ts
import { UsedCarCustomerPhoto } from '@entity/used-car/used-car-customer-photo.entity';
import { UsedCar } from '@entity/used-car/used-car.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UsedCarCustomerPhotoRepository {
    constructor(
        @InjectRepository(UsedCarCustomerPhoto)
        private readonly usedCarCustomerPhotoRepository: Repository<UsedCarCustomerPhoto>,
    ) { }

    private getRepo(manager?: EntityManager): Repository<UsedCarCustomerPhoto> {
        return manager ? manager.getRepository(UsedCarCustomerPhoto) : this.usedCarCustomerPhotoRepository;
    }

    createMultiple(data: UsedCarCustomerPhoto[], manager?: EntityManager): UsedCarCustomerPhoto[] {
        const repo = this.getRepo(manager);
        return repo.create(data);
    }

    async save(entity: UsedCarCustomerPhoto[], manager?: EntityManager): Promise<UsedCarCustomerPhoto[]> {
        const repo = this.getRepo(manager);
        return await repo.save(entity);
    }
}