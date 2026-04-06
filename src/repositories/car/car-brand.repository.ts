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

    private async getRepo(manager?: EntityManager): Promise<Repository<CarBrand>> {
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

    async verifyCarDetails(
        brand_id: number,
        year: number,
        model_id: number,
        variant_id: number,
        manager?: EntityManager,
    ) {
        const repo = await this.getRepo(manager);
        const result = await repo
            .createQueryBuilder('b')
            .select([
                'b.id as "brandId"',
                'b.slug as "brandSlug"',
                'b.operation_start_year as "startYear"',
                'b.operation_end_year as "endYear"',
                'm.id as "modelId"',
                'm.slug as "modelSlug"',
                'm.production_start_year as "modelStartYear"',
                'm.production_end_year as "modelEndYear"',
                'v.id as "variantId"',
                'v.slug as "variantSlug"',
                'v.model_year as "variantModelYear"',
                'v.discontinued_date as "variantDiscontinuedDate"',
            ])
            .innerJoin(
                'models',
                'm',
                `m.brand_id = b.id 
                AND m.id = :modelId 
                AND m.is_active = true
                AND m.production_start_year <= :year
                AND (m.production_end_year IS NULL OR m.production_end_year >= :year)`,
                { modelId: model_id, year },
            )
            .innerJoin(
                'variants',
                'v',
                `v.model_id = m.id 
                AND v.id = :variantId 
                AND v.is_active = true
                AND v.model_year <= :year
                AND (v.discontinued_date IS NULL OR v.discontinued_date >= :discontinuedDate)`,
                { variantId: variant_id, year, discontinuedDate: new Date(`${year}-01-01`) },
            )
            .where('b.id = :brandId', { brandId: brand_id })
            .andWhere('b.is_active = true')
            .andWhere('b.operation_start_year <= :year', { year })
            .andWhere(
                '(b.operation_end_year IS NULL OR b.operation_end_year >= :year)',
                { year },
            )
            .getRawOne();

        return result;
    }

    // async verifyCarDetails(
    //     brand_id: number,
    //     year: number,
    //     model_id: number,
    //     variant_id: number,
    //     manager?: EntityManager,
    // ) {
    //     const repo = await this.getRepo(manager);

    //     const result = await repo
    //         .createQueryBuilder()
    //         .select([
    //             'b.id as "brandId"',
    //             'b.operation_start_year as "startYear"',
    //             'b.operation_end_year as "endYear"',
    //             'm.id as "modelId"',
    //             'm.production_start_year as "modelStartYear"',
    //             'm.production_end_year as "modelEndYear"',
    //             'v.id as "variantId"',
    //             'v.discontinued_date as "variantDiscontinuedDate"',
    //         ])
    //         .from('brands', 'b')
    //         .leftJoin(
    //             'models',
    //             'm',
    //             'm.brand_id = b.id AND m.id = :modelId AND m.is_active = true',
    //             { modelId: model_id },
    //         )
    //         .leftJoin(
    //             'variants',
    //             'v',
    //             'v.model_id = m.id AND v.id = :variantId AND v.is_active = true',
    //             { variantId: variant_id },

    //         )
    //         .where('b.id = :brandId', { brandId: brand_id })
    //         .andWhere('b.is_active = true')
    //         .andWhere('v.model_year <= :year', { year: year })
    //         .andWhere('m.production_start_year <= :year', { year: year })
    //         .andWhere(new Brackets((qb) => {
    //             qb.where('m.production_end_year IS NULL')
    //                 .orWhere('m.production_end_year >= :year', { year: year });
    //         }))
    //         .andWhere(
    //             new Brackets((qb) => {
    //                 qb.where('v.discontinued_date IS NULL')
    //                     .orWhere('v.discontinued_date >= :discontinuedDate', {
    //                         discontinuedDate: new Date(`${year}-01-01`),
    //                     });
    //             }),
    //         )
    //         .getRawOne();

    //     return result;
    // }
}