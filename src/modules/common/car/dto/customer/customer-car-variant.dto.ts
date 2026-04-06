import { MIN_CAR_BRAND_YEAR } from "@common/constants/app.constant";
import { SearchQueryDto } from "@common/dto/search-query.dto";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CustomerCarVariantParamDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(MIN_CAR_BRAND_YEAR)
    year: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    modelId: number;
}

export class CustomerCarVariantQueryDto extends SearchQueryDto { }