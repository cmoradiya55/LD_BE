import { PaginationQueryDto } from "@common/dto/pagination-default-query.dto";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class GetInspectorByManagerDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    managerId: number;
}

export class GetInspectorByManagerQueryDto extends PaginationQueryDto { }