// src/repositories/car.repository.ts
import { BLACKLISTED_STATUS } from '@common/constants/used-car.constant';
import { UsedCar } from '@entity/used-car/used-car.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Not, Repository } from 'typeorm';
import { UsedCarListingDto } from '../../modules/customer/used-car/dto/used-car-listing.dto';
import { QBHelper } from '@common/helpers/query-builder.helper';
import { USED_CAR_FILTER_CONFIG, USED_CAR_LIST_SELECT_COLUMNS, USED_CAR_SEARCH_COLUMNS, USED_CAR_TABLE_ALIASES, USED_CAR_TABLES } from './config/used-car-query.filter.config';
import { SelectQueryBuilder } from 'typeorm/browser';
import { USED_CAR_SORT_CONFIG } from './config/used-car-query.sort.config';
import { VehicleHelper } from '@common/helpers/vehicle-helper';
import { InspectionImageQueryHelper } from '@common/providers/inspection-image/helper/inspection-image.helper';
import { InspectionImage } from '@entity/used-car/inspection-image.entity';
import { SORT_ORDER } from '@common/constants/app.constant';
import { PrimaryImageQueryHelper } from '@common/providers/inspection-image/helper/primary-image.hrlper';

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
        @InjectRepository(InspectionImage)
        private readonly inspectionImageRepository: Repository<InspectionImage>,
    ) { }

    private getRepo(manager?: EntityManager): Repository<UsedCar> {
        return manager ? manager.getRepository(UsedCar) : this.usedCarRepository;
    }

    async checkDuplicateRegistration(
        registrationNumber: string,
        manager?: EntityManager,
    ): Promise<void> {
        if (!BLACKLISTED_STATUS.length) throw new BadRequestException('Contact administrator: Internal configuration error');

        const repo = this.getRepo(manager);
        const { clean, rtoCode } = VehicleHelper.normalizeRegistration(registrationNumber);

        const queryBuilder = repo
            .createQueryBuilder('uc')
            .select(['uc.id as "id"'])
            .where('uc.rto_code = :rtoCode', { rtoCode })
            .andWhere('uc.registration_number_clean = :clean', { clean })
            .andWhere('uc.deleted_at IS NULL')
            .andWhere('uc.status NOT IN (:...blacklistedStatuses)', {
                blacklistedStatuses: BLACKLISTED_STATUS,
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

    async findByIds(
        customerId: number,
        ids: number[],
        page: number,
        limit: number,
    ): Promise<UsedCarListResult> {
        if (!BLACKLISTED_STATUS.length) throw new BadRequestException('Contact administrator: Internal configuration error');

        if (!ids.length) {
            return {
                data: [],
                total: 0,
                page,
                limit,
            };
        }
        // Build query
        const queryBuilder = this.createBaseListQuery(customerId)
            .addSelect('COUNT(*) OVER() as "totalCount"')
            .andWhere('uc.id IN (:...ids)', { ids });


        const skip = (page - 1) * limit;
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

    async findById(
        id: number,
        manager?: EntityManager,
    ): Promise<UsedCar | null> {
        const repo = this.getRepo(manager);
        if (!BLACKLISTED_STATUS.length) throw new BadRequestException('Contact administrator: Internal configuration error');

        return await repo.findOne({
            where: {
                id,
                status: Not(In(BLACKLISTED_STATUS))
            },
        });
    }

    async getBasicUsedCarDetailsWithPincodeByIdAndCustomer(
        id: number,
        customerId: number,
        manager?: EntityManager,
    ): Promise<UsedCar | null> {
        const repo = this.getRepo(manager);
        return await repo.findOne({
            where: { id, customer_id: customerId },
            relations: ['pincode'],
        });
    }

    /**
     * Find used cars with filters, search, and pagination
     */
    async findUsedCars(
        dto: UsedCarListingDto,
        customerId?: number,
    ): Promise<UsedCarListResult> {
        const { search, page, limit, safetyRating, sortBy } = dto;
        const skip = (page - 1) * limit;

        // Build query`
        const queryBuilder = this.createBaseListQuery(customerId)
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

    /**
     * Find used cars details with it's images, fetaures, specifications etc.
     */
    async getUsedCarDetailBySlug(
        slug: string,
        customerId?: number,
    ): Promise<any> {
        const repo = this.getRepo();

        // First get the used car with basic relations
        const usedCarQb = repo
            .createQueryBuilder('used_car')
            .leftJoin('used_car.brand', 'brand')
            .leftJoin('used_car.model', 'model')
            .leftJoin('used_car.variant', 'variant')
            .leftJoin('variant.variantFeatures', 'variant_features')
            .leftJoin('variant_features.feature', 'feature')
            .where('used_car.slug = :slug', { slug })
            .andWhere('used_car.deleted_at IS NULL')
            .addSelect([
                // Used car fields
                'used_car.id',
                'used_car.registration_year',
                'used_car.owner_type',
                'used_car.km_driven',
                'used_car.registration_number',
                'used_car.final_price',
                'used_car.rto_code',

                // Brand
                'brand.display_name',

                // Model
                'model.display_name',

                // Variant
                'variant.display_name',
                'variant.fuel_type',
                'variant.transmission_type',
                'variant.boot_space_liters',
                'variant.seating_capacity',
                'variant.ground_clearance_mm',

                'variant.engine_displacement_cc',
                'variant.cylinders',
                'variant.max_power_ps',
                'variant.max_power_rpm',
                'variant.max_torque_nm',
                'variant.max_torque_rpm',
                'variant.fuel_tank_litres',
                'variant.mileage_kmpl',
                'variant.battery_capacity_kwh',
                'variant.electric_range_km',
                'variant.electric_motor_power_kw',
                'variant.electric_motor_torque_nm',
                'variant.num_gears',

                // Variant features
                'variant_features.feature_value',
                'variant_features.feature_id',
                'feature.name',
                'feature.display_name',
                'feature.value_type',
            ]);

        if (customerId) {
            console.log('Customer ID present in getUsedCarDetailBySlug:', customerId);
            // User is logged in - check actual wishlist status
            usedCarQb.leftJoin(
                `${USED_CAR_TABLES.wishlist}`,
                `${USED_CAR_TABLE_ALIASES.wishlist}`,
                `${USED_CAR_TABLE_ALIASES.wishlist}.used_car_id = used_car.id 
                        AND ${USED_CAR_TABLE_ALIASES.wishlist}.customer_id = :customerId`,
                { customerId },
            )
                .addSelect(
                    `CASE WHEN ${USED_CAR_TABLE_ALIASES.wishlist}.id IS NOT NULL THEN true ELSE false END`,
                    'isWishlisted',
                );
        } else {
            console.log('No Customer ID in getUsedCarDetailBySlug');
            // User is not logged in - always return false
            usedCarQb.addSelect('false', 'isWishlisted');
        }

        console.log('Executing used car detail query for slug:', usedCarQb.getSql());
        // const usedCar = await usedCarQb.getOne();
        const usedCar = await usedCarQb.getOne();
        console.log('-------------------------');
        console.log('usedCar', usedCar);
        console.log('-------------------------');

        if (!usedCar) {
            return null;
        }

        // Get images using the helper
        const imageQb = this.inspectionImageRepository
            .createQueryBuilder('img')
            .orderBy('img.image_type', SORT_ORDER.ASC)
            .addOrderBy('img.sort_order', SORT_ORDER.ASC);

        InspectionImageQueryHelper.applyFilters(imageQb, {
            vehicleId: usedCar.id,
            applyWhitelist: true,
            activeOnly: true,
        });

        const rawImages = await imageQb.getMany();

        return {
            ...usedCar,
            images: rawImages,
        };
    }

    /**
    * Find customer used cars details with it's images, fetaures, specifications etc.
    */
    async findUsedCarByCustomer(
        customerId: number,
        page: number,
        limit: number,
    ): Promise<UsedCarListResult> {
        if (!BLACKLISTED_STATUS.length) throw new BadRequestException('Contact administrator: Internal configuration error');

        // Build query
        const queryBuilder = this.createBaseListQuery(customerId, false)
            .addSelect('COUNT(*) OVER() as "totalCount"')
            .addSelect(`${USED_CAR_TABLE_ALIASES.usedCar}.status as "status"`)
            .andWhere(`${USED_CAR_TABLE_ALIASES.usedCar}.customer_id = :customerId`, { customerId });

        const skip = (page - 1) * limit;
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



    /**
     * Get used cars details with it's inspection images, customer images, fetaures, specifications etc.
     */
    async getUsedCarDetailByCustomer(
        customerId: number,
        usedCarId: number,
    ): Promise<any> {
        const repo = this.getRepo();

        // First get the used car with basic relations
        const usedCarQb = repo
            .createQueryBuilder('used_car')
            .leftJoin('used_car.brand', 'brand')
            .leftJoin('used_car.model', 'model')
            .leftJoin('used_car.variant', 'variant')
            .leftJoin('variant.variantFeatures', 'variant_features')
            .leftJoin('variant_features.feature', 'feature')
            .leftJoin('used_car.photos', 'customer_images')
            .leftJoin('used_car.pincode', 'pincode')
            .leftJoin('pincode.city', 'city')
            .where('used_car.id = :usedCarId', { usedCarId })
            .andWhere('used_car.customer_id = :customerId', { customerId })
            .andWhere('used_car.deleted_at IS NULL')
            .select([
                // Used car fields
                'used_car.id',
                'used_car.registration_year',
                'used_car.owner_type',
                'used_car.km_driven',
                'used_car.registration_number',
                'used_car.final_price',
                'used_car.rto_code',
                'used_car.km_driven_range',
                'used_car.pincode_id',

                // Brand
                'brand.display_name',

                // Model
                'model.display_name',

                // Variant
                'variant.display_name',
                'variant.fuel_type',
                'variant.transmission_type',
                'variant.boot_space_liters',
                'variant.seating_capacity',
                'variant.ground_clearance_mm',

                'variant.engine_displacement_cc',
                'variant.cylinders',
                'variant.max_power_ps',
                'variant.max_power_rpm',
                'variant.max_torque_nm',
                'variant.max_torque_rpm',
                'variant.fuel_tank_litres',
                'variant.mileage_kmpl',
                'variant.battery_capacity_kwh',
                'variant.electric_range_km',
                'variant.electric_motor_power_kw',
                'variant.electric_motor_torque_nm',
                'variant.num_gears',

                // Variant features
                'variant_features.feature_value',
                'variant_features.feature_id',
                'feature.name',
                'feature.display_name',
                'feature.value_type',

                // Customer images
                'customer_images.id',
                'customer_images.url',

                // Pincode & City
                'pincode.id',
                'pincode.pincode',
                'pincode.area_name',
                'city.id',
                'city.city_name',
            ]);

        const usedCar = await usedCarQb.getOne();

        if (!usedCar) {
            return null;
        }

        // Get images using the helper
        const imageQb = this.inspectionImageRepository
            .createQueryBuilder('img')
            .orderBy('img.image_type', SORT_ORDER.ASC)
            .addOrderBy('img.sort_order', SORT_ORDER.ASC);

        InspectionImageQueryHelper.applyFilters(imageQb, {
            vehicleId: usedCar.id,
            applyWhitelist: false,
            activeOnly: true,
        });

        const rawImages = await imageQb.getMany();

        return {
            ...usedCar,
            images: rawImages,
        };
    }

    async updateMyUsedCarById(
        customerId: number,
        usedCarId: number,
        updateData: Partial<UsedCar>,
        manager?: EntityManager,
    ): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.update(
            {
                id: usedCarId,
                customer_id: customerId,
            },
            updateData,
        );
    }

    // ============ Private Methods ============

    private createBaseListQuery(customerId: number | undefined, isStatusFilter: boolean = true): SelectQueryBuilder<any> {
        if (!BLACKLISTED_STATUS.length) throw new BadRequestException('Contact administrator: Internal configuration error');

        const repo = this.getRepo();
        const qb = repo
            .createQueryBuilder(USED_CAR_TABLE_ALIASES.usedCar)
            .select(USED_CAR_LIST_SELECT_COLUMNS)
            .innerJoin(USED_CAR_TABLES.brand, USED_CAR_TABLE_ALIASES.brand, `${USED_CAR_TABLE_ALIASES.brand}.id = ${USED_CAR_TABLE_ALIASES.usedCar}.brand_id`)
            .innerJoin(USED_CAR_TABLES.model, USED_CAR_TABLE_ALIASES.model, `${USED_CAR_TABLE_ALIASES.model}.id = ${USED_CAR_TABLE_ALIASES.usedCar}.model_id`)
            .innerJoin(USED_CAR_TABLES.variant, USED_CAR_TABLE_ALIASES.variant, `${USED_CAR_TABLE_ALIASES.variant}.id = ${USED_CAR_TABLE_ALIASES.usedCar}.variant_id`)
            .where(`${USED_CAR_TABLE_ALIASES.usedCar}.deleted_at IS NULL`)

        if (isStatusFilter) {
            qb.andWhere(`${USED_CAR_TABLE_ALIASES.usedCar}.status NOT IN(:...blacklistedStatuses)`, {
                blacklistedStatuses: BLACKLISTED_STATUS,
            });
        }

        // Append primary image using helper
        PrimaryImageQueryHelper.appendToQuery(qb, {
            mainTableAlias: USED_CAR_TABLE_ALIASES.usedCar,
        });

        if (customerId) {
            // User is logged in - check actual wishlist status
            qb.leftJoin(
                `${USED_CAR_TABLES.wishlist}`,
                `${USED_CAR_TABLE_ALIASES.wishlist}`,
                `${USED_CAR_TABLE_ALIASES.wishlist}.used_car_id = ${USED_CAR_TABLE_ALIASES.usedCar}.id 
                        AND ${USED_CAR_TABLE_ALIASES.wishlist}.customer_id = :customerId`,
                { customerId },
            )
                .addSelect(
                    `CASE WHEN ${USED_CAR_TABLE_ALIASES.wishlist}.id IS NOT NULL THEN true ELSE false END`,
                    'isWishlisted',
                );
        } else {
            // User is not logged in - always return false
            qb.addSelect('false', 'isWishlisted');
        }

        return qb;

    }

    async softDeleteByCustomerId(customerId: number, manager?: EntityManager): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.softDelete({
            customer_id: customerId,
        });
    }
}