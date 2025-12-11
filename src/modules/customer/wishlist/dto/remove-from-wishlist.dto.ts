import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class RemoveFromWishlistDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    listing_id: number;
}