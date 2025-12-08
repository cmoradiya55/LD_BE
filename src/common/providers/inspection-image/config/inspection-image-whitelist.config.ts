// =============================================
// config/inspection-image-whitelist.config.ts
// =============================================

import { InspectionImageType as T, InspectionImageSubtype as S } from '../enum/inspection-image.enum';

// [imageType, imageSubtype | null]
type WhitelistTuple = [number, number | null];

const WHITELIST: WhitelistTuple[] = [
    [T.EXTERIOR, S.EXTERIOR_FRONT],
    [T.EXTERIOR, S.EXTERIOR_REAR],
    [T.EXTERIOR, S.EXTERIOR_LEFT],
    [T.EXTERIOR, S.EXTERIOR_RIGHT],
    [T.INTERIOR, S.INTERIOR_DASHBOARD],
    [T.INTERIOR, S.INTERIOR_FRONT_SEATS],
    [T.INTERIOR, S.INTERIOR_REAR_SEATS],
    [T.INTERIOR, S.INTERIOR_BOOT_SPACE],
    [T.ENGINE, S.ENGINE_BAY,],
    [T.TYRES, S.TYRE_FRONT_LEFT,],
    [T.TYRES, S.TYRE_FRONT_RIGHT,],
    [T.TYRES, S.TYRE_REAR_LEFT,],
    [T.TYRES, S.TYRE_REAR_RIGHT],
    [T.TEST_DRIVE, S.ODOMETER],
    [T.DOCUMENTS, S.DOC_RC_FRONT],
];

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