import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { UsedCarListingStatus } from "@common/enums/car-detail.enum";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator";

export class GetAllUsedCarsForAdminDto extends PaginationQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNotEmpty()
    @IsEnum(UsedCarListingStatus)
    status: UsedCarListingStatus;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    cityId: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    managerId: number;
}