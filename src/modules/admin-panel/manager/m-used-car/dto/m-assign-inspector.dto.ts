import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class MAssignInspectorDto {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    usedCarId: number;

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    inspectorId: number;
}