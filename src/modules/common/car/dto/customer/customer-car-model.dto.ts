import { MIN_CAR_BRAND_YEAR } from "@common/constants/app.constant";
import { SearchQueryDto } from "@common/dto/search-query.dto";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CustomerCarModelParamDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    brandId: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(MIN_CAR_BRAND_YEAR)
    year: number;
}

export class CustomerCarModelQueryDto extends SearchQueryDto { }

export class CustomerCarModelSearchInFilterQueryDto extends SearchQueryDto { }


// for filter listing (without year)
export class CustomerCarModelFilterListingParamDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    brandId: number;
}