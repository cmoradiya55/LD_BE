// src/repositories/car.repository.ts
import { PAGINATION_DEFAULTS, SORT_ORDER } from '@common/constants/app.constant';
import { CarBrand } from '@entity/car/car-brand.entity';
import { City } from '@entity/general/city.entity';
import { Pincode } from '@entity/general/pincode.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';

@Injectable()
export class PincodeRepository {
    constructor(
        @InjectRepository(Pincode)
        private readonly repo: Repository<Pincode>,
    ) { }

    private async getRepo(manager?: EntityManager): Promise<Repository<Pincode>> {
        return manager ? manager.getRepository(Pincode) : this.repo;
    }

    async getPincodeAndCitySuggestion(
        query: string,
        page: number = PAGINATION_DEFAULTS.PAGE,
        limit: number = PAGINATION_DEFAULTS.LIMIT,
        manager?: EntityManager
    ) {
        const repo = await this.getRepo(manager);
        const skip = (page - 1) * limit;
        const isNumber = /^[0-9]+$/.test(query);

        const qb = repo
            .createQueryBuilder('p')
            .innerJoinAndSelect('p.city', 'c')
            .take(limit)
            .skip(skip);

        if (isNumber) {
            qb.where('p.pincode = :pin', { pin: query })
                .orderBy('c.is_active', SORT_ORDER.DESC)
                .addOrderBy('p.pincode', SORT_ORDER.ASC)
                .addOrderBy('c.city_name', SORT_ORDER.ASC);
        } else {
            qb.where('c.city_name ILIKE :q', { q: `%${query}%` })
                .orWhere('p.area_name ILIKE :q', { q: `%${query}%` })
                .orderBy('c.is_active', SORT_ORDER.DESC)
                .addOrderBy('p.pincode', SORT_ORDER.ASC)
                .addOrderBy('c.city_name', SORT_ORDER.ASC);

        }

        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
}