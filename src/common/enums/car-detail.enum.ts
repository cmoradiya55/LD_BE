export enum FuelType {
    PETROL = 1,
    DIESEL = 2,
    CNG = 3,
    ELECTRIC = 4,
    HYBRID = 5,
}

export enum BodyType {
    SEDAN = 1,
    SUB_COMPACT_SUV = 2,
    SUV = 3,
    HATCHBACK = 4,
    MUV = 5,
    COUPE = 6,
    CONVERTIBLE = 7,
    PICKUP = 8,
    WAGON = 9,
}

export const FuelTypeLabel: Record<number, string> = {
    [FuelType.PETROL]: 'Petrol',
    [FuelType.DIESEL]: 'Diesel',
    [FuelType.CNG]: 'CNG',
    [FuelType.ELECTRIC]: 'Electric',
    [FuelType.HYBRID]: 'Hybrid',
};

export enum TransmissionType {
    MANUAL = 1,
    AUTOMATIC = 2,
}

export const TransmissionTypeLabel: Record<number, string> = {
    [TransmissionType.MANUAL]: 'Manual',
    [TransmissionType.AUTOMATIC]: 'Automatic',
};

export enum OwnershipType {
    FIRST = 1,
    SECOND = 2,
    THIRD = 3,
    FOURTH = 4,
    FIFTH = 5,
}

export enum KilometerDriven {
    ZERO_TO_10K = 1,
    TEN_TO_20K = 2,
    TWENTY_TO_30K = 3,
    THIRTY_TO_40K = 4,
    FORTY_TO_50K = 5,
    FIFTY_TO_60K = 6,
    SIXTY_TO_70K = 7,
    SEVENTY_TO_80K = 8,
    EIGHTY_TO_90K = 9,
    NINTY_TO_1LAKH = 10,
    ONE_LAKH_TO_1_2_LAKH = 11,
    ONE_2_LAKH_TO_1_5_LAKH = 12,
    ONE_5_LAKH_PLUS = 13,
}

export enum UsedCarListingStatus {
    PENDING = 1,
    VERIFIED = 2,
    LISTED = 3,
    SOLD = 4,
    REJECTED = 5,
    EXPIRED = 6,
}

export enum SafetyRating {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}