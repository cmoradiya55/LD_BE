// src/modules/used-car/config/used-car-query.config.ts

/**
 * Filter operator types
 */
export type FilterOperator = 'eq' | 'gte' | 'lte' | 'in';

/**
 * Filter configuration interface
 */
export interface FilterConfig {
    field: string;
    column: string;
    operator: FilterOperator;
}

/**
 * Filter configurations for used car listing
 * Add/remove filters here - no need to touch repository
 */
export const USED_CAR_FILTER_CONFIG: FilterConfig[] = [
    // Array filters (IN)
    { field: 'brandId', column: 'uc.brand_id', operator: 'in' },
    { field: 'modelId', column: 'uc.model_id', operator: 'in' },
    { field: 'modelYear', column: 'uc.registration_year', operator: 'in' },
    { field: 'fuelType', column: 'v.fuel_type', operator: 'in' },
    { field: 'bodyType', column: 'm.body_type', operator: 'in' },
    { field: 'transmissionType', column: 'v.transmission_type', operator: 'in' },
    { field: 'ownershipType', column: 'uc.owner_type', operator: 'in' },
    { field: 'seats', column: 'v.seating_capacity', operator: 'in' },

    // Range filters
    { field: 'minKmDriven', column: 'uc.km_driven', operator: 'gte' },
    { field: 'maxKmDriven', column: 'uc.km_driven', operator: 'lte' },
    { field: 'minPrice', column: 'uc.expected_price', operator: 'gte' },
    { field: 'maxPrice', column: 'uc.expected_price', operator: 'lte' },
];

/**
 * Searchable columns for used car listing
 * Add/remove searchable fields here
 */
export const USED_CAR_SEARCH_COLUMNS: string[] = [
    'b.display_name',
    'm.display_name',
    'v.display_name',
];

/**
 * Select columns for list view
 */
export const USED_CAR_LIST_SELECT_COLUMNS: string[] = [
    // Used car
    'uc.id as "id"',
    'uc.slug as "slug"',
    'uc.registration_year as "registrationYear"',
    'uc.owner_type as "ownerType"',
    'uc.km_driven as "kmDriven"',
    'uc.final_price as "finalPrice"',
    'uc.rto_code as "rtoCode"',
    'uc.status as "status"',
    'uc.created_at as "createdAt"',
    // Brand
    'b.display_name as "brandName"',
    // Model
    'm.display_name as "modelName"',
    // Variant
    'v.display_name as "variantName"',
    'v.fuel_type as "fuelType"',
    'v.transmission_type as "transmissionType"',
    // Photo
    // 'ph.url as "primaryPhoto"',
];

/**
 * Select columns for detail view
 */
export const USED_CAR_DETAIL_SELECT_COLUMNS: string[] = [
    // Used car
    'uc.id as "id"',
    'uc.user_id as "userId"',
    'uc.registration_year as "registrationYear"',
    'uc.owner_type as "ownerType"',
    'uc.km_driven_range as "kmDrivenRange"',
    'uc.km_driven as "kmDriven"',
    'uc.registration_number as "registrationNumber"',
    'uc.expected_price as "expectedPrice"',
    'uc.final_price as "finalPrice"',
    'uc.insurance_validity as "insuranceValidity"',
    'uc.status as "status"',
    'uc.rejection_reason as "rejectionReason"',
    'uc.is_verified as "isVerified"',
    'uc.verified_at as "verifiedAt"',
    'uc.created_at as "createdAt"',
    // Brand
    'b.id as "brandId"',
    'b.display_name as "brandName"',
    'b.logo_url as "brandLogo"',
    // Model
    'm.id as "modelId"',
    'm.display_name as "modelName"',
    'm.body_type as "bodyType"',
    'm.global_ncap_rating as "globalNcapRating"',
    'm.bharat_ncap_rating as "bharatNcapRating"',
    // Variant
    'v.id as "variantId"',
    'v.display_name as "variantName"',
    'v.fuel_type as "fuelType"',
    'v.transmission_type as "transmissionType"',
    'v.seating_capacity as "seats"',
    'v.engine_displacement_cc as "engineDisplacementCc"',
    'v.max_power_ps as "maxPowerPs"',
    'v.max_torque_nm as "maxTorqueNm"',
    'v.mileage_kmpl as "mileageKmpl"',
    // Pincode
    'p.id as "pincodeId"',
    'p.code as "pincodeCode"',
    'p.city as "city"',
    'p.state as "state"',
];

/**
 * Table aliases used in queries
 */
export const USED_CAR_TABLE_ALIASES = {
    usedCar: 'uc',
    brand: 'b',
    model: 'm',
    variant: 'v',
    pincode: 'p',
    photo: 'ph',
    wishlist: 'cw',
} as const;

/**
 * Table names
 */
export const USED_CAR_TABLES = {
    usedCar: 'used_car',
    brand: 'brands',
    model: 'models',
    variant: 'variants',
    pincode: 'pincodes',
    photo: 'used_car_customer_photos',
    wishlist: 'customer_wishlists',
} as const;