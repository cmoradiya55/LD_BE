import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToWishlistDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    listing_id: number;
}