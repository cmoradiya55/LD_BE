import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { IntersectionType } from "@nestjs/mapped-types";

export class CustomerUsedCarListingDto extends IntersectionType(
    PaginationQueryDto,
) { }

