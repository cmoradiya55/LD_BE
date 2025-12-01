// src/repositories/car.repository.ts
import { PAGINATION_DEFAULTS, SORT_ORDER } from '@common/constants/app.constant';
import { CarBrand } from '@entity/car/car-brand.entity';
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
}