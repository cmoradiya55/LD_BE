// src/repositories/car.repository.ts
import { SORT_ORDER } from '@common/constants/app.constant';
import { CarBrand } from '@entity/car/car-brand.entity';
import { CarModel } from '@entity/car/car-model.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository, Raw } from 'typeorm';

@Injectable()
export class CarModelRepository {
    constructor(
        @InjectRepository(CarModel)
        private readonly repo: Repository<CarModel>,
    ) { }

    private async getRepo(manager): Promise<Repository<CarModel>> {
        return manager ? manager.getRepository(CarModel) : this.repo;
    }

    // find models by brand id and year
    async findByBrandIdAndYear(brandId: number, year: number, search?: string, manager?: EntityManager): Promise<CarModel[]> {
        const repo = await this.getRepo(manager);
        return repo.find({
            where: {
                brand_id: brandId,
                is_active: true,
                name: search ? ILike(`%${search}%`) : undefined,
                production_start_year: year <= 0 ? undefined : Raw(alias => `${alias} <= ${year}`),
                production_end_year: year <= 0 ? undefined : Raw(alias => `(${alias} IS NULL OR ${alias} >= ${year})`),
            },
            select: ['id', 'name', 'display_name'],
            order: {
                id: SORT_ORDER.DESC,
            },
        });
    }
}