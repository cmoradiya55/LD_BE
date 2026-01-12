import { USED_CAR_MINIMUM_PRICE_FILTER } from "@common/constants/used-car.constant";
import { CustomerUsedCarApprovalStatus } from "@common/enums/used-car-status.enum";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, Min, MinLength, ValidateIf } from "class-validator";

export class ApproveOrRejectListingParamDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    id: number;
}

export class ApproveOrRejectListingDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsEnum(CustomerUsedCarApprovalStatus)
    status: CustomerUsedCarApprovalStatus;

    // if approve then updated price is required
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(USED_CAR_MINIMUM_PRICE_FILTER)
    price?: number;

    @ValidateIf(o => o.status === CustomerUsedCarApprovalStatus.CANCELLED)
    @IsNotEmpty()
    @MinLength(5)
    reason?: string;
}