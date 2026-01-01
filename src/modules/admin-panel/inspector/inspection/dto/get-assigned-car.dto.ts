import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { INSPECTOR_CAR_LIST_FILTER, MANAGER_CAR_LIST_FILTER } from "@common/constants/admin/m-car-filter.constant";
import { Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator";

export class GetAssignedCarQueryDto extends PaginationQueryDto {
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Number)
    @IsIn(INSPECTOR_CAR_LIST_FILTER)
    status: number;
}