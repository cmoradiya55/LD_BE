export enum FuelType {
    PETROL = 1,
    DIESEL = 2,
    CNG = 3,
    ELECTRIC = 4,
    HYBRID = 5,
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
    CVT = 3,
    DCT = 4,
    AMT = 5,
}

export const TransmissionTypeLabel: Record<number, string> = {
    [TransmissionType.MANUAL]: 'Manual',
    [TransmissionType.AUTOMATIC]: 'Automatic',
    [TransmissionType.CVT]: 'CVT',
    [TransmissionType.DCT]: 'DCT',
    [TransmissionType.AMT]: 'AMT',
};