import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive, IsString, MinLength } from "class-validator";

export class UpdateInspectionCenterParamDto {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    id: number;
}

export class UpdateInspectionCentreDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    address: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    landmark: string;

    @IsNotEmpty({ message: 'City is required to update inspection centre' })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    cityId: number;

    @IsNotEmpty({ message: 'Pincode is required to update inspection centre' })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    pincodeId: number;
}