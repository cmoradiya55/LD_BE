// src/repositories/car.repository.ts
import { SORT_ORDER } from '@common/constants/app.constant';
import { CarBrand } from '@entity/car/car-brand.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';

@Injectable()
export class CarBrandRepository {
    constructor(
        @InjectRepository(CarBrand)
        private readonly repo: Repository<CarBrand>,
    ) { }

    private async getRepo(manager): Promise<Repository<CarBrand>> {
        return manager ? manager.getRepository(CarBrand) : this.repo;
    }

    // get all car brands for customer app
    async findAllForCustomerApp(query?: string, manager?: EntityManager): Promise<CarBrand[]> {
        const repo = await this.getRepo(manager);
        return repo.find({
            where: {
                is_active: true,
                display_name: query ? ILike(`%${query}%`) : undefined,
            },
            order: {
                is_priority: SORT_ORDER.DESC,
                priority_order: SORT_ORDER.ASC,
                display_name: SORT_ORDER.ASC,
            },
        });
    }

    // Get only year range for a brand
    async findYearRangeByBrandId(brandId: number, manager?: EntityManager): Promise<{ operation_start_year: number; operation_end_year: number | null; } | null> {
        const repo = await this.getRepo(manager);
        
        const brand = await repo.findOne({
            where: { id: brandId, is_active: true },
            select: ['operation_start_year', 'operation_end_year'],
        });
        if (!brand) return null;

        return {
            operation_start_year: brand.operation_start_year,
            operation_end_year: brand.operation_end_year,
        };
    }
}