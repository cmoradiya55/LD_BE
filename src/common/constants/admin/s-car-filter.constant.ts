import { UsedCarListingStatus } from "@common/enums/car-detail.enum";

export const STAFF_CAR_LIST_FILTER = [
    UsedCarListingStatus.INSPECTION_COMPLETED,
    UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF,
    UsedCarListingStatus.APPROVED_BY_MANAGER,
    UsedCarListingStatus.REJECTED_BY_MANAGER,
] as const;