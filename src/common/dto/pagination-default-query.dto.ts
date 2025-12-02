import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer'; // Import Transform
import { PAGINATION_DEFAULTS } from '@common/constants/app.constant';

export class PaginationQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    public page: number = PAGINATION_DEFAULTS.PAGE;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => Math.min(value, PAGINATION_DEFAULTS.MAXIMUM_LIMIT)) // Apply the cap here
    public limit: number = PAGINATION_DEFAULTS.LIMIT;
}
