import { ParseBoolean } from "@common/decorators/parse-boolean.decorator";
import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { SearchQueryDto } from "@common/dto/search-query.dto";
import { IntersectionType } from "@nestjs/mapped-types";
import { IsOptional } from "class-validator";

export class GetAllCityDto extends IntersectionType(
    PaginationQueryDto,
    SearchQueryDto
) {
    @IsOptional()
    @ParseBoolean()
    isActive?: boolean;
}