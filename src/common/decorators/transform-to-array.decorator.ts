// src/common/decorators/transform-to-array.decorator.ts

import { Transform } from 'class-transformer';

/**
 * Transforms query param to array
 * Handles: "1,2,3" | "1" | ["1","2"] (when same param repeated)
 */
export function TransformToNumberArray() {
    return Transform(({ value }) => {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }

        // Already array (repeated query params: ?brandId=1&brandId=2)
        if (Array.isArray(value)) {
            return value
                .flatMap((v) => String(v).split(','))
                .map((v) => Number(v.trim()))
                .filter((v) => !isNaN(v));
        }

        // Comma-separated string: ?brandId=1,2,3
        return String(value)
            .split(',')
            .map((v) => Number(v.trim()))
            .filter((v) => !isNaN(v));
    });
}

export function TransformToStringArray() {
    return Transform(({ value }) => {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }

        // Already array (repeated query params)
        if (Array.isArray(value)) {
            return value
                .flatMap((v) => String(v).split(','))
                .map((v) => v.trim().toLowerCase())
                .filter((v) => v);
        }

        // Comma-separated string
        return String(value)
            .split(',')
            .map((v) => v.trim().toLowerCase())
            .filter((v) => v);
    });
}