import { ParseBoolean } from "@common/decorators/parse-boolean.decorator";
import { OwnershipType } from "@common/enums/car-detail.enum";
import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsInt, isNotEmpty, IsNotEmpty, IsObject, IsOptional, IsPositive, IsString, Length, Min } from "class-validator";

export class UpdateVehicleDetailsParamDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    id: number;
}

export class UpdateVehicleDetailsDto {
    @IsDateString()
    @IsNotEmpty()
    registrationDate: string;

    @IsDateString()
    @IsNotEmpty()
    fitnessValidUntil: string;

    @IsDateString()
    @IsNotEmpty()
    insuranceValidUntil: string;

    @IsDateString()
    @IsNotEmpty()
    pucValidUntil: string;

    @IsObject()
    @IsNotEmpty()
    challanDetails: Record<string, any>; // ✅ Dynamic JSON object

    @ParseBoolean()
    @IsBoolean()
    @IsNotEmpty()
    loanStatus: boolean;

    @Type(() => Number)
    @IsEnum(OwnershipType)
    @IsNotEmpty()
    owner: number;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    registrationPlace: string;

    @ParseBoolean()
    @IsBoolean()
    @IsNotEmpty()
    isBlacklisted: boolean;

    @ParseBoolean()
    @IsBoolean()
    @IsNotEmpty()
    isRtoNocIssued: boolean;

    @ParseBoolean()
    @IsBoolean()
    @IsNotEmpty()
    isPartyPeshi: boolean;

    @ParseBoolean()
    @IsBoolean()
    @IsNotEmpty()
    isHypothecated: boolean;

    @ParseBoolean()
    @IsBoolean()
    @IsNotEmpty()
    isConverted: boolean;

    @ParseBoolean()
    @IsBoolean()
    @IsNotEmpty()
    isMigrated: boolean;

    @ParseBoolean()
    @IsBoolean()
    @IsNotEmpty()
    adaptedForSpecialUse: boolean;

    @IsInt()
    @Min(0)
    @IsNotEmpty()
    criminalCases: number;

    @IsInt()
    @Min(0)
    @IsNotEmpty()
    civilCases: number;

    @IsInt()
    @Min(0)
    @IsNotEmpty()
    roadAccidents: number;

    @IsInt()
    @Min(0)
    @IsNotEmpty()
    compensationCases: number;

    @IsInt()
    @Min(0)
    @IsNotEmpty()
    otherCases: number;

    @IsOptional()
    @IsString()
    staffRemarks: string;
}