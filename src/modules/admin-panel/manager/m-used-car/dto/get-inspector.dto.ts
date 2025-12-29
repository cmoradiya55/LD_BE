import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { UsedCarListingStatus } from "@common/enums/car-detail.enum";
import { Type } from "class-transformer";
import { IsEnum, IsIn, IsNotEmpty, IsOptional } from "class-validator";

export class GetUsedCarQueryDto extends PaginationQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsEnum(UsedCarListingStatus)
    status: UsedCarListingStatus;
}