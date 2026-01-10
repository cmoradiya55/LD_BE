import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { UsedCarListingStatus } from "@common/enums/car-detail.enum";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class GetAllUsedCarsForAdminDto extends PaginationQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNotEmpty()
    @IsEnum(UsedCarListingStatus)
    status: UsedCarListingStatus;
}