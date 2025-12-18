import { SORT_ORDER } from '@common/constants/app.constant';
import { City } from '@entity/general/city.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
import { GetAllCityDto } from '../../modules/common/city/dto/get-all-city.dto';

@Injectable()
export class CityRepository {
    constructor(
        @InjectRepository(City)
        private readonly repo: Repository<City>,
    ) { }

    private getRepo(manager?: EntityManager): Repository<City> {
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
        const exists = await repository.exists({
            where: {
                id: id,
                is_active: true,
            },
        });
        return exists;
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

    async getAllCities(query: GetAllCityDto, page: number, limit: number, manager?: EntityManager) {
        const repository = await this.getRepo(manager);
        const skip = (page - 1) * limit;
        const { search, isActive } = query;

        const whereConditions: any = {};
        if (isActive !== undefined) {
            whereConditions.is_active = isActive;
        }

        if (search) {
            whereConditions.city_name = ILike(`%${search}%`);
        }

        const [data, total] = await repository.findAndCount({
            where: whereConditions,
            take: limit,
            skip: skip,
            order: {
                city_name: SORT_ORDER.ASC,
            },
        });

        return { data, total, page, limit };
    }
    async validatePincodeInCity(
        cityId: number,
        pincodeId: number,
        manager?: EntityManager,
    ): Promise<boolean> {
        const repo = this.getRepo(manager);

        const count = await repo
            .createQueryBuilder('city')
            .innerJoin(
                'pincodes',
                'pincode',
                'pincode.city_id = city.id AND pincode.id = :pincodeId',
                { pincodeId },
            )
            .where('city.id = :cityId', { cityId })
            .andWhere('city.is_active = true')
            .getCount();

        return count > 0;
    }

}