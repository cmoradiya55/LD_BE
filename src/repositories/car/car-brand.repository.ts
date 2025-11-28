// src/repositories/car.repository.ts
import { SORT_ORDER } from '@common/constants/app.constant';
import { CarBrand } from '@entity/car/car-brand.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CarBrandRepository {
    constructor(
        @InjectRepository(CarBrand)
        private readonly repo: Repository<CarBrand>,
    ) { }

    // get all car brands for customer app
    async findAllForCustomerApp(): Promise<CarBrand[]> {
        return this.repo.find({
            where: {
                is_active: true,
            },
            order: {
                is_priority: SORT_ORDER.DESC,      // true (1) comes before false (0)
                priority_order: SORT_ORDER.ASC,     // lower priority number first
                display_name: SORT_ORDER.ASC,       // alphabetical for non-priority items
            },
        });
    }
}