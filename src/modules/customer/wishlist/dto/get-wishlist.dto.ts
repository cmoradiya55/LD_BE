import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '@common/dto/pagination-default-query.dto';

export class GetWishlistDto extends PaginationQueryDto { }