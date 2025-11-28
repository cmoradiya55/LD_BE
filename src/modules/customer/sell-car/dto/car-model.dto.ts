import { SearchQueryDto } from "@common/dto/search-query.dto";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CarModelParamDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    brandId: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(1900)
    year: number;
}

export class CarModelQueryDto extends SearchQueryDto { }