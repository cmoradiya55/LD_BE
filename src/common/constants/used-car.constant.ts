import { UsedCarListingStatus } from "@common/enums/car-detail.enum";

export const DUPLICATE_REGISTRATION_STATUS_CHECK = [
    UsedCarListingStatus.PENDING,
    UsedCarListingStatus.INSPECTION_STARTED,
    UsedCarListingStatus.INSPECTION_COMPLETED,
    UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF,
    UsedCarListingStatus.APPROVED_BY_MANAGER,
    UsedCarListingStatus.APPROVED_BY_ADMIN,
    UsedCarListingStatus.LISTED
] as const;

export const WHITELISTED_STATUS_FOR_UPDATE_MY_USED_CAR_DETAIL: UsedCarListingStatus[] = [
    UsedCarListingStatus.PENDING,
] as const;

export const USED_CAR_MIN_YEAR_FILTER = 2010;
export const USED_CAR_MAX_YEAR_FILTER = new Date().getFullYear() - 1;