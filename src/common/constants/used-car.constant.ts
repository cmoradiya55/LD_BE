import { UsedCarListingStatus } from "@common/enums/car-detail.enum";

export const WHITELISTED_STATUSES_FOR_DUPLICATE_CHECK = [
    UsedCarListingStatus.PENDING
] as const;

export const USED_CAR_MIN_YEAR_FILTER = 2010;
export const USED_CAR_MAX_YEAR_FILTER = new Date().getFullYear() - 1;