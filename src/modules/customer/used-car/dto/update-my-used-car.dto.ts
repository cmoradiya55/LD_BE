import { KilometerDriven } from "@common/enums/car-detail.enum";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class UpdateMyUsedCarDto {
    @IsNotEmpty({ message: 'Odometer reading is required' })
    @Type(() => Number)
    @IsEnum(KilometerDriven, { message: 'Odometer reading must be one of the predefined ranges' })
    km_driven_range: KilometerDriven;

    @IsInt({ message: 'Pincode ID must be an integer' })
    @IsPositive({ message: 'Pincode ID must be a positive number' })
    @Type(() => Number)
    pincode_id: number;
}

export class UpdateMyUsedCarDetailParamDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    id: number;
}