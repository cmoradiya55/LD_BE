import { IsInt, IsString, IsBoolean, IsOptional, Min, Max, IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { InspectionImageSubType, InspectionImageType } from '@common/providers/inspection-image/enum/inspection-image.enum';
import { ParseBoolean } from '@common/decorators/parse-boolean.decorator';
import { IsValidInspectionImageSubtype } from '@common/decorators/admin-panel/is-valid-sub-inpection-image-subtype.decorator';

export class InspectionImageBaseDto {
    @Type(() => Number)
    @IsInt()
    @IsEnum(InspectionImageType)
    type: number;

    @ValidateIf(o => o.type !== InspectionImageType.OTHER)
    @Type(() => Number)
    @IsInt()
    @IsValidInspectionImageSubtype()
    sub_type: number;

    @IsNotEmpty()
    @IsString()
    image_url: string;

    @ParseBoolean()
    is_damage: boolean;

    @ValidateIf(o => o.is_damage === true)
    @IsNotEmpty()
    @IsString()
    remarks?: string;
}