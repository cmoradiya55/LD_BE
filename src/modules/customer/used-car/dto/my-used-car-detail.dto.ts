import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class MyUsedCarDetailParamDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    id: number;
}