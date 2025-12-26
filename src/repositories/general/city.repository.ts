import { SORT_ORDER } from '@common/constants/app.constant';
import { City } from '@entity/general/city.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
import { GetAllCityDto } from '../../modules/common/city/dto/get-all-city.dto';
import { UserRole } from '@common/enums/user.enum';

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

    async getAllInspectionCentreDetails(manager?: EntityManager) {
        const repo = this.getRepo();
        return await repo
            .createQueryBuilder('city')

            // 1️⃣ only active cities
            .where('city.is_active = true')

            // 2️⃣ join active inspection centres
            .innerJoinAndSelect(
                'city.inspectionCentres',
                'ic',
                'ic.is_active = true AND ic.deleted_at IS NULL',
            )

            // 3️⃣ join manager
            .leftJoinAndSelect(
                'ic.users',
                'manager',
                `
                manager.role = :managerRole
                AND manager.is_active = true
                AND manager.deleted_at IS NULL
                `,
                { managerRole: UserRole.MANAGER },
            )
            // 4️⃣ add inspector count per manager
            .loadRelationCountAndMap(
                'manager.inspectorCount', // property to map count into
                'manager.managedInspectors', // relation from manager to inspectors
                'inspector',
                qb => qb
                    .where('inspector.role = :inspectorRole', { inspectorRole: 3 })
                    .andWhere('inspector.is_active = true')
                    .andWhere('inspector.deleted_at IS NULL')
            )
            
            // optional but realistic
            .leftJoinAndSelect('ic.pincode', 'pincode')

            .orderBy('city.city_name', 'ASC')
            .addOrderBy('ic.created_at', 'DESC')

            .getMany();
    }
}