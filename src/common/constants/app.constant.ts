export const MODULE_PREFIX = {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
} as const;

export const SORT_ORDER = {
    ASC: 'ASC',
    DESC: 'DESC',
} as const;

export const MIN_CAR_BRAND_YEAR = 1900;

export const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 10,
    MAXIMUM_LIMIT: 50,
} as const;
