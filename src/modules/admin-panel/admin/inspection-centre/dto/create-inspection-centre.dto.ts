import { IsInt, IsNotEmpty, IsPositive, IsString, MinLength } from "class-validator";

export class CreateInspectionCentreDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    address: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    landmark: string;

    @IsNotEmpty({ message: 'City is required to create inspection centre' })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    cityId: number;

    @IsNotEmpty({ message: 'Pincode is required to create inspection centre' })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    pincodeId: number;
}