import { SORT_ORDER } from "@common/constants/app.constant";

/**
 * Sort order types
 */
export type SortOrder = typeof SORT_ORDER;


/**
 * Sort configuration interface
 */
export interface SortConfig {
    field: string;
    column: string;
    order: SortOrder[keyof typeof SORT_ORDER];
    isDefault?: boolean;
}


/**
 * Sort options enum - used in DTO
 */
export enum UsedCarSortOption {
    RELEVANCE = 1,
    NEWEST = 2,
    PRICE_LOW_TO_HIGH = 3,
    PRICE_HIGH_TO_LOW = 4,
    KM_LOW_TO_HIGH = 5,
    MODEL_NEW_TO_OLD = 6,
}

/**
 * Sort configurations mapping
 */
export const USED_CAR_SORT_CONFIG: Record<UsedCarSortOption, SortConfig[]> = {
    [UsedCarSortOption.RELEVANCE]: [
        // Relevance sorting - prioritize verified, then by created_at
        { field: 'isVerified', column: 'uc.is_verified', order: SORT_ORDER.DESC },
        { field: 'createdAt', column: 'uc.created_at', order: SORT_ORDER.DESC },
    ],
    [UsedCarSortOption.NEWEST]: [
        { field: 'createdAt', column: 'uc.created_at', order: SORT_ORDER.DESC },
    ],
    [UsedCarSortOption.PRICE_LOW_TO_HIGH]: [
        { field: 'expectedPrice', column: 'uc.expected_price', order: SORT_ORDER.ASC },
    ],
    [UsedCarSortOption.PRICE_HIGH_TO_LOW]: [
        { field: 'expectedPrice', column: 'uc.expected_price', order: SORT_ORDER.DESC },
    ],
    [UsedCarSortOption.KM_LOW_TO_HIGH]: [
        { field: 'kmDriven', column: 'uc.km_driven', order: SORT_ORDER.ASC },
    ],
    [UsedCarSortOption.MODEL_NEW_TO_OLD]: [
        { field: 'registrationYear', column: 'uc.registration_year', order: SORT_ORDER.DESC },
    ],
};

/**
 * Default sort option
 */
export const USED_CAR_DEFAULT_SORT = UsedCarSortOption.RELEVANCE;
