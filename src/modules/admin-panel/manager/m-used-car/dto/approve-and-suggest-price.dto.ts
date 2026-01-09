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
    @Min(5000)
    price: number;
}