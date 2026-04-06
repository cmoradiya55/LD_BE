// src/common/helpers/vehicle.helper.ts

export class VehicleHelper {
    /**
     * Normalize a vehicle registration number
     * Example: "GJ-05-RM-8458" → clean: "GJ05RM8458", rtoCode: "GJ05"
     */
    static normalizeRegistration(regNumber: string) {
        if (!regNumber) {
            throw new Error('Registration number is required');
        }

        // 1. Remove all non-alphanumeric characters
        let clean = regNumber.replace(/[^A-Za-z0-9]/g, '');

        // 2. Convert to uppercase
        clean = clean.toUpperCase();

        // 3. Extract RTO code (first 4 characters)
        const rtoCode = clean.substring(0, 4);

        return {
            original: regNumber,
            clean,
            rtoCode,
        };
    }
}
