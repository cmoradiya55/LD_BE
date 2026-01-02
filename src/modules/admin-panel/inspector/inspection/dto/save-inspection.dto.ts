// dto/save-inspection-draft.dto.ts
import { IsInt, IsString, IsArray, IsOptional, ValidateNested, IsNumber, Min, IsPositive, IsNotEmpty, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { InspectionImageBaseDto } from '@common/dto/inspection-image-base.dto';


export class SaveInspectionDraftParamDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    usedCarId: number;
}

export class SaveInspectionDraftDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InspectionImageBaseDto)
    @IsOptional()
    images?: InspectionImageBaseDto[];

    @IsOptional()
    @IsNotEmpty({ message: 'Register number is required' })
    @IsString({ message: 'Register number must be a string' })
    @Matches(
        /^[A-Z]{2}-[0-9]{2}-[A-Z]{2}-(?!0000)[0-9]{4}$/,
        { message: 'Invalid registration number format (e.g., GJ-05-RM-8459)' },
    )
    registration_number?: string;

    @IsInt()
    @Min(1900)
    @IsOptional()
    @Type(() => Number)
    registration_year?: number;

    @IsString()
    @IsOptional()
    rc_image?: string;

    @IsString()
    @IsOptional()
    insurance_image?: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @IsPositive()
    km_driven?: number;
}