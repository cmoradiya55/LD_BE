import { MAX_FILE_UPLOAD_ALLOWED, MIN_CAR_BRAND_YEAR, MIN_FILE_UPLOAD_REQUIRED } from "@common/constants/app.constant";
import { KilometerDriven, OwnershipType } from "@common/enums/car-detail.enum";
import { Type } from "class-transformer";
import {
    IsInt,
    IsPositive,
    Min,
    Max,
    IsString,
    IsNotEmpty,
    IsArray,
    ArrayMinSize,
    ArrayMaxSize,
    IsEnum,
    Matches,
    MaxLength,
} from "class-validator";

export class CreateSellCarDto {

    @IsNotEmpty({ message: 'Register number is required' })
    @IsString({ message: 'Register number must be a string' })
    @Matches(
        /^[A-Z]{2}-[0-9]{2}-[A-Z]{2}-(?!0000)[0-9]{4}$/,
        { message: 'Invalid registration number format (e.g., GJ-05-RM-8459)' },
    )
    registrationNumber: string;

    @IsInt({ message: 'Brand ID must be an integer' })
    @IsPositive({ message: 'Brand ID must be a positive number' })
    @Type(() => Number)
    brandId: number;

    @IsInt({ message: 'Year must be an integer' })
    @Min(MIN_CAR_BRAND_YEAR, { message: `Year must not be less than ${MIN_CAR_BRAND_YEAR}` })
    @Max(new Date().getFullYear(), { message: 'Year cannot be in the future' })
    @Type(() => Number)
    year: number;

    @IsInt({ message: 'Model ID must be an integer' })
    @IsPositive({ message: 'Model ID must be a positive number' })
    @Type(() => Number)
    modelId: number;

    @IsInt({ message: 'Variant ID must be an integer' })
    @IsPositive({ message: 'Variant ID must be a positive number' })
    @Type(() => Number)
    variantId: number;

    @IsNotEmpty({ message: 'Owner type is required' })
    @Type(() => Number)
    @IsEnum(OwnershipType, { message: 'Owner type must be one of: 1st, 2nd, 3rd, 4th, 5th' })
    ownerType: OwnershipType;

    @IsNotEmpty({ message: 'Odometer reading is required' })
    @Type(() => Number)
    @IsEnum(KilometerDriven, { message: 'Odometer reading must be one of the predefined ranges' })
    odometerReading: KilometerDriven;

    @IsInt({ message: 'Pincode ID must be an integer' })
    @IsPositive({ message: 'Pincode ID must be a positive number' })
    @Type(() => Number)
    pincodeId: number;

    @IsInt({ message: 'Expected price must be an integer' })
    @IsPositive({ message: 'Expected price must be a positive number' })
    @Max(100000000, { message: 'Expected price seems too high' })
    @Type(() => Number)
    expectedPrice: number;

    @IsArray({ message: 'Photos must be an array' })
    @ArrayMinSize(MIN_FILE_UPLOAD_REQUIRED, { message: `At least ${MIN_FILE_UPLOAD_REQUIRED} photo is required` })
    @ArrayMaxSize(MAX_FILE_UPLOAD_ALLOWED, { message: `Maximum ${MAX_FILE_UPLOAD_ALLOWED} photos allowed` })
    @IsString({ each: true, message: 'Each photo key must be a string' })
    // @Matches(
    //     /^[a-zA-Z0-9!_.*'()-\/]+\.(jpg|jpeg|png|webp)$/i,
    //     { each: true, message: 'Invalid S3 key format. Must be a valid path ending with jpg, jpeg, png, or webp' }
    // )
    photos: string[];
}