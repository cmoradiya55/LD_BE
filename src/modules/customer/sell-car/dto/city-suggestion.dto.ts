import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CitySuggestionDto extends PaginationQueryDto {
    @IsString()
    @MinLength(2)
    q: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    cityId?: number;
}