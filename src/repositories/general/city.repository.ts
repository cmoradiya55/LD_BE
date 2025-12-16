// src/repositories/car.repository.ts
import { PAGINATION_DEFAULTS, SORT_ORDER } from '@common/constants/app.constant';
import { City } from '@entity/general/city.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';

@Injectable()
export class CityRepository {
    constructor(
        @InjectRepository(City)
        private readonly repo: Repository<City>,
    ) { }

    private async getRepo(manager?: EntityManager): Promise<Repository<City>> {
        return manager ? manager.getRepository(City) : this.repo;
    }

    async getActiveCities(page: number, limit: number, manager?: EntityManager) {
        const repository = await this.getRepo(manager);
        const skip = (page - 1) * limit;
        const [data, total] = await repository.findAndCount({
            where: {
                is_active: true,
            },
            take: limit,
            skip: skip,
            order: {
                city_name: SORT_ORDER.ASC,
            },
        });

        return { data, total, page, limit };
    }

    async isCityIdValid(id: number, manager?: EntityManager): Promise<boolean> {
        const repository = await this.getRepo(manager);
        const count = await repository.count({
            where: {
                id: id,
                is_active: true,
            },
        });
        return count > 0;
    }

    async getCityById(id: number, manager?: EntityManager): Promise<City | null> {
        const repository = await this.getRepo(manager);
        return await repository.findOne({
            where: {
                id: id,
                is_active: true,
            },
        });
    }

    async getPincodeIdsByCityId(cityId: number, manager?: EntityManager): Promise<number[]> {
        const repository = await this.getRepo(manager);
        const city = await repository.findOne({
            where: {
                id: cityId,
                is_active: true,
            },
            relations: ['pincodes'],
        });
        return city ? city.pincodes.map(p => p.id) : [];
    }
}