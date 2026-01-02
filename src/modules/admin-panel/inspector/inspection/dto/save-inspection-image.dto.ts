// dto/save-inspection-draft.dto.ts
import { IsInt, IsString, IsArray, IsOptional, ValidateNested, IsNumber, Min, IsPositive, IsNotEmpty } from 'class-validator';
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

    @IsString()
    @IsOptional()
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