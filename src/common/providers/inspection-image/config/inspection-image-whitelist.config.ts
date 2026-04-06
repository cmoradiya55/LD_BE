// =============================================
// config/inspection-image-whitelist.config.ts
// =============================================

import { InspectionImageType as T, InspectionImageSubType as S } from '../enum/inspection-image.enum';

// [imageType, imageSubtype | null]
type WhitelistTuple = [number, number | null];

const WHITELIST: WhitelistTuple[] = [
    [T.EXTERIOR, S[T.EXTERIOR].ROOF],

    [T.EXTERIOR, S[T.EXTERIOR].LEFT_FRONT],
    [T.EXTERIOR, S[T.EXTERIOR].FRONT],
    [T.EXTERIOR, S[T.EXTERIOR].LEFT_SIDE],
    [T.EXTERIOR, S[T.EXTERIOR].LEFT_BACK],

    [T.EXTERIOR, S[T.EXTERIOR].BACK],
    [T.EXTERIOR, S[T.EXTERIOR].RIGHT_BACK],
    [T.EXTERIOR, S[T.EXTERIOR].RIGHT_SIDE],
    [T.EXTERIOR, S[T.EXTERIOR].RIGHT_FRONT],

    [T.EXTERIOR, S[T.EXTERIOR].BOOT_DOOR],
    [T.EXTERIOR, S[T.EXTERIOR].WINDSHIELD_REAR],

    [T.EXTERIOR, S[T.ENGINE_AND_TRANSMISSION].ENGINE],

    [T.INTERIOR, S[T.INTERIOR].DASHBOARD],
    [T.INTERIOR, S[T.INTERIOR].ODOMETER],
    [T.INTERIOR, S[T.INTERIOR].FRONT_SEAT_SIDE],
    [T.INTERIOR, S[T.INTERIOR].REAR_SEAT_SIDE],
    [T.INTERIOR, S[T.INTERIOR].BOOT_SPACE],
    
    [T.TYRES, S[T.TYRES].FRONT_LEFT],
    [T.TYRES, S[T.TYRES].FRONT_RIGHT],
    [T.TYRES, S[T.TYRES].REAR_LEFT],
    [T.TYRES, S[T.TYRES].REAR_RIGHT],
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