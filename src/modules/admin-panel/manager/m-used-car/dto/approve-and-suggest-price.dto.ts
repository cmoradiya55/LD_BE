import { USED_CAR_MINIMUM_PRICE_FILTER } from "@common/constants/used-car.constant";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive, Min } from "class-validator";

export class MApproveAndSuggestPriceParamDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    usedCarId: number;
}

export class MApproveAndSuggestPriceDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @Min(USED_CAR_MINIMUM_PRICE_FILTER)
    price: number;
}