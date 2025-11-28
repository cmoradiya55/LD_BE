// src/repositories/car.repository.ts
import { FuelTypeLabel } from '@common/enums/car-detail.enum';
import { CarVariant } from '@entity/car/car-variant.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository, LessThanOrEqual, MoreThanOrEqual, IsNull, Brackets } from 'typeorm';

export interface FuelTypeGroup {
    fuelType: string;
    fuelTypeId: number;
    variants: CarVariant[];
}

@Injectable()
export class CarVariantRepository {
    constructor(
        @InjectRepository(CarVariant)
        private readonly repo: Repository<CarVariant>,
    ) { }

    private async getRepo(manager?: EntityManager): Promise<Repository<CarVariant>> {
        return manager ? manager.getRepository(CarVariant) : this.repo;
    }

    async findByBrandIdYear(
        year: number,
        modelId: number,
        manager?: EntityManager
    ): Promise<CarVariant[]> {
        const repo = await this.getRepo(manager);

        const query = repo
            .createQueryBuilder('variant')
            .select([
                'variant.id',
                'variant.name',
                'variant.display_name',
                'variant.transmission_type',
                'variant.fuel_type',
                'variant.model_year',
            ])
            .where('variant.model_id = :modelId', { modelId })
            .andWhere('variant.is_active = :isActive', { isActive: true })
            .andWhere('variant.model_year <= :year', { year })
            .andWhere(
                new Brackets((qb) => {
                    qb.where('variant.discontinued_date IS NULL')
                        .orWhere('variant.discontinued_date >= :discontinuedDate', {
                            discontinuedDate: new Date(`${year}-01-01`),
                        });
                }),
            )
            .orderBy('variant.fuel_type', 'ASC')
            .addOrderBy('variant.id', 'DESC');

        return query.getMany();
    }
}