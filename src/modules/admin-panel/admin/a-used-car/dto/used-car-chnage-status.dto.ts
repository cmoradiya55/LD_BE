import { USED_CAR_MINIMUM_PRICE_FILTER } from "@common/constants/used-car.constant";
import { AdminUsedCarApprovalStatus } from "@common/enums/used-car-status.enum";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, Min, MinLength, ValidateIf } from "class-validator";

export class UsedCarChangeStatusParamDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    id: number;
}

export class UsedCarChangeStatusDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsEnum(AdminUsedCarApprovalStatus)
    status: AdminUsedCarApprovalStatus;

    // if approve then updated price is required
    @ValidateIf(o => o.status === AdminUsedCarApprovalStatus.APPROVED)
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @Min(USED_CAR_MINIMUM_PRICE_FILTER)
    price?: number;

    @ValidateIf(o => o.status === AdminUsedCarApprovalStatus.CANCELLED)
    @IsNotEmpty()
    @MinLength(5)
    reason?: string;
}