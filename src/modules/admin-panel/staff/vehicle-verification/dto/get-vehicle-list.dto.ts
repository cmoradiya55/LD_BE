import { STAFF_CAR_LIST_FILTER } from "@common/constants/admin/s-car-filter.constant";
import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsOptional } from "class-validator";

export class GetVehicleListQueryDto extends PaginationQueryDto {
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Number)
    @IsIn(STAFF_CAR_LIST_FILTER)
    status: number;
}