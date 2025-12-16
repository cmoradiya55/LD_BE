import { Type } from "class-transformer";
import { IsInt, IsPositive } from "class-validator";

export class UpdateCityDto {
    @IsInt()
    @Type(() => Number)
    @IsPositive()
    id: number;
}