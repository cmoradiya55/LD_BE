import { UsedCarListingStatus } from "@common/enums/car-detail.enum";

// Statuses to be excluded while cars are is not being listed (e.g., pending approval , inspection not done yet etc.)
export const BLACKLISTED_STATUS = [
    // UsedCarListingStatus.PENDING,
    UsedCarListingStatus.REJECTED,
] as const;

export const USED_CAR_MIN_YEAR_FILTER = 2010;
export const USED_CAR_MAX_YEAR_FILTER = new Date().getFullYear() - 1;