export const CUSTOMER_OTP_LENGTH = 6;

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

// Allowed File Extensions and Content Types
export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'application/pdf': ['pdf'],
};

export const MIN_FILE_UPLOAD_REQUIRED = 1;
export const MAX_FILE_UPLOAD_ALLOWED = 20;

export const S3_BUCKET_FOLDERS = [] as const;

export const OTP_EXPIRY_MS = {
    MOBILE: 10 * 60 * 1000,
    EMAIL: 10 * 60 * 1000,
    ACCOUNT_DELETE: 10 * 60 * 1000,
} as const;

export const JWT_TOKEN_TYPES = {
    ACCESS: 'access',
    REFRESH: 'refresh',
} as const;

export const COOKIE_NAMES = {
    REFRESH_TOKEN: 'refresh_token',
}

export const JWT_UNITS = {
    MINUTES: 'm',
    HOURS: 'h',
    DAYS: 'd',
} as const;

export const JWT_ACCESS_EXPIRY_UNIT = JWT_UNITS.MINUTES;
export const JWT_REFRESH_EXPIRY_UNIT = JWT_UNITS.DAYS; // if changed here then change in cookie maxAge calculation also