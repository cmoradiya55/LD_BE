// configs/inspection-validation.config.ts

import { IMAGE_SUBTYPE_NAMES, InspectionImageSubType, InspectionImageType } from "../enum/inspection-image.enum";


// =============================================
// TYPE SAFETY - Forces you to define ALL subtypes
// =============================================
type InspectionImageTypeValue = typeof InspectionImageType[keyof typeof InspectionImageType];

interface RequiredImageSpec {
    type: InspectionImageTypeValue;
    subtype: number;
    name: string;
    isMandatory: boolean;
}

// =============================================
// HELPER TYPES FOR COMPILE-TIME VALIDATION
// =============================================

// ✅ Fix: Use keyof to get valid type keys
type ValidInspectionType = keyof typeof InspectionImageSubType;

type ExtractSubtypes<T extends ValidInspectionType> = 
    typeof InspectionImageSubType[T][keyof typeof InspectionImageSubType[T]];

type ExteriorSubtypes = ExtractSubtypes<typeof InspectionImageType.EXTERIOR>;
type TyreSubtypes = ExtractSubtypes<typeof InspectionImageType.TYRES>;
type EngineSubtypes = ExtractSubtypes<typeof InspectionImageType.ENGINE_AND_TRANSMISSION>;
type SteeringSubtypes = ExtractSubtypes<typeof InspectionImageType.STEERING_SUSPENSION_AND_BRAKES>;
type ACSubtypes = ExtractSubtypes<typeof InspectionImageType.AIR_CONDITIONING>;
type ElectricalSubtypes = ExtractSubtypes<typeof InspectionImageType.ELECTRICAL>;
type InteriorSubtypes = ExtractSubtypes<typeof InspectionImageType.INTERIOR>;
type SeatSubtypes = ExtractSubtypes<typeof InspectionImageType.SEATS>;

// ✅ This creates a record that MUST have ALL subtypes as keys
type RequiredExteriorConfig = Record<ExteriorSubtypes, boolean>;
type RequiredTyreConfig = Record<TyreSubtypes, boolean>;
type RequiredEngineConfig = Record<EngineSubtypes, boolean>;
type RequiredSteeringConfig = Record<SteeringSubtypes, boolean>;
type RequiredACConfig = Record<ACSubtypes, boolean>;
type RequiredElectricalConfig = Record<ElectricalSubtypes, boolean>;
type RequiredInteriorConfig = Record<InteriorSubtypes, boolean>;
type RequiredSeatConfig = Record<SeatSubtypes, boolean>;

// =============================================
// MANDATORY CONFIGURATION (TYPE-SAFE)
// =============================================

const EXTERIOR_MANDATORY: RequiredExteriorConfig = {
    [InspectionImageSubType[InspectionImageType.EXTERIOR].ROOF]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].BONNET]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_A]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_B]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_C]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_A]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_B]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_C]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].UPPER_CROSS_MEMBER]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LOWER_CROSS_MEMBER]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].RADIATOR_SUPPORT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].HEADLIGHT_SUPPORT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].BOOT_DOOR]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].FIREWALL]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].QUARTER_PANEL_LHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].QUARTER_PANEL_RHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].FENDER_LHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].FENDER_RHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_LHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_RHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_LHS_LEG]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_RHS_LEG]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].COWL_TOP]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].RUNNING_BOARDER_LHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].RUNNING_BOARDER_RHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_LHS_FRONT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_LHS_REAR]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_RHS_FRONT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_RHS_REAR]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].WINDSHIELD_FRONT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].WINDSHIELD_REAR]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_LHS_HEADLIGHT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_RHS_HEADLIGHT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_LHS_TAILLIGHT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_RHS_TAILLIGHT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].BUMPER_FRONT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].BUMPER_REAR]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].ORVM_LHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].ORVM_RHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_FRONT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].FRONT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_SIDE]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_BACK]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].BACK]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_BACK]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_SIDE]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_FRONT]: true,
};

const TYRES_MANDATORY: RequiredTyreConfig = {
    [InspectionImageSubType[InspectionImageType.TYRES].FRONT_LEFT]: true,
    [InspectionImageSubType[InspectionImageType.TYRES].FRONT_RIGHT]: true,
    [InspectionImageSubType[InspectionImageType.TYRES].REAR_LEFT]: true,
    [InspectionImageSubType[InspectionImageType.TYRES].REAR_RIGHT]: true,
    [InspectionImageSubType[InspectionImageType.TYRES].SPARE_TYRE]: true,
};

const ENGINE_MANDATORY: RequiredEngineConfig = {
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].GEAR_SHIFTING]: true,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].BATTERY]: true,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].COOLANT]: true,

    // Petrol/Diesel specific
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].EXHAUST_SMOKE]: false,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE]: false,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_SOUND]: false,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_MOUNTING]: false,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].CLUTCH]: false,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_OIL_LEVEL_DIPSTICK]: false,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].SUMP]: false,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].COLD_START]: false,
    
    // Electric specific
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].MOTOR_SOUND]: false,
};

const STEERING_MANDATORY: RequiredSteeringConfig = {
    [InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].STEERING]: true,
    [InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].SUSPENSION]: true,
    [InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].BRAKES]: true,
};

const AC_MANDATORY: RequiredACConfig = {
    [InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].AC_COOLING]: true,
    [InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].CLIMATE_CONTROL_AC]: true,
    [InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].HEATER]: true,
};

const ELECTRICAL_MANDATORY: RequiredElectricalConfig = {
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_FRONT_WINDOW]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_REAR_WINDOW]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_FRONT_WINDOW]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_REAR_WINDOW]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].REAR_DEFOGGER]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].AIRBAG_FEATURE_DRIVER_SIDE]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].STEERING_MOUNTED_AUDIO_CONTROL]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].MUSIC_SYSTEM]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].ELECTRICAL]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].PARKING_SENSOR]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].INTERIOR]: false,
};

const INTERIOR_MANDATORY: RequiredInteriorConfig = {
    [InspectionImageSubType[InspectionImageType.INTERIOR].DASHBOARD]: true,
    [InspectionImageSubType[InspectionImageType.INTERIOR].ODOMETER]: true,
    [InspectionImageSubType[InspectionImageType.INTERIOR].FRONT_SEAT_SIDE]: true,
    [InspectionImageSubType[InspectionImageType.INTERIOR].REAR_SEAT_SIDE]: true,
    [InspectionImageSubType[InspectionImageType.INTERIOR].BOOT_SPACE]: true,
};

const SEATS_MANDATORY: RequiredSeatConfig = {
    [InspectionImageSubType[InspectionImageType.SEATS].LHS_FRONT_SEAT]: true,
    [InspectionImageSubType[InspectionImageType.SEATS].RHS_FRONT_SEAT]: true,
    [InspectionImageSubType[InspectionImageType.SEATS].LHS_REAR_SEAT]: true,
    [InspectionImageSubType[InspectionImageType.SEATS].RHS_REAR_SEAT]: true,
};

// =============================================
// GENERATE REQUIRED_INSPECTION_IMAGES ARRAY
// =============================================
function generateRequiredImages(): RequiredImageSpec[] {
    const result: RequiredImageSpec[] = [];

    // ✅ Fix: Keep the proper type
    const addImages = <T extends ValidInspectionType>(
        type: T,
        config: Record<number, boolean>
    ) => {
        Object.entries(config).forEach(([subtype, isMandatory]) => {
            const subtypeNum = Number(subtype);
            result.push({
                type: type as InspectionImageTypeValue, // ✅ Cast to InspectionImageTypeValue instead of number
                subtype: subtypeNum,
                name: IMAGE_SUBTYPE_NAMES[type]?.[subtypeNum] || `Unknown (${subtypeNum})`,
                isMandatory,
            });
        });
    };

    // Add all types
    addImages(InspectionImageType.EXTERIOR, EXTERIOR_MANDATORY);
    addImages(InspectionImageType.TYRES, TYRES_MANDATORY);
    addImages(InspectionImageType.ENGINE_AND_TRANSMISSION, ENGINE_MANDATORY);
    addImages(InspectionImageType.STEERING_SUSPENSION_AND_BRAKES, STEERING_MANDATORY);
    addImages(InspectionImageType.AIR_CONDITIONING, AC_MANDATORY);
    addImages(InspectionImageType.ELECTRICAL, ELECTRICAL_MANDATORY);
    addImages(InspectionImageType.INTERIOR, INTERIOR_MANDATORY);
    addImages(InspectionImageType.SEATS, SEATS_MANDATORY);

    return result;
}

export const REQUIRED_INSPECTION_IMAGES = generateRequiredImages();

// =============================================
// COMPUTED VALUES
// =============================================
export const TOTAL_MANDATORY_IMAGES = REQUIRED_INSPECTION_IMAGES.filter(
    img => img.isMandatory
).length;

export const MANDATORY_IMAGES_BY_TYPE = REQUIRED_INSPECTION_IMAGES
    .filter(img => img.isMandatory)
    .reduce((acc, img) => {
        if (!acc[img.type]) acc[img.type] = [];
        acc[img.type].push(img);
        return acc;
    }, {} as Record<number, RequiredImageSpec[]>);

// =============================================
// BASIC FIELD VALIDATION
// =============================================
export interface BasicFieldRule {
    field: string;
    validator: (car: any) => boolean;
    message: string;
    code: string;
}

export const BASIC_FIELD_RULES: BasicFieldRule[] = [
    {
        field: 'registration_number',
        validator: (car) => !!car.registration_number?.trim(),
        message: 'Registration number is required',
        code: 'MISSING_REGISTRATION_NUMBER',
    },
    {
        field: 'registration_year',
        validator: (car) => 
            !!car.registration_year && 
            car.registration_year >= 1900 &&
            car.registration_year <= new Date().getFullYear() + 1,
        message: 'Valid registration year is required',
        code: 'INVALID_REGISTRATION_YEAR',
    },
    {
        field: 'km_driven',
        validator: (car) => 
            car.km_driven !== null && 
            car.km_driven !== undefined && 
            car.km_driven >= 0 && 
            car.km_driven <= 500000,
        message: 'Valid KM driven is required (0-500,000)',
        code: 'INVALID_KM_DRIVEN',
    },
    {
        field: 'rc_image',
        validator: (car) => !!car.rc_image?.trim(),
        message: 'RC document image is required',
        code: 'MISSING_RC_IMAGE',
    },
    {
        field: 'insurance_image',
        validator: (car) => !!car.insurance_image?.trim(),
        message: 'Insurance document image is required',
        code: 'MISSING_INSURANCE_IMAGE',
    },
];