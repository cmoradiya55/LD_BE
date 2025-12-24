import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class VerifyUserDocumentsDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    userId: number;
}