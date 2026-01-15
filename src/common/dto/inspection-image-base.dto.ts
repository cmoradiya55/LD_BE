import { IsInt, IsString, IsEnum, IsNotEmpty, ValidateIf, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { InspectionImageSubType, InspectionImageType, TreadDepthEnum } from '@common/providers/inspection-image/enum/inspection-image.enum';
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

    @ValidateIf(o => {
        // Optional: skip all AIR_CONDITIONING images
        if (o.type === InspectionImageType.AIR_CONDITIONING) return false;

        // Skip BRAKES and SUSPENSION subtypes for STEERING_SUSPENSION_AND_BRAKES
        if (o.type === InspectionImageType.STEERING_SUSPENSION_AND_BRAKES) {
            const skipSubTypes = [
                InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].BRAKES,
                InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].SUSPENSION,
            ];
            // If sub_type is BRAKES or SUSPENSION → skip validation
            if (skipSubTypes.includes(o.sub_type)) return false;

            // If sub_type is STEERING → validation runs
            return true;
        }

        if (o.type === InspectionImageType.ELECTRICAL) {
            const skipSubTypes = [
                InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_FRONT_WINDOW,
                InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_REAR_WINDOW,
                InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_FRONT_WINDOW,
                InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_REAR_WINDOW,
            ];
            // If sub_type is BRAKES or SUSPENSION → skip validation
            if (skipSubTypes.includes(o.sub_type)) return false;

            // If sub_type is STEERING → validation runs
            return true;
        }

        // For all other types → validation runs
        return true;
    })
    @IsNotEmpty()
    @IsString({
        message: (args) => {
            const obj = args.object as InspectionImageBaseDto;
            return `Image URL is required for type ${obj.type} and sub_type ${obj.sub_type}`;
        }
    })
    image_url: string;

    @IsNotEmpty()
    @ParseBoolean()
    is_damage: boolean;

    @ValidateIf(o =>
        o.type === InspectionImageType.ELECTRICAL && (
            o.sub_type === InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_FRONT_WINDOW
            ||
            o.sub_type === InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_REAR_WINDOW
            ||
            o.sub_type === InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_FRONT_WINDOW
            ||
            o.sub_type === InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_REAR_WINDOW
        )
    )
    @IsNotEmpty()
    @ParseBoolean()
    is_power: boolean;

    @ValidateIf(o => o.type === InspectionImageType.TYRES)
    @Type(() => Number)
    @IsEnum(TreadDepthEnum)
    tread_depth: number;

    @ValidateIf(o => o.is_damage === true)
    @IsNotEmpty()
    @IsString()
    remarks?: string;
}