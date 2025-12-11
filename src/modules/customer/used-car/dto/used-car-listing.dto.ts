import { USED_CAR_MAX_YEAR_FILTER, USED_CAR_MIN_YEAR_FILTER } from "@common/constants/used-car.constant";
import { TransformToNumberArray } from "@common/decorators/transform-to-array.decorator";
import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { SearchQueryDto } from "@common/dto/search-query.dto";
import { BodyType, FuelType, OwnershipType, SafetyRating, TransmissionType } from "@common/enums/car-detail.enum";
import { IsEnumArray, IsIntArrayInRange, IsPositiveIntArray } from "@common/validators/array.validator";
import { IntersectionType } from "@nestjs/mapped-types";
import { USED_CAR_DEFAULT_SORT, UsedCarSortOption } from "@repository/used-car/config/used-car-query.sort.config";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsOptional, Min } from "class-validator";

class UsedCarFilterDto {
    // ============ ID Filters ============
    @IsOptional()
    @TransformToNumberArray()
    @IsPositiveIntArray()
    brandId?: number[];

    @IsOptional()
    @TransformToNumberArray()
    @IsPositiveIntArray()
    modelId?: number[];

    // ============ Year Filter ============
    @IsOptional()
    @TransformToNumberArray()
    @IsIntArrayInRange(USED_CAR_MIN_YEAR_FILTER, USED_CAR_MAX_YEAR_FILTER)
    modelYear?: number[];

    // ============ Range Filters ============

    @IsOptional()
    @Type(() => Number)
    @Min(0)
    minKmDriven?: number;

    @IsOptional()
    @Type(() => Number)
    @Min(0)
    maxKmDriven?: number;

    @IsOptional()
    @Type(() => Number)
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @Min(0)
    maxPrice?: number;

    // ============ Number Enum Filters ============
    @IsOptional()
    @TransformToNumberArray()
    @IsEnumArray(FuelType)
    fuelType?: FuelType[];

    @IsOptional()
    @TransformToNumberArray()
    @IsEnumArray(BodyType)
    bodyType?: BodyType[];

    @IsOptional()
    @TransformToNumberArray()
    @IsEnumArray(TransmissionType)
    transmissionType?: TransmissionType[];

    @IsOptional()
    @TransformToNumberArray()
    @IsEnumArray(OwnershipType)
    ownershipType?: OwnershipType[];

    @IsOptional()
    @TransformToNumberArray()
    @IsEnumArray(SafetyRating)
    safetyRating?: SafetyRating[];

    // ============ Other Filters ============
    @IsOptional()
    @TransformToNumberArray()
    @IsPositiveIntArray()
    seats?: number[];
}

class UsedCarSortDto {
    @IsOptional()
    @Type(() => Number)
    @IsEnum(UsedCarSortOption, {
        message: `sortBy must be one of: ${Object.keys(UsedCarSortOption).join(', ')}`,
    })
    sortBy: UsedCarSortOption = USED_CAR_DEFAULT_SORT;
}

export class UsedCarListingDto extends IntersectionType(
    SearchQueryDto,
    PaginationQueryDto,
    UsedCarFilterDto,
    UsedCarSortDto
) { }

