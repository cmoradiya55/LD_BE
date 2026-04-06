import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class CitySuggestionDto extends PaginationQueryDto {
    @IsString()
    @MinLength(2)
    q: string;
}