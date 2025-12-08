// src/repositories/car.repository.ts
import { WHITELISTED_STATUSES_FOR_DUPLICATE_CHECK } from '@common/constants/used-car.constant';
import { UsedCar } from '@entity/used-car/used-car.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UsedCarListingDto } from '../../modules/customer/used-car/dto/used-car-listing.dto';
import { QBHelper } from '@common/helpers/query-builder.helper';
import { USED_CAR_FILTER_CONFIG, USED_CAR_LIST_SELECT_COLUMNS, USED_CAR_SEARCH_COLUMNS, USED_CAR_TABLE_ALIASES, USED_CAR_TABLES } from './config/used-car-query.filter.config';
import { SelectQueryBuilder } from 'typeorm/browser';
import { USED_CAR_SORT_CONFIG } from './config/used-car-query.sort.config';
import { VehicleHelper } from '@common/helpers/vehicle-helper';

export interface UsedCarListResult {
    data: any[];
    total: number;
    page: number;
    limit: number;
}

@Injectable()
export class UsedCarRepository {
    constructor(
        @InjectRepository(UsedCar)
        private readonly usedCarRepository: Repository<UsedCar>,
    ) { }

    private getRepo(manager?: EntityManager): Repository<UsedCar> {
        return manager ? manager.getRepository(UsedCar) : this.usedCarRepository;
    }

    async checkDuplicateRegistration(
        registrationNumber: string,
        manager?: EntityManager,
    ): Promise<void> {
        const repo = this.getRepo(manager);
        const { clean, rtoCode } = VehicleHelper.normalizeRegistration(registrationNumber);

        const queryBuilder = repo
            .createQueryBuilder('uc')
            .select(['uc.id as "id"'])
            .where('uc.rto_code = :rtoCode', { rtoCode })
            .andWhere('uc.registration_number_clean = :clean', { clean })
            .andWhere('uc.deleted_at IS NULL')
            .andWhere('uc.status NOT IN (:...whitelistedStatuses)', {
                whitelistedStatuses: WHITELISTED_STATUSES_FOR_DUPLICATE_CHECK,
            });

        const existingListing = await queryBuilder.getRawOne();

        if (existingListing) {
            throw new BadRequestException('A used car listing with this registration number already exists.');
        }

        return;
    }

    create(data: UsedCar, manager?: EntityManager): UsedCar {
        const repo = this.getRepo(manager);
        return repo.create(data);
    }

    async save(entity: UsedCar[], manager?: EntityManager): Promise<UsedCar[]> {
        const repo = this.getRepo(manager);
        return await repo.save(entity);
    }

    /**
         * Find used cars with filters, search, and pagination
         */
    async findUsedCars(
        manager: EntityManager,
        dto: UsedCarListingDto,
    ): Promise<UsedCarListResult> {
        const { search, page, limit, safetyRating, sortBy } = dto;
        const skip = (page - 1) * limit;

        // Build query
        const queryBuilder = this.createBaseListQuery(manager)
            .addSelect('COUNT(*) OVER() as "totalCount"');

        // Apply filters
        QBHelper.applyFilters(queryBuilder, dto, USED_CAR_FILTER_CONFIG);
        QBHelper.applySearch(queryBuilder, search, USED_CAR_SEARCH_COLUMNS);
        QBHelper.applyOrFilter(
            queryBuilder,
            'safetyRating',
            [`${USED_CAR_TABLE_ALIASES.model}.global_ncap_rating`, `${USED_CAR_TABLE_ALIASES.model}.bharat_ncap_rating`],
            safetyRating,
        );

        // Apply sorting
        const sortConfig = USED_CAR_SORT_CONFIG[sortBy];
        QBHelper.applySorting(queryBuilder, sortConfig);

        // Execute query
        const data = await queryBuilder
            .offset(skip)
            .limit(limit)
            .getRawMany();

        // Extract total and clean data
        const { cleanedData, total } = QBHelper.extractTotalAndCleanData(data);

        return {
            data: cleanedData,
            total,
            page,
            limit,
        };
    }


    // ============ Private Methods ============

    private createBaseListQuery(manager: EntityManager): SelectQueryBuilder<any> {
        return manager
            .createQueryBuilder()
            .select(USED_CAR_LIST_SELECT_COLUMNS)
            .from(USED_CAR_TABLES.usedCar, USED_CAR_TABLE_ALIASES.usedCar)
            .innerJoin(USED_CAR_TABLES.brand, USED_CAR_TABLE_ALIASES.brand, `${USED_CAR_TABLE_ALIASES.brand}.id = ${USED_CAR_TABLE_ALIASES.usedCar}.brand_id`)
            .innerJoin(USED_CAR_TABLES.model, USED_CAR_TABLE_ALIASES.model, `${USED_CAR_TABLE_ALIASES.model}.id = ${USED_CAR_TABLE_ALIASES.usedCar}.model_id`)
            .innerJoin(USED_CAR_TABLES.variant, USED_CAR_TABLE_ALIASES.variant, `${USED_CAR_TABLE_ALIASES.variant}.id = ${USED_CAR_TABLE_ALIASES.usedCar}.variant_id`)
            // .leftJoin(
            //     USED_CAR_TABLES.photo,
            //     USED_CAR_TABLE_ALIASES.photo,
            //     `${USED_CAR_TABLE_ALIASES.photo}.used_car_id = ${USED_CAR_TABLE_ALIASES.usedCar}.id AND ${USED_CAR_TABLE_ALIASES.photo}.is_primary = true AND ${USED_CAR_TABLE_ALIASES.photo}.deleted_at IS NULL`,
            // )
            .where(`${USED_CAR_TABLE_ALIASES.usedCar}.deleted_at IS NULL`);
    }
}