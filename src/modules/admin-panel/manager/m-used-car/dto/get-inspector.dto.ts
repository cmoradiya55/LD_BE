import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { MANAGER_CAR_LIST_FILTER } from "@common/constants/admin/m-car-filter.constant";
import { Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator";

export class GetUsedCarQueryDto extends PaginationQueryDto {
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Number)
    @IsIn(MANAGER_CAR_LIST_FILTER)
    status: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    inspectorId: number;
}