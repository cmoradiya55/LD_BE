// src/repositories/car.repository.ts
import { SORT_ORDER } from '@common/constants/app.constant';
import { CarModel } from '@entity/car/car-model.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository, LessThanOrEqual, MoreThanOrEqual, IsNull } from 'typeorm';

@Injectable()
export class CarModelRepository {
    constructor(
        @InjectRepository(CarModel)
        private readonly repo: Repository<CarModel>,
    ) { }

    private async getRepo(manager?: EntityManager): Promise<Repository<CarModel>> {
        return manager ? manager.getRepository(CarModel) : this.repo;
    }

    // find models by brand id and year
    async findByBrandIdAndYear(brandId: number, year: number, search?: string, manager?: EntityManager): Promise<CarModel[]> {
        const repo = await this.getRepo(manager);
        return repo.find({
            where: [
                // Case 1: production_end_year IS NULL
                {
                    brand_id: brandId,
                    is_active: true,
                    name: search ? ILike(`%${search}%`) : undefined,
                    production_start_year: LessThanOrEqual(year),
                    production_end_year: IsNull(),
                },

                // Case 2: production_end_year >= year
                {
                    brand_id: brandId,
                    is_active: true,
                    name: search ? ILike(`%${search}%`) : undefined,
                    production_start_year: LessThanOrEqual(year),
                    production_end_year: MoreThanOrEqual(year),
                }
            ],
            select: ['id', 'name', 'display_name'],
            order: { id: SORT_ORDER.DESC },
        });
    }

    // find models by brand id and year
    async findByBrandId(brandId: number, search?: string, manager?: EntityManager): Promise<CarModel[]> {
        const repo = await this.getRepo(manager);
        return repo.find({
            where: {
                brand_id: brandId,
                is_active: true,
            },
            select: ['id', 'display_name'],
            order: { id: SORT_ORDER.DESC },
        });
    }

    async findModelsByBrandOrModel(search: string, manager?: EntityManager): Promise<CarModel[]> {
        const repo = await this.getRepo(manager);
        const searchPattern = `%${search}%`;

        return await repo
            .createQueryBuilder('model')
            .leftJoinAndSelect('model.brand', 'brand')
            .where('model.name ILIKE :searchPattern', { searchPattern })
            .orWhere('model.display_name ILIKE :searchPattern', { searchPattern })
            .orWhere('brand.display_name ILIKE :searchPattern', { searchPattern })
            .select([
                'model.id',
                'model.name',
                'model.display_name',
                'brand.display_name',
                'brand.logo_url',
            ])
            .orderBy('model.id', SORT_ORDER.DESC)
            .getMany();
    }
}