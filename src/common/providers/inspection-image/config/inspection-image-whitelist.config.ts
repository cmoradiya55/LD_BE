// =============================================
// config/inspection-image-whitelist.config.ts
// =============================================

import { InspectionImageType as T, InspectionImageSubtype as S } from '../enum/inspection-image.enum';

// [imageType, imageSubtype | null, displayName, maxImages]
type WhitelistTuple = [number, number | null, string, number];

const WHITELIST: WhitelistTuple[] = [
    [T.EXTERIOR, S.EXTERIOR_FRONT, 'Exterior - Front', 1],
    [T.EXTERIOR, S.EXTERIOR_REAR, 'Exterior - Rear', 1],
    [T.EXTERIOR, S.EXTERIOR_LEFT, 'Exterior - Left', 1],
    [T.EXTERIOR, S.EXTERIOR_RIGHT, 'Exterior - Right', 1],
    [T.INTERIOR, S.INTERIOR_DASHBOARD, 'Interior - Dashboard', 1],
    [T.INTERIOR, S.INTERIOR_FRONT_SEATS, 'Interior - Front Seats', 1],
    [T.INTERIOR, S.INTERIOR_REAR_SEATS, 'Interior - Rear Seats', 1],
    [T.INTERIOR, S.INTERIOR_BOOT_SPACE, 'Interior - Boot Space', 1],
    [T.ENGINE, S.ENGINE_BAY, 'Engine Bay', 1],
    [T.TYRES, S.TYRE_FRONT_LEFT, 'Tyre - Front Left', 1],
    [T.TYRES, S.TYRE_FRONT_RIGHT, 'Tyre - Front Right', 1],
    [T.TYRES, S.TYRE_REAR_LEFT, 'Tyre - Rear Left', 1],
    [T.TYRES, S.TYRE_REAR_RIGHT, 'Tyre - Rear Right', 1],
    [T.TEST_DRIVE, S.ODOMETER, 'Odometer', 1],
    [T.DOCUMENTS, S.DOC_RC_FRONT, 'RC Front', 1],
];

export interface WhitelistMeta {
    label: string;
    max: number;
    order: number;
}

// Pre-computed map for O(1) lookup
const WHITELIST_MAP = new Map<string, WhitelistMeta>(
    WHITELIST.map(([type, subtype, label, max], order) => [
        `${type}-${subtype}`,
        { label, max, order }
    ])
);

export const getMeta = (type: number, subtype: number | null): WhitelistMeta | null =>
    WHITELIST_MAP.get(`${type}-${subtype}`) ?? WHITELIST_MAP.get(`${type}-null`) ?? null;

export const getWhitelist = () => WHITELIST.map(([type, subtype]) => ({ type, subtype }));

export const getWhitelistSQL = (alias: string = 'img'): string => {
    if (!WHITELIST.length) return '1=1';

    return WHITELIST
        .map(([type, subtype]) =>
            subtype !== null
                ? `(${alias}.image_type = ${type} AND ${alias}.image_subtype = ${subtype})`
                : `(${alias}.image_type = ${type})`
        )
        .join(' OR ');
};