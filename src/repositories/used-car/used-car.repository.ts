// src/repositories/car.repository.ts
import { WHITELISTED_STATUSES_FOR_DUPLICATE_CHECK } from '@common/constants/used-car.constant';
import { UsedCar } from '@entity/used-car/used-car.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UsedCarRepository {
    constructor(
        @InjectRepository(UsedCar)
        private readonly usedCarRepository: Repository<UsedCar>,
    ) { }

    private getRepo(manager?: EntityManager): Repository<UsedCar> {
        return manager ? manager.getRepository(UsedCar) : this.usedCarRepository;
    }

    async checkDuplicateRegistration(
        registrationNumber: string,
        manager?: EntityManager,
    ): Promise<void> {
        const repo = this.getRepo(manager);
        const queryBuilder = repo
            .createQueryBuilder()
            .select(['uc.id as "id"'])
            .from('used_car', 'uc')
            .where('uc.registration_number = :registrationNumber', {
                registrationNumber: registrationNumber.toUpperCase().trim()
            })
            .andWhere('uc.deleted_at IS NULL')
            .andWhere('uc.status NOT IN (:...whitelistedStatuses)', {
                whitelistedStatuses: WHITELISTED_STATUSES_FOR_DUPLICATE_CHECK,
            });

        const existingListing = await queryBuilder.getRawOne();

        if (existingListing) {
            throw new BadRequestException('A used car listing with this registration number already exists.');
        }

        return;
    }

    create(data: UsedCar, manager?: EntityManager): UsedCar {
        const repo = this.getRepo(manager);
        return repo.create(data);
    }

    async save(entity: UsedCar[], manager?: EntityManager): Promise<UsedCar[]> {
        const repo = this.getRepo(manager);
        return await repo.save(entity);
    }
}