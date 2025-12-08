// =============================================
// helpers/inspection-image.helper.ts
// =============================================

import { SelectQueryBuilder, Brackets, ObjectLiteral } from 'typeorm';
import { getMeta, getWhitelist, getWhitelistSQL, WhitelistMeta } from '../config/inspection-image-whitelist.config';
import { IMAGE_TYPE_NAMES } from '../enum/inspection-image.enum';

export interface ImageQueryOptions {
    vehicleId?: number;
    vehicleIds?: number[];
    applyWhitelist?: boolean;      // true = whitelist filter, false = all images
    alias?: string;                 // table alias (default: 'img')
    activeOnly?: boolean;           // filter is_active = true (default: true)
}

export interface ProcessedImage {
    id: number;
    vehicleId: number;
    type: number;
    subtype: number | null;
    url: string;
    thumb: string | null;
    title: string | null;
    label: string;
    order: number;
}

export interface ImageSection {
    type: number;
    name: string;
    images: ProcessedImage[];
}

/**
 * Reusable helper to append image conditions to any query
 */
export class InspectionImageQueryHelper {
    
    /**
     * Apply image filters to an existing query builder
     * Can be chained with any query
     */
    static applyFilters<T extends ObjectLiteral>(
        qb: SelectQueryBuilder<T>,
        options: ImageQueryOptions
    ): SelectQueryBuilder<T> {
        const { 
            vehicleId, 
            vehicleIds, 
            applyWhitelist = true, 
            alias = 'img',
            activeOnly = true 
        } = options;

        // Vehicle filter
        if (vehicleId) {
            qb.andWhere(`${alias}.vehicle_id = :vehicleId`, { vehicleId });
        } else if (vehicleIds?.length) {
            qb.andWhere(`${alias}.vehicle_id IN (:...vehicleIds)`, { vehicleIds });
        }

        // Active filter
        if (activeOnly) {
            qb.andWhere(`${alias}.is_active = true`);
        }

        // Whitelist filter
        if (applyWhitelist) {
            const whitelist = getWhitelist();
            if (whitelist.length) {
                qb.andWhere(new Brackets(wb => {
                    whitelist.forEach(({ type, subtype }, idx) => {
                        const cond = subtype !== null
                            ? `${alias}.image_type = :t${idx} AND ${alias}.image_subtype = :s${idx}`
                            : `${alias}.image_type = :t${idx}`;
                        
                        const params: Record<string, number> = { [`t${idx}`]: type };
                        if (subtype !== null) params[`s${idx}`] = subtype;
                        
                        idx === 0 ? wb.where(cond, params) : wb.orWhere(cond, params);
                    });
                }));
            }
        }

        // Default ordering
        qb.addOrderBy(`${alias}.image_type`, 'ASC')
          .addOrderBy(`${alias}.image_subtype`, 'ASC')
          .addOrderBy(`${alias}.sort_order`, 'ASC');

        return qb;
    }

    /**
     * Get raw SQL WHERE clause for whitelist (for raw queries or subqueries)
     */
    static getWhitelistCondition(alias: string = 'img'): string {
        return getWhitelistSQL(alias);
    }

    /**
     * Get SQL subquery for images (can be used in main query as lateral join or subquery)
     */
    static getSubquerySQL(options: {
        vehicleIdColumn: string;     // e.g., 'v.id' or 'vehicle.id'
        applyWhitelist?: boolean;
        limit?: number;
        alias?: string;
    }): string {
        const { vehicleIdColumn, applyWhitelist = true, limit, alias = 'img' } = options;
        
        let sql = `
            SELECT ${alias}.id, ${alias}.vehicle_id, ${alias}.image_type, ${alias}.image_subtype,
                   ${alias}.image_url, ${alias}.thumbnail_url, ${alias}.title
            FROM inspection_images ${alias}
            WHERE ${alias}.vehicle_id = ${vehicleIdColumn}
              AND ${alias}.is_active = true
        `;

        if (applyWhitelist) {
            sql += ` AND (${getWhitelistSQL(alias)})`;
        }

        sql += ` ORDER BY ${alias}.image_type, ${alias}.image_subtype, ${alias}.sort_order`;

        if (limit) {
            sql += ` LIMIT ${limit}`;
        }

        return sql;
    }

    /**
     * Process raw image results - apply maxImages limit and add metadata
     */
    static processImages(
        images: any[],
        applyWhitelist: boolean = true
    ): ProcessedImage[] {
        if (!applyWhitelist) {
            // Return all images without whitelist processing
            return images.map((img, idx) => ({
                id: img.id,
                vehicleId: img.vehicle_id,
                type: img.image_type,
                subtype: img.image_subtype,
                url: img.image_url,
                thumb: img.thumbnail_url,
                title: img.title,
                label: IMAGE_TYPE_NAMES[img.image_type] || 'Other',
                order: idx,
            }));
        }

        const result: ProcessedImage[] = [];
        const counts = new Map<string, number>();

        for (const img of images) {
            const meta = getMeta(img.image_type, img.image_subtype);
            if (!meta) continue;

            const key = `${img.image_type}-${img.image_subtype}`;
            const cnt = counts.get(key) || 0;
            if (cnt >= meta.max) continue;

            counts.set(key, cnt + 1);
            result.push({
                id: img.id,
                vehicleId: img.vehicle_id,
                type: img.image_type,
                subtype: img.image_subtype,
                url: img.image_url,
                thumb: img.thumbnail_url,
                title: img.title,
                label: meta.label,
                order: meta.order,
            });
        }

        return result.sort((a, b) => a.order - b.order);
    }

    /**
     * Process images and group by vehicle ID (for bulk queries)
     */
    static processImagesByVehicle(
        images: any[],
        applyWhitelist: boolean = true
    ): Map<number, ProcessedImage[]> {
        const vehicleMap = new Map<number, any[]>();
        
        // Group raw images by vehicle
        for (const img of images) {
            const arr = vehicleMap.get(img.vehicle_id);
            arr ? arr.push(img) : vehicleMap.set(img.vehicle_id, [img]);
        }

        // Process each vehicle's images
        const result = new Map<number, ProcessedImage[]>();
        for (const [vehicleId, vehicleImages] of vehicleMap) {
            result.set(vehicleId, this.processImages(vehicleImages, applyWhitelist));
        }

        return result;
    }

    /**
     * Group processed images by section (image_type)
     */
    static groupBySection(images: ProcessedImage[]): ImageSection[] {
        const map = new Map<number, ProcessedImage[]>();
        
        for (const img of images) {
            const arr = map.get(img.type);
            arr ? arr.push(img) : map.set(img.type, [img]);
        }

        return [...map.entries()]
            .map(([type, imgs]) => ({
                type,
                name: IMAGE_TYPE_NAMES[type] || 'Other',
                images: imgs,
            }))
            .sort((a, b) => (a.images[0]?.order ?? 999) - (b.images[0]?.order ?? 999));
    }
}