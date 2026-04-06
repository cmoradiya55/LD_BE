// src/common/helpers/primary-image-query.helper.ts

import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PRIMARY_IMAGE_CONFIG } from '../enum/inspection-image.enum';

export interface PrimaryImageOptions {
    /** Alias for the main table (e.g., 'uc' for used_car) */
    mainTableAlias: string;
    /** Primary key column of main table (default: 'id') */
    mainTablePkColumn?: string;
    /** Alias for the select field (default: 'primaryImage') */
    selectAlias?: string;
    /** Override image type (uses constant by default) */
    imageType?: number;
    /** Override image subtype (uses constant by default) */
    imageSubtype?: number;
}

export class PrimaryImageQueryHelper {
    /**
     * Generates optimized subquery SQL for fetching primary image
     * Uses correlated subquery with LIMIT 1 - PostgreSQL optimizes this well with proper indexes
     */
    static getSubquery(options: PrimaryImageOptions): string {
        const {
            mainTableAlias,
            mainTablePkColumn = 'id',
            imageType = PRIMARY_IMAGE_CONFIG.IMAGE_TYPE,
            imageSubtype = PRIMARY_IMAGE_CONFIG.IMAGE_SUBTYPE,
        } = options;

        return `(
            SELECT ii.image_url 
            FROM ${PRIMARY_IMAGE_CONFIG.TABLE_NAME} ii 
            WHERE ii.${PRIMARY_IMAGE_CONFIG.VEHICLE_FK_COLUMN} = ${mainTableAlias}.${mainTablePkColumn}
                AND ii.is_active = true 
                AND ii.image_type = ${imageType}
                AND ii.image_subtype = ${imageSubtype}
            ORDER BY ii.sort_order ASC 
            LIMIT 1
        )`;
    }

    /**
     * Appends primary image select to an existing query builder
     * @returns The same query builder for chaining
     */
    static appendToQuery<T extends ObjectLiteral>(
        queryBuilder: SelectQueryBuilder<T>,
        options: PrimaryImageOptions,
    ): SelectQueryBuilder<T> {
        const { selectAlias = 'primaryImage' } = options;
        const subquery = this.getSubquery(options);

        return queryBuilder.addSelect(subquery, selectAlias);
    }
}