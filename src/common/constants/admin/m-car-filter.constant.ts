import { UsedCarListingStatus } from "@common/enums/car-detail.enum";

export const MANAGER_CAR_LIST_FILTER = [
    UsedCarListingStatus.PENDING,
    UsedCarListingStatus.INSPECTOR_ASSIGNED,
    UsedCarListingStatus.INSPECTION_STARTED,
    UsedCarListingStatus.INSPECTION_COMPLETED,
    UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF,
    UsedCarListingStatus.APPROVED_BY_MANAGER,
    UsedCarListingStatus.REJECTED_BY_MANAGER,
    UsedCarListingStatus.REJECTED_BY_ADMIN,
] as const;

export const INSPECTOR_CAR_LIST_FILTER = [
    UsedCarListingStatus.INSPECTOR_ASSIGNED,
    UsedCarListingStatus.INSPECTION_STARTED,
    UsedCarListingStatus.INSPECTION_COMPLETED,
    UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF,
    UsedCarListingStatus.APPROVED_BY_MANAGER,
    UsedCarListingStatus.REJECTED_BY_MANAGER,
] as const;