export const MODULE_PREFIX = {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
} as const;

export const SORT_ORDER = {
    ASC: 'ASC',
    DESC: 'DESC',
} as const;

export const MIN_CAR_BRAND_YEAR = 1900;

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
