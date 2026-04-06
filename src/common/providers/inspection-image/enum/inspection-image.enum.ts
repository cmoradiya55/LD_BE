// =============================================
// enums/inspection-image.enum.ts
// =============================================
export enum TreadDepthEnum {
    LESS_THAN_3MM = 3,
    BETWEEN_3MM_AND_4MM = 4,
    BETWEEN_4MM_AND_5MM = 5,
    BETWEEN_5MM_AND_6MM = 6,
    BETWEEN_6MM_AND_7MM = 7,
    BETWEEN_7MM_AND_8MM = 8,
    BETWEEN_8MM_AND_9MM = 9,
    BETWEEN_9MM_AND_MM = 10,
}

export const InspectionImageType = {
    EXTERIOR: 1,
    TYRES: 2,
    ENGINE_AND_TRANSMISSION: 3,
    STEERING_SUSPENSION_AND_BRAKES: 4,
    AIR_CONDITIONING: 5,
    ELECTRICAL: 6,
    INTERIOR: 7,
    SEATS: 8,
    OTHER: 9,
} as const;

export const InspectionImageSubType = {
    [InspectionImageType.EXTERIOR]: {
        ROOF: 1,
        BONNET: 2,

        PILLAR_LHS_A: 3,
        PILLAR_LHS_B: 4,
        PILLAR_LHS_C: 5,

        PILLAR_RHS_A: 6,
        PILLAR_RHS_B: 7,
        PILLAR_RHS_C: 8,

        UPPER_CROSS_MEMBER: 9,
        LOWER_CROSS_MEMBER: 10,

        RADIATOR_SUPPORT: 11,
        HEADLIGHT_SUPPORT: 12,

        BOOT_DOOR: 13,

        FIREWALL: 14,

        QUARTER_PANEL_LHS: 15,
        QUARTER_PANEL_RHS: 16,

        FENDER_LHS: 17,
        FENDER_RHS: 18,

        APRON_LHS: 19,
        APRON_RHS: 20,

        APRON_LHS_LEG: 21,
        APRON_RHS_LEG: 22,

        COWL_TOP: 24,

        RUNNING_BOARDER_LHS: 25,
        RUNNING_BOARDER_RHS: 26,

        DOOR_LHS_FRONT: 27,
        DOOR_LHS_REAR: 28,
        DOOR_RHS_FRONT: 29,
        DOOR_RHS_REAR: 30,

        WINDSHIELD_FRONT: 31,
        WINDSHIELD_REAR: 32,

        LIGHT_LHS_HEADLIGHT: 33,
        LIGHT_RHS_HEADLIGHT: 34,
        LIGHT_LHS_TAILLIGHT: 35,
        LIGHT_RHS_TAILLIGHT: 36,

        BUMPER_FRONT: 37,
        BUMPER_REAR: 38,

        ORVM_LHS: 39,
        ORVM_RHS: 40,

        LEFT_FRONT: 41,
        FRONT: 42,
        LEFT_SIDE: 43,

        LEFT_BACK: 44,
        BACK: 45,

        RIGHT_BACK: 46,
        RIGHT_SIDE: 47,
        RIGHT_FRONT: 48,
    },

    [InspectionImageType.TYRES]: {
        FRONT_LEFT: 1,
        FRONT_RIGHT: 2,
        REAR_LEFT: 3,
        REAR_RIGHT: 4,
        SPARE_TYRE: 5,
    },

    [InspectionImageType.ENGINE_AND_TRANSMISSION]: {
        EXHAUST_SMOKE: 1,

        ENGINE: 2,
        ENGINE_SOUND: 3,
        ENGINE_MOUNTING: 4,
        CLUTCH: 5,
        GEAR_SHIFTING: 6,

        ENGINE_OIL_LEVEL_DIPSTICK: 7,

        BATTERY: 8,
        COOLANT: 9,
        SUMP: 10,
        COLD_START: 11,
        
        // Electric vehicles
        MOTOR_SOUND: 12,
    },

    [InspectionImageType.STEERING_SUSPENSION_AND_BRAKES]: {
        STEERING: 1,
        SUSPENSION: 2,
        BRAKES: 3,
    },

    [InspectionImageType.AIR_CONDITIONING]: {
        AC_COOLING: 1,
        CLIMATE_CONTROL_AC: 2,
        HEATER: 3,
    },

    [InspectionImageType.ELECTRICAL]: {
        LHS_FRONT_WINDOW: 1,
        LHS_REAR_WINDOW: 2,
        RHS_FRONT_WINDOW: 3,
        RHS_REAR_WINDOW: 4,

        REAR_DEFOGGER: 5,
        AIRBAG_FEATURE_DRIVER_SIDE: 6,
        STEERING_MOUNTED_AUDIO_CONTROL: 7,

        MUSIC_SYSTEM: 8,
        ELECTRICAL: 10,

        PARKING_SENSOR: 11,
        INTERIOR: 12,
    },

    [InspectionImageType.INTERIOR]: {
        DASHBOARD: 1,
        ODOMETER: 2,

        FRONT_SEAT_SIDE: 3,
        REAR_SEAT_SIDE: 4,
        BOOT_SPACE: 5,
    },

    [InspectionImageType.SEATS]: {
        LEATHER_SEATS: 1,
    }
} as const;

export const IMAGE_TYPE_NAMES: Record<typeof InspectionImageType[keyof typeof InspectionImageType], string> = {
    [InspectionImageType.EXTERIOR]: 'Exterior',
    [InspectionImageType.TYRES]: 'Tyres',

    [InspectionImageType.ENGINE_AND_TRANSMISSION]: 'Engine & Transmission',

    [InspectionImageType.STEERING_SUSPENSION_AND_BRAKES]: 'Steering, Suspension & Brakes',
    [InspectionImageType.AIR_CONDITIONING]: 'Air Conditioning',
    [InspectionImageType.ELECTRICAL]: 'Electrical',
    [InspectionImageType.INTERIOR]: 'Interior',
    [InspectionImageType.SEATS]: 'Seats',

    [InspectionImageType.OTHER]: 'Other',
};

export const IMAGE_SUBTYPE_NAMES = {
    [InspectionImageType.EXTERIOR]: {
        [InspectionImageSubType[InspectionImageType.EXTERIOR].ROOF]: 'Roof',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].BONNET]: 'Bonnet',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_A]: 'Pillar LHS A',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_B]: 'Pillar LHS B',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_C]: 'Pillar LHS C',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_A]: 'Pillar RHS A',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_B]: 'Pillar RHS B',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_C]: 'Pillar RHS C',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].UPPER_CROSS_MEMBER]: 'Upper Cross Member',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].LOWER_CROSS_MEMBER]: 'Lower Cross Member',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].RADIATOR_SUPPORT]: 'Radiator Support',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].HEADLIGHT_SUPPORT]: 'Headlight Support',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].BOOT_DOOR]: 'Boot Door',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].QUARTER_PANEL_LHS]: 'Quarter Panel LHS',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].QUARTER_PANEL_RHS]: 'Quarter Panel RHS',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].FENDER_LHS]: 'Fender LHS',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].FENDER_RHS]: 'Fender RHS',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_LHS]: 'Apron LHS',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_RHS]: 'Apron RHS',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_LHS_LEG]: 'Apron LHS Leg',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_RHS_LEG]: 'Apron RHS Leg',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].FIREWALL]: 'Firewall',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].COWL_TOP]: 'Cowl Top',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].RUNNING_BOARDER_LHS]: 'Running Board LHS',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].RUNNING_BOARDER_RHS]: 'Running Board RHS',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_LHS_FRONT]: 'Door LHS Front',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_LHS_REAR]: 'Door LHS Rear',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_RHS_FRONT]: 'Door RHS Front',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_RHS_REAR]: 'Door RHS Rear',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].WINDSHIELD_FRONT]: 'Front Windshield',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].WINDSHIELD_REAR]: 'Rear Windshield',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_LHS_HEADLIGHT]: 'Left Headlight',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_RHS_HEADLIGHT]: 'Right Headlight',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_LHS_TAILLIGHT]: 'Left Taillight',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_RHS_TAILLIGHT]: 'Right Taillight',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].BUMPER_FRONT]: 'Front Bumper',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].BUMPER_REAR]: 'Rear Bumper',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].ORVM_LHS]: 'ORVM LHS',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].ORVM_RHS]: 'ORVM RHS',
        
        [InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_FRONT]: 'Left Front',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].FRONT]: 'Front',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_SIDE]: 'Left Side',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_BACK]: 'Left Back',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].BACK]: 'Back',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_BACK]: 'Right Back',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_SIDE]: 'Right Side',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_FRONT]: 'Right Front',
    },

    [InspectionImageType.TYRES]: {
        [InspectionImageSubType[InspectionImageType.TYRES].FRONT_LEFT]: 'Front Left Tyre',
        [InspectionImageSubType[InspectionImageType.TYRES].FRONT_RIGHT]: 'Front Right Tyre',
        [InspectionImageSubType[InspectionImageType.TYRES].REAR_LEFT]: 'Rear Left Tyre',
        [InspectionImageSubType[InspectionImageType.TYRES].REAR_RIGHT]: 'Rear Right Tyre',
        [InspectionImageSubType[InspectionImageType.TYRES].SPARE_TYRE]: 'Spare Tyre',
    },

    [InspectionImageType.ENGINE_AND_TRANSMISSION]: {
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].EXHAUST_SMOKE]: 'Exhaust Smoke',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].COLD_START]: 'Cold Start',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE]: 'Engine',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_SOUND]: 'Engine Sound',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_MOUNTING]: 'Engine Mounting',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].CLUTCH]: 'Clutch',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].GEAR_SHIFTING]: 'Gear Shifting',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_OIL_LEVEL_DIPSTICK]: 'Engine Oil Level (Dipstick)',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].BATTERY]: 'Battery',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].COOLANT]: 'Coolant',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].SUMP]: 'Sump',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].MOTOR_SOUND]: 'Motor Sound',
    },

    [InspectionImageType.STEERING_SUSPENSION_AND_BRAKES]: {
        [InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].STEERING]: 'Steering',
        [InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].SUSPENSION]: 'Suspension',
        [InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].BRAKES]: 'Brakes',
    },

    [InspectionImageType.AIR_CONDITIONING]: {
        [InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].AC_COOLING]: 'AC Cooling',
        [InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].CLIMATE_CONTROL_AC]: 'Climate Control AC',
        [InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].HEATER]: 'Heater',
    },

    [InspectionImageType.ELECTRICAL]: {
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_FRONT_WINDOW]: 'LHS Front Window',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_REAR_WINDOW]: 'LHS Rear Window',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_FRONT_WINDOW]: 'RHS Front Window',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_REAR_WINDOW]: 'RHS Rear Window',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].REAR_DEFOGGER]: 'Rear Defogger',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].AIRBAG_FEATURE_DRIVER_SIDE]: 'Driver Side Airbag',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].STEERING_MOUNTED_AUDIO_CONTROL]: 'Steering Mounted Audio Control',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].MUSIC_SYSTEM]: 'Music System',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].ELECTRICAL]: 'Electrical',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].PARKING_SENSOR]: 'Parking Sensor',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].INTERIOR]: 'Interior Electrical',
    },

    [InspectionImageType.INTERIOR]: {
        [InspectionImageSubType[InspectionImageType.INTERIOR].DASHBOARD]: 'Dashboard',
        [InspectionImageSubType[InspectionImageType.INTERIOR].ODOMETER]: 'Odometer',
        [InspectionImageSubType[InspectionImageType.INTERIOR].REAR_SEAT_SIDE]: 'Rear Seat Side',
        [InspectionImageSubType[InspectionImageType.INTERIOR].BOOT_SPACE]: 'Boot Space',
    },

    [InspectionImageType.SEATS]: {
        [InspectionImageSubType[InspectionImageType.SEATS].LEATHER_SEATS]: 'Leather Seats',
    },
} as const;

// Primary image configuration - change these to update which image is considered "primary"
export const PRIMARY_IMAGE_CONFIG = {
    IMAGE_TYPE: InspectionImageType.EXTERIOR,
    IMAGE_SUBTYPE: InspectionImageSubType[InspectionImageType.EXTERIOR].ROOF,
    TABLE_NAME: 'inspection_images',
    VEHICLE_FK_COLUMN: 'vehicle_id',
} as const;