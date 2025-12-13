// src/repositories/car.repository.ts
import { PAGINATION_DEFAULTS, SORT_ORDER } from '@common/constants/app.constant';
import { Pincode } from '@entity/general/pincode.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, Repository } from 'typeorm';

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
        cityId?: number,
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

        qb.where('1 = 1');

        if (cityId) {
            qb.andWhere('c.id = :cityId', { cityId });
        }

        if (isNumber) {
            qb.andWhere('p.pincode = :pin', { pin: query })
        } else {
            qb.andWhere(
                new Brackets(qb => {
                    qb.where('c.city_name ILIKE :q', { q: `%${query}%` })
                        .orWhere('p.area_name ILIKE :q', { q: `%${query}%` })
                })
            );
        }

        qb.orderBy('c.is_active', SORT_ORDER.DESC)
            .addOrderBy('p.pincode', SORT_ORDER.ASC)
            .addOrderBy('c.city_name', SORT_ORDER.ASC);

        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }

    async isPincodeActive(pincodeId: number, manager?: EntityManager): Promise<boolean> {
        const repo = await this.getRepo(manager);
        const pincode = await repo.findOne({
            select: { id: true },
            where: { id: pincodeId, city: { is_active: true } },
            relations: ['city'],
        });
        return !!pincode;
    }

    async isPincodeBelongsToCity(pincodeId: number, cityId: number, manager?: EntityManager): Promise<boolean> {
        const repo = await this.getRepo(manager);
        const pincode = await repo.findOne({
            select: { id: true },
            where: { id: pincodeId, city: { id: cityId, is_active: true } },
            relations: ['city'],
        });
        return !!pincode;
    }
}