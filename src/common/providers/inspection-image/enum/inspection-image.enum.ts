// =============================================
// enums/inspection-image.enum.ts
// =============================================

export const InspectionImageType = {
    EXTERIOR: 1,
    INTERIOR: 2,
    ENGINE: 3,
    TYRES: 4,
    DOCUMENTS: 5,
    DAMAGE: 6,
    UNDERBODY: 7,
    ELECTRICAL: 8,
    FEATURES: 9,
    TEST_DRIVE: 10,
} as const;

export const InspectionImageSubtype = {
    EXTERIOR_FRONT: 101,
    EXTERIOR_REAR: 102,
    EXTERIOR_LEFT: 103,
    EXTERIOR_RIGHT: 104,
    EXTERIOR_BOOT: 111,
    INTERIOR_DASHBOARD: 201,
    INTERIOR_FRONT_SEATS: 207,
    INTERIOR_REAR_SEATS: 208,
    INTERIOR_BOOT_SPACE: 214,
    ENGINE_BAY: 301,
    TYRE_FRONT_LEFT: 401,
    TYRE_FRONT_RIGHT: 402,
    TYRE_REAR_LEFT: 403,
    TYRE_REAR_RIGHT: 404,
    DOC_RC_FRONT: 501,
    ODOMETER: 1001,
} as const;

export const IMAGE_TYPE_NAMES: Record<typeof InspectionImageType[keyof typeof InspectionImageType], string> = {
    [InspectionImageType.EXTERIOR]: 'Exterior',
    [InspectionImageType.INTERIOR]: 'Interior',
    [InspectionImageType.ENGINE]: 'Engine',
    [InspectionImageType.TYRES]: 'Tyres',
    [InspectionImageType.DOCUMENTS]: 'Documents',
    [InspectionImageType.DAMAGE]: 'Damage',
    [InspectionImageType.UNDERBODY]: 'Underbody',
    [InspectionImageType.ELECTRICAL]: 'Electrical',
    [InspectionImageType.FEATURES]: 'Features',
    [InspectionImageType.TEST_DRIVE]: 'Verification',
};

// Primary image configuration - change these to update which image is considered "primary"
export const PRIMARY_IMAGE_CONFIG = {
    IMAGE_TYPE: InspectionImageType.EXTERIOR,
    IMAGE_SUBTYPE: InspectionImageSubtype.EXTERIOR_FRONT,
    TABLE_NAME: 'inspection_images',
    VEHICLE_FK_COLUMN: 'vehicle_id',
} as const;