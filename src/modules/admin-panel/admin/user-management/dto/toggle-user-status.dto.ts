import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class ToggleUserStatusDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    id: number;
}