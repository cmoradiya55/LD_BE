import { UsedCarListingStatus } from "@common/enums/car-detail.enum";

export const WHITELISTED_STATUSES_FOR_DUPLICATE_CHECK = [
    UsedCarListingStatus.PENDING
] as const;